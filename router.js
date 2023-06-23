import express from 'express';

import home from './controllers/home.js';
import post from './controllers/post.js';
import category from './controllers/category.js';
import tag from './controllers/tag.js';
import page from './controllers/page.js';
import user from './controllers/user.js';
import search from './controllers/search.js';
import cache from './controllers/cache.js';
import config from './config.js';

const router = express.Router();

router.get('/', home);
router.get('/публікації', post.index);
router.get('/публікації/:slug', post.view);
router.get('/категорії', category.index);
router.get('/категорії/:slug', category.posts);
router.get('/мітки', tag.index);
router.get('/мітки/:slug', tag.posts);
router.get('/сторінки', page.index);
router.get('/сторінки/:slug', page.view);
router.get('/автори', user.index);
router.get('/автори/:slug', user.posts);
router.get('/пошук', search);

router.get('/кеш', authenticate, cache.index);
router.delete('/кеш', authenticate, cache.clear);

router.get('/:slug', async (request, response) => {
    response.render('404');
});

function authenticate(request, response, next) {
    if (!request?.header('x-api-key')
        || (request.header('x-api-key') !== config.key) )
        return response.sendStatus(403); 
    next()
}

export { router as default };