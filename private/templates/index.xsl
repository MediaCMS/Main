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
<!--
    <xsl:include href="article.xsl" />
    <xsl:include href="category.xsl" />
    <xsl:include href="tag.xsl" />
    <xsl:include href="comment.xsl" />
    <xsl:include href="page.xsl" />
    <xsl:include href="user.xsl" />
    <xsl:include href="common.xsl" />
    <xsl:include href="my.xsl" />
-->
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
                <link href="/index.css?v=1" rel="stylesheet" />
                <link href="/bootstrap.min.css?v=1" rel="stylesheet" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
                <script src="/jquery-3.3.1.min.js" type="application/javascript" />
                <script src="/popper.min.js" type="application/javascript" />
                <script src="/bootstrap.min.js?v=1" type="application/javascript" />
                <xsl:if test="not(debug)">
                    <script src='https://www.google.com/recaptcha/api.js' />
                </xsl:if>
                <xsl:if test="@editor">
                    <script src='/tinymce/tinymce.min.js' />
                    <script src="/tinymce/jquery.tinymce.min.js" />
                </xsl:if>
                <script src="/image.js?v=1" type="application/javascript" />
                <script src="/index.js?v=1" type="application/javascript" />
            </head>
            <body>
                <xsl:if test="menu">
                    <header>
                        <nav class="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
                            <a class="navbar-brand" href="{@main}" title="Головний сайт">
                                <img src="/logo.png" alt="{@logo}" />
                            </a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon">&#160;</span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav mr-auto">
                                    <xsl:for-each select="menu/item">
                                        <li class="nav-item">
                                            <xsl:if test="@active"><xsl:attribute name="class">nav-item active</xsl:attribute></xsl:if>
                                            <a class="nav-link" href="{@uri}">
                                                <xsl:value-of select="(@title)" /> <span class="sr-only">(current)</span>
                                            </a>
                                        </li>
                                    </xsl:for-each>
                                </ul>
                            </div>
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
                    <xsl:if test="menu">
                        <div class="row mt-5">
                            <h1 class="col"><xsl:value-of select="@title" /></h1>
                            <xsl:if test="submenu">
                                <nav class="navbar navbar-expand-md">
                                    <ul class="col navbar-nav">
                                        <xsl:for-each select="submenu/item">
                                            <li class="nav-item">
                                                <a class="nav-link" href="{@uri}">
                                                    <xsl:if test="@modal">
                                                        <xsl:attribute name="data-toggle">modal</xsl:attribute>
                                                        <xsl:attribute name="data-target"><xsl:value-of select="@modal" /></xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="(@title)" /> <span class="sr-only">(current)</span>
                                                </a>
                                            </li>
                                        </xsl:for-each>
                                    </ul>
                                </nav>
                            </xsl:if>
                        </div>
                    </xsl:if>
                    <div class="body controller-{name(main/*/.)} action-{name(main/*/*/.)} mt-4">
                        <xsl:apply-templates select="main/*" />
                    </div>
                </main>
                <footer class="text-center small my-5">
                    <div class="copyright"><xsl:value-of select="@copyright" disable-output-escaping="yes" /></div>
                    <xsl:if test="debug">
                        <div class="debug text-muted my-2">
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

<!--
    <xsl:template match="main/*/index">
         <xsl:choose>
            <xsl:when test="items/item">
                <xsl:apply-templates select="." mode="extends" />
                <xsl:apply-templates select="pagination" />
            </xsl:when>
            <xsl:otherwise>Записів не знайдено</xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="filter" />
    </xsl:template>
-->
<!--
    <xsl:template match="main/*/index/filter">
        <div class="modal fade" id="filter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Фільтр</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&#215;</span>
                        </button>
                    </div>
                    <form action="{@uri}" method="POST">
                        <div class="modal-body">
                            <xsl:apply-templates select="." mode="extends" />
                            <div class="form-group row">
                                <label for="filterStatus" class="col-sm-5 col-form-label">Статус</label>
                                <div class="col-sm-7">
                                    <select name="_status" title="Фільтр за статусом" id="filterStatus" class="form-control">
                                        <xsl:for-each select="statuses/item">
                                            <option value="{@value}">
                                                <xsl:if test="@value=../../@_status">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <xsl:if test="orderFields">
                                <div class="form-group row">
                                    <label for="filterOrderField" class="col-sm-5 col-form-label">Поле для сортування</label>
                                    <div class="col-sm-7">
                                        <select name="_orderField" title="Поле для сортування" id="filterOrderField" class="form-control">
                                            <xsl:for-each select="orderFields/item">
                                                <option value="{@field}">
                                                    <xsl:if test="@field=../../@_orderField">
                                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="@title" />
                                                </option>
                                            </xsl:for-each>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="filterOrderDirection" class="col-sm-5 col-form-label">Напрям сортування</label>
                                    <div class="col-sm-7">
                                        <select name="_orderDirection" title="Напрямок сортування" id="filterOrderDirection" class="form-control">
                                            <xsl:for-each select="orderDirections/item">
                                                <option value="{@value}">
                                                    <xsl:if test="@value=../../@_orderDirection">
                                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="@title" />
                                                </option>
                                            </xsl:for-each>
                                        </select>
                                    </div>
                                </div>
                            </xsl:if>
                            <div class="form-group row">
                                <label for="filterLimit" class="col-sm-5 col-form-label">Записів на сторінку</label>
                                <div class="col-sm-7">
                                    <select name="_limit" title="Кількість записів на сторінку" id="filterLimit" class="form-control">
                                        <xsl:for-each select="limits/item">
                                            <option value="{@value}">
                                                <xsl:if test="@value=../../@_limit">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                            <input type="submit" name="submit" value="Фільтрувати" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </xsl:template>
-->
<!--
    <xsl:template match="main/*/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <xsl:apply-templates select="." mode="extends" />
            <xsl:if test="@id">
                <xsl:if test="@alias">
                    <div class="form-group row">
                        <label for="formAlias" class="col-sm-4 col-form-label">Псевдонім</label>
                        <div class="col-sm-8">
                            <input type="text" name="alias" value="{@alias}" readonly="readonly"
                                   id="formAlias" class="form-control" title="Псевдонім" />
                        </div>
                    </div>
                </xsl:if>
                <xsl:if test="@user">
                    <div class="form-group row">
                        <label for="formUser" class="col-sm-4 col-form-label">Користувач</label>
                        <div class="col-sm-8">
                            <input type="text" name="user" value="{@user}" readonly="readonly"
                                   id="formUser" class="form-control" title="Користувач" />
                        </div>
                    </div>
                </xsl:if>
                <div class="form-group row">
                    <label for="formTime" class="col-sm-4 col-form-label">Дата та час</label>
                    <div class="col-sm-8">
                        <input type="text" name="time" value="{@time}" readonly="readonly"
                               id="formTime" class="form-control" title="Дата та час останньої модифікації" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formID" class="col-sm-4 col-form-label">Ідентифікатор</label>
                    <div class="col-sm-8">
                        <input type="text" name="id" value="{@id}" readonly="readonly"
                               id="formID" class="form-control" title="Ідентифікатор" />
                    </div>
                </div>
            </xsl:if>
            <div class="form-group text-center py-5">
                <input type="submit" name="_save" value="Зберегти" class="btn btn-primary mx-1" />
                <xsl:if test="not(@id)">
                    <input type="reset" name="_reset" value="Очистити" class="btn btn-secondary mx-1" />
                </xsl:if>
                <xsl:if test="@id">
                    <input type="submit" name="_delete" value="Видалити" class="btn btn-danger mx-1">
                        <xsl:if test="@status=0">
                            <xsl:attribute name="value">Відновити</xsl:attribute>
                        </xsl:if>
                    </input>
                </xsl:if>
            </div>
        </form>
    </xsl:template>
-->

</xsl:stylesheet>