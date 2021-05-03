# 1. Record architecture decisions

Date: 2021-02-22

## Status

Accepted

## Context
CharlesCD in its current version appends the circle uuid to the generated kubernetes deployment name of the user application.
This behaviour allows the user to deploy multiple versions of the same application in a given namespace for different circles.
All of this without changing the helm charts, which is, in our opinion, a win for the user experience.

The problem comes with different kubernetes resources that may be present in the user charts. Not all of the resources can have
their name changed during runtime. One example is the ConfigMap resource that needs to be referenced by the name inside the 
chart definition.

CharlesCD must provide the necessary means for the differentiation of resources such as ConfigMap, Secrets etc. between circles on the
same namespace. The application must also specify the set of resources that will have the circle uuid appended to their name
during runtime.

## Decision
CharlesCD will:
 
1. Provide one text input for a custom helm chart values file name;
2. Provide one text input for a custom branch name for the github/gitlab chart code;
3. Automatically append the circle uuid to the name of the following kubernetes resources:
	1. DaemonSet
	2. StatefulSet
	3. Deployment
	4. CronJob
	5. Job
	6. HPA

## Consequences
Users will have to be warned about CharlesCD's limitations regarding resource management. This
ADR must be included in the public documentation.