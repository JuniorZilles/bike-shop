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
                bat 'npm install'
            }
        }
        
        stage('Build'){
            steps {
                bat 'npm build'
            }
        }
        
        stage('Test'){
            steps {
                bat 'npm test'
            }
        }
    }
}