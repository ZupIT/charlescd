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

    packageJSON = readJSON file: 'package.json'
    sh "echo sonar.projectVersion=${packageJSON.version} >> sonar-project.properties"

    stage('SonarQube analysis') {
      nodejs(nodeJSInstallationName: 'NodeJSAuto', configId: '') {

        script {
          def scannerHome = tool 'Sonar Zup';
          withSonarQubeEnv('Sonar Zup') {
            sh "${scannerHome}/bin/sonar-scanner"
          }
        }

      }
    }

  } catch (e) {

      notifyBuildStatus {
        buildStatus = "FAILED"
      }
      throw e

  }

}
