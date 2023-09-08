import fs from 'fs';
import db from '../db.js';
import config from '../config.js';

export default async function (request, response) {

    const sitemap = new Sitemap();

    sitemap.add('/', 'hourly', 1);
    
    sitemap.add('/publikatsiyi', 'hourly', 0.8);
    const posts = db.collection('posts')
        .find({ status: true })
        .sort({ time: 1 })
        .project({ _id: 0, slug: 1 });
    while (await posts.hasNext()) {
        const post = await posts.next();
        sitemap.add('/publikatsiyi/' + post.slug, 'never', 0.9);
    }

    sitemap.add('/katehoriyi', 'yearly', 0.3);
    const categories = db.collection('categories')
        .find({ status: true })
        .sort({ order: 1 })
        .project({ _id: 0, slug: 1 });
    while (await categories.hasNext()) {
        const category = await categories.next();
        sitemap.add('/katehoriyi/' + category.slug, 'hourly', 0.8);
    }

    sitemap.add('/mitky', 'monthly', 0.3);
    const tags = db.collection('tags')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });
    while (await tags.hasNext()) {
        const tag = await tags.next();
        sitemap.add('/mitky/' + tag.slug, 'hourly', 0.8);
    }

    sitemap.add('/korystuvachi', 'monthly', 0.3);
    const users = db.collection('users')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });
    while (await users.hasNext()) {
        const user = await users.next();
        sitemap.add('/korystuvachi/' + user.slug, 'hourly', 0.8);
    }

    sitemap.add('/storinky', 'never', 0.1);
    const pages = db.collection('pages')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });

    while (await pages.hasNext()) {
        const page = await pages.next();
        sitemap.add('/storinky/' + page.slug, 'never', 0.1);
    }

    sitemap.add('/poshuk', 'never', 0.1);

    fs.writeFileSync(config.root + '/public/sitemap.xml', sitemap.get());

    response.end();
}

class Sitemap {

    constructor () {
        this.xml = '<?xml version="1.0" encoding="UTF-8"?>';
        this.xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    }

    get () {
        return this.xml + '</urlset>';
    }

    add (url, changefreq = 'never', priority = 0) {
        let item = '';
        item += '<url>';
        item += `<loc>${config.protocol}://${config.host}${url}</loc>`;
        item += `<changefreq>${changefreq}</changefreq>`;
        item += `<priority>${priority}</priority>`;
        item += '</url>';
        this.xml += item;
    }
}