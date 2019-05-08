<?php
/**
 * Клас для роботи з логом
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

class Log {

    /** @var string Назва файлу лога */
    protected static $file = 'log';


    /**
     * Додає запис в файл лога
     *
     * @param string $message Повідомлення, що повинно записатись в лог-файл
     */
    public static function append(string $message) {

        $file = PATH_PRIVATE . DIRECTORY_SEPARATOR . static::$file;

        $string['time'] = date('Y-m-d H:i:s');

        $string['ip'] = sprintf("[%21s]", System::getIP() . ':' . $_SERVER['REMOTE_PORT']);

        $string['description'] = '"' . $message . '"';

        if (isset($_SERVER['HTTP_USER_AGENT']))

            $string['agent'] = '"' . $_SERVER['HTTP_USER_AGENT'] . '"';

        $string = implode('  ', $string) . "\n";

        file_put_contents($file, $string, FILE_APPEND | LOCK_EX);
    }


    /**
     * Додає запис в файл лога для винятка
     *
     * @param Exception $exception Виняток, що повинно записатись в лог-файл
     */
    public static function appendException(Exception $exception) {

        $message = [$exception->getMessage(), $exception->getFile(), $exception->getLine(), $exception->getCode()];

        $message = vsprintf('%s (%s:%d, %d)', $message);

        self::append($message);
    }
}