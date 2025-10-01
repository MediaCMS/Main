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

    posts: async (request, response, next) => {
        const data = await db.collection('categories')
            .aggregate([
                { $match: {
                    slug: request.params.slug,
                    status: true
                } },
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
                        { $sort: { time: 1 } },
                        { $skip: skip(request.query?.page) },
                        { $limit: limit },
                        { $lookup: {
                            from: 'users', 
                            localField: 'user', 
                            foreignField: '_id', 
                            as: 'user'
                        } },
                        { $unwind: '$user' },
                        { $project: {
                            _id: false, title: true, description: true,
                            image: true, slug: true, date: true, status: true,
                            user: { title: true, slug: true }
                        } }
                    ],
                    as: 'posts'
                } },
                { $project: {
                    _id: false, time: false, order: false,
                    user: false, status: false
                } } 
            ]).next();
        if (!data) {
            response.status(404);
            return next();
        }
        response.render('categories/posts', data);
     }
}