<?php
/**
 * Маршрутизатор (вибір необхідного контролера та дії)
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

class Router {

    /** @var string Адреса файла контролерів сайта */
    protected $file = '/controllers.json';

    /** @var array Перелік частин адреси сторінки */
    protected $uri;

    /** @var string Назва поточного контролера */
    protected $controller;

    /** @var array Перелік контролерів */
    protected $controllers;

    /** @var array Перелік кодів та опису переадресації */
    protected $redirects = [

        300 => 'Multiple Choices',
        301 => 'Moved Permanently',
        302 => 'Moved Temporarily',
        303 => 'See Other',
        304 => 'Not Modified',
        305 => 'Use Proxy',
        306 => '',
        307 => 'Temporary Redirect'
    ];


    /**
     * Конструктор класу
     */
    public function __construct() {

        $this->setURI();

        $this->setControllers();

        $this->route();
    }

    /**
     * Повертає елемент ідентифікатора сторінки
     *
     * @param integer $key Ключ елемента
     * @return string|null Назва елемента
     */
    public function getDebug(int $key): ?string {

        return $this->uri[$key] ?? null;
    }

    /**
     * Отримує та зберігає ідентифікатор сторінки у вигляді переліку його елементів
     */
    private function setURI(): void {

        $request = urldecode($_SERVER['REQUEST_URI']);

        preg_match_all('/\/([^\?]*)\??/i', $request, $this->uri);

        $this->uri = explode('/', $this->uri[1][0]);
    }

    /**
     * Повертає елемент ідентифікатора сторінки
     *
     * @param integer $key Ключ елемента
     * @return string|null Назва елемента
     */
    public function getURI(int $key): ?string {

        return $this->uri[$key] ?? null;
    }

    /**
     * Перевіряє наявність елемента ідентифікатора сторінки
     *
     * @param integer $key Ключ елемента
     * @return boolean Ознака наявності
     */
    public function issetURI(int $key): bool {

        return isset($this->uri[$key]);
    }

    /**
     * Зчитує та зберігає контролери сайта
     */
    public function setControllers() {

        $controllers = file_get_contents(PATH_PRIVATE . $this->file);

        $this->controllers = json_decode($controllers, true);
    }

    /**
     * Повертає контролери сайта
     *
     * @return array Перелік контролерів
     */
    public function getControllers(): array {

        return $this->controllers;
    }

    /**
     * Вибирає контролер та дію
     *
     * ToDo: CacheIt!
     */
    private function route(): void {

        $controller = array_search($this->getURI(0), $this->controllers);

        $this->controller = ($controller !== false) ? $controller : 'Unknown';
    }

    /**
     * Повертає контролер поточної сторінки
     *
     * @return string Назва контролера
     */
    public function getController(): string {

        return $this->controller;
    }

    /**
     * Повертає псевдонім вказаного контролера
     *
     *
     * @param string $controller Назва затребуваного контролера
     * @return string Псевдонім контролера
     */
    public function getAliasByController(string $controller): string {

        return $this->controllers[$controller];
    }

    /**
     * Здійснює переадресацію
     *
     * @param string|null $uri Адреса сторінки сайту, на яку потрібно переадресувати
     * @param integer $code Код переадресації HTTP-протоколу
     */
    public function redirect($uri = '/', int $code = 303): void {

        header('HTTP/1.x '. $code . ' ' . $this->redirects[$code]);

        header('Location: '. HOST . urldecode($uri));

        exit($code);
    }
}