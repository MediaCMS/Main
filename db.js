import { MongoClient, ObjectId } from 'mongodb';
import config from './config.js';

const client = new MongoClient(config.db);
const db = client.db();
await client.connect();

function filter(query) {
    const match = { status: true }
    if ('category' in query) {
        match['category._id'] = new ObjectId(query.category);
    }
    if ('tag' in query) {
        match.tags = new ObjectId(query.tag);
    }
    if ('user' in query) {
        match['user._id'] = new ObjectId(query.user);
    }
    const order = { field: 'title', direction: 1 }
    if ('orderField' in query) {
        order.field = query['orderField'];
    }
    if ('orderDirection' in query) {
        order.direction = parseInt(query['orderDirection']);
    }
    const page = request.query?.page ?? 1;
    const stages = [
        { $match: match },
        { $order: { [order.field] : order.direction }},
        { $skip: (page - 1) * config.limit },
        { $limit: config.limit }
    ];
    //console.log(stages);
    return stages;
}

export { db as default, client, ObjectId, filter };
