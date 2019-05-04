<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Main
 * @link        https://github.com/MediaCMS/Main
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/user/index">
     </xsl:template>

    <xsl:template match="main/user/view">
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