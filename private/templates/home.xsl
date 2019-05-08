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
        <div class="bd-example">
            <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active" />
                    <li data-target="#carouselExampleCaptions" data-slide-to="1" />
                    <li data-target="#carouselExampleCaptions" data-slide-to="2" />
                </ol>
                <div class="carousel-inner">
                    <xsl:for-each select="articles/article">
                        <div class="carousel-item">
                            <xsl:if test="position()=1">
                                <xsl:attribute name="class">carousel-item active</xsl:attribute>
                            </xsl:if>
                            <img src="{$imagePath}/{@image}" class="d-block w-100" alt="{@title}" />
                            <div class="carousel-caption d-none d-md-block">
                                <h5><xsl:value-of select="@title" /></h5>
                                <p><xsl:value-of select="@description" /></p>
                            </div>
                        </div>
                    </xsl:for-each>
                 </div>
                <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true" />
                    <span class="sr-only">Попередній</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true" />
                    <span class="sr-only">Наступний</span>
                </a>
            </div>
        </div>
        <div class="">
            <xsl:for-each select="articles/article">
                <div>
                    <h2><xsl:value-of select="@title" /></h2>
                    <img src="{$imagePath}/{@image}" alt="{@title}" />
                    <p><xsl:value-of select="@description" /></p>
                </div>
            </xsl:for-each>
        </div>
    </xsl:template>

</xsl:stylesheet>