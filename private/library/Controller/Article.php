<?php
/**
 * Контролер статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;
use \SimpleXMLElement;

class Article extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Статті';

    /** @var string Опис контролера */
    protected $description = 'Список статей сайту';

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

        $keywords = [];

        $tagControllerAlias = $this->router->getAliasByController('Tag');

        $tags = explode(',', $data['tags']);

        $tagsNode = $node->addChild('tags');

        foreach($tags as $tag) {

            $tagArray = explode('/', $tag);

            $tagNode = $tagsNode->addChild('tag');

            $tagNode->addAttribute('title', $tagArray[0]);

            $tagNode->addAttribute('uri', '/' . $tagControllerAlias . '/' . $tagArray[1]);

            $keywords[] = $tagArray[0];
        }

        $this->keywords = implode(', ', $keywords);

        $userControllerAlias = $this->router->getAliasByController('User');

        $data['userURI'] = '/' . $userControllerAlias . '/' . $data['userAlias'];

        unset($data['text'], $data['tags']);
    }
}