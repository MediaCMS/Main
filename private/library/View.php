<?php
/**
 * Вигляд
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

use \SimpleXMLElement, \DOMDocument, \XSLTProcessor;

class View {

    /** @var string Загальний xml-файл вигляду */
    protected $fileXML = '/templates/index.xml';

    /** @var string Загальний xsl-файл вигляду */
    protected $fileXSL = '/templates/index.xsl';

    /** @var SimpleXMLElement Дерево вигляду */
    protected $xml;

    /** @var SimpleXMLElement Поточний елемент сторінки */
    protected $node;

    /** @var integer Максимальна кількість суміжних номерів сторінок пагінатора */
    protected $adjacent = 3;

    /** @var array Перелік типів оповіщень */
    protected $alerts = [

        'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
    ];


    /**
     * Конструктор класу
     */
    public function __construct() {

        $this->xml = simplexml_load_file(PATH_PRIVATE . $this->fileXML);

        $host = idn_to_utf8($_SERVER['HTTP_HOST'], 0, INTL_IDNA_VARIANT_UTS46);

        $this->xml->addAttribute('host', $host);

        $this->xml->addAttribute('hostIDN', $_SERVER['HTTP_HOST']);

        $this->xml->addAttribute('photoHost', PHOTO_HOST);

        $this->xml->addAttribute('photoPath', PHOTO_PATH);

        $url = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        $this->xml->addAttribute('url', urldecode($url));

        $this->xml->addAttribute('urlEncoded', urldecode($url));

        $this->xml->addAttribute('uri', urldecode($_SERVER['REQUEST_URI']));

        $this->xml->addAttribute('logo', TITLE);

        $this->xml->addAttribute('copyright', TITLE . ' @ ' . date('Y'));

        if (DEVELOPMENT) $this->xml->addAttribute('development', 'true');

        if ($_SESSION['debug']) $this->xml->addChild('debug');
    }

    /**
     * Додає у вигляд заголовок сторінки
     *
     * @param string $title Текст заголовка
     */
    public function setTitle(string $title): void {

        $this->xml->attributes()->title = $title;
    }

    /**
     * Додає у вигляд опис сторінки
     *
     * @param string $description Текст опису
     */
    public function setDescription(string $description): void {

        $this->xml->attributes()->description = $description;
    }

    /**
     * Додає у вигляд ключові слова сторінки
     *
     * @param string $keywords Ключові слова
     */
    public function setKeywords(string $keywords): void {

        $this->xml->attributes()->keywords = $keywords;
    }

    /**
     * Додає у вигляд зображення сторінки
     *
     * @param string $image Відносна адреса зображення
     */
    public function setImage(string $image): void {

        $this->xml->attributes()->image = $image;
    }

    /**
     * Додає у вигляд дату створення сторінки
     *
     * @param string $date Дата сторінки
     */
    public function setDate(string $date): void {

        $this->xml->attributes()->date = $date;
    }

    /**
     * Додає у вигляд автора сторінки
     *
     * @param array $author Дані автора сторінки
     *  string $author['title'] Назва автора
     *  string $author['image'] Відносна адреса зображення автора
     *  string $author['uri'] Відносна адреса власної сторінки автора
     */
    public function setAuthor(array $author): void {

        $this->xml->author->attributes()->title = $author['title'];

        if (isset($author['image']))

            $this->xml->author->attributes()->image = $author['image'];

        if (isset($author['uri']))

            $this->xml->author->attributes()->uri = $author['uri'];
    }

    /**
     * Додає у вигляд категорії
     *
     * @param array $categories Масив з категоріями
     */
    public function setCategories(array $categories): void {

        $categoriesNode = $this->xml->addChild('categories');

        foreach($categories as $category) {

            $categoryNode = $categoriesNode->addChild('category');

            $categoryNode->addAttribute('title', $category['title']);

            $categoryNode->addAttribute('uri', $category['uri']);

            if (isset($category['active']))

                $categoryNode->addAttribute('active', 1);
        }
    }

    /**
     * Додає у вигляд дані користувача
     *
     * @param array $user Масив з даними
     */
    public function setUser(array $user): void {

        $this->setItem($this->xml->addChild('user'), $user);
    }

    /**
     * Додає у вигляд оповіщення
     *
     * @param string $text Текст оповіщення
     * @param string $type Тип оповіщення
     */
    public function setAlert(string $text, string $type = 'info'): void {

        if (!in_array($type, $this->alerts))

            throw new Exception(sprintf('Невідомий тип оповіщення %s', $type));

        $alertNode = $this->xml->addChild('alert');

        $alertNode->addAttribute('type', $type);

        $alertNode->addAttribute('text', $text);
    }

    /**
     * Додає у вигляд поточний елемент сторінки
     *
     * @param string $controller Назва контролера
     * @return SimpleXMLElement Поточний елемент
     */
    public function setNode(string $controller): SimpleXMLElement {

        $this->node = $this->xml->main->addChild(lcfirst($controller));

        return $this->node;
    }

    /**
     * Повертає поточний елемент виводу
     *
     * @return SimpleXMLElement Шаблон виводу
     */
    public function getNode(): SimpleXMLElement {

        return $this->node;
    }

    /**
     * Додає у вигляд сутність
     *
     * @param SimpleXMLElement $node Елемент, в який необхідно додати сутність
     * @param array|null $item Масив, який необхідно додати у вигляд
     */
    public function setItem(SimpleXMLElement $node, ?array $item): void {

        //if (!isset($item)) return;

        foreach($item as $title => $value) {

            if (!isset($value)) continue;

            if (is_array($value)) {

                $this->setItems($node->addChild($title), $value);

            } else {

                $node->addAttribute($title, $value);
            }
        }
    }

    /**
     * Додає у вигляд колекцію
     *
     * @param SimpleXMLElement $node Елемент, в який необхідно додати колекцію
     * @param array $index Таблиця, яку необхідно додати у вивід
     */
    public function setItems(SimpleXMLElement $node, array $index): void {

        foreach($index as $item)

            $this->setItem($node->addChild('item'), $item);
    }

    /**
     * Додає у вигляд XML-дерево
     *
     * @param SimpleXMLElement $parent Елемент, в який необхідно додати
     * @param SimpleXMLElement $child Елемент, який необхідно додати
     */
    public function add(SimpleXMLElement $parent, SimpleXMLElement $child) {

        $parentDOM = dom_import_simplexml($parent);

        $childDOM = dom_import_simplexml($child);

        $childDOM = $parentDOM->ownerDocument->importNode($childDOM, true);

        $parentDOM->appendChild($childDOM);
    }

    /**
     * Додає у вигляд пагінацію для списка
     *
     * @param integer $page Номер поточної сторінки
     * @param integer $pages Загальна кількість сторінок в списку
     * @param string $alias Псевдонім поточного контролера
     */
    public function setPagination(int $page = 1, int $pages = 1, string $alias = null): void {

        if ($pages < 2) return;

        $pagination = range(1, $pages);

        if (($adjacent = floor($this->adjacent / 2) * 2 + 1) >= 1) {

            $paginationMin = count($pagination) - $this->adjacent;

            $paginationMax = intval($page) - ceil($this->adjacent / 2);

            $paginationOffset = max(0, min($paginationMin, $paginationMax));

            $pagination = array_slice($pagination, $paginationOffset, $this->adjacent);
        }

        $paginationNode = $this->node->addChild('pagination');

        $paginationNode->addAttribute('uri', '/' . $alias);

        $paginationNode->addAttribute('page', $page);

        $paginationNode->addAttribute('pages', $pages);

        $pagesNode = $paginationNode->addChild( 'pages' );

        foreach($pagination AS $item) {

            $pageNode = $pagesNode->addChild('page');

            $pageNode->addAttribute('title', 'Сторінка №' . $item);

            $pageNode->addAttribute('value', $item);
        }

        if ($page > 1) {

            $title = $this->xml->attributes()->title;

            $title = sprintf('%s (сторінка №%d)', $title, $page);

            $this->setTitle($title);
        }
    }

    /**
     * Вмикає завантаження js-файлу reCaptcha
     */
    public function setRecaptcha(): void {

        $this->xml->addAttribute('recaptcha', RECAPTCHA_PUBLIC);
    }

    /**
     * Додає у вигляд відлагодження
     *
     * @param array $queries SQL-запити мапера
     */
    public function setDebug(array $queries = null): void {

        $timeTotal = 0;

        $this->xml->addAttribute('timestamp', time());

        $xml = print_r($this->xml, true);

        $xml = preg_replace('/\s*(\(|\))\n/', "\n", $xml);

        $xml = preg_replace('/[\n]{2,12}/', "\n", $xml);

        $xml = preg_replace('/[ ]{2,8}/', "  ", $xml);

        $debugNode = $this->xml->debug;

        $debugNode->addChild('xml', $xml);

        $debugNode->addAttribute('time', round(((microtime(true) - TIME) * 1000), 2));

        $debugNode->addAttribute('memory', round(((memory_get_usage() - MEMORY) / 1024), 2));

        $debugNode->addAttribute('memoryPeak', round((memory_get_peak_usage() / 1024), 2));

        if (isset($queries)) {

            $databaseNode = $this->xml->debug->addChild('database');

            if (is_array($queries)) {

                $queriesNode = $databaseNode->addChild('queries');

                foreach($queries as $key => $query) {

                    $string = htmlspecialchars(htmlspecialchars($query['string']));

                    $string = preg_replace("/\t/", "", $string);

                    $string = preg_replace("/\n\s{12}/", "\n", $string);

                    $string = preg_replace("/\n[\s]*\n/", "\n", $string);

                    $string = preg_replace("/^\n(.*)\n$/iu", "$1", $string);

                    $string = preg_replace("/(|\s)([A-Z_]+)(\(|\s)/", "$1<span>$2</span>$3", $string);

                    $queryNode = $queriesNode->addChild('query', $string);

                    $time = sprintf('%01.2f', round($query['time'], 2));

                    $queryNode->addAttribute('time', $time);

                    $timeTotal += $query['time'];
                }

                $timeTotal = sprintf('%01.2f', $timeTotal);

                $databaseNode->addAttribute('time', $timeTotal);
            }
        }
    }

    /**
     * Додає у вигляд трасування
     *
     * @param \Exception $exception Виняток
     */
    public function setException(\Exception $exception): void {

        $alert = $exception->getMessage();

        if ($_SESSION['debug']) {

            if (!is_null($exception->getFile()))

                $alert .= sprintf(' [%s, %s]', $exception->getFile(), $exception->getLine());

            $traceNode = $this->xml->debug->addChild('trace');

            foreach($exception->getTrace() as $key => $item) {

                if (!isset($item['file'])) continue;

                $itemNode = $traceNode->addChild('item');

                $itemNode->addAttribute('file', $item['file']);

                $itemNode->addAttribute('line', $item['line']);

                $itemNode->addAttribute('function', $item['function']);
            }
        }

        $this->setAlert($alert, 'danger');
    }

    /**
     * Здійснює XSL-трансформацію та повертає HTML-код
     *
     * return string HTML-код сторінки
     */
    public function getHTML(): string {

        $xml = new DOMDocument('1.0', 'UTF-8');

        $xml->loadXML($this->xml->asXML());

        $xslt = new XSLTProcessor();

        $xsl = new DOMDocument('1.0', 'UTF-8');

        $xslFile = PATH_PRIVATE . $this->fileXSL;

        $xsl->load($xslFile, LIBXML_NOCDATA);

        $xslt->importStylesheet($xsl);

        return $xslt->transformToXML($xml);
    }
};