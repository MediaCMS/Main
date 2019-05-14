<?php
/**
 * Контролер головної сторінки
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;

class Home extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Головна сторінка';

    /** @var string Опис контролера */
    protected $description = 'Медіа - демонстраційний сайт інтернет-видання розробленої на MediaCMS (сторінка в розробці)';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';


    /**
     * Головний метод контролера
     */
    public function run(): void {

        $articleAlias = $this->router->getAliasByController('Article');

        $params = ['_status' => 1, '_orderField' => 'time', '_orderDirection' => 1, '_limit' => 6];

        $this->database->call('ArticleGetIndex', $params);

        $articles = $this->database->getResults();

        shuffle($articles); // видалити, додано для демо сайта

        $articlesNode = $this->node->addChild('articles');

        foreach($articles as $article) {

            $articleNode = $articlesNode->addChild('article');

            $article['uri'] = '/' . $articleAlias . '/' . $article['alias'];

            $this->view->setItem($articleNode, $article);
        }
    }
}