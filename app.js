import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db, { client } from './db.js';
import log from './log.js';
import menu from './menu.js';
import router from './router.js';
import config from './config.js';

const app = express();
const server = app.listen(config.port, config.ip, () => {
    console.log(`HTTP server started [${app.get('env')}]`);
    console.log(`Listening at ${config.ip}:${config.port}`);
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors(config.cors));
app.set('views', config.root + '/views');
app.set('view engine', 'ejs');

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

app.use(async function (request, response, next) {
    request.url = decodeURI(request.url);
    response.locals.name = config.name;
    response.locals.host = config.host;
    response.locals.idn = config.idn;
    response.locals.path = decodeURI(request.originalUrl).split("?").shift();
    response.locals.url = response.locals.host + response.locals.uri;
    response.locals.menu = menu;
    response.locals.images = config.image;
    response.locals.title = config.name;
    response.locals.description = null;
    response.locals.keywords = null;
    response.locals.message = null;
    response.locals.map = false;
    response.locals.google = config.google;
    response.locals.facebook = config.facebook;
    response.locals.copyright = config.copyright;
    response.locals.categories = await db.collection('categories')
        .find({ status: true }).sort({ order: 1 }).toArray();
    next();
});

app.use(async (request, response, next) => {
    const render = response.render;
    response.render = function (view, locals, callback) {
        render.call(this, 'index', { ...locals, ...{ view } }, callback);
    }
    next();
});

app.use(router);

app.use(async (error, request, response, next) => {
    console.error(error);
    if (response.headersSent) return next(error);
    response.status(500).end('Error ;-(');
    await log(error);
})

process.on('unhandledRejection', async error => {
    console.log('Unhandled Rejection', error);
    await log(error);
    process.exit(1);
})

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received')
    await client.close();
    server.close();
    console.log(`HTTP server closed`);
    process.exit(0);
})
