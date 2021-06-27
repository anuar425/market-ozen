import { Model, Document } from "mongoose";
import { zipObject, pickBy, fill } from "lodash";
import flat from "flat";
import { Router } from "express";

export enum CRUDOperations {
  CREATE = 1,
  READ = 2,
  READONE = 3,
  UPDATE = 4,
  DELETE = 5,
}

type ParametersConfig = string[] | Record<string, true | CRUDOperations[]>;

type CRUDConfig = {
  endpoint: string;
  model: Model<any & Document>;
  parameters: ParametersConfig;
};

const CRUDDefaultConfig = {
  archiveMode: false,
  limit: 1000,
  operations: [
    CRUDOperations.CREATE,
    CRUDOperations.READ,
    CRUDOperations.READONE,
    CRUDOperations.UPDATE,
    CRUDOperations.DELETE,
  ],
};

function bodyFilter(body: Record<string, any>, parameters: ParametersConfig, operation: CRUDOperations) {
  const flatBody = flat<typeof body, Record<string, unknown>>(body, { safe: true });

  // Filter body params for Safety, depends on Operation type
  if (!Array.isArray(parameters)) {
    parameters = Object.entries(parameters)
      .filter(([_, value]) => value === true || value.indexOf(operation) !== -1)
      .map(([p]) => p) as string[];
  }

  return pickBy(
    // return flattenBody with allowed params!
    flatBody,
    (_, key) =>
      !!(parameters as string[]).find((p) => key.indexOf(p) === 0 && (key === p || key[p.length] === ".")) // if key allowed in parameters!
  ) as Record<string, unknown>;
}

export default function CRUDEndpoints(router: Router, config: CRUDConfig) {
  const { endpoint, model, parameters, operations } = {
    ...CRUDDefaultConfig,
    ...config,
  };

  const queryOptions = {};

  console.log(`CRUDEndpoints init from endpoint ${endpoint}`);

  /* ------------------------------------- READ ------------------------------------- */
  if (operations.indexOf(CRUDOperations.READ) !== -1) {
    router.get(`/${endpoint}`, async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({});
        const { user } = req;

        let searchCriteria = { owner: user._id };

        let items = await model.find(searchCriteria, null, queryOptions);

        res.json(items);
      } catch (e) {
        next(e);
      }
    });
  }
  if (operations.indexOf(CRUDOperations.READONE) !== -1) {
    /* ------------------------------------- READONE ------------------------------------- */
    router.get(`/${endpoint}/:id`, async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({});
        const { user } = req;
        if (!req.params.id) throw new Error("NO_ID");

        let searchCriteria = { _id: req.params.id, owner: user._id };

        let item = await model.findOne(searchCriteria).select("-owner");
        if (!item) throw new Error("NOT_FOUND");

        res.json(item);
      } catch (e) {
        next(e);
      }
    });
  }
  /* ------------------------------------- CREATE ------------------------------------- */
  if (operations.indexOf(CRUDOperations.CREATE) !== -1) {
    router.post(`/${endpoint}`, async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({});
        const { user } = req;

        // Don't Allow Empty Body
        if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
          throw new Error("EMPTY_BODY");

        let createData = { owner: user._id };

        createData = { ...bodyFilter(req.body, parameters, CRUDOperations.CREATE), ...createData };

        let item = await model.create(pickBy(createData, (x) => x !== undefined && x !== null));

        if (!item) throw new Error("ERROR_ON_SAVE");

        res.json(item);
        /* 
        let createdItem = item.toObject();
        res.json(createdItem);
        *  */
      } catch (e) {
        if (e.code === 11000) {
          next(new Error("DUPLICATE"));
        } else next(e);
      }
    });
  }

  /* ------------------------------------- UPDATE ------------------------------------- */
  if (operations.indexOf(CRUDOperations.UPDATE) !== -1) {
    router.put(`/${endpoint}`, async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({});
        const { user } = req;
        // Don't Allow Empty Body
        if (!req.body || typeof req.body !== "object" || Object.keys(req.body).length === 0)
          throw new Error("EMPTY_BODY");

        if (!req.body._id) throw new Error("NO_ID");

        let searchCriteria = { _id: req.body._id, owner: user._id };

        const updateData = bodyFilter(req.body, parameters, CRUDOperations.UPDATE);

        const $pull: string[] = [];
        const $push: Record<string, unknown> = {};
        const $unset: string[] = [];

        Object.entries(updateData).forEach(([param, value]) => {
          if (value === null) {
            // Required for proper remove from Array; TODO: Not tested on Objects;
            $unset.push(param);
            const path = param.split(".");
            if (path.length > 1) {
              path.pop();
              $pull.push(path.join("."));
            }
          } else if (param.indexOf(".@.") !== -1) {
            // @ param means replace entire object!
            const [path, injparam] = param.split(".@.");
            updateData[path] ??= {};
            Object.assign(updateData[path], { [injparam]: updateData[param] });
            delete updateData[param];
          } else if (param.indexOf(".$push.") !== -1) {
            // @ param means replace entire object!
            const [path, injparam] = param.split(".$push.");
            $push[path] ??= {};
            Object.assign($push[path], { [injparam]: updateData[param] });
            delete updateData[param];
          }
        });

        const preHookData = {};
        console.log({ updateData, $unset, $pull, preHookData, $push });

        const now = Date.now();
        const updateQuery = pickBy(updateData, (x) => x !== undefined && x !== null);
        if ($unset.length) {
          updateQuery.$unset = zipObject($unset, fill(new Array($unset.length), 1));
        }
        if (Object.keys($push).length) {
          updateQuery.$push = $push;
        }

        Object.assign(updateQuery, preHookData);

        let item = await model.findOneAndUpdate(searchCriteria, updateQuery, {
          new: true,
          runValidators: true,
        });
        console.log(`ms:`, Date.now() - now);

        if ($pull.length) {
          item = await model.findOneAndUpdate(
            searchCriteria,
            {
              $pull: zipObject($pull, fill(new Array($pull.length), null)),
            },
            {
              new: true,
              runValidators: true,
            }
          );
        }

        if (!item) throw new Error("ERROR_ON_SAVE");

        res.json(item);
      } catch (e) {
        next(e);
      }
    });
  }

  /* ------------------------------------- DELETE ------------------------------------- */
  if (operations.indexOf(CRUDOperations.DELETE) !== -1) {
    router.delete(`/${endpoint}/:id`, async (req, res, next) => {
      try {
        if (!req.user) return res.status(401).json({});
        const { user } = req;

        if (!req.params.id) throw new Error("NO_ID");

        let searchCriteria = { _id: req.params.id, owner: user._id };

        await model.deleteOne(searchCriteria);

        res.json();
      } catch (e) {
        next(e);
      }
    });
  }
}
