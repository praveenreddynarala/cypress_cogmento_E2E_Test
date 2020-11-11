
def prop = [: ]

pipeline {
  agent {
    // this image provides everything needed to run Cypress
    docker {
      image 'cypress/base:10'
    }
  }

  environment {
    CHROME_BIN = '/bin/google-chrome'
  }

  stages {
    stage('Clone') {
      steps {
        script {
          def gitInfo = checkout scm
          prop = [
              'commitID': gitInfo.GIT_COMMIT,
              'branch': env.BRANCH_NAME,
              'repourl': gitInfo.GIT_URL,
              'buildId': env.BUILD_ID,
              'jenkinsUrl': env.JENKINS_URL,
              'iqProjectName': 'Cypress_Jenkins_Pipeline',
              'buildType': 'node',
              'repository': 'cypress_cogmento_E2E_Test']
          echo "$prop.commitID"
        }
      }
    }

    stage('Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        echo "Running build ${$prop.buildId} on ${$prop.jenkinsUrl} on branch ${$prop.branch}"
        sh 'npm run cy:verify'
      }
    }

    stage('start local server') {
      steps {
        // start local server in the background
        // we will shut it down in "post" command block
        sh 'nohup npm run start:ci &'
      }
    }

    stage('Cypress Parallel Tests') {
      environment {
        // we will be recording test results and video on Cypress dashboard
        // to record we need to set an environment variable
        // we can load the record key variable from credentials store
        // see https://jenkins.io/doc/book/using/using-credentials/
        CYPRESS_RECORD_KEY = credentials('CYPRESS_RECORD_KEY')
        // because parallel steps share the workspace they might race to delete
        // screenshots and videos folders. Tell Cypress not to delete these folders
        CYPRESS_trashAssetsBeforeRuns = 'false'
      }

      parallel {
        // start several test jobs in parallel, and they all
        // will use Cypress Dashboard to load balance any found spec files
        stage('tester A') {
          steps {
            echo "Running build ${$prop.buildId}"
            sh 'npm run e2e:record:parallel'
          }
        }

        // second tester runs the same command
        stage('tester B') {
          steps {
            echo "Running build ${$prop.buildId}"
            sh 'npm run e2e:record:parallel'
          }
        }
      }
    }

    post {
      // shutdown the server running in the background
      always {
        echo 'Stopping local server'
        sh 'pkill -f http-server'
      }
    }
  }
  }
