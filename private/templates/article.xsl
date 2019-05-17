<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/article/view">
        <xsl:apply-templates select="text" />
        <div class="panel">
            <p>
                <strong>Автор:</strong>&#160;
                <a href="{@userURI}"><xsl:value-of select="@userTitle" /></a>
            </p>
            <p>
                <strong>Мітки:</strong>&#160;
                <xsl:for-each select="tags/tag">
                    <a href="{@uri}"><xsl:value-of select="@title" /></a>
                    <xsl:if test="position()!=last()">,&#160;</xsl:if>
                </xsl:for-each>
            </p>
        </div>
    </xsl:template>

</xsl:stylesheet>