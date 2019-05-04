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

    <xsl:template match="main/article/index">
        <xsl:call-template name="index" />
    </xsl:template>

    <xsl:template match="main/article/view">
        <div>
            <xsl:value-of select="." />
        </div>
    </xsl:template>

</xsl:stylesheet>