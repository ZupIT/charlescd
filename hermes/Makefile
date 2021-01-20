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
BINARY_NAME=hermes

start:
				$(GORUN) $(CMD_PATH)
build: 
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_NAME) $(CMD_PATH)
local-tests:
				$(GOTEST) ./...
tests:
				$(GOTEST) ./...
cover:
				$(GOTEST) -v -coverpkg ./internal/* -coverprofile=cover.out
				$(GOTOOL) cover -func=cover.out
cover-browser:
				$(GOTEST) -v -coverpkg ./internal/* -coverprofile=cover.out
				$(GOTOOL) cover -html=cover.out -o cover.html
				open cover.html