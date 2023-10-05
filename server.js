const http = require('http')
const fs = require('fs')
const url = require('url')
const db = require('./db.json')
console.log(db);

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
    if (req.method === 'DELETE') {
        const parsedUrl = url.parse(req.url, true)
        const bookID = parsedUrl.query.id;

        const newBooks = db.books.filter((book) => book.id != bookID)
        if (newBooks.length === db.books.length) {
            res.writeHead(401, { "Content-Type": "application/json" })
            res.write(JSON.stringify('Book not Found'))
            res.end()
        }
        else {
            fs.writeFile(
                "db.json",
                JSON.stringify({ ...db, books: newBooks }),
                (err) => {
                    if (err) {
                        throw err
                    }
                    res.writeHead(200, { "Content-Type": "application/json" })
                    res.write(JSON.stringify({ message: 'Book Removed Succesfuly' }))
                    res.end()
                }
            );
        }

    }
    if (req.method === "POST" && req.url === '/api/books') {
        let book = ''

        req.on('data', (data) => {
            book = book + data.toString()
        });

        req.on('end', () => {
            // console.log(JSON.parse(book));
            const newBook = { id: 123, ...JSON.parse(book), free: 1 }
            console.log(newBook);
            res.end('New book added')
        })
    }
})


server.listen(4503, () => {
    console.log('Server is Running');
})