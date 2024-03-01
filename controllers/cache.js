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
    delete: (request, response) => {
        const path = '/' + request.params.categorySlug
        + '/' + request.params.documentSlug
        console.log(path, cache.has(path))
        cache.delete(path)
        response.end();
    },
    clear: (request, response) => {
        cache.clear();
        response.end();
    },
}