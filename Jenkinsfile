pipeline {
  agent {
    node {
      label 'Node stuff'
    }
    
  }
  stages {
    stage('Run it yo') {
      steps {
        timestamps() {
          build(job: 'Waiting yo', quietPeriod: 5)
        }
        
      }
    }
  }
}