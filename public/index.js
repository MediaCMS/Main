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

console.log('development: ' + DEVELOPMENT);

const DEBUG = (document.documentElement.hasAttribute('data-debug'));

console.log('debug: ' + DEBUG);

/* Google Tag*/
if (!DEVELOPMENT) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-141467326-1';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-141467326-1');
}

let imageWidths = {};
$.each(['0320', '0480', '0640', '0960', '1280', '1600', '1920', '2560', '3840'], function(index, width) {
    imageWidths[Number(width)] = width;
});


$(function(){

    let nodes = {};
    nodes.html = $('html');
    nodes.body = $('body');


    // paragraph with text resize
    $('body main div.text p').each(function() {
        if ($(this).find('img').length > 0) return true;
        //if ($(this).text().search('Фото:|Джерело:') > -1) return true;
        $(this).css('max-width', '760px');
    });

    // images lazy load
    lazyLoad();
    lazyLoad($(window).height());
    $(window).scroll(function(){
        let scrollTop = $(window).scrollTop() + ($(window).height() * 0.9);
        lazyLoad(scrollTop);
    });
});

function lazyLoad(scrollTop) {
    //if (typeof simulation === 'undefined') simulation = false;
    $('body img[data-width]').each(function(){
        if ((scrollTop !== undefined) && ($(this).offset().top > scrollTop)) return false;
        let parentWidth = $(this).parent().width();
        let parentHeight = $(this).parent().height();
        let currentWidth = 320;
        let currentWidthTitle = imageWidths[320];
        let currentWidthMax = Number($(this).data('width'));
        $.each(imageWidths,function (width, widthTitle) {
            let height = width / 2;
            currentWidth = width;
            currentWidthTitle = widthTitle;
            if ((width > parentWidth) && (height > parentHeight)) return false;
            if (width >= currentWidthMax) return false;
        });
        if (scrollTop === undefined) {
            $(this).width(currentWidth);
        } else {
            let uri = $(this).attr('src').slice(0, -8) + currentWidthTitle + '.jpg';
            $(this).attr('src', uri).removeAttr('data-width');
        }
    });
}