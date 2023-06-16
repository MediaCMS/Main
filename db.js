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
    const sort = { field: 'title', direction: 1 }
    if ('sortField' in query) {
        sort.field = query['sortField'];
    }
    if ('sortOrder' in query) {
        sort.order = parseInt(query['sortOrder']);
    }
    const page = query?.page ?? 1;
    const stages = [
        { $match: match },
        { $sort: { [sort.field]: sort.order }},
        { $skip: (page - 1) * config.limit },
        { $limit: config.limit }
    ];
    //console.log(stages);
    return stages;
}

export { db as default, client, ObjectId, filter };
