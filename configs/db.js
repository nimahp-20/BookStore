const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'library';

const main = async () => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        // const usersCollection = db.collection('users');
        //
        // const result = await usersCollection.insertOne({
        //     name: 'Nima',
        //     username: 'Nima12345',
        //     email: 'nh@gmail.com',
        //     crime: 0,
        //     role: 'ADMIN',
        // });

        const rentsCollections = db.collection('rents')
        const result = await  rentsCollections.insertOne({
            "id": "e708c9a4-fc00-4b30-aecf-14934a3f7bfc",
            "userId": "1",
            "bookId": "2"
        })
        console.log(`Inserted document with _id: ${result.insertedId}`);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
};

main();
