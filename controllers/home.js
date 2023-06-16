import db, { filter } from '../db.js';

export default async (request, response) => {
    const view = {
        title: 'Категорії',
        description: 'Список категорій публікацій',
        keywords: 'категорії'
    };
    response.render('home', view);
}