const Router = require('express');
const router = new Router();
const controller = require('../Controllers/authController')

router.post('/reg', controller.reg);
router.post('/login', controller.login);
router.post('/settings', controller.settings);

module.exports = router;