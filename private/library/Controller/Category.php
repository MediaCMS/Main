<?php
/**
 * Контролер категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;
use \SimpleXMLElement;

class Category extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Категорії';

    /** @var string Опис контролера */
    protected $description = 'Перелік категорій сайту (сторінка в розробці)';

    /** @var string Ключові слова контролера */
    protected $keywords = 'категорії';

    /** @var string Зображення контролера */
    protected $image = '';


    /**
     * Виводить дані про об'єкт з БД (розширення)
     *
     * @param SimpleXMLElement $node Посилання на елемент виводу
     * @param array $data Посилання на дані об'єкта
     */
    protected function viewExtended(SimpleXMLElement $node, array &$data): void {

        $this->filter['categoryID'] = $data['id'];

        $this->index($node);
    }

    /**
     * Додає у вигляд сторінку з 404-ю помилкою
     */
    protected function notFound(): void {

        $this->title = 'Невідома категорія';

        $this->description = sprintf('Невідомий псевдонім категорії "%s"', $this->router->getURI(1));

        $this->keywords = 'Невідома категорія, сторінка не знайдена, 404 Not Found';

        $this->image = '';

        $this->view->setAlert($this->description, 'danger');

        header('HTTP/1.x 404 Not Found');
    }
}