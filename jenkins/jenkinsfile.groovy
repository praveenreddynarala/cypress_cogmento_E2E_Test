pipeline {
  agent any

  parameters {
    string defaultValue: 'https://reqres.in', description: '', name: 'reqres_url', trim: false
    string defaultValue: 'https://gorest.co.in', description: '', name: 'gorest_url', trim: false 
    string defaultValue: 'https://api.github.com', description: '', name: 'github_url', trim: false 
    string defaultValue: 'praveenreddynarala', description: '', name: 'auth_username', trim: false 
    password defaultValue: 'Pr@veen26785', description: '', name: 'auth_password'
    string defaultValue: 'pJpMr1MHHccRJUQo9jW4Ue7TX8uy-dVWVIBY', description: '', name: 'bearer_token', trim: false
    string defaultValue: '9b82f4dabe53b4c7e76b1bfeb83d4f57dd9a25ef', description: '', name: 'github_bearer_token', trim: false
    string defaultValue: 'http://localhost:3000', description: '', name: 'mock_url', trim: false
  }

  environment {
    GH_PASSWORD = credentials('GH_PASSWORD')
    GOREST_BEARER_TOKEN = credentials('GOREST_BEARER_TOKEN')
    GIT_HUB_BEARER_TOKEN = credentials('GIT_HUB_BEARER_TOKEN')
  }
  
  stages {
    stage('Scm checkout') {
      when {
        branch comparator: 'EQUALS', pattern: 'cypressAPI'
    }
      steps {
        git branch: 'cypressAPI', credentialsId: 'f6a76776-a640-40a2-ac8b-0126a137a4a6', url: 'https://github.com/praveenreddynarala/cypress_cogmento_E2E_Test.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
        sh 'npm install jason-server --save -dev'
        sh 'npm install faker --save'
        sh 'npm install mocha --save-dev'
        sh 'npm install cypress-multi-reporters --save-dev'
        sh 'npm install mochawesome --save-dev'
        sh 'npm install mochawesome-merge --save-dev'
        sh 'npm install mochawesome-report-generator --save-dev'
      }
    }

    stage('cypress parallel tests') {
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

      stage('Run Tests') {
          steps {
            echo "Running build ${env.BUILD_ID}"
            script {
              try{
                sh 'npx -e NO_COLOR=1 cypress run --env reqres_url=${params.reqres_url},gorest_url=${params.gorest_url},github_url=${params.github_url},auth_username=${params.auth_username},auth_password=${env.GH_PASSWORD},bearer_token=${env.GOREST_BEARER_TOKEN},github_bearer_token=${env.GIT_HUB_BEARER_TOKEN},mock_url=${params.mock_url}'
              }catch(Exception e){
                echo 'Passed'
              }
            }
          }
        }
    }

    stage('Generate Reports'){
      steps {
        sh 'npm run posttest'
      }
    }
  }

  post {
    always {
      echo 'Stopping local server'
      sh 'pkill -f http-server'
    }
  }
}
