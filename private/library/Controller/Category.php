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

class Category extends Controller {

    /**
     * Виводить список категорій
     */
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить статті категорії
     */
    public function view(): void {

        parent::view();
    }
}