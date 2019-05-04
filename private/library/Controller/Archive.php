<?php
/**
 * Контролер архіву статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;

class Archive extends Controller {

    /**
     * Виводить список статей по датам
     */
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить статті за певну дату
     */
    public function view(): void {

        parent::view();
    }
}