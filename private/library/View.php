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

    /** @var string Загальний xsl-файл вигляду */
    protected $fileXSL = 'templates/index.xsl';

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

        $xml = '<?xml version="1.0" encoding="utf-8" ?><root><main /></root>';

        $this->xml = new SimpleXMLElement($xml);

        $this->xml->addAttribute('title', TITLE);

        $this->xml->addAttribute('description', '');

        $this->xml->addAttribute('image', '');

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

        if (DEVELOPMENT) $this->xml->addChild('debug');
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
     * Повертає заголовок сторінки
     *
     * @return string Текст заголовка
     */
    public function getTitle(): string {

        return $this->xml->attributes()->title;
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
     * Повертає опис сторінки
     *
     * @return string Текст опису
     */
    public function getDescription(): string {

        return $this->xml->attributes()->description;
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
     * Повертає зображення сторінки
     *
     * @return string Відносна адреса зображення
     */
    public function getImage(): string {

        return $this->xml->attributes()->image;
    }

    /**
     * Додає у вигляд головне меню
     *
     * @param array $schema Схема сайту
     */
    public function setMenu(array $schema): void {

         $this->xml->addChild('menu');

        foreach($schema as $alias => $params) {

            if (isset($params['isHidden']) && ($params['isHidden'] !== false)) continue;

            $itemNode = $this->xml->menu->addChild('item');

            $itemNode->addAttribute('title', $params['title']);

            $itemNode->addAttribute('description', $params['description']);

            $itemNode->addAttribute('uri', '/' . $alias);

            if (isset($params['active']))

                $itemNode->addAttribute('active', 1);
        }
    }

    /**
     * Додає у вигляд поточне підменю
     *
     * @param array $submenu Масив з пунктами підменю
     * @param string $alias Поточний перший псевдонім адреси
     */
    public function setSubmenu(array $submenu, string $alias): void {

        $submenuNode = $this->xml->addChild('submenu');

        foreach($submenu as $item) {

            $itemNode = $submenuNode->addChild('item');

            $itemNode->addAttribute('title', $item['title']);

            if (isset($item['alias']))

                $itemNode->addAttribute('uri', '/' . $alias . '/' . $item['alias']);

            if (isset($item['modal']))

                $itemNode->addAttribute('modal', $item['modal']);
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

        $paginationNode->addAttribute('uri', '/' . $alias . '/список');

        $paginationNode->addAttribute('page', $page);

        $paginationNode->addAttribute('pages', $pages);

        $pagesNode = $paginationNode->addChild( 'pages' );

        foreach($pagination AS $item) {

            $pageNode = $pagesNode->addChild('page');

            $pageNode->addAttribute('title', 'Сторінка №' . $item);

            $pageNode->addAttribute('value', $item);
        }

        if ($page > 1) {

            $title = $this->getTitle();

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
     * Додає у вигляд сторінку з 404-ю помилкою
     *
     * @param string $uri Відносна адреса сторінки
     */
    public function pageNotFound(string $uri): void {

        $this->xml->addChild('pageNotFound');

        $this->xml->attributes()->title = 'Сторінка не знайдена';

        $description = sprintf('Сторінка "%s" не знайдена', $uri);

        $this->xml->attributes()->description = $description;

        header('HTTP/1.x 404 Not Found');
    }

    /**
     * Додає у вигляд відлагодження
     *
     * @param array $queries SQL-запити мапера
     */
    public function setDebug(array $queries = null): void {

        $timeTotal = 0;

        $this->xml->addAttribute('timestamp', time());

        $xml = $this->toArray($this->xml);

        $xml = print_r((array) $xml, true);

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
     * @param Exception $exception Виняток
     */
    public function setException(Exception $exception): void {

        $alert = $exception->getMessage();

        if (DEVELOPMENT) {

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
     * Здійснює XSLT-трансформацію та повертає HTML-код
     *
     * return string HTML-код сторінки
     */
    public function getHTML(): string {

        $xml = new DOMDocument('1.0', 'UTF-8');

        $xml->loadXML($this->xml->asXML());

        $xslt = new XSLTProcessor();

        $xsl = new DOMDocument('1.0', 'UTF-8');

        $xslFile = PATH_PRIVATE . DIRECTORY_SEPARATOR . $this->fileXSL;

        $xsl->load($xslFile, LIBXML_NOCDATA);

        $xslt->importStylesheet($xsl);

        return $xslt->transformToXML($xml);
    }

    /**
     * Конвертує SimpleXMLElement в масив
     *
     * @param SimpleXMLElement $object Елемент XML
     * @param array|null $out Масив для наповнення
     * @return array Масив з даними
     */

    private function toArray(SimpleXMLElement $object, $out = []): array {

        foreach($object->attributes() as $key => $value)

            $out['@' . $key] = (string) $value;

        foreach ($object as $index => $node) {

            if (is_object($node)) {

                $out[$index][] = $this->toArray($node);

            } else {

                $out[$index] = $node;
            }
        }

        //$out[$index] = (is_object($node)) ? self::xml2array($node) : print_r($node, true);

        return $out;
    }

};