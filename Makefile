GOCMD=go
GORUN=$(GOCMD) run
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get

DIST_PATH=dist
CMD_PATH=cmd/octopipe/*.go
BINARY_NAME=octopipe

start:
				$(GORUN) $(CMD_PATH)
build: 
				$(GOBUILD) -o $(DIST_PATH)/$(BINARY_NAME) $(CMD_PATH)
publish-octopipe:
				docker build -t realwavelab.azurecr.io/octopipe:v-0-1-0 -f cmd/octopipe/Dockerfile .
				docker push realwavelab.azurecr.io/octopipe:v-0-1-0
publish-ui:
				cd web && yarn build
				docker build -t realwavelab.azurecr.io/octopipe-ui:darwin -f web/Dockerfile .
				docker push realwavelab.azurecr.io/octopipe-ui:darwin