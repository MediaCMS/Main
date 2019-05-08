<?php
/**
 * Системні статичні функції
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

class System {

    /**
     * Повертає ip-адресу користувача
     *
     * @return string IP-адреса
     */
    public static function getIP() : string {

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {

            $ip = $_SERVER['HTTP_CLIENT_IP'];

        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {

            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];

        } else {

            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    /**
     * Конвертує дату/час з українською локалізацією
     *
     * @param string $format Формат дати/часу
     * @param integer|null $timestamp Дата/час
     * @return string Форматові дата/час
     */
    public static function getDate(string $format, int $timestamp = null): string {

        $timestamp = $timestamp ?? time();

        $days = [null, 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

        $format = str_replace('l', $days[date('N', $timestamp)], $format);

        $months = [null, 'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',

            'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

        $format = str_replace('F', $months[date('n', $timestamp)], $format);

        $months = [null, 'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',

            'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

        $format = str_replace('f', $months[date('n', $timestamp)], $format);

        return date($format, $timestamp);
    }
}