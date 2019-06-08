<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Бібліотека для виводу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/home">
        <div id="carousel" class="carousel slide carousel-fade" data-ride="carousel" data-interval="5000">
            <ol class="carousel-indicators">
                <li data-target="#carousel" data-slide-to="0" class="active" />
                <li data-target="#carousel" data-slide-to="1" />
                <li data-target="#carousel" data-slide-to="2" />
            </ol>
            <div class="carousel-inner">
                <xsl:for-each select="articles/article[position()&lt;4]">
                    <div class="carousel-item" style="overflow: hidden;">
                        <xsl:if test="position()=1">
                            <xsl:attribute name="class">carousel-item active</xsl:attribute>
                        </xsl:if>
                        <xsl:call-template name="image">
                            <xsl:with-param name="uri" select="@image" />
                            <xsl:with-param name="title" select="@title" />
                            <xsl:with-param name="class" select="'d-block'" />
                        </xsl:call-template>
                        <div class="gradient" />
                        <div class="carousel-caption">
                            <h2><xsl:value-of select="@title" /></h2>
                            <p class="lead"><xsl:value-of select="@description" /></p>
                        </div>
                        <a href="{@uri}" />
                    </div>
                </xsl:for-each>
            </div>
            <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true" />
                <span class="sr-only">Попередній</span>
            </a>
            <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true" />
                <span class="sr-only">Наступний</span>
            </a>
        </div>
        <div class="list row mt-4">
            <xsl:for-each select="articles/article[position()>3]">
                <div class="col-md-4"><xsl:call-template name="card" /></div>
            </xsl:for-each>
        </div>
    </xsl:template>

    <xsl:template match="main/article/view">
        <xsl:apply-templates select="text" />
        <div class="panel">
            <p class="tags">
                <strong>Мітки: </strong>
                <xsl:for-each select="tags/tag">
                    <a href="{@uri}"><xsl:value-of select="@title" /></a>
                    <xsl:if test="position()!=last()">,&#160;</xsl:if>
                </xsl:for-each>
            </p>
        </div>
    </xsl:template>

    <xsl:template match="main/user/login">
        <div class="card d-table mx-auto">
            <div class="card-header">Авторизація</div>
            <div class="card-body ">
                <form class="form" method="POST">
                    <div class="form-group">
                        <input type="email" name="email" value="{@email}" placeholder="Логін" class="form-control text-center" />
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" placeholder="Пароль" class="form-control text-center" />
                    </div>
                    <xsl:if test="not(/root/debug)">
                        <div class="form-group">
                            <div class="recaptcha">
                                <div class="g-recaptcha" data-size="normal"
                                     data-sitekey="{/root/@recaptcha}" />
                                <div class="logo" />
                                <div class="right" />
                                <div class="bottom" />
                            </div>
                        </div>
                    </xsl:if>
                    <div class="form-group text-center pt-3">
                        <input type="submit" name="submit" value="Авторизуватись" class="btn btn-primary" />
                    </div>
                </form>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>