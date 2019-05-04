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

class Article extends Controller {

    /**
     * Виводить список статей
     */
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить статтю
     */
    public function view(): void {

        parent::view();
    }
}