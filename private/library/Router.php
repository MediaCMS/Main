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

    /** @var string Адреса файла схеми сайта */
    protected $file = '/schema.json';

    /** @var array Перелік частин адреси сторінки */
    protected $uri;

    /** @var array Схема сайта */
    protected $schema;

    /** @var string Заголовок сторінки */
    protected $title;

    /** @var string Опис сторінки */
    protected $description = '';

    /** @var string Зображення сторінки */
    protected $image = '';

    /** @var string Назва поточного контролера */
    protected $controller;

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
     * Вибирає контролер та дію
     */
    private function route(): void {

        $alias = $this->getURI(0);

        if (is_null($alias)) {

            $this->controller = 'Main';

        } else {

            $this->setSchema();

            foreach($this->schema as $controller => &$params) {

                if ($params['alias'] != $alias) continue;

                $this->controller = $controller;

                $this->title = $params['title'];

                $this->description = $params['description'];

                $this->image = $params['image'];

                $params['active'] = true;

                break;
            }

            if (!isset($this->controller)) {

                $this->title = 'Сторінка не знайдена';

                $this->description = 'Запиувана Вами стрінка відсутня на нашому сайті';

                $this->controller = 'Unknown';
            }
        }
    }

    /**
     * Отримує та зберігає схему сайта
     *
     * ToDo: CacheIt! (with alias key)
     */
    private function setSchema(): void {

        $this->schema = json_decode(

            file_get_contents(PATH_PRIVATE . $this->file), true
        );
    }

    /**
     * Повертає всю схему сайту чи тільки параметри певного контролера
     *
     * @param string|null $controller Назва затребуваного контролера
     * @return array Схема або параметри контролера
     */
    public function getSchema(string $controller = null): array {

        return (isset($controller)) ? $this->schema[$controller] : $this->schema;
    }

    /**
     * Зберігає найменування поточної сторінки
     *
     * @param string $title Текст назви
     */
    protected function setTitle(string $title): void {

        $this->title = $title;
    }

    /**
     * Повертає найменування сторінки
     *
     * @return string Текст назви
     */
    public function getTitle(): string {

        return $this->title;
    }

    /**
     * Повертає опис поточної сторінки
     *
     * @return string Текст опису
     */
    public function getDescription(): string {

        return $this->description;
    }

    /**
     * Повертає зображення поточної сторінки
     *
     * @return string Адреса файла зображення
     */
    public function getImage(): string {

        return $this->image;
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