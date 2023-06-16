export default async (request, response) => {
    response.render('search', {
        title: 'Пошук',
        description: 'Пошук по сайту',
        keywords: 'пошук'
    });
}