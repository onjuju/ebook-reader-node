const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs')

// 处理在线语音
function createVoice (req, res) {
  // text不能超过100字
  const text  = req.query.text // 内容
  const lang = req.query.lang // 英文
  // const text = '测试科大讯飞在线语音api, 科大讯飞会在线地生成语音返回给客户端'
  // const lang = 'cn'
  
  let engineType = 'intp65' // 引擎
  if (lang.toLocaleLowerCase() === 'en') {
    engineType = 'intp65_en'
  }
  const speed = '30'
  const voiceParam = {
    auf: 'audio/L16;rate=16000', // 音频采样率
    aue: 'lame',
    voice_name: 'xiaoyan',
    speed,
    engine_type: engineType,
    volume: '50',
    pitch: '50',
    text_type: 'text'
  }

  const currentTime = Math.floor(new Date().getTime() / 1000) // 转化为UTC时间戳
  const appId = '5c87719a'
  const apiKey = 'b746addcfb053161b19da13bbf7765a6'
  const xParam = Base64.encode(JSON.stringify(voiceParam)) // 将参数json进行base64加密
  const checkSum = md5(apiKey + currentTime + xParam)
  const headers = {}
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
  headers['X-Param'] = xParam
  headers['X-Appid'] = appId
  headers['X-CurTime'] = currentTime
  headers['X-CheckSum'] = checkSum
  headers['X-Real-Ip'] = '127.0.0.1'
  const data = qs.stringify({
    text: text
  })
  const options = {
    host: 'api.xfyun.cn',
    path: '/v1/service/v1/tts',
    method: 'POST',
    headers
  }

  // 原生请求
  const request = http.request(options, response => {
    let mp3 = ''
    const contentLength = response.headers['content-length']
    response.setEncoding('binary') // 设置编码格式为二进制
    response.on('data', data => {
      // 获得data时, 当data长度较大时会多次调用
      mp3 += data
      const process = data.length / contentLength * 100
      const percent = parseInt(process) // 进度百分比
    })
    response.on('end', () => {
      // console.log(response.headers)
      // console.log(mp3)
      const contentType = response.headers['content-type']
      if (contentType === 'text/html') {
        // 返回的文件不为mp3
        res.send(mp3)
      } else if (contentType === 'text/plain') {
        res.send(mp3)
      }else {
        const fileName = new Date().getTime()
        // 本地存储路径
        const filePath = `${mp3FilePath}/${fileName}.mp3`
        // 下载地址, 返回给前端进行下载
        const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
        // console.log(filePath, downloadUrl)
        fs.writeFile(filePath, mp3, 'binary', err => {
          if (err) {
            res.send(mp3)
          } else {
            res.json({
              error: 0,
              msg: '下载成功',
              path: downloadUrl
            })
          }
        })  
      }
    })
  })
  request.write(data)
  request.end()
}

module.exports = createVoice