<?php
/**
 * Контролер погоди
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;

class Weather extends Controller {

    /** @var string Заголовок контролера */
    protected $title = 'Погода';

    /** @var string Опис контролера */
    protected $description = 'Прогноз погоди на деклька днів (сторінка в розробці)';

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