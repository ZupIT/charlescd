cd ../legacy
yarn build
docker build . -t darwin-ui-legacy
docker container stop darwin-ui-legacy-container || true
docker run -p 3001:3001 -d  --rm --name darwin-ui-legacy-container darwin-ui-legacy
