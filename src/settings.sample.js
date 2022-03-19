"use strict"

export default {
    name: "Медіа",
    slogan: "Медіа інтернет-видання",
    api: {
        url: "http://медіа/ппі",
        key: "",
        timeout: 3_000 
    },
    images: {
        url: "http://фото.медіа/сховище",
        widths: [320, 480, 640, 960, 1280, 1600, 1920, 2560, 3840],
    },
    months: [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ],
    searchID: "",
    notFound: "Сторінка не знайдена",
    alert: "Демонстраційний сайт <a href=\"https://github.com/MediaCMS\" title=\"MediaCMS\" className=\"alert-link\">MediaCMS</a>",
    copyright: "2022"
}