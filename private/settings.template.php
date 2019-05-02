<?php
/**
 * Налаштування
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

/** Назва сайту */
define('TITLE', '');

/** Адреса сайту */
define('HOST', '');

/** Адреса сервера БД MySQL */
define('DB_HOST', 'localhost');

/** Назва БД MySQL */
define('DB_NAME', '');

/** Назва користувача БД MySQL */
define('DB_USER', '');

/** Пароль користувача БД MySQL */
define('DB_PASSWORD', '');

/** Адреса головного сайту */
define('MAIN', '');

/** Адреса фотосервера */
define('PHOTO_HOST', '');

/** Шлях до файлів фотографій */
define('PHOTO_PATH', '/');

/** Адреса сервера Memcached */
define('MEMCACHED_HOST', 'localhost');

/** Порт сервера Memcached */
define('MEMCACHED_PORT', '11211');

/** Публічний ключ reCaptcha */
define('RECAPTCHA_PUBLIC', '');

/** Таємний ключ reCaptcha */
define('RECAPTCHA_PRIVATE', '');

/** Ознка виконання сторінки в режимі розробки */
define('DEVELOPMENT', false);
