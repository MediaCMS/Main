import db from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: 'Автори', 
            description: 'Список авторів публікацій',
            keywords: 'автори'
        };
        const stages = [
            { $lookup: {
                from: 'roles', 
                localField: 'role',
                foreignField: '_id',
                as: 'role'
            }},
            { $unwind: '$role' },
            ...filter(request.query)
        ];
        stages[0].$match.role.lavel = { $gt: 2 };
        data.users = await db.collection('users')
            .aggregate(stages).toArray();
        response.render('users/list', data);
    },

    view: async (request, response) => {
        const user = await db.collection('users').find({
            alias: request.params.slug,
            status: true
        }).next();
        response.render('users/view', user);
    }
}