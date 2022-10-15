const typingCTL =  (wss, dataJson, socket) => {
    try {

        wss.clients.forEach((client) => {
            if (client.id != socket.id) {
                client.send(
                    JSON.stringify({
                        type: 'typingResponse',
                        text: dataJson.text,
                    })
                )
            }
        })
    
        
    } catch (error) {
        
    }

}

module.exports = typingCTL