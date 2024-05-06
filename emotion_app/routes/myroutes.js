const express = require('express');
const controller = require('./../controllers/mycontroller');
const myrouter = express.Router();

myrouter.get('/', controller.getHome);

myrouter.get('/sign_in_page', controller.getSignIn);

myrouter.post('/sign_in_page', controller.postSignIn);

myrouter.get('/create_account', controller.getCreateAccount);

myrouter.post('/create_account', controller.postCreateAccount);

myrouter.get('/emotional_snap', controller.getEmotionalSnap);

myrouter.post('/emotional_snap', controller.postEmotionalSnap);

myrouter.get('/dashboard', controller.getDashboard);

myrouter.get('/view_previous_snap', controller.getPrevSnap);

myrouter.get('/change_password', controller.getChangePassword);

myrouter.post('/change_password', controller.postChangePassword);

myrouter.post('/select_delete_snap', controller.postSelectDeleteSnap);

myrouter.post('/select_edit_snap', controller.postSelectEditSnap);

myrouter.post('/delete_snap', controller.postDeleteSnap);

myrouter.post('/edit_snap', controller.postEditSnap);

myrouter.get('/chart', controller.getChart)

myrouter.get('/sign_out', controller.getSignOut);

myrouter.get('*', controller.get404);

module.exports = myrouter;