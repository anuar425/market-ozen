mkdir _db
mkdir _logs
mkdir _uploads
chmod 777 _uploads
cd backend
docker run -it --name nodeModulesInstaller -w /app -v $(pwd):/app node:15.13.0-alpine npm i