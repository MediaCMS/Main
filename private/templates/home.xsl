<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу головної сторінки
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/home">
        <div class="top">
            <div id="carousel" class="carousel slide carousel-fade" data-ride="carousel" data-interval="2000">
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
                            <img data-uri="{@image}" class="d-block" alt="{@title}" />
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
            <div class="row mt-4">
                <xsl:for-each select="articles/article[position()>3]">
                    <div class="col-md-4">
                        <div class="card h-100">
                        <img data-uri="{@image}" alt="{@title}" class="card-img-top" />
                            <div class="card-body">
                                <h4 class="card-title"><xsl:value-of select="@title" /></h4>
                                <p class="card-text"><xsl:value-of select="@description" /></p>
                                <a href="{@uri}" class="btn btn-primary">Читати</a>
                            </div>
                        </div>
                    </div>
                </xsl:for-each>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>