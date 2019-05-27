/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
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
