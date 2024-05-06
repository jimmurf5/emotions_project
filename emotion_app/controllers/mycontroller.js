const axios = require('axios');
const path = require('path');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { request } = require('http');
const { query } = require('express');
const session = require('express-session');

// Load environment variables from .env file
require('dotenv').config();
// Access variables
const apiKey = process.env.API_KEY;

exports.getHome = (req, res) => {
    res.status(200);
    const isLoggedIn = false;
    const onDash = false;
    res.render('homepage', { isLoggedIn, onDash });
};

exports.getSignIn = (req, res) => {
    res.status(200);
    const isLoggedIn = false;
    const onDash = false;
    res.render('sign_in_page', { isLoggedIn, onDash });
};

exports.postSignIn = async (req, res) => {
    const { email, password } = req.body;
    const isLoggedIn = false;
    const onDash = false;

    const vals = { email, password };
    console.log("vals:", vals);
    const endpoint = `http://localhost:3002/sign_in`;

    axios.post(endpoint, vals, {
        headers: {
            'x-api-key': apiKey
        }
    })
        .then((response) => {
            const data = response.data;
            console.log("data:", data);
            const session = req.session;
            session.isloggedin = true;
            session.user = {
                email: data.result[0].email,
                userId: data.result[0].user_id,
                firstName: data.result[0].first_name
            };

            console.log('User signed in:', session.user);

            console.log('Before redirect');
            res.redirect('/dashboard');
            console.log('After redirect');
        })
        .catch((error) => {
            let errorMessage;
            if (error.response && error.response.data) {
                errorMessage = error.response.data.error;
            } else {
                errorMessage = error.message;
            }

            console.error(`Error making API request: ${errorMessage}`);

            // Render the sign_in_page template with error message, if any
            res.render('sign_in_page', { isLoggedIn, onDash, errorMessage });
        });
};

exports.getCreateAccount = (req, res) => {
    res.status(200);
    const isLoggedIn = false;
    const onDash = false;
    res.render('create_account', { isLoggedIn, onDash });
};

exports.postCreateAccount = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const isLoggedIn = false;
    const onDash = false;

    const vals = { firstName, lastName, email, password };
    console.log("vals:", vals);
    const endpoint = `http://localhost:3002/create_account`;

    axios
        .post(endpoint, vals, {
            headers: {
                'x-api-key': apiKey
            }
        })
        .then((response) => {
            const data = response.data;
            console.log(data);

            // Store user data in the session
            const session = req.session;
            session.isloggedin = true;
            session.user = {
                userId: data.result.insertId,
                firstName: firstName
            };

            // redirect to dashboard after successful account creation
            console.log('Before redirect');
            res.redirect('/dashboard');
            console.log('After redirect');
        })
        .catch((error) => {
            if (error.response) {
                console.log(`Error making API request: ${error.response.data.error}`);
                res.render('create_account', { isLoggedIn, onDash, error: error.response.data.error });
            } else {
                console.log(`Error making API request: ${error.message}`);
                res.render('create_account', { isLoggedIn, onDash, error: error.response.data.error });
            }
        });
};

exports.getDashboard = (req, res) => {
    //check if user is logged in, verify seesion
    if (req.session.user) {
        //access and store the users first name
        const firstName = req.session.user.firstName;
        const isLoggedIn = req.session.isloggedin;
        const onDash = true;
        //render dashboard and pass first name dynamically
        res.status(200).render('dashboard', { firstName, isLoggedIn, onDash });
    } else {
        //if the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.getEmotionalSnap = (req, res) => {
    if (req.session.user) {
        res.status(200);
        const isLoggedIn = req.session.isloggedin;
        const onDash = false;
        res.render('emotion_snap', { isLoggedIn, onDash });
    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.postEmotionalSnap = async (req, res) => {
    // Get the user ID from session
    const userId = req.session.user.userId;
    const {
        joy,
        surprise,
        anger,
        disgust,
        fear,
        sadness,
        contempt
    } = req.body;
    const contextTriggers = JSON.parse(req.body.contextTriggers); // Parse the JSON string back into an array

    const vals = { userId, joy, surprise, anger, disgust, fear, sadness, contempt, contextTriggers };
    console.log("vals:", vals);
    const endpoint = `http://localhost:3002/emotional_snap`;

    // Make Axios POST request to endpoint
    await axios
        .post(endpoint, vals, {
            headers: {
                'x-api-key': apiKey
            }
        })
        .then((response) => {
            const data = response.data;
            console.log(data);

            // Redirect to dashboard after snap
            res.redirect('/dashboard');

        })
        .catch((error) => {
            console.error(`Error making API request: ${error.message}`);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        });
}

exports.getPrevSnap = async (req, res) => {
    try {
        // Check if the user is logged in
        if (req.session.user) {
            const userId = req.session.user.userId;
            const isLoggedIn = req.session.isloggedin;
            const onDash = false;
            const endpoint = `http://localhost:3002/view_previous_snap?userId=${userId}`;

            await axios.get(endpoint, {
                headers: {
                    'x-api-key': apiKey
                }
            })
                .then((response) => {
                    const data = response.data.results;
                    console.log(data);
                    res.status(200).render('view_previous_snap', {
                        firstName: req.session.user.firstName,
                        previousSnapshots: data,
                        isLoggedIn,
                        onDash
                    });
                })
                .catch((error) => {
                    console.log(`Error making API request: ${error}`);
                    // Send an error response to the client if the request fails
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        } else {
            // If the user is not logged in, redirect to home
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getChangePassword = (req, res) => {
    if (req.session.user) {
        res.status(200);
        const isLoggedIn = req.session.isloggedin;
        const onDash = false;
        res.render('change_password', { isLoggedIn, onDash });
    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.postChangePassword = async (req, res) => {
    if (req.session.user) {
        const userId = req.session.user.userId;
        const { newPassword } = req.body;

        const vals = { userId, newPassword };
        console.log("vals:", vals);
        const endpoint = `http://localhost:3002/change_password`;

        // Make Axios POST request to endpoint
        await axios
            .post(endpoint, vals, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then((response) => {
                const data = response.data;
                console.log(data);

                res.redirect('/dashboard');
                console.log('After redirect');
            })
            .catch((error) => {
                console.error(`Error making API request: ${error.message}`);
            });
    } else {
        res.status(401).send('Unauthorized');
    }
};

exports.postSelectDeleteSnap = async (req, res) => {
    if (req.session.user) {

        const snapID = req.body.emotion_snap_id;
        const isLoggedIn = req.session.isloggedin;
        const onDash = false;
        console.log('snapID', snapID);

        const vals = { snapID };
        console.log("vals:", vals);
        const endpoint = `http://localhost:3002/select_delete_snap`;

        if (!snapID) {
            // If snapID is not present in the request parameters, respond with a 400 Bad Request
            return res.status(400).json({ error: 'Snap ID is missing.' });
        }

        // Make Axios POST request to endpoint
        await axios
            .post(endpoint, vals, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then((response) => {
                const data = response.data;
                console.log(data);

                // Render the view_previous_snap page with the fetched snapshots
                res.status(200).render('delete_snap', {
                    firstName: req.session.user.firstName,
                    deleteSnap: data.deleteSnap,
                    snapshotId: data.snapshotId,
                    isLoggedIn,
                    onDash
                });
            })
            .catch((error) => {
                console.error(`Error making API request: ${error.message}`);
            });

    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.postSelectEditSnap = async (req, res) => {
    if (req.session.user) {

        const snapID = req.body.emotion_snap_id;
        const isLoggedIn = req.session.isloggedin;
        const onDash = false;
        console.log('snapID', snapID);

        const vals = { snapID };
        console.log("vals:", vals);
        const endpoint = `http://localhost:3002/select_edit_snap`;

        if (!snapID) {
            // If snapID is not present in the request parameters, respond with a 400 Bad Request
            return res.status(400).json({ error: 'Snap ID is missing.' });
        }

        // Make Axios POST request to endpoint
        await axios
            .post(endpoint, vals, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then((response) => {
                const data = response.data;
                console.log(data);

                // Render the view_previous_snap page with the fetched snapshots
                res.status(200).render('edit_snap', {
                    firstName: req.session.user.firstName,
                    editSnap: data.editSnap,
                    snapshotId: data.snapshotId,
                    isLoggedIn,
                    onDash
                });
            })
            .catch((error) => {
                console.error(`Error making API request: ${error.message}`);
            });

    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.postDeleteSnap = async (req, res) => {
    if (req.session.user) {
        const snapID = req.body.emotion_snap_id;
        console.log('snapID', snapID);

        const endpoint = `http://localhost:3002/delete_snap?snapID=${snapID}`;

        if (!snapID) {
            // If snapID is not present in the request parameters, respond with a 400 Bad Request
            return res.status(400).json({ error: 'Snap ID is missing.' });
        }

        await axios
            .delete(endpoint, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then((response) => {
                console.log(response.data);
                // Successfully deleted, redirect to dashboard
                res.redirect('/dashboard');
            })
            .catch((error) => {
                console.log(`Error making API request: ${error}`);
            });
    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.postEditSnap = async (req, res) => {
    if (req.session.user) {
        const snapID = req.body.emotion_snap_id;
        const contextTriggers = req.body.contextTriggers;
        console.log('snapID:', snapID, 'contextTriggers', contextTriggers);

        if (!snapID) {
            // If snapID is not present in the request parameters, respond with a 400 Bad Request
            return res.status(400).json({ error: 'Snap ID is missing.' });
        }

        const vals = { snapID, contextTriggers };
        console.log("vals:", vals);
        const endpoint = `http://localhost:3002/edit_snap`;

        // Make Axios POST request to endpoint
        await axios
            .post(endpoint, vals, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then((response) => {
                const data = response.data;
                console.log(data);
                // Successfully edited, redirect to dashboard
                res.redirect('/dashboard');
            })
            .catch((error) => {
                console.error(`Error making API request: ${error.message}`);
            });
    } else {
        // If the user is not logged in, redirect to home
        res.redirect('/');
    }
};

exports.getChart = async (req, res) => {
    try {
        // Check if the user is logged in
        if (req.session.user) {
            const userId = req.session.user.userId;
            const isLoggedIn = req.session.isloggedin;
            const onDash = false;
            const endpoint = `http://localhost:3002/chart?userId=${userId}`;

            await axios.get(endpoint, {
                headers: {
                    'x-api-key': apiKey
                }
            })
                .then((response) => {
                    const data = response.data;
                    console.log("it was passed across")
                    console.log(data);
                    res.status(200).render('chart', {
                        firstName: req.session.user.firstName,
                        xValues: data.xValues,
                        joyData: data.joyData,
                        surpriseData: data.surpriseData,
                        angerData: data.angerData,
                        disgustData: data.disgustData,
                        fearData: data.fearData,
                        sadnessData: data.sadnessData,
                        contemptData: data.contemptData,
                        triggerData: data.triggerData,
                        triggerCountsData: data.triggerCounts,
                        isLoggedIn,
                        onDash
                    });
                })
                .catch((error) => {
                    console.log(`Error making API request: ${error}`);
                    // Send an error response to the client if the request fails
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        } else {
            // If the user is not logged in, redirect to home
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error handling getChart:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getSignOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
};

exports.get404 = (req, res) => {
    const isLoggedIn = false;
    const onDash = false;
    res.status(404);
    res.render('404', isLoggedIn, onDash);
};