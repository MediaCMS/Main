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

    /** @var integer Ідентифікатор активної категорії меню */
    protected $category;

    /** @var array Фільтр списку */
    protected $filter = [

        '_status' => 1, '_orderField' => 'time', '_orderDirection' => 1,

        '_offset' => 0, '_limit' => 12
    ];

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

            $this->node = $this->view->setNode($this->router->getController());

            if (isset($_SESSION['user'])) {

                $this->user = $_SESSION['user'];

                $this->view->setUser($this->user);
            }

            $this->run();

        } catch (\Exception $exception) {

            header('HTTP/1.x 500 Internal Server Error');

            $this->view->setException($exception);

            Log::appendException($exception);
        }
    }

    /**
     * Додає у вигляд категорії
     */
    public function setCategories(): void {

        $categories = [];

        $categoryAlias = $this->router->getAliasByController('Category');

        $this->database->call('CategoryGetAll');

        while($category = $this->database->getResult()) {

            if ($category['id'] == $this->category) $category['active'] = true;

            $category['uri'] = '/'. $categoryAlias . '/' . $category['alias'];

            $categories[] = $category;
        }

        $this->view->setCategories($categories);
    }

    /**
     * Головний метод контролера (шаблон)
     */
    public function run(): void {

        $alias = $this->router->getURI(1);

        if (isset($alias))

            $this->view($alias);

        else

            $this->index($this->node, $this->router->getController());
    }

    /**
     * Виводить список об'єктів з БД (шаблон)
     *
     * @param SimpleXMLElement $node Елемент виводу
     * @param string $controller Назва контролера
     */
    protected function index(SimpleXMLElement $node, string $controller = 'Article'): void {

        $page = (isset($_GET['сторінка'])) ? $_GET['сторінка'] : 1;

        $this->filter['_offset'] = ($page - 1) * $this->filter['_limit'];

        $this->database->call($controller . 'GetIndex', $this->filter);

        $indexNode = $node->addChild('index');

        $itemsNode = $indexNode->addChild('items');

        while($item = $this->database->getResult()) {

            $itemNode = $itemsNode->addChild('item');

            $item['uri'] = '/' . $this->router->getAliasByController($controller) . '/' . $item['alias'];

            if (isset($item['categoryAlias']))

                $item['categoryURI'] =

                    '/' . $this->router->getAliasByController('Category') . '/' . $item['categoryAlias'];

            if (isset($item['userAlias']))

                $item['userURI'] =

                    '/' . $this->router->getAliasByController('User') . '/' . $item['userAlias'];

            $this->view->setItem($itemNode, $item);
        }

        $pages = ceil($this->database->getFoundRows() / $this->filter['_limit']);

        $this->view->setPagination($page, $pages, $this->router->getURI(0));
    }

    /**
     * Виводить дані про об'єкт з БД (шаблон)
     *
     * @param string $alias Псевдонім об'єкту
     */
    protected function view(string $alias): void {

        $this->database->call($this->router->getController() . 'GetByAlias', $alias);

        $data = $this->database->getResult();

        if (!isset($data)) {

            $this->notFound(); return;
        }

        $this->title = $data['title'];

        $this->description = $data['description'];

        $this->keywords = $data['title'];

        $this->image = $data['image'];

        if (isset($data['userTitle'])) {

            $this->view->setDate(System::getDate('j f Y року', strtotime($data['time'])));

            $author['title'] = $data['userTitle'];

            if (isset($data['userImage']))

                $author['image'] = $data['userImage'];

            if (isset($data['userAlias']))

                $author['uri'] =

                    '/' . $this->router->getAliasByController('User') .

                    '/' . $data['userAlias'];

            $this->view->setAuthor($author);
        }

        $viewNode = $this->node->addChild('view');

        $this->viewExtended($viewNode, $data);

        $this->view->setItem($viewNode, $data);
    }

    /**
     * Виводить дані про об'єкт з БД (розширення)
     *
     * @param SimpleXMLElement $node Посилання на елемент виводу
     * @param array $data Посилання на дані об'єкта
     */
    protected function viewExtended(SimpleXMLElement $node, array &$data): void {}

    /**
     * Додає у вигляд результат запиту з БД (шаблон)
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
     * Додає у вигляд сторінку з 404-ю помилкою
     */
    protected function notFound(): void {

        $this->title = 'Сторінка не знайдена';

        $request = urldecode( $_SERVER['REQUEST_URI']);

        $description = sprintf('Запитувана вами сторінка "%s" не знайдена', $request);

        $this->description = $description;

        $this->keywords = 'Сторінка не знайдена, 404 Not Found';

        $this->image = '';

        $this->view->setAlert($description, 'danger');

        header('HTTP/1.x 404 Not Found');
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

        $this->view->setTitle($this->title);

        $this->view->setDescription($this->description);

        $this->view->setKeywords($this->keywords);

        $this->view->setImage($this->image);

        $this->setCategories();

        if ($_SESSION['debug']) {

            $queries = null;

            if (isset($this->database))

                $queries = $this->database->getQueries();

            $this->view->setDebug($queries);
        }

        print $this->view->getHTML();
    }
}