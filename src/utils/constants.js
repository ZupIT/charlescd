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

function webhookBaseStage(uriWebhook) {
  return {
    "method": "GET",
    "name": "Trigger webhook",
    "refId": "7",
    "requisiteStageRefIds": [
      "6"
    ],
    "statusUrlResolution": "getMethod",
    "type": "webhook",
    "url": uriWebhook,
    "waitForCompletion": false
  }
} 

function baseSpinnaker(pipelineName, applicationName, appName) {
  return {
    name: pipelineName,
    application: applicationName,
    appConfig: {},
    keepWaitingPipelines: false,
    lastModifiedBy: "",
    limitConcurrent: true,
    stages: [],
    triggers: [],
    updateTs: "1560803000000",
    "triggers": [
      {
        "enabled": true,
        "payloadConstraints": {},
        "source": appName,
        "type": "webhook"
      }
    ],
  };
}

export { baseManifest, baseSpinnaker, webhookBaseStage};
