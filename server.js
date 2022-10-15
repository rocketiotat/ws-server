const fs = require('fs')
const express = require('express')
const cors = require('cors')
const http = require('http')
const app = express()
const WebSocket = require('ws')
const uuidv4 = require('uuid').v4
const messageCTL = require('./Controllers/messageCTL.js')
const typingCTL = require('./Controllers/typingCTL.js')
const leaveCTL = require('./Controllers/leaveCTL.js')
const usersCTL = require('./Controllers/usersCTL.js')

const PORT = process.env.PORT || 8080

// const server = new https.createServer(
//     {
//         cert: fs.readFileSync('./cert/server.cert'),
//         key: fs.readFileSync('./cert/server.key'),
//     },
//     app
// )

const server = new http.createServer(app)

server.keepAliveTimeout = 60 * 1000 * 100
server.headersTimeout = 60 * 1000 * 100

app.use(
    cors({
        origin: '*',
        allowedHeaders: '*', //X-Token as a custom header field
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    })
)

app.get('/api', (req, res) => {
    res.json({
        message: 'The Chat Server using WebSocket This is a genral API Message',
    })
})

app.get('/', (req, res) => {
    res.send('Server is Running')
})

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found')
})

const wss = new WebSocket.Server({ server })

wss.keepAliveTimeout = 60 * 1000 * 100
wss.headersTimeout = 60 * 1000 * 100

var msg
let users = []

wss.on('connection', function connection(socket, request, client) {
    socket.id = uuidv4()

    console.log(`⚡: ${socket.id} user just connected!`)

    socket.on('message', async (data) => {
        try {
            dataJson = JSON.parse(data)
            if (dataJson.type === 'message') {
                messageCTL(wss, dataJson)
            }

            if (dataJson.type === 'typing') {
                typingCTL(wss, dataJson, socket)
            }

            if (dataJson.type === 'newUser') {
                users = usersCTL(wss, dataJson, users, socket)
            }

            if (dataJson.type === 'leaveChat') {
                users = leaveCTL(wss.dataJson, users)
            }
        } catch (error) {
            socket.send(JSON.stringify({ type: 'errorSocket', error: error }))
        }

        console.log(`⚡: ${socket.id} messageResponse : ${data}`)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected')
        users = users.filter((user) => user.socketID !== socket.id)
        socket.send(JSON.stringify({ type: 'messageResponse', users: users }))
        socket.disconnect()
    })

    socket.on('error', (error) => {
        console.log('🔥: Error Socket')
        socket.send(JSON.stringify({ type: 'errorSocket', error: error }))
        socket.connection()
    })

    socket.on('ping', () => {
        console.log(`🔥: ${socket.id} Ping`)
        socket.pong()
    })

    socket.send(
        JSON.stringify({
            type: 'ConnectionResponse',
            data: 'Chat room is working!',
        })
    )
})

wss.on('listening', () => {
    console.log(`⚡: WSS Server is listening!`)
})

server.listen(PORT, () => {
    console.log(`⚡: HTTP Server is running on port ${PORT}!`)
})
