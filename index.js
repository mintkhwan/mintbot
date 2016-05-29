var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var text
var token = 'CAAOCHbO8ZBuUBAESPFlZCGsg1w0uz7lTWrEALvOt8T0rtu1LlElBBZAUDDZAo3VPoAnXhfjFzRyoMdTAOCHYDH22RZCSyVRVaS3SP6cvmnIRZAW8ZAHrOmyhcylbDFKPIPd6YRUFPdaLXJM9o8oxdQJRt56AHZAip1xYt2PIKUxsYCzbYg9sAYhEkWzC8ddFuDDIgGsAMgFqNAZDZD'
var num = 0
var n = 0
var count = 0

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text

      var sln = text.length
      var getFunc = text.substring(0, 3)
      //console.log('func : ' + getFunc)

      var getText = text.substring(4, text.length)
      var space = getText.search(' ')
      var num1 = parseFloat(getText.substring(0, space))
      var num2 = parseFloat(getText.substring(space, getText.length))
      //console.log('number1 : ' + num1 + ' number2 : ' + num2)

      if (getFunc === 'sum'){
        var sum = num1 + num2
        //console.log('sum : '+sum)
        sendTextMessage(sender, sum)
      }

      if (getFunc === 'max'){
        sendTextMessage(sender, max)
      }


      //////////////////////////////////////////////////////////////////////////
      //sendTextMessage(sender, text)
      //////////////////////////////////////////////////////////////////////////
      // if (num === 0) {
      //   if (text === 'เริ่ม') {
      //     sendTextMessage(sender, 'ทายดูครับ 1-100 \n พิมพ์ จบ เพื่อเลิกเล่น')
      //     num = 1
      //     n = Math.floor((Math.random() * 100) + 1)
      //     console.log(n)
      //   } else {
      //     sendTextMessage(sender, 'พิมพ์ เริ่ม เพื่อเริ่มเกม')
      //     num = 0
      //   }
      // }
      // if (num === 1) {
      //   if (text != 'เริ่ม') {
      //     if (text > n) {
      //       sendTextMessage(sender, "มากไปครับ :'(")
      //       count++
      //     }else if (text < n) {
      //       sendTextMessage(sender, "น้อยไปครับ :'(")
      //       count++
      //     }else if (text == n) {
      //       count++
      //       sendTextMessage(sender, 'ถูกต้องครับ ทำไป ' + count + ' ครั้ง' + '\n' + '8|')
      //       num = 0
      //       count = 0
      //     }else if (text == 'จบ') {
      //       sendTextMessage(sender, 'กากหวะ เลิกเล่นง่ายๆ')
      //       count = 0
      //       num = 0
      //     } else {
      //       sendTextMessage(sender, 'พิมพ์เลข 1-100 ซิเว้ย')
      //     }
      //   }
      // }
      //////////////////////////////////////////////////////////////////////////
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!')
})

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
