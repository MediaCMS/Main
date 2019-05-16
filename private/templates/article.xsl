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
<!--<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">-->
<xsl:stylesheet version="1.0" exclude-result-prefixes="exslt my"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:my="https://github.com/MediaCMS">

    <xsl:template match="main/article/index">
<!--        <xsl:call-template name="index" />-->
    </xsl:template>

    <xsl:template match="main/article/view">
        <div class="panel">
            <p><xsl:value-of select="@user" /></p>
            <p><xsl:value-of select="@tags" /></p>
        </div>
        <xsl:apply-templates select="text/root" />
    </xsl:template>

    <xsl:template match="article/view/text/root">
        <div class="text"><xsl:apply-templates select="*" mode="html" /></div>
    </xsl:template>

    <xsl:template match="@* | node()" mode="html">
        <xsl:copy>
            <xsl:apply-templates select="@* | node()" mode="html" />
        </xsl:copy>
    </xsl:template>

    <xsl:template match="p" mode="html">
        <p><xsl:apply-templates select="@* | node()" mode="html" /></p>
    </xsl:template>

    <xsl:template match="img" mode="html">
        <img>
            <xsl:apply-templates select="@* | node()" mode="html" />
            <xsl:variable name="offset" select="string-length(@src) - 8" />
            <xsl:variable name="width" select="substring(@src, $offset + 1, 4)" />
            <xsl:attribute name="src"><xsl:value-of select="substring(@src, 1, $offset)" />0320.jpg</xsl:attribute>
            <xsl:attribute name="data-width"><xsl:value-of select="$width" /></xsl:attribute>
        </img>
    </xsl:template>

</xsl:stylesheet>