<?php
/**
 * Контролер для тестування
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;
use MediaCMS\Main\Exception;

class Test extends Controller {

    /** @var string Заголовок контролера */
    protected $title = '';

    /** @var string Опис контролера */
    protected $description = '';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';


    /**
     * Головний метод контролера
     */
    public function run(): void {


    }
}