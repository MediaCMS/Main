import home from '../service/post/home.js';
import cache from '../cache.js';

export default async (request, response) => {
    const data = cache.has(request.path)
        ? cache.get('/') : await home();
//    console.log(data);
    response.render('home', {
//        title: 'Новини',
//       description: '',
//        keywords: 'новини, статті, медіа',
        posts: data.posts
    });
}