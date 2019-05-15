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

    /** @var string Заголовок контролера */
    protected $title = 'Статті';

    /** @var string Опис контролера */
    protected $description = 'Список статей сайту (сторінка в розробці)';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';


    /**
     * Головний метод контролера
     */
    public function run(): void {

        parent::run();
    }

    /**
     * Виводить список об'єктів з БД
     */
    protected function index(): void {

        parent::index();
    }

    /**
     * Виводить дані про об'єкт з БД
     *
     * @param string $alias Псевдонім об'єкту
     */
    protected function view(string $alias): void {

        parent::view($alias);
    }
}