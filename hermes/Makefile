GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
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
