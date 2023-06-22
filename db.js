import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const client = new MongoClient(config.db);
const db = client.db();
await client.connect();

function skip(page = 1) {
    return (page - 1) * config.limit;
}

const limit = config.limit;

export { db as default, client, ObjectId, skip, limit };
