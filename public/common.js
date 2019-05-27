/**
 * Спільний JS файл
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
$(function(){

    let imageWidths = {};
    $.each(['0320', '0480', '0640', '0960', '1280', '1600', '1920', '2560', '3840'], function(index, width) {
        imageWidths[Number(width)] = width;
    });

    let nodes = {};
    nodes.html = $('html');
    nodes.body = $('body');

    function lazyLoad(scrollTop){
        $('body img[data-width]').each(function(){
            if($(this).offset().top > scrollTop) return false;
            let parentWidth = $(this).parent().width();
            let parentHeight = $(this).parent().height();
            let currentWidthTitle = imageWidths[320];
            let currentWidthMax = Number($(this).data('width'));
            $.each(imageWidths,function (width, widthTitle) {
                let height = width / 2;
                currentWidthTitle = widthTitle;
                if ((width > parentWidth) && (height > parentHeight)) return false;
                if (width >= currentWidthMax) return false;
            });
            let uri = $(this).attr('src').slice(0, -8) + currentWidthTitle + '.jpg';
            $(this).attr('src', uri).removeAttr('data-width');
        });
    }

});
