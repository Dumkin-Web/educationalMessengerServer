const Router = require('express');
const router = new Router();
const controller = require('../Controllers/mainController')

router.post('/settings', controller.changeSettings); //изменение данных пользователя
router.post('/new-contact', controller.addNewContacts); //добавление нового контакта
router.get('/get-status-of-contacts', controller.getStatusOfContacts); //получение статуса контактов пользователя
//router.get('/userData', )

module.exports = router;