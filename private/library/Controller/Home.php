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

    /**
     * Головний метод контролера
     */
    public function run(): void {

        $articleController = $this->router->getSchema('Article');

        $params = ['_status' => 1, '_orderField' => 'time', '_orderDirection' => 1, '_limit' => 6];

        $this->database->call('ArticleGetIndex', $params);

        $articles = $this->database->getResults();

        shuffle($articles); // видалити, додано для демо сайта

        $articlesNode = $this->node->addChild('articles');

        foreach($articles as $article) {

            $articleNode = $articlesNode->addChild('article');

            $article['uri'] = '/' . $articleController['alias'] . '/' . $article['alias'];

            $this->view->setItem($articleNode, $article);
        }
    }
}