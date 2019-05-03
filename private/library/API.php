<?php
/**
 * Прикладний програмний інтерфейс
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

class API {

    /** @var array|null Дані для передачі (при наявності) */
    protected $data;

    /** @var array|null Виняток (при наявності) */
    protected $exception;

    /** @var array|null Відлагодження (при наявності) */
    protected $debug;


    /**
     * Додає дані
     *
     * @param array $data Дані
     */
    public function setData(array $data): void {

        $this->data = $data;
    }

    /**
     * Повертає дані
     *
     * @return array|null Дані
     */
    public function getData(): ?array {

        return $this->data;
    }

    /**
     * Додає виняток
     *
     * @param \Exception $exception Виняток
     */
    public function setException(\Exception $exception): void {

        $this->exception['message'] = $exception->getMessage();

        if (!is_null($exception->getFile()))

            $this->exception['file'] = $exception->getFile();

        if (!is_null($exception->getLine()))

            $this->exception['line'] = $exception->getLine();

        foreach($exception->getTrace() as $key => $item)

            $this->exception['trace'][] = $item;
    }

    /**
     * Додає дані відлагодження
     *
     * @param string $title Назва
     * @param mixed $data Дані
     */
    public function setDebug(string $title, $data): void {

        $this->debug[$title] = $data;
    }

    /**
     * Виводить результат в JSON-форматі
     */
    public function print(): void {

        $result = [];

        if (isset($this->data)) $result['data'] = $this->data;

        if (isset($this->exception)) $result['exception'] = $this->exception;

        if (isset($this->debug)) $result['debug'] = $this->debug;

        print json_encode($result, JSON_UNESCAPED_UNICODE);
    }
}