<?php
/**
 * Головний файл в загальному доступі
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

/** Час початку виконання скриптів */
define('TIME', microtime(true));

/** Кількість пам’яті, що використовується на початку виконання скриптів */
define('MEMORY', memory_get_usage());

/** Шлях до головної теки сайту */
define('PATH_ROOT', realpath( __DIR__ . '/..'));

/** Шлях до головної публічної теки сайту */
define('PATH_PUBLIC', PATH_ROOT .'/public');

/** Шлях до головної приватної теки сайту */
define('PATH_PRIVATE', PATH_ROOT .'/private');

require_once(PATH_PRIVATE . '/index.php');
