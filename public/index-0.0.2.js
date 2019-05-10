/**
 * Головний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
console.log('index.js loaded');
$(function(){

    console.log('document ready');

    let imageWidths = {};
    $.each(['0320', '0480', '0640', '0960', '1280', '1600', '1920', '2560', '3840'], function(index, width) {
        imageWidths[Number(width)] = width;
    });

    let nodes = {};
    nodes.html = $('html');
    nodes.body = $('body');
    let photo = {
        host: nodes.html.data('photo-host'),
        path: nodes.html.data('photo-path')
    };

    // create images
    $('html img[data-uri][data-uri!=""]').each(function() {
        let imageParentWidth = $(this).parent().width();
        let imageParentHeight = $(this).parent().height();
        let imageCurrentWidthTitle = imageWidths[320];
        let imageCurrentWidthMax = Number($(this).data('uri').slice(-8, -4));
        $.each(imageWidths,function (imageWidth, imageWidthTitle) {
            imageHeight = imageWidth / 2;
            imageCurrentWidthTitle = imageWidthTitle;
            if ((imageWidth > imageParentWidth) && (imageHeight > imageParentHeight)) return false;
            if (imageWidth >= imageCurrentWidthMax) return false;
        });
        let uri = $(this).data('uri').slice(0, -8) + imageCurrentWidthTitle + '.jpg';
        $(this).attr('src', photo.host + photo.path + uri);
    });
});
