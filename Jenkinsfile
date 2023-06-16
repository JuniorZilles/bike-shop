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
                sh 'echo ${env.BUILD_ID}'
                sh 'docker build -t juniorzilles/bike-shop:${env.BUILD_ID} .'
            }
        }

        stage('Push image to Hub'){
            steps{
                script{
                   withCredentials([string(credentialsId: 'dockerhub-pwd', variable: 'dockerhubpwd')]) {
                    sh 'docker login -u juniorzilles -p ${dockerhubpwd}'
                   }
                   sh 'docker push juniorzilles/bike-shop'
                }
            }
        }
        stage('Deploy to k8s'){
            steps{
                script{
                    kubernetesDeploy (configs: 'deployment.yaml',kubeconfigId: 'k8sconfigpwd')
                }
            }
        }
    }
}