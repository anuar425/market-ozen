// @ts-expect-error no DECL for solc(
import solc from "solc";
import fs from "fs";
import path from "path";
import escape from "escape-unicode";

export default function nftGenerator(
  data: { name: string; sym: string; uri: string },
  options: { burnable: boolean } = { burnable: false }
) {
  const name = escape(data.name);
  const sym = escape(data.sym);
  const uri = escape(data.uri);
  const { burnable } = options;
  const nftSol = `// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
${burnable ? 'import "./@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";' : ""}

contract SergazinToken is ERC721, ERC721URIStorage, Ownable${burnable ? ", ERC721Burnable" : ""} {
    constructor() ERC721("${name}","${sym}") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return  "${uri}";
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
`;

  const input = {
    language: "Solidity",
    sources: {
      "nft.sol": {
        content: nftSol,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const result = JSON.parse(
    solc.compile(JSON.stringify(input), {
      import(name: string) {
        return {
          contents: fs.readFileSync(path.resolve(__dirname, `../smart-contract/${name}`), {
            encoding: "utf8",
          }),
        };
      },
    })
  );

  console.log(result);
  const contractName = Object.keys(result.contracts["nft.sol"])[0];
  const contract = result.contracts["nft.sol"][contractName];
  const metadata = JSON.parse(contract.metadata);
  return {
    abi: metadata.output.abi,
    unlinked_binary: contract.evm.bytecode.object,
  };
}

/* 
const contractBytecode = nftGenerator("sergazin", "srg", "https://sergazin.kz");
console.log(contractBytecode);
*  */
