const env = require('./env')

let resUrl 
let mp3FilePath
if (env === 'dev') {
  resUrl = 'http://192.168.0.102:8081'
  mp3FilePath = 'D:/reborn/Reader/resource/mp3'
} else {
  // 生产环境
  resUrl = 'http://47.112.108.171'
  mp3FilePath = '/root/nginx/upload/mp3'
}


const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'SocialSciences',
  'Economics',
  'Eductation',
  'Engineering',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'Biomedicine',
  'BusinessandManagement',
  'EarthSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
  mp3FilePath
}