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
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="no" encoding="UTF-8" media-type="text/html" />

    <xsl:strip-space elements="*"/>

    <xsl:variable name="imagePath" select="concat(/root/@photoHost, /root/@photoPath)" />

    <xsl:include href="common.xsl" />
    <xsl:include href="home.xsl" />
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
            <xsl:attribute name="data-photo-host"><xsl:value-of select="@photoHost" /></xsl:attribute>
            <xsl:attribute name="data-photo-path"><xsl:value-of select="@photoPath" /></xsl:attribute>
            <xsl:if test="debug"><xsl:attribute name="data-debug">true</xsl:attribute></xsl:if>
            <head>
                <title><xsl:value-of select="@title" /></title>
                <meta name="description" content="{@description}" />
                <meta name="keywords" content="{@keywords}" />
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
                <link href="/bootstrap-4.3.1.min.css" rel="stylesheet" />
                <link href="/index.css?v=14" rel="stylesheet" />
                <script src="/jquery-3.4.1.min.js" type="application/javascript" />
                <script src="/popper-1.15.0.min.js" type="application/javascript" />
                <script src="/bootstrap-4.3.1.min.js" type="application/javascript" />
                <xsl:if test="not(debug)">
                    <script src='https://www.google.com/recaptcha/api.js' />
                </xsl:if>
                <script src="/index.js?v=3" type="application/javascript" />
            </head>
            <body>
                <xsl:if test="menu">
                    <header>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <a class="navbar-brand" href="/" title="Головна сторінка">
                                <img src="/logo.png" width="100" alt="{@logo}" />
                            </a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon" />
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav mr-auto ml-4">
                                    <xsl:for-each select="categories/category">
                                        <li class="nav-item">
                                            <xsl:if test="@active">
                                                <xsl:attribute name="class">nav-item active</xsl:attribute>
                                            </xsl:if>
                                            <a class="nav-link" href="{@uri}"><xsl:value-of select="@title" /></a>
                                        </li>
                                    </xsl:for-each>
                                </ul>
                                <form class="form-inline my-2 my-lg-0" action="/пошук">
                                    <input class="form-control mr-sm-2" type="search" placeholder="Пошук" aria-label="search" />
                                </form>
                                <!--
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
                                -->
                            </div>
                        </nav>
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
                        <xsl:if test="not(main/home)">
                            <h1><xsl:value-of select="@title" /></h1>
                            <p><xsl:value-of select="@description" /></p>
                            <xsl:if test="@image!=''">
                                <xsl:call-template name="image">
                                    <xsl:with-param name="uri" select="@image" />
                                    <xsl:with-param name="title" select="@title" />
                                    <xsl:with-param name="class" select="'w-100'" />
                                </xsl:call-template>
                            </xsl:if>
                        </xsl:if>
                        <xsl:apply-templates select="main/*" />
                    </div>
                </main>
                <footer class="container text-center my-5">
                    <div class="alert alert-info my-5" role="alert">
                        Демонстраційний сайт <a href="https://github.com/MediaCMS" title="MediaCMS" class="alert-link">MediaCMS</a> (в розробці)
                    </div>
                    <nav class="text-center big">
                        <ul class="list-inline">
                            <xsl:for-each select="menu/item[not(@hidden)or(@hidden!='true')]">
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

</xsl:stylesheet>