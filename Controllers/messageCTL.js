const messageCTL =  (wss, dataJson) => {
    try {

        wss.clients.forEach((client) =>
            client.send(
                JSON.stringify({
                    type: 'messageResponse',
                    msg: dataJson.msg,
                })
            )
        )
        console.log(
            `⚡: ${socket.id} messageResponse : ${dataJson.text}`
        )
    
        
    } catch (error) {
        
    }

}

module.exports = messageCTL