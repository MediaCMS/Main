import { MongoClient, ObjectId } from 'mongodb';
import LRUCache from 'lru-cache';
import config from './config.js';

const client = new MongoClient(config.db);
const cache = new LRUCache({ max: config.cache });
const db = client.db();
await client.connect();

export { db as default, client, ObjectId, cache };