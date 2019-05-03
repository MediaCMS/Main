<?php
/**
 * Клас для винятків
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

class Exception extends \Exception {

    /** @var string xdebug_message */
    public $xdebug_message;
}