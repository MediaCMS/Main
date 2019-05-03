<?php
/**
 * Клас роботи з базою данних
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Main;

use \mysqli, \mysqli_result;

class Database {

    /** @var string Адреса сервера БД */
    protected $host = '';

    /** @var string Назва БД */
    protected $name = '';

    /** @var string Назва користувача БД */
    protected $user = '';

    /** @var string Пароль для доступу до БД */
    protected $password = '';

    /** @var mysqli Підключення до БД */
    protected $connection;

    /** @var string Кодування БД */
    protected $charset = 'utf8';

    /** @var array Запити sql для відлагодження */
    protected $queries = [];

    /** @var mysqli_result Результат виконання запиту */
    protected $result;


    /**
     * Конструктор класу
     *
     * @param string $name Назва БД
     * @param string $user Назва користувача БД
     * @param string $password Пароль користувача БД
     * @param string $host Адреса сервера БД
     */
    public function __construct(string $name, string $user, string $password, string $host = 'localhost') {

        $this->name = $name;

        $this->user = $user;

        $this->password = $password;

        $this->host = $host;

        $this->connection = new mysqli($this->host, $this->user, $this->password, $this->name);
    }

    /**
     * Виконує sql-запит
     *
     * @param   string $query Запит sql
     * @param   string|array|null $params Додаткові параметри sql-запиту
     * @throws  Exception Виняток мапера
     */
    public function run(string $query, $params = null): void {

        if (isset($params)) {

            $params = is_array($params) ? $params : [$params];

            foreach($params as $key => $param)

                $params[$key] = $this->protect($param);

            $query = vsprintf($query, $params);
        }

        $this->result = null;

        $time = microtime(true);

        $this->result = $this->connection->query($query);

        $time = (microtime(true) - $time) * 1000;

        $this->queries[] = ['string' => $query, 'time' => $time];

        if ($this->result === false)

            throw new Exception(

                sprintf('Помилка запиту "%s [%d]"', $this->connection->error, $this->connection->errno)
            );
    }

    /**
     * Викликає збережену процедуру mysql
     *
     * @param   string $procedure Назва збереженої процедури
     * @param   mixed $params Параметри функції
     */
    public function call(string $procedure, ... $params): void {

        if (count($params) > 0) {

            foreach ($params as &$param) {

                if (is_null($param)) {

                    $param = 'null';

                } elseif (is_array($param) || is_object($param)) {

                    $param = json_encode($param, JSON_UNESCAPED_UNICODE);

                    $param = str_replace("'", "\'", $param);

                    $param = str_replace('\\"', '\\\"', $param);

                    $param = str_replace(["\\r", "\\n", "\\t"], ['\\\r', '\\\n', '\\\t'], $param);

                    $param = str_replace("\",\"", "\", \"", $param);

                    $param = sprintf("'%s'", $param);

                } elseif (is_string($param)) {

                    $param = sprintf("'%s'", $this->protect($param));
                }
            }

            $params = implode(", ", $params);

            $query = "CALL %s(%s);";

        } else {

            $query = "CALL %s();";
        }

        $this->run(vsprintf($query, [$procedure, $params]));

        if (isset($this->result) && (is_object($this->result)))

            $this->connection->next_result();
    }

    /**
     * Захищає параметри sql-запиту від sql-ін`єкцій
     *
     * @param   string $value Параметр sql-запиту
     * @return  string Захищений параметр sql-запиту
     */
    private function protect(&$value = null): string {

        return (is_null($value)) ? null : $this->connection->real_escape_string($value);
    }

    /**
     * Повертає перший рядок зі списку результату запиту
     *
     * @return array|null Асоціативний масив даних з рядка результату запиту
     */
    public function getResult(): ?array {

        return $this->result->fetch_assoc();
    }

    /**
     * Повертає значення поля за назвою з першого рядка результату запиту
     *
     * @param   string $title Назва поля
     * @return  string|null Значення поля
     */
    public function getResultByName(string $title): ?string {

        $result = $this->getResult();

        return ($result[$title]) ?? null;
    }

    /**
     * Повертає результат запиту
     *
     * @return array|null Список асоціативниих масивів результату
     */
    public function getResults(): array {

        $result = [];

        if ($this->getResultCount() > 0) {

            while($row = $this->getResult()) $result[] = $row;

            $this->result->close();
        }

        return $result;
    }

    /**
     * Повертає кількість рядків результату запиту
     *
     * @return integer Кількість рядків результату запиту
     */
    public function getResultCount(): ?int {

        return (is_object($this->result)) ? $this->result->num_rows : null;
    }

    /**
     * Повертає ідентифікатор нового запису
     *
     * @return integer Ідентифікатор
     */
    public function getInsertId(): int {

        return $this->connection->insert_id;
    }

    /**
     * Отримує та повертає кількість рядків останнього запиту
     *
     * @return integer id нового запису
     */
    public function getFoundRows(): int {

        $this->call('_GetFoundRows');

        return $this->getResultByName('foundRows');
    }

    /**
     * Повертає перелік виконаних sql-запитів
     *
     * @return array Перелік sql-запитів з часом їх виконаня
     */
    public function getQueries(): array {

        return $this->queries;
    }
}