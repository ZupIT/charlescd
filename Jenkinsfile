node {

  try {

    def projectName = "darwin-deploy"

    buildWithMakefile {
      dockerRepositoryName = projectName
      dockerFileLocation = "."
      team = "Realwave"
      dockerBuildingImage = "nodedindbuilder"
    }

    deployDockerServiceK8s {
      microservice = projectName
      dockerk8sGroup = "Darwin"
    }

  } catch (e) {

      notifyBuildStatus {
        buildStatus = "FAILED"
      }
      throw e

  }

}