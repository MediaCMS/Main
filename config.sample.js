export default {
    name: 'Медіа',
    host: 'media',
    protocol: 'https',
    ip: '127.0.1.1',
    port: 8888,
    root: '/var/www/media/main',
    db: 'mongodb://media:0123456789@localhost:27017/media',
    image: {
        host: 'https://photo.media',
        widths: [320, 480, 640, 800, 960, 1280, 1600, 1920, 2560, 3840],
        blank: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    },
    notFound: {
        title: 'Сторінка не знайдена',
        description: 'Сторінка за вашим запитом не знайдена на нашому сайті',
        keywords: '404'
    },
    key: '',
    cache: 1_000,
    google: {
        analytics: '',
        search: ''
    },
    facebook: {
        pages: '',
        app_id: '',
        admins: ''
    },
    copyright: '2023',
    limit: 100,
    log: '/log'
}