@Library('ZupSharedLibs@darwin') _

node {

  try {

    def projectName = "darwin-deploy"

    buildWithMakefile {
      dockerRepositoryName = projectName
      dockerFileLocation = "."
      team = "Realwave"
      dockerBuildingImage = "nodedindbuilder"
    }

  } catch (e) {

      notifyBuildStatus {
        buildStatus = "FAILED"
      }
      throw e

  }

}
