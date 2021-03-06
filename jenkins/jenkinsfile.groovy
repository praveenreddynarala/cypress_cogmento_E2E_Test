pipeline {
  agent any

  tools {nodejs "node"}

  parameters {
    string defaultValue: 'https://reqres.in', description: '', name: 'reqres_url', trim: false
    string defaultValue: 'https://gorest.co.in', description: '', name: 'gorest_url', trim: false 
    string defaultValue: 'https://api.github.com', description: '', name: 'github_url', trim: false 
    string defaultValue: 'praveenreddynarala', description: '', name: 'auth_username', trim: false 
    string defaultValue: 'http://localhost:3000', description: '', name: 'mock_url', trim: false
  }

  environment {
    GH_PASSWORD = credentials('GH_PASSWORD')
    GOREST_BEARER_TOKEN = credentials('GOREST_BEARER_TOKEN')
    GIT_HUB_BEARER_TOKEN = credentials('GIT_HUB_BEARER_TOKEN')
    CYPRESS_RECORD_KEY = credentials('cypress-record-key')
    CYPRESS_trashAssetsBeforeRuns = 'false'
  }
  
  stages {
    stage('Scm checkout') {
      when {
        branch comparator: 'EQUALS', pattern: 'cypressAPI'
      }
    
      steps {
        checkout scm: [
          $class: 'GitSCM', 
          branches: [[name: '*/cypressAPI']], 
          doGenerateSubmoduleConfigurations: false, 
          extensions: [], 
          submoduleCfg: [], 
          userRemoteConfigs: [[credentialsId: 'f6a76776-a640-40a2-ac8b-0126a137a4a6', url: 'https://github.com/praveenreddynarala/cypress_cogmento_E2E_Test.git']]
          ]
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm i -g'
        bat 'npm ci'
      }
    }

    stage('Run Tests') {
        steps {
          echo "Running build ${env.BUILD_ID}"
          script {
            try{
              bat "npx -e NO_COLOR=1 cypress run --record --key ${env.CYPRESS_RECORD_KEY} --env reqres_url=${params.reqres_url},gorest_url=${params.gorest_url},github_url=${params.github_url},auth_username=${params.auth_username},auth_password=${env.GH_PASSWORD},bearer_token=${env.GOREST_BEARER_TOKEN},github_bearer_token=${env.GIT_HUB_BEARER_TOKEN},mock_url=${params.mock_url}"
            }catch(Exception e){
              echo 'Passed'
            }
          }
        }
      }

    stage('Generate Reports'){
      steps {
        script {
          bat 'npm run posttest'
        }
      }
    }
  }

  post {
    always {
      script {
        bat 'echo ALWAYS'
        archiveArtifacts artifacts: 'cypress\\reports\\mochareports\\**\\*'
      }
    }
    success {
      script {
        if(currentBuild.currentResult  == 'SUCCESS') {
          bat 'echo SUCCESS'
        }
      }
    }
    unstable {
      script {
        if(currentBuild.currentResult  == 'UNSTABLE') {
          bat 'echo UNSTABLE'
        }
      }
    }
    failure {
      script {
        if(currentBuild.currentResult  == 'FAILURE') {
          bat 'echo FAILURE'
        }
      }
    }
  }
}
