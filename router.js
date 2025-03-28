import express from 'express';
import jwt from 'jsonwebtoken';

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

const verification = (request, response, next) => {
    if (request.cookies?.token) {
        try {
            response.locals.user = jwt.verify(
                request.cookies.token, config.key
            );
        } catch (error) {
            return response.status(403).end(error);
        }
    } else {
        return response.sendStatus(401);
    }
    next();
}

const router = express.Router();

router.get('/', home);
router.get('/publikatsiyi', post.index);
router.get('/publikatsiyi/:slug', post.view);
router.get('/katehoriyi', category.index);
router.get('/katehoriyi/:slug', category.posts);
router.get('/mitky', tag.index);
router.get('/mitky/:slug', tag.posts);
router.get('/storinky', page.index);
router.get('/storinky/:slug', page.view);
router.get('/korystuvachi', user.index);
router.get('/korystuvachi/:slug', user.posts);
router.get('/poshuk', search);

router.get('/mapa-sayta', verification, sitemap);
router.get('/kesh', verification, cache.index);
router.delete(
    '/kesh/:categorySlug/:documentSlug',
    verification, cache.delete
);
router.delete('/kesh', verification, cache.clear);

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

export { router as default };