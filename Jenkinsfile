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
                sh 'npm build'
            }
        }
        
        stage('Test'){
            steps {
                sh 'npm test'
            }
        }
    }
}