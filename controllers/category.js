import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Категорії",
            description: "Список категорій публікацій",
            keywords: "категорії"
        };
        data.categories = await db.collection('categories')
            .find({ status: true }).sort({ order: 1 } ).toArray();
        response.render('categories/index', data);
    },

    posts: async (request, response) => {
        const stages = [
            { $lookup: {
                from: 'posts', 
                let: { category: '$_id' },
                pipeline: [
                    { $match: {
                        $expr: {
                            $eq: [ '$category', '$$category' ]
                        },
                        status: true
                    } },
                    { $lookup: {
                        from: 'users', 
                        localField: 'user', 
                        foreignField: '_id', 
                        as: 'user'
                    } },
                    { $unwind: '$user' },
                    { $project: {
                        _id: false, title: true, description: true,
                        image: true, alias: true, status: true,
                        user: { title: true, alias: true }
                    } },
                    { $sort: { time: 1 } },
                    { $skip: skip(request.query?.page) },
                    { $limit: limit }
                ],
                as: 'posts'
            } },
            { $match: {
                alias: request.params.slug,
                status: true
            } },
            { $project: { _id: false, time: false, order: false, user: false, status: false }}
        ];
        console.dir(stages, { depth: 6 })
        const data = await db.collection('categories')
            .aggregate(stages).next();
        console.dir(data, { depth: 6 })
        /*
        const data = await db.collection('categories')
            .find({
                alias: request.params.slug,
                status: true
            }).next();
        let stages = filter({
            category: data._id,
            sortField: 'time',
            sortOrder: 1, ...request.query
        });
        stages = [
            { $lookup: {
                from: 'users', 
                localField: 'user', 
                foreignField: '_id', 
                as: 'user'
            } },
            { $unwind: '$user' },
            { $project: {
                time: 1, title: 1, description: 1, 
                image: 1, tags: 1, alias: 1, status: 1,
                category: { _id: 1, title: 1, alias: 1 },
                user: { _id: 1, title: 1, alias: 1 }
            }},
            ...stages
        ];
        data.posts = await db.collection('posts')
            .aggregate(stages).toArray();
        */
        response.render('categories/posts', data);
     }
}