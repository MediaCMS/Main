<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Допоміжний файл виводу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="@*|node()" mode="html">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" mode="html" />
        </xsl:copy>
    </xsl:template>

    <xsl:template name="image">
        <xsl:param name="uri" />
        <xsl:param name="title" />
        <xsl:param name="class" select="''" />
        <xsl:variable name="width" select="substring($uri, 41, 4)" />
        <img src="{$imagePath}{substring($uri, 1, 40)}0320.jpg" data-width="{$width}">
            <xsl:if test="string-length($title) &gt; 0">
                <xsl:attribute name="alt"><xsl:value-of select="$title" /></xsl:attribute>
            </xsl:if>
            <xsl:if test="string-length($class) &gt; 0">
                <xsl:attribute name="class"><xsl:value-of select="$class" /></xsl:attribute>
            </xsl:if>
        </img>
    </xsl:template>

    <xsl:template name="card">
        <div class="card h-100">
            <div class="card-img-top">
                <xsl:if test="@image != ''">
                    <a href="{@uri}" title="{@title} ({@user})">
                        <xsl:call-template name="image">
                            <xsl:with-param name="uri" select="@image" />
                            <xsl:with-param name="title" select="@title" />
                        </xsl:call-template>
                    </a>
                </xsl:if>
            </div>
            <div class="card-body">
                <h5 class="card-title">
                    <a href="{@uri}" title="{@title} ({@user})"><xsl:value-of select="@title" /></a>
                </h5>
                <xsl:if test="@userTitle">
                    <p class="small">
                        <a href="{@userURI}" title="{@userTitle}"><i><xsl:value-of select="@userTitle" /></i></a>
                    </p>
                </xsl:if>
                <p class="card-text">
                    <xsl:value-of select="@description" /></p>
                <xsl:if test="@categoryTitle">
                    <a href="{@categoryURI}" class="btn btn-primary" title="{@categoryTitle}"><xsl:value-of select="@categoryTitle" /></a>
                </xsl:if>
            </div>

        </div>
    </xsl:template>

    <xsl:template name="media">
        <div class="media row">
            <div class="media-image col-sm-4">
                <xsl:call-template name="image">
                    <xsl:with-param name="uri" select="@image" />
                    <xsl:with-param name="title" select="@title" />
                </xsl:call-template>
            </div>
            <div class="media-body col-sm-8">
                <h3 class="mt-0 mb-1"><xsl:value-of select="@title" /></h3>
                <p><xsl:value-of select="@description" /></p>
            </div>
            <a href="{@uri}" title="{@title}"/>
        </div>
    </xsl:template>

    <xsl:template match="main/*">
        <xsl:apply-templates select="." />
    </xsl:template>

    <xsl:template match="main/*/index | main/*/view/index">
        <div class="list row mt-4">
            <xsl:for-each select="items/item">
                <div class="col-lg-4 col-md-6 col-sm-12 my-2"><xsl:call-template name="card" /></div>
            </xsl:for-each>
        </div>
        <xsl:apply-templates select="pagination" />
    </xsl:template>

    <xsl:template match="main/*/view">
<!--        <xsl:apply-templates select="@*" />-->
        <xsl:apply-templates select="text" />
        <xsl:apply-templates select="index" />
    </xsl:template>

    <xsl:template match="main/*/view/text">
        <div class="text"><xsl:apply-templates mode="html" /></div>
    </xsl:template>

    <xsl:template match="main/*/view/text//p" mode="html">
        <xsl:copy><xsl:apply-templates mode="html" /></xsl:copy>
    </xsl:template>

    <xsl:template match="main/*/view/text//img" mode="html">
        <xsl:copy>
            <xsl:apply-templates />
            <xsl:variable name="offset" select="string-length(@src) - 8" />
            <xsl:variable name="width" select="substring(@src, $offset + 1, 4)" />
            <xsl:attribute name="src"><xsl:value-of select="substring(@src, 1, $offset)" />0320.jpg</xsl:attribute>
            <xsl:attribute name="data-width"><xsl:value-of select="$width" /></xsl:attribute>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="main/*">
        <xsl:apply-templates select="*" />
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
                    <a href="{@uri}?сторінка={@page - 1}" title="Попередня сторінка" class="page-link">&lt;</a>
                </li>
                <xsl:for-each select="pages/page">
                    <li class="page-item">
                        <xsl:if test="@value=../../@page"><xsl:attribute name="class">page-item active</xsl:attribute></xsl:if>
                        <a href="{../../@uri}?сторінка={@value}" title="{@title}" class="page-link"><xsl:value-of select="@value" /></a>
                    </li>
                </xsl:for-each>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}?сторінка={@page + 1}" title="Наступна сторінка" class="page-link">&gt;</a>
                </li>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}?сторінка={@pages}" title="Остання сторінка" class="page-link">&gt;&gt;</a>
                </li>
            </ul>
        </nav>
    </xsl:template>

    <xsl:template match="pageNotFound">
        <div id="pageNotFound">
            <h2><xsl:value-of select="/root/@description" /></h2>
            <p>Page Not Found (Text)</p>
        </div>
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
            <div class="container xml text-left d-inline-block">
                <pre><xsl:value-of select="xml" /></pre>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>