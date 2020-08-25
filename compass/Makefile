GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
GOBUILDPLUGIN=$(GOCMD) build -buildmode=plugin
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOTOOL=$(GOCMD) tool

DIST_PATH=dist
CMD_PATH=cmd/*.go
BINARY_NAME=compass

# $(GOBUILDPLUGIN) "$$plugin"/*.go

start:
				for plugin in ./plugins/datasource/*/; do $(GOBUILDPLUGIN) -o ./plugins "$$plugin"/*.go ; done
				$(GORUN) $(CMD_PATH)
build: 
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_NAME) $(CMD_PATH)
tests:
				docker-compose -f ./docker-compose.test.yaml up --build --abort-on-container-exit
				docker-compose -f ./docker-compose.test.yml down --volumes
tests-db-up:
				docker-compose -f ./docker-compose.test.yaml up --build db
tests-db-down:
				docker-compose -f ./docker-compose.test.yaml down --volumes db
cover:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -func=cover.out
cover-browser:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -html=cover.out -o cover.html
				open cover.html