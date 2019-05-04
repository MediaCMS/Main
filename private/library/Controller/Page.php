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

class Page extends Controller {

    /**
     * Виводить список сторінок
     */
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить сторінку
     */
    public function view(): void {

        parent::view();
    }
}