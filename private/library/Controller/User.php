<?php
/**
 * Контролер користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main\Controller;

use MediaCMS\Main\Controller;

class User extends Controller {

    /**
     * Виводить список користувачів
     */
    public function Primary(): void {

        $this->index();
    }

    /**
     * Виводить користувача
     */
    public function Secondary(): void {

        $this->view();
    }

    /**
     * Авторизовує користувача
     */
    public function Login(): void {

    }

    /**
     * Розавторизовує користувача
     */
    public function Logout(): void {

    }
}