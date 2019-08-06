node {

  try {

    def projectName = "darwin-deploy"

    buildDockerBuilder {
        dockerFileBuilder = "DockerfileBuilder"
        dockerRepositoryName = projectName
        dockerFileLocation = "."
        team = "Realwave"
    }

    buildWithMakefile {
      dockerRepositoryName = projectName
      dockerFileLocation = "."
      team = "Realwave"
      dockerBuildingImage = "${projectName}:builder"
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