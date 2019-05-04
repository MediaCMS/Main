<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Головний файл виводу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" exclude-result-prefixes="exslt"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common">

    <xsl:output method="html" indent="no" encoding="UTF-8"  media-type="text/html" />

    <xsl:variable name="imagePath" select="concat(/root/@photoHost, /root/@photoPath)" />

    <xsl:include href="article.xsl" />
    <xsl:include href="category.xsl" />
    <xsl:include href="tag.xsl" />
    <xsl:include href="page.xsl" />
    <xsl:include href="user.xsl" />
    <xsl:include href="test.xsl" />
    <xsl:include href="cache.xsl" />

    <xsl:template match="/*">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
        <html xml:lang="uk" lang="uk" dir="ltr" id="root">
            <xsl:if test="@editor">
                <xsl:attribute name="data-photo-host"><xsl:value-of select="@photoHost" /></xsl:attribute>
                <xsl:attribute name="data-photo-path"><xsl:value-of select="@photoPath" /></xsl:attribute>
            </xsl:if>
            <xsl:if test="debug"><xsl:attribute name="data-debug">true</xsl:attribute></xsl:if>
            <head>
                <title><xsl:value-of select="@title" /></title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
                <link href="/index-0.0.10.css" rel="stylesheet" />
                <link href="/bootstrap-4.3.1.min.css" rel="stylesheet" />
                <script src="/jquery-3.4.1.min.js" type="application/javascript" />
                <script src="/popper-1.15.0.min.js" type="application/javascript" />
                <script src="/bootstrap-4.3.1.min.js" type="application/javascript" />
                <xsl:if test="not(debug)">
                    <script src='https://www.google.com/recaptcha/api.js' />
                </xsl:if>
                <!--<script src="/index-0.0.1.js" type="application/javascript" />-->
            </head>
            <body>
                <xsl:if test="menu">
                    <header>
                        <a class="navbar-brand" href="{@main}" title="Головний сайт">
                            <img src="/logo.png" alt="{@logo}" />
                        </a>
                            <div title="{user/@roleTitle}" class="user text-light"><xsl:value-of select="user/@title" />
                                <xsl:choose>
                                    <xsl:when test="string-length(user/@image) &gt; 0">
                                        <xsl:call-template name="image">
                                            <xsl:with-param name="title" select="user/@title" />
                                            <xsl:with-param name="uri" select="user/@image" />
                                        </xsl:call-template>
                                    </xsl:when>
                                    <xsl:otherwise><img src="/user.png" alt="{user/@title}" /></xsl:otherwise>
                                </xsl:choose>
                            </div>
                    </header>
                </xsl:if>
                <xsl:if test="alert">
                    <div class="container text-center my-3">
                        <div class="alert alert-{alert/@type} d-inline-block" role="alert">
                            <xsl:value-of select="alert/@text" />
                        </div>
                    </div>
                </xsl:if>
                <main class="container">
                    <div class="body controller-{name(main/*/.)} action-{name(main/*/*/.)} mt-4">
                        <h1><xsl:value-of select="@title" /></h1>
                        <p><xsl:value-of select="@description" /></p>
                        <xsl:apply-templates select="main/*" />
                    </div>
                </main>
                <footer class="text-center my-5">
                    <nav class="text-center big">
                        <ul class="list-inline">
                            <xsl:for-each select="menu/item">
                                <li class="list-inline-item">
                                    <a href="{@uri}" title="{@description}"><xsl:value-of select="@title" /></a>
                                    <xsl:if test="position() &lt; last()">&#0160;&#0160;&#8226;</xsl:if>
                                </li>
                            </xsl:for-each>
                        </ul>
                    </nav>
                    <div class="copyright small"><xsl:value-of select="@copyright" disable-output-escaping="yes" /></div>
                    <xsl:if test="debug">
                        <div class="debug text-muted small my-2">
                            <span title="Загальний час створення сторінки"><xsl:value-of select="debug/@time" /> мс</span>&#160;/
                            <span title="Час витрачений на запит до БД"><xsl:value-of select="debug/database/@time" /> мс</span>&#160;/
                            <span title="Використано пам’яті"><xsl:value-of select="debug/@memory" /> kB</span>&#160;/
                            <span title="Максимальний рівень пам’яті"><xsl:value-of select="debug/@memoryPeak" /> kB</span>
                        </div>
                    </xsl:if>
                </footer>
                <xsl:apply-templates select="debug" />
            </body>
        </html>
    </xsl:template>

    <xsl:template name="image">
        <xsl:param name="uri" />
        <xsl:param name="title" />
        <img data-uri="{$uri}">
            <xsl:if test="string-length($title) &gt; 0">
                <xsl:attribute name="alt"><xsl:value-of select="$title" /></xsl:attribute>
            </xsl:if>
        </img>
    </xsl:template>

    <xsl:template name="index2">
        <div class="items">
            <xsl:for-each select="items/item">
                <div class="item">
                    <div class="image"><xsl:value-of select="@image" /></div>
                    <div class="title"><xsl:value-of select="@title" /></div>
                    <div class="description"><xsl:value-of select="@description" /></div>
                </div>
            </xsl:for-each>
        </div>
        <xsl:apply-templates select="pagination" />
    </xsl:template>

    <xsl:template match="pagination">
        <nav aria-label="Page navigation example" class="mt-5">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <xsl:if test="@page = 1"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}" title="Перша сторінка" class="page-link">&lt;&lt;</a>
                </li>
                <li class="page-item">
                    <xsl:if test="@page = 1"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@page - 1}" title="Попередня сторінка" class="page-link">&lt;</a>
                </li>
                <xsl:for-each select="pages/page">
                    <li class="page-item">
                        <xsl:if test="@value=../../@page"><xsl:attribute name="class">page-item active</xsl:attribute></xsl:if>
                        <a href="{../../@uri}/{@value}" title="{@title}" class="page-link"><xsl:value-of select="@value" /></a>
                    </li>
                </xsl:for-each>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@page + 1}" title="Наступна сторінка" class="page-link">&gt;</a>
                </li>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@pages}" title="Остання сторінка" class="page-link">&gt;&gt;</a>
                </li>
            </ul>
        </nav>
    </xsl:template>

    <xsl:template match="debug">
        <div id="debug" class="text-center">
            <xsl:if test="database/queries/query">
                <div class="container mapper">
                    <table class="table">
                        <caption>Запити</caption>
                        <thead>
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">Час</th>
                                <th scope="col">Запит</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="database/queries/query">
                                <tr>
                                    <th scope="row" class="text-right"><xsl:value-of select="position()" />.</th>
                                    <td class="text-right"><xsl:value-of select="@time" /></td>
                                    <td class="text-left string">
                                        <pre><xsl:value-of select="." disable-output-escaping="yes" /></pre>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:if>
            <xsl:if test="trace/item">
                <div class="container trace">
                    <table class="table">
                        <caption>Відлагодження</caption>
                        <thead>
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">Файл</th>
                                <th scope="col">Рядок</th>
                                <th scope="col">Функція</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="trace/item">
                                <tr>
                                    <th scope="row" class="text-right"><xsl:value-of select="position()" />.</th>
                                    <td class="text-left"><xsl:value-of select="@file" /></td>
                                    <td class="text-right"><xsl:value-of select="@line" /></td>
                                    <td class="text-left"><xsl:value-of select="@function" /></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:if>
            <div class="xml text-left d-inline-block">
                <pre><xsl:value-of select="xml" /></pre>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="pageNotFound">
        <div id="pageNotFound">
            <h2><xsl:value-of select="/root/@description" /></h2>
            <p>Page Not Found (Text)</p>
        </div>
    </xsl:template>

    <xsl:template match="test">
        <div id="test" />
    </xsl:template>

</xsl:stylesheet>