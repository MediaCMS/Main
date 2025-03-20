export default {
    name: 'Медіа',
    host: 'media',
    protocol: 'https',
    ip: '127.0.1.1',
    port: 8888,
    root: '/var/www/media/main',
    db: 'mongodb://media:**********@127.0.0.1:27017/media',
    key: '', // private key
    cors: {
        origin: 'http://panel.mediacms.local',
        optionsSuccessStatus: 200
    },
    image: {
        host: 'https://image.example.com',
        widths: [320, 480, 640, 800, 960, 1280, 1600, 1920, 2560, 3840],
        blank: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    },
    google: {
        analytics: '',
        search: ''
    },
    facebook: {
        pages: '',
        app_id: '',
        admins: ''
    },
    notFound: {
        title: 'Сторінка не знайдена',
        description: 'Сторінка за вашим запитом не знайдена на нашому сайті',
        keywords: '404'
    },
    copyright: '2025',
    cache: 1_000,
    limit: 100,
    log: '/log'
}