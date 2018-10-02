const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
let text = ''
const token = 'CAAOCHbO8ZBuUBAESPFlZCGsg1w0uz7lTWrEALvOt8T0rtu1LlElBBZAUDDZAo3VPoAnXhfjFzRyoMdTAOCHYDH22RZCSyVRVaS3SP6cvmnIRZAW8ZAHrOmyhcylbDFKPIPd6YRUFPdaLXJM9o8oxdQJRt56AHZAip1xYt2PIKUxsYCzbYg9sAYhEkWzC8ddFuDDIgGsAMgFqNAZDZD'
let num = 0
let n = 0
let count = 0

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
  let messaging_events = req.body.entry[0].messaging
  for (const i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text

      let sln = text.length
      let getFunc = text.substring(0, 3)
      let getText = text.substring(4, text.length)
      let space = getText.search(' ')
      let num1 = parseFloat(getText.substring(0, space))
      let num2 = parseFloat(getText.substring(space, getText.length))

      if (getFunc === 'sum'){
        let sum = num1 + num2
        sendTextMessage(sender, sum)
      }

      if (getFunc === 'max'){
        if (num1 > num2) {
          sendTextMessage(sender, num1)
        }
        if (num2 > num1) {
          sendTextMessage(sender, num2)
        }
        if (num1 === num2) {
          sendTextMessage(sender, 'equal')
        }
      }

      if (getFunc === 'min'){
        if (num1 < num2) {
          sendTextMessage(sender, num1)
        }
        if (num2 < num1) {
          sendTextMessage(sender, num2)
        }
        if (num1 === num2) {
          sendTextMessage(sender, 'equal')
        }
      }

      if (getFunc === 'avg') {
        let num = []
        let sum = 0
        let gettext = text.substring(4, text.length)
        num = gettext.split(' ')
        for (const i = 0;i < num.length;i++) {
          sum += parseFloat(num[i])
        }
        sendTextMessage(sender, sum/num.length)
      }
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!')
})

function sendTextMessage (sender, text) {
  let messageData = {
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
