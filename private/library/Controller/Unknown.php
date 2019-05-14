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

    /** @var string Заголовок контролера */
    protected $title = '';

    /** @var string Опис контролера */
    protected $description = '';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';


    /**
     * Сторінка не знайдена
     */
    public function notFound(): void {

        $this->submenu = [];

        $alert = 'Невідома адреса ' . urldecode($_SERVER['REQUEST_URI']);

        $this->view->setAlert($alert, 'danger');

        header('HTTP/1.x 404 Not Found');
    }
}