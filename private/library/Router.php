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

    /** @var string Ознака автоматичного створення об'єкта бази даних */
    protected $isDatabase = true;

    /** @var string Ознака автоматичного створення об'єкта вигляду */
    protected $isView = true;

    /** @var string Ознака прихованого контролера */
    protected $isHidden = false;

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
     * Отримує та зберігає схему сайта
     */
    private function setSchema(): void {

        $this->schema = json_decode(

            file_get_contents(PATH_PRIVATE . $this->file), true
        );
    }

    /**
     * Повертає схему сайту
     *
     * @return array Схема сайта
     */
    public function getSchema(): array {

        return $this->schema;
    }

    /**
     * Вибирає контролер та дію
     */
    private function route(): void {

        $alias = $this->getURI(0);

        if (is_null($alias)) {

            $this->setController('Main');

        } else {

            $this->setSchema();

            if (isset($this->schema[$alias])) {

                $params = &$this->schema[$alias];

                $this->setTitle($params['title']);

                $this->setDescription($params['description']);

                $this->setController($params['controller']);

                if (isset($params['isDatabase']))

                    $this->setIsDatabase($params['isDatabase']);

                if (isset($params['isView']))

                    $this->setIsView($params['isView']);

                if (isset($params['isHidden']))

                    $this->setIsHidden($params['isHidden']);

                $params['active'] = true;

            } else {

                $this->setController('Unknown');

            }
        }
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
    public function getTitle() {

        return $this->title;
    }

    /**
     * Зберігає опис поточної сторінки
     *
     * @param string $description Текст опису
     */
    protected function setDescription(string $description): void {

        $this->description = $description;
    }

    /**
     * Повертає опис поточної сторінки
     *
     * @return string Текст опису
     */
    public function getDescription() {

        return $this->description;
    }

    /**
     * Зберігає зображення поточної сторінки
     *
     * @param string $image Адреса файла зображення
     */
    protected function setImage(string $image): void {

        $this->image = $image;
    }

    /**
     * Повертає зображення поточної сторінки
     *
     * @return string Адреса файла зображення
     */
    public function getImage() {

        return $this->image;
    }

    /**
     * Зберігає контролер поточної сторінки
     *
     * @param string $controller Назва контролера
     */
    protected function setController(string $controller): void {

        $this->controller = $controller;
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
     * Зберігає ознаку автоматичного створення об'єкта бази даних
     *
     * @param boolean $isDatabase Ознака створення
     */
    protected function setIsDatabase(bool $isDatabase): void {

        $this->isDatabase = $isDatabase;
    }

    /**
     * Повертає ознаку автоматичного створення об'єкта бази даних
     *
     * @return boolean Ознака створення
     */
    public function isDatabase(): bool {

        return $this->isDatabase;
    }

    /**
     * Зберігає ознаку автоматичного створення об'єкта вигляду
     *
     * @param boolean $isView Ознака створення
     */
    protected function setIsView(bool $isView): void {

        $this->isView = $isView;
    }

    /**
     * Повертає ознаку автоматичного створення об'єкта вигляду
     *
     * @return boolean Ознака створення
     */
    public function isView(): bool {

        return $this->isView;
    }

    /**
     * Зберігає ознаку прихованого контролера
     *
     * @param boolean $isHidden Ознака прихованості
     */
    protected function setIsHidden(bool $isHidden): void {

        $this->isHidden = $isHidden;
    }

    /**
     * Повертає ознаку прихованого контролера
     *
     * @return boolean Ознака прихованості
     */
    public function isHidden(): bool {

        return $this->isHidden;
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