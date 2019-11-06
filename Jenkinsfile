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

    sleep 5

    stage("Quality Gate") {
        timeout(time: 1, unit: 'HOURS') {
           def qg = waitForQualityGate()
           if (qg.status != 'OK') {
               error "Pipeline aborted due to quality gate failure: ${qg.status}"
           }
       }
    }

    buildDockerContainer {
      dockerRepositoryName = projectName
      dockerFileLocation = "."
      team = "Realwave"
    }

  } catch (e) {

      notifyBuildStatus {
        buildStatus = "FAILED"
      }
      throw e

  }

}
