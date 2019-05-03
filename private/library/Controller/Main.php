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

class Main extends Controller {

    /**
     * Виводить список коментарів
     */
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить коментар
     */
    public function view(): void {

        if (is_null($this->router->getURI(2))) {

            $this->router->redirect('/' . $this->router->getURI(0));

            throw new Exception('Відсутній ідентифікатор коментаря');
        }

        parent::view();
    }
}