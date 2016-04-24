var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var text
var token = 'CAAOCHbO8ZBuUBAESPFlZCGsg1w0uz7lTWrEALvOt8T0rtu1LlElBBZAUDDZAo3VPoAnXhfjFzRyoMdTAOCHYDH22RZCSyVRVaS3SP6cvmnIRZAW8ZAHrOmyhcylbDFKPIPd6YRUFPdaLXJM9o8oxdQJRt56AHZAip1xYt2PIKUxsYCzbYg9sAYhEkWzC8ddFuDDIgGsAMgFqNAZDZD'

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
      // Handle a text message from this sender
      console.log(text)
      if (text === 'Hi') {
        sendTextMessage(sender, 'Hi! I am CoFen')
      } else {
        //sendTextMessage(sender, 'Text received, echo: ' + text.substring(0, 200))
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
