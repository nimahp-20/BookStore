const { MongoClient } = require('mongodb');
require('dotenv').config()

const dbName = process.env.dbName;

const client = new MongoClient(process.env.dbConnection);
const main = async () => {

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);

        const users = db.collection('users')
        const result = await  users.insertOne({
            "name": "ali",
            "username": "ali_mmdi",
            "email": "ali@gmail.com",
            "crime": 0,
            "role": "USER"
        })
        console.log(result);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
};

main();
