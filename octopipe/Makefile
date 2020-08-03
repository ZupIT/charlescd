GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOTOOL=$(GOCMD) tool

DIST_PATH=dist
CMD_PATH=cmd/*.go
BINARY_NAME=octopipe

start:
				$(GORUN) $(CMD_PATH)
build: 
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_NAME) $(CMD_PATH)
test:
				$(GOTEST) ./...
cover:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -func=cover.out
cover-browser:
				$(GOTEST) -coverprofile cover.out ./...
				$(GOTOOL) cover -html=cover.out -o cover.html
				open cover.html