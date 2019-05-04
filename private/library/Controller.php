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

    /** @var API Прикладний програмний інтерфейс */
    protected $api;

    /** @var boolean Ознака створення меню */
    protected $menu = true;

    /** @var boolean Ознака завантаження WYSIWYG-редактора */
    protected $editor = false;

    /** @var array Дані поточного користувача */
    protected $user;

    /** @var integer Номер поточної сторінки списку */
    protected $page = 1;

    /** @var string Тип сторінки виводу */
    protected $outputType = 'text/html';

    /** @var \Exception Виняток */
    protected $exception;


    /**
     * Конструктор класу
     *
     * @param Router $router Маршрутизатор
     */
    public function __construct(Router $router) {

        header(sprintf('Content-User: %s; charset=utf-8', $this->outputType));

        $this->router = $router;

        if ($this->router->isDatabase())

            $this->database = new Database(DB_NAME, DB_USER, DB_PASSWORD);

        if ($this->router->isView()) {

            $this->view = new View();

            $this->view->setTitle($this->router->getTitle());

            $this->view->setDescription($this->router->getDescription());

            $this->view->setImage($this->router->getImage());

            $this->node = $this->view->setNode($this->router->getController());

        } else {

            $this->api = new API();
        }

        if (isset($_SESSION['user'])) {

            $this->user = $_SESSION['user'];

            if ($this->router->isView()) $this->view->setUser($this->user);
        }
    }

    /**
     * Виводить список
     */
    public function index(): void {

        $this->indexAdvanced();

        $this->database->call($this->router->getController() . 'GetIndex', $this->filter);

        $itemsNode = $this->node->addChild('items');

        $i = 1;

        while($item = $this->database->getResult()) {

            $itemNode = $itemsNode->addChild('item');

            $item['position'] = $this->filter['_offset'] + $i;

            $this->view->setItem($itemNode, $item);

            $i ++;
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($this->page, $pages, $this->router->getURI(0));
    }

    /**
     * Виводить список (додатково)
     */
    public function indexAdvanced(): void {}

    /**
     * Виводить дані
     */
    public function view(): void {

        $id = $this->router->getURI(2);

        if (isset($id)) $this->get($id);
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
     * Створює та додає у вигляд виняток
     *
     * @param Exception $exception Виняток
     */
    public function exception(Exception $exception): void {

        if ($this->router->isView()) {

            $this->view->setException($exception);

        } else {

            $this->api->setException($exception);
        }
    }

    /**
     * Деструктор контроллера
     */
    public function __destruct() {

        if (!isset($this->view)) {

            $this->api->print();

            return;
        }

        if ($this->menu) {

            $this->view->setMenu($this->router->getSchema());
        }

        if (DEVELOPMENT) {

            $queries = null;

            if (isset($this->database))

                $queries = $this->database->getQueries();

            $this->view->setDebug($queries);
        }

        print $this->view->getHTML();
    }
}