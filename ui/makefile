REGISTRY = $(DOCKER_REGISTRY)
RELEASE = $(RELEASE_VERSION)

# Go parameters
NODECMD=yarn
NODEINSTALL= ${NODECMD} install
NODEBUILD=$(NODECMD) build
NODETEST=$(NODECMD) test
BINARY_NAME_LEGACY=darwin-ui-legacy
BINARY_NAME_NEW=darwin-ui-new

# Docker
DOCKERCMD=docker
DOCKERBUILD=${DOCKERCMD} build
DOCKERPUSH=${DOCKERCMD} push
DOCKERTAG=${DOCKERCMD} tag

# Commons commands
HOST=127.0.0.1

all: test build
build:
	cd ./packages/legacy && ${NODEINSTALL}
	cd ./packages/legacy && ${NODEBUILD}
	cd ./packages/legacy && $(DOCKERBUILD) -t "${REGISTRY}/${BINARY_NAME_LEGACY}:${RELEASE}" .
	cd ./packages/legacy && $(DOCKERTAG) "${REGISTRY}/${BINARY_NAME_LEGACY}:${RELEASE}" "${REGISTRY}/${BINARY_NAME_LEGACY}:latest"
	cd ./packages/new-ui && ${NODEINSTALL}
	cd ./packages/new-ui && ${NODEBUILD}
	cd ./packages/new-ui && $(DOCKERBUILD) -t "${REGISTRY}/${BINARY_NAME_NEW}:${RELEASE}" .
	cd ./packages/new-ui && $(DOCKERTAG) "${REGISTRY}/${BINARY_NAME_NEW}:${RELEASE}" "${REGISTRY}/${BINARY_NAME_NEW}:latest"

publish:
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME_LEGACY}:${RELEASE}"
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME_LEGACY}:latest"
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME_NEW}:${RELEASE}"
	${DOCKERPUSH} "${REGISTRY}/${BINARY_NAME_NEW}:latest"
test:
	@echo "don't have time for test right now"

