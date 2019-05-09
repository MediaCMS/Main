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
use MediaCMS\Main\Exception;

class Home extends Controller {

    /**
     * Головний метод контролера
     */
    public function run(): void {

        $articleController = $this->router->getSchema('Article');

        $params = ['_status' => 1, '_orderField' => 'time', '_orderDirection' => 1, '_limit' => 6];

        $this->database->call('ArticleGetIndex', $params);

        $articlesNode = $this->node->addChild('articles');

        while($row = $this->database->getResult()) {

            $articleNode = $articlesNode->addChild('article');

            $row['uri'] = '/' . $articleController['alias'] . '/' . $row['alias'];

            $this->view->setItem($articleNode, $row);
        }
    }

    /**
     * Виводить коментар
     */
    public function view(): void {

        if (is_null($this->router->getURI(2))) {

            $this->router->redirect('/' . $this->router->getURI(0));

            throw new Exception('Відсутній ідентифікатор коментаря');
        }
    }
}