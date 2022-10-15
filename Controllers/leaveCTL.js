const leaveCTL =  (wss, dataJson, users) => {
    try {

        users = users.filter((u) => u.userName !== dataJson.userName)

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

module.exports = leaveCTL