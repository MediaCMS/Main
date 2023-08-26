import express from 'express';

import home from './controllers/home.js';
import post from './controllers/post.js';
import category from './controllers/category.js';
import tag from './controllers/tag.js';
import page from './controllers/page.js';
import user from './controllers/user.js';
import search from './controllers/search.js';
import sitemap from './controllers/sitemap.js';
import cache from './controllers/cache.js';
import config from './config.js';

const router = express.Router();

router.get('/', home);
router.get('/posts', post.index);
router.get('/posts/:slug', post.view);
router.get('/categories', category.index);
router.get('/categories/:slug', category.posts);
router.get('/tags', tag.index);
router.get('/tags/:slug', tag.posts);
router.get('/pages', page.index);
router.get('/pages/:slug', page.view);
router.get('/users', user.index);
router.get('/users/:slug', user.posts);
router.get('/search', search);
router.get('/sitemap', authenticate, sitemap);

router.get('/cache', authenticate, cache.index);
router.delete('/cache', authenticate, cache.clear);

router.get('/:slug', async (request, response, next) => {
    response.status(404);
    next();
});

router.use(async (request, response, next) => {
    if (response.statusCode === 404) {
        response.locals.title = config.notFound.title;
        response.locals.description = config.notFound.description;
        response.locals.keywords = config.notFound.keywords;
        response.render('404');
    }
    next();
});

function authenticate(request, response, next) {
    if (!request?.header('x-api-key')
        || (request.header('x-api-key') !== config.key) )
        return response.sendStatus(403); 
    next()
}

export { router as default };