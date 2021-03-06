<?php
/**
 * Контролер загальних дій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;

class Unknown extends Controller {

    /**
     * Головний метод контролера
     */
    public function run(): void {

        $this->notFound();
    }
}