REGISTRY = $(DOCKER_REGISTRY)
RELEASE = $(RELEASE_VERSION)

# Go parameters
NODECMD=npm
NODEINSTALL= ${NODECMD} install
NODEBUILD=$(NODECMD) run build
NODETEST=$(NODECMD) run test
NODERUN=$(NODECMD) run start:prod
BINARY_NAME=darwin-deploy

# Docker
DOCKERCMD=docker
DOCKERBUILD=${DOCKERCMD} build
DOCKERPUSH=${DOCKERCMD} push
DOCKERTAG=${DOCKERCMD} tag

# Commons
HOST=127.0.0.1

all: test build
build:
	${NODEINSTALL}
	${NODEBUILD}
	$(DOCKERBUILD) -t "${REGISTRY}/${BINARY_NAME}:${RELEASE}" .
	$(DOCKERTAG) "${REGISTRY}/${BINARY_NAME}:${RELEASE}" "${REGISTRY}/${BINARY_NAME}:latest"

publish:
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME}:${RELEASE}"
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME}:latest"
test:
	@echo "don't have time for test right now"
run:
	${NODERUN}
