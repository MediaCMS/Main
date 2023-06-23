import cache from '../cache.js';

export default {
    index: (request, response) => {
        const data = { index: [], total: { count: 0, size: 0 } };
        cache.forEach((value, key) => {
            const size = Buffer.byteLength(JSON.stringify(value))
            data.index.push({ key, size });
            data.total.size += size;
            data.total.count ++;
        })
        response.json(data);
    },
    clear: (request, response) => {
        if (request.query?.path) {
            cache.delete(request.query.path)
        } else {
            cache.clear();
        }
        response.end();
    },
}