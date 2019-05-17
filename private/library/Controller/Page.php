<?php
/**
 * Контролер сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;
use \SimpleXMLElement;

class Page extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Сторінки';

    /** @var string Опис контролера */
    protected $description = 'Статичні сторінки сайту (сторінка в розробці)';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';

    
    /**
     * Виводить дані про об'єкт з БД (розширення)
     *
     * @param SimpleXMLElement $node Посилання на елемент виводу
     * @param array $data Посилання на дані об'єкта
     */
    protected function viewExtended(SimpleXMLElement $node, array &$data): void {

        $textNode = new SimpleXMLElement('<text>' . $data['text'] . '</text>');

        $this->view->addTree($node, $textNode);

        unset($data['text']);
    }

}