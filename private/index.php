<?php
/**
 * Головний файл з обмеженим доступом
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

use MediaCMS\Main\Router;
use MediaCMS\Main\Exception;
use MediaCMS\Main\Log;

session_start();

set_error_handler('exceptionErrorHandler');

spl_autoload_register('autoload');


require_once(PATH_PRIVATE . '/settings.php');


if (!isset($_SESSION['debug'])) $_SESSION['debug'] = DEVELOPMENT;

if (isset($_GET['dbg'])) {

    if (!$_SESSION['debug'] && (strlen($_GET['dbg']) > 0) && ($_GET['dbg'] == DEBUG)) {

        $_SESSION['debug'] = true;

    } else {

        $_SESSION['debug'] = false;
    }
}


try {

    $router = new Router();

    $controller = '\MediaCMS\Main\Controller\\' . $router->getController();

    $controller = new $controller($router);

} catch (Exception $exception) {

    Log::appendException($exception);

    header('HTTP/1.x 500 Internal Server Error');

    $message = [$exception->getMessage(), $exception->getFile(), $exception->getLine(), $exception->getCode()];

    $message = vsprintf('%s (%s:%d, %d)', $message);

    if ($_SESSION['debug']) {

        if ($exception->xdebug_message) {

            echo '<table>' . $exception->xdebug_message . '</table>';

        } else {

            echo $message;

            echo '<pre>' . $exception->getTraceAsString() . '</pre>';
        }
    }
}

/**
 * Створює автозавантажувач об’єктів
 *
 * @param string $object Назва об’єкту
 */
function autoload(string $object) {

    $object = str_replace('MediaCMS\Main\\', '\library\\', $object);

    $object = str_replace('\\', '/', $object);

    $class = PATH_PRIVATE . $object . '.php';

    require_once($class);
}

/**
 * Перетворює помилки у винятки
 *
 * @param integer $number Номер помилки
 * @param string $string Опис помилки
 * @param string $file Назва файлу, в якому виникла помилка
 * @param integer $line Номер рядка файлу, в якому виникла помилка
 * @throws ErrorException Error to Exception
 */
function exceptionErrorHandler(int $number, string $string, string $file, int $line) {

    throw new ErrorException($string, 0, $number, $file, $line);
}
