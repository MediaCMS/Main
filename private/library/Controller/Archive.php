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

    /** @var string Заголовок контролера */
    protected $title = 'Архів';

    /** @var string Опис контролера */
    protected $description = 'Список статей структорований по датам (сторінка в розробці)';

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