export default {
    name: 'Медіа',
    host: 'media',
    protocol: 'https',
    ip: '127.0.1.1',
    port: 8888,
    path: '/var/www/media/main',
    db: 'mongodb://media:0123456789@localhost:27017/media',
    cache: 10,
    image: {
        host: 'https://photo.media',
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
    copyright: '2023',
    limit: 100,
    log: 'log'
}