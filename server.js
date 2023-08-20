const http = require('http')

const fs = require('fs')

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/users') {
        fs.readFile('db.json', (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db)
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify(data.users))
            res.end()

        })
    }
    if (req.method === 'GET' && req.url === '/api/books') {
        fs.readFile('db.json', (err, db) => {
            if (err) {
                throw err
            }
            const data = JSON.parse(db)
            res.writeHead(200, { "Content-Type": "application/json" })
            res.write(JSON.stringify(data.books))
            res.end()

        })
    }
})


server.listen(4503, () => {
    console.log('Server is Running');
})