const usersCTL =  (wss, dataJson, users, socket) => {
    try {

        const user = {
            userID: socket.id,
            userName: dataJson.userName,
            socketID: socket.id,
        }

        users = users.filter((u) => u.userName !== user.userName)

        users.push(user)
        console.log
        wss.clients.forEach((client) =>
            client.send(
                JSON.stringify({
                    type: 'newUserResponse',
                    users: users,
                })
            )
        )
        console.log(`⚡: newUserResponse :`, users)
        
        return users
                        
        
    } catch (error) {
        return users
    }

}

module.exports = usersCTL