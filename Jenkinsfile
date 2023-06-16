pipeline{
    agent any
    tools {nodejs "Node"}
    stages {
        stage('Clone Repository'){
            steps{
                git branch: 'main',
                    url: 'https://github.com/JuniorZilles/bike-shop-api.git'
            }
        }
        
        stage('Install Dependencies'){
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build'){
            steps {
                sh 'npm run build'
            }
        }
        
        // stage('Test'){
        //     steps {
        //         sh 'npm run test'
        //     }
        // }

        stage('Build Image'){
            steps {
                sh 'docker build -t juniorzilles/bike-shop:${env.BUILD_ID} .'
            }
        }
    }
}