# MediaCMS Main
## Головна частина
###  Децентралізована високонавантажена CMS для інтернет-видань

*Увага!!! Проєкт експерементальний (Minimal Viable Product)* \
*Не використовувати на реальних проєктах, тільки для навчання*

#### Вимоги

NPM, NodeJS, MongoDB

#### Встановлення

Перед використанням необхідно в БД встановити колекції з [MediaCMS Panel](https://github.com/MediaCMS/Panel) репозиторію

1. Встановіть код з репозиторію в каталог проєкту: \
`git clone https://github.com/MediaCMS/Main.git`
2. Налаштуйте вебсервер для видавання статичних файлів з каталогу `dist` проєкту
3. Встановіть необхдні модулі npm за допомогою команди `npm install`
4. Скопіюйте файли зразки та відредагуйте їх \
`settings.sample.js` в `settings.js` \
`.gitignore-sample` в `.gitignore` \
`src/settings.sample.js` в `src/settings.js` \
5. Запустіть сервер NodeJS за допомогою команди `node app.js`
