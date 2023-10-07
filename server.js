const http = require('http')
const fs = require('fs')
const url = require('url')
const db = require('./db.json')
const crypto = require('crypto')
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
    if (req.method === 'DELETE' && req.url.startsWith('/api/books')) {
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
            const newBook = { id: crypto.randomUUID(), ...JSON.parse(book), free: 1 }
            db.books.push(newBook)
            fs.writeFile('./db.json', JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }
                res.writeHead(201, { 'Content-Type': "application/json" })
                res.write(JSON.stringify({ message: 'New Book Added' }))
                res.end()
            })
            console.log(newBook);
            res.end('New book added')
        })
    }
    if (req.method === 'PUT' && req.url.startsWith('/api/books')) {
        const parsedUrl = url.parse(req.url, true)
        const bookId = parsedUrl.query.id
        let newBookInfo = ''

        req.on('data', (data) => {
            newBookInfo = newBookInfo + data.toString()
        })
        req.on('end', () => {
            const reqBody = JSON.parse(newBookInfo)

            db.books.forEach((book) => {
                if (book.id === Number(bookId)) {
                    book.title = reqBody.title
                    book.author = reqBody.author
                    book.price = reqBody.price
                }
            })
            fs.writeFile('./db.json', JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write('Book Updated')
                res.end()
            })
        })
    }
    if (req.method === "POST" && req.url === '/api/users') {
        let newUser = ''

        req.on('data', (data) => {
            newUser = newUser + data.toString()
        })
        req.on('end', () => {
            const { name, username, email } = JSON.parse(newUser)

            const isUserExists = db.users.find(
                (user) => user.email === email || user.username === username
            )
            if (name === "" || username === "" || email === "") {
                res.writeHead(422, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ message: 'Please Fill all data' }))
                res.end()
            } else if (isUserExists) {
                res.writeHead(409, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ message: 'This user Already exists' }))
                res.end()
            } else {
                const newUserInfo = {
                    id: crypto.randomUUID(),
                    name,
                    username,
                    email,
                    crime: 0
                }
                db.users.push(newUserInfo)

                fs.writeFile('./db.json', JSON.stringify(db), (err) => {
                    if (err) {
                        throw err
                    }
                })
                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ message: "UserRegisterd Succesfuly" }))
                res.end()
            }


            // console.log(newUserInfo);
        })
    }
    if (req.method === 'PUT' && req.url.startsWith('/api/users')) {
        const parsedUrl = url.parse(req.url, true)
        const userId = parsedUrl.query.id
        let reqBody = ''

        req.on('data', (data) => {
            reqBody = reqBody + data.toString()
        })

        req.on('end', () => {
            const { crime } = JSON.parse(reqBody)

            db.users.forEach(user => {
                if (user.id === +userId) {
                    user.crime = crime
                }
            })
            fs.writeFile('./db.json', JSON.stringify(db), (err) => {
                if (err) {
                    throw err
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({ message: 'User Punished' }))
                res.end()
            })
        })
    }
})


server.listen(4503, () => {
    console.log('Server is Running');
})