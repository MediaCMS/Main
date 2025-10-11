import home from '../service/post/home.js';
import cache from '../cache.js';

export default async (request, response) => {
    const data = cache.has(request.path)
        ? cache.get('/') : await home();
    response.render('home', {
        title: 'Новини Львова і Львівщини',
        description: 'Варіанти - онлайн газета новин Львова. Інший погляд на львівські новини та новини львівщини. Завжди свіжі новини про Львів, про львів\'ян і не тільки. Тут новини у Львові оновлюються постійно.',
        keywords: 'новини львів, львівські новини, новини львівщини, новини про Львів, новини у Львові, Варіанти',
        important: data.important,
        categories: data.categories
    });
}