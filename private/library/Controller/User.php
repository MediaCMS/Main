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
    public function index(): void {

        parent::index();
    }

    /**
     * Виводить користувача
     */
    public function view(): void {

        parent::view();
    }

    /**
     * Авторизовує користувача
     */
    public function login(): void {

    }

    /**
     * Розавторизовує користувача
     */
    public function logout(): void {

    }
}