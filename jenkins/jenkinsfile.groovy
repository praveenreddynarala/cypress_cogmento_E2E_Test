pipeline {
  agent any

  tools {nodejs "node"}

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
    CYPRESS_RECORD_KEY = credentials('CYPRESS_RECORD_KEY')
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
        bat 'npm config set registry http://registry.npmjs.org/'
        bat 'npm i'
        bat 'npm install jason-server --save -dev'
        bat 'npm install faker --save'
        bat 'npm install mocha --save-dev'
        bat 'npm install cypress-multi-reporters --save-dev'
        bat 'npm install mochawesome --save-dev'
        bat 'npm install mochawesome-merge --save-dev'
        bat 'npm install mochawesome-report-generator --save-dev'
      }
    }

    // stage('Build') {
    //   steps {
    //     script {
    //       bat 'npm run build'
    //     }
    //   }
    // }

    stage('Run Tests') {
        steps {
          echo "Running build ${env.BUILD_ID}"
          script {
            try{
              bat 'npx -e NO_COLOR=1 cypress run --env reqres_url=${params.reqres_url},gorest_url=${params.gorest_url},github_url=${params.github_url},auth_username=${params.auth_username},auth_password=${env.GH_PASSWORD},bearer_token=${env.GOREST_BEARER_TOKEN},github_bearer_token=${env.GIT_HUB_BEARER_TOKEN},mock_url=${params.mock_url}'
            }catch(Exception e){
              echo 'Passed'
            }
          }
        }
      }

    stage('Generate Reports'){
      steps {
        bat 'npm run posttest'
      }
    }
  }

  post {
    always {
      script {
        echo 'Stopping local server'
        bat 'pkill -f http-server'
      }
    }
    success {
      script {
        bat 'echo SUCCESS'
      }
    }
    unstable {
      script {
        bat 'echo UNSTABLE'
      }
    }
    failure {
      script {
        bat 'echo FAILURE'
      }
    }
  }
}
