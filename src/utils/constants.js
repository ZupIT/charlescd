const baseManifest = {
  cloudProvider: "kubernetes",
  manifestArtifactAccount: "embedded-artifact",
  manifests: [],
  name: null,
  refId: null,
  relationships: {
    loadBalancers: [],
    securityGroups: []
  },
  requisiteStageRefIds: [],
  source: "text",
  type: "deployManifest"
};

function baseSpinnaker(pipelineName, applicationName) {
  return {
    name: pipelineName,
    application: applicationName,
    appConfig: {},
    keepWaitingPipelines: false,
    lastModifiedBy: "",
    limitConcurrent: true,
    stages: [],
    triggers: [],
    updateTs: "1560803000000"
  };
}

export { baseManifest, baseSpinnaker };
