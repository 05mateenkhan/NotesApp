const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware')


router.get('/dashboard',isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.showNote)
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateNode)
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteNote);
router.get('/dashboard/add', isLoggedIn, dashboardController.addNoteForm);
router.post('/dashboard/add', isLoggedIn, dashboardController.addNote)
module.exports = router;
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);

module.exports = router;