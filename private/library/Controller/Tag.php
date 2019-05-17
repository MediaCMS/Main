<?php
/**
 * Контролер міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;
use \SimpleXMLElement;

class Tag extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Мітки';

    /** @var string Опис контролера */
    protected $description = 'Список міток сайту (сторінка в розробці)';

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

        $this->filter['tagID'] = $data['id'];

        $this->index($node);
    }
}