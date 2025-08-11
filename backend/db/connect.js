const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

let db;

const connectdb = async () => {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
};

const getdb = () => db;

module.exports = { connectdb, getdb };
