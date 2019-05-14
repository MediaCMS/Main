<?php
/**
 * Абстрактний базовий клас контролера
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

use \SimpleXMLElement;

abstract class Controller {

    /** @var Router Маршрутизатор */
    protected $router;

    /** @var Database База данних */
    protected $database;

    /** @var View Вигляд (вид, представлення) сторінки */
    protected $view;

    /** @var SimpleXMLElement Поточний елемент сторінки у вигляді */
    protected $node;

    /** @var array Дані поточного користувача */
    protected $user;

    /** @var string Заголовок контролера */
    protected $title = '';

    /** @var string Опис контролера */
    protected $description = '';

    /** @var string Ключові слова контролера */
    protected $keywords = '';

    /** @var string Зображення контролера */
    protected $image = '';

    /** @var integer Кількість записів на сторінку в списку */
    protected $limit = 10;

    /** @var \Exception Виняток */
    protected $exception;


    /**
     * Конструктор класу
     *
     * @param Router $router Маршрутизатор
     */
    public function __construct(Router $router) {

        header('Content-User: text/html; charset=utf-8');

        $this->router = $router;

        $this->database = new Database(DB_NAME, DB_USER, DB_PASSWORD);

        $this->view = new View();

        try {

            $this->view->setTitle($this->title);

            $this->view->setDescription($this->description);

            $this->view->setImage($this->image);

            $this->node = $this->view->setNode($this->router->getController());

            if (isset($_SESSION['user'])) {

                $this->user = $_SESSION['user'];

                $this->view->setUser($this->user);
            }

            $this->setCategories();


            $this->run();

        } catch (Exception $exception) {

            header('HTTP/1.x 500 Internal Server Error');

            $this->view->setException($exception);

            Log::append($exception);
        }
    }

    /**
     * Додає у вигляд категорії
     */
    public function setCategories(): void {

        $categories = [];

        $categoryAlias = $this->router->getAliasByController('Category');

        $this->database->call('CategoryGetList');

        while($category = $this->database->getResult()) {

            if (($this->router->getURI(0) == $categoryAlias)

                && ($this->router->getURI(1) == $category['alias']))

                $category['active'] = true;

            $categories[] = $category;
        }

        $this->view->setCategories($categories, $categoryAlias);
    }

    /**
     * Головний метод контролера
     */
    public function run(): void {}

    /**
     * Виводить список (додатково)
     */
    protected function secondary(): void {}

    /**
     * Виводить список
     */
    public function index(): void {

        $page = (isset($_GET['page'])) ? $_GET['page'] : 1;

        $offset = ($page - 1) * $this->limit;

        $this->database->call($this->router->getController() . 'GetIndex');

        $itemsNode = $this->node->addChild('items');

        $i = 1;

        while($item = $this->database->getResult()) {

            $itemNode = $itemsNode->addChild('item');

            $item['position'] = $offset + $i;

            $this->view->setItem($itemNode, $item);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->limit);

        $this->view->setPagination($page, $pages, $this->router->getURI(0));
    }

    /**
     * Отримує дані з БД
     *
     * @param integer $id Ідентифікатор набору даних
     * @return array Дані
     */
    protected function get(int $id): array {

        $this->database->call($this->router->getController() . 'Get', $id);

        $data = $this->database->getResult();

        $this->view->setItem($this->node, $data);

        return $data;
    }

    /**
     * Додає у вигляд результат запиту з БД
     *
     * @param string $itemsTitle Назва загального елемента
     * @param string $itemTitle Назва дочірніх елементів
     */
    public function setItems(string $itemsTitle = 'items', string $itemTitle = 'item'): void {

        $parentNode = $this->node->addChild($itemsTitle);

        while($row = $this->database->getResult()) {

            $childNode = $parentNode->addChild($itemTitle);

            $this->view->setItem($childNode, $row);
        }
    }

    /**
     * Доступ заборонено
     */
    public function denied(): void {

        $alert = 'Доступ заборонено';

        if (isset($this->user))

            $alert .= ' (Права доступу: "' . $this->user['roleTitle'] .'"")';

        $this->view->setAlert($alert, 'danger');

        //$this->router->redirect();

        unset($this->node);

        throw new Exception($alert);
    }

    /**
     * Деструктор контроллера
     */
    public function __destruct() {

        if ($_SESSION['debug']) {

            $queries = null;

            if (isset($this->database))

                $queries = $this->database->getQueries();

            $this->view->setDebug($queries);
        }

        print $this->view->getHTML();
    }
}