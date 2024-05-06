const express = require('express');
const controller = require('./../controllers/apicontroller');
const router = express.Router(); 
const verifyApiKey = require('./../middleware/verifyApiKey');

router.post('/sign_in', verifyApiKey, controller.postSignIn);

router.post('/create_account', verifyApiKey, controller.postCreateAccount);

router.post('/emotional_snap', verifyApiKey, controller.postEmotionalSnap);

router.get('/view_previous_snap', verifyApiKey, controller.getPrevSnap);

router.post('/change_password', verifyApiKey, controller.postChangePassword);

router.post('/select_delete_snap', verifyApiKey, controller.postSelectDeleteSnap);

router.post('/select_edit_snap', verifyApiKey, controller.postSelectEditSnap);

router.delete('/delete_snap', verifyApiKey, controller.deleteSnap);

router.post('/edit_snap', verifyApiKey, controller.postEditSnap);

router.get('/chart', controller.getChart);

module.exports = router;