import fs from 'fs'
import db from '../db.js';
import { SitemapStream } from 'sitemap';
import config from '../config.js';

export default async function (request, response) {

    const sitemap = new SitemapStream({ hostname: config.host });
    const stream = fs.createWriteStream(config.root + '/public/sitemap.xml');

    sitemap.pipe(stream);
    sitemap.write({ url: '/', changefreq: 'hourly', priority: 1.0 });

    sitemap.write({ url: '/posts', changefreq: 'monthly', priority: 0.8 });
    const posts = db.collection('posts')
        .find({ status: true })
        .sort({ time: 1 })
        .project({ _id: 0, slug: 1 });
    while (await posts.hasNext()) {
        const post = await posts.next();
        sitemap.write({
            url: `/posts/${post.slug}`,
            changefreq: 'never',
            priority: 0.3
        })
    }

    sitemap.write({ url: '/categories', changefreq: 'monthly', priority: 0.5 });
    const categories = db.collection('categories')
        .find({ status: true })
        .sort({ order: 1 })
        .project({ _id: 0, slug: 1 });
    while (await categories.hasNext()) {
        const category = await categories.next();
        sitemap.write({
            url: `/categories/${category.slug}`,
            changefreq: 'hourly',
            priority: 0.3
        })
    }

    sitemap.write({ url: '/tags', changefreq: 'monthly', priority: 0.5 });
    const tags = db.collection('tags')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });
    while (await tags.hasNext()) {
        const tag = await tags.next();
        sitemap.write({
            url: `/tags/${tag.slug}`,
            changefreq: 'hourly',
            priority: 0.3
        })
    }

    sitemap.write({ url: '/users', changefreq: 'monthly', priority: 0.1 });
    const users = db.collection('users')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });
    while (await users.hasNext()) {
        const user = await users.next();
        sitemap.write({ 
            url: `/users/${user.slug}`,
            changefreq: 'never',
            priority: 0.3
        })
    }

    sitemap.write({ url: '/pages', changefreq: 'never', priority: 0.1 });
    const pages = db.collection('pages')
        .find({ status: true })
        .sort({ title: 1 })
        .project({ _id: 0, slug: 1 });
    while (await pages.hasNext()) {
        const page = await pages.next();
        sitemap.write({
            url: `/pages/${page.slug}`,
            changefreq: 'never',
            priority: 0.3
        })
    }

    sitemap.write({ url: '/search', changefreq: 'never', priority: 0.1 });
    
    sitemap.end();
    response.end();
}