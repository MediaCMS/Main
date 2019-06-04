/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

console.log('index.js was loaded');

const DEVELOPMENT = (document.documentElement.hasAttribute('data-development'));

console.log('development: '+DEVELOPMENT);

const DEBUG = (document.documentElement.hasAttribute('data-debug'));

console.log('debug: '+DEBUG);

/* Google Tag*/
if (!DEVELOPMENT) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-141467326-1';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-141467326-1');
}

$(function(){
    /*
    let photo = {
        host: nodes.html.data('photo-host'),
        path: nodes.html.data('photo-path')
    };
    */

    // images lazy load
    lazyLoad($(window).height());
    $(window).scroll(function(){
        let scrollTop = $(window).scrollTop() + ($(window).height() * 0.9);
        lazyLoad(scrollTop);
    });
});
