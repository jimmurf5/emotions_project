const conn = require('./../utils/dbconn');

const path = require('path');

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { request } = require('http');
const { query } = require('express');
const session = require('express-session');
const { addTriggersToSnaps, checkPasswordStrength } = require('./../middleware/helperFunctions');

//function to check if the email is already in the database
function emailDataBaseChecker(email) {
    return new Promise((resolve, reject) => {
        //sql query to search database for submitted email
        const sql = 'SELECT * FROM `user` WHERE email = ?';
        conn.query(sql, [email], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            //if there is a user with existing email, resolve with true, otherwise resolve with false
            resolve(results.length > 0);
        });
    });
}

// Function to get the contextual trigger id based on the contextual trigger returned by post request
function getContextualTriggerId(contextTriggers) {
    // Make sure contextTriggers is an array
    if (!Array.isArray(contextTriggers)) {
        contextTrigger = [contextTriggers]; // Wrap the single trigger name in an array
        console.log('Context Triggers after wrapping in array:', contextTrigger);
    }

    // Fetch the trigger id based on trigger name
    const sql = 'SELECT context_trigger_id, name FROM `context_trigger` WHERE BINARY name IN (?)';

    return new Promise((resolve, reject) => {
        conn.query(sql, contextTrigger, (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            if (results.length === 0) {
                reject(new Error(`Invalid contextual trigger value: ${contextTrigger}`));
                return;
            }

            // Resolve with the first result (assuming each trigger name is unique)
            resolve({
                name: results[0].name,
                context_trigger_id: results[0].context_trigger_id
            });
        });
    });
}

exports.postSignIn = (req, res) => {
    const { email, password } = req.body;

    const values = [email];

    const sql = 'SELECT * FROM `user` WHERE email = ?;';

    console.log("SQL Query:", sql);
    console.log("SQL Values:", values);

    conn.query(sql, values, async (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            res.status(500).json({
                status: 'failure',
                message: 'Internal Server Error'
            });
            return;
        }

        console.log(`Length = ${results.length}`);
        if (results.length > 0) {
            try {
                const hashedPasswordBuffer = results[0].password;
                const hashedPassword = hashedPasswordBuffer.toString('utf8'); // Convert Buffer to string
                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    res.status(200);
                    console.log("the passwords matched");
                    res.json({
                        status: 'success',
                        message: `${results.length} records retrieved`,
                        result: results
                    });
                } else {
                    // Incorrect password
                    res.status(401).send('Invalid email or password');
                }
            } catch (error) {
                console.error('Error comparing passwords with bcrypt', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(401).json({
                status: 'failure',
                message: `Invalid user credentials`,
                error: 'Invalid email or password'
            });
        }
    });
};

exports.postCreateAccount = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    //log the request body and extracted user details
    console.log('Request Body', req.body);
    console.log("accountDetails:", firstName, lastName, email, password)

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        //call function to ensure that email is not already in user table
        const emailExist = await emailDataBaseChecker(email);

        if (emailExist) {
            return res.status(400).json({ error: 'Please enter another email, this email is already in use' });
        }

        // check password strength
        await checkPasswordStrength(password);
        // declare cost factor
        const saltRounds = 10;

        // salt and hash plain password with bcrypt
        const hash = await bcrypt.hash(password, saltRounds);

        // insert user values into the user table
        const values = [firstName, lastName, email, hash]; // Use the hashed password
        const sql = 'INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `email`, `password`) VALUES (NULL, ?, ?, ?, ?);';

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error inserting user data into the database:', err);
                res.status(500);
                res.json({
                    status: 'failure',
                    message: err
                });
            }

            console.log('User data inserted successfully');

            // Respond with success
            return res.status(200).json({ status: "success", message: `Record ID ${results.insertId} added`, result: results });
        });
    } catch (error) {
        console.error('Error during account creation:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postEmotionalSnap = async (req, res) => {
    //get the user ID from session, or if no session from the request body when using postman
    const userId = req.session.user ? req.session.user.userId : req.body.userId;
    console.log("userID:", userId);
    const {
        joy,
        surprise,
        anger,
        disgust,
        fear,
        sadness,
        contempt,
        contextTriggers
    } = req.body;

    console.log("Emotion Values:", joy, surprise, anger, disgust, fear, sadness, contempt);

    try {
        // Insert emotional data into emotion_snap table
        const result = await insertEmotionSnap(userId, joy, surprise, anger, disgust, fear, sadness, contempt);

        // Log the result to check if there are any errors
        console.log("Insert Emotion Snap Result:", result);

        // Get the inserted emotion_snap_id
        const emotionSnapId = result.insertId;

        console.log("Context Triggers:", contextTriggers);
        // Insert entries into the many-to-many table for each context trigger
        await Promise.all(contextTriggers.map(trigger => insertEmotionContextTrigger(emotionSnapId, trigger)));

        console.log('Emotional data inserted successfully');
        //res.status(200).json({ message: 'Emotional data inserted successfully' });
        res.status(201);
        res.json({
            status: 'success',
            message: `Record ID ${emotionSnapId} added`,
        });

    } catch (error) {
        console.error('Error inserting emotional data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to insert emotional data into emotion_snap table
function insertEmotionSnap(userId, joy, surprise, anger, disgust, fear, sadness, contempt) {
    const values = [userId, joy, surprise, anger, disgust, fear, sadness, contempt];
    console.log("values:", values);
    const sql = 'INSERT INTO `emotion_snap` (`emotion_snap_id`, `user_id`, `time_stamp`, `joy`, `surprise`, `anger`, `disgust`, `fear`, `sadness`, `contempt`) VALUES (NULL, ?, current_timestamp(), ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        conn.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

// Function to insert entries into the many-to-many table for emotion_snap and context_trigger
function insertEmotionContextTrigger(emotionSnapId, contextTriggerName) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the context_trigger_id based on the trigger name
            const contextTriggerInfo = await getContextualTriggerId(contextTriggerName);

            if (contextTriggerInfo) {
                const contextTriggerId = contextTriggerInfo.context_trigger_id;

                // Insert into the many-to-many table
                const values = [emotionSnapId, contextTriggerId];
                const sql = 'INSERT INTO `emotion_snap_context_trigger` (`emotion_snap_id`, `context_trigger_id`) VALUES (?, ?)';

                conn.query(sql, values, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    } 
                    resolve(result);
                });
            } else {
                // Handle the case where the context trigger is not found
                console.error(`Context trigger not found for: ${contextTriggerName}`);
                reject(new Error(`Context trigger not found for: ${contextTriggerName}`));
            }

        } catch (error) {
            reject(error);
        }
    });
}



let groupedResults;

exports.getPrevSnap = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log("userID:", userId);

        if (userId) {
            // Fetch previous snapshots from the database based on userId
            const sql = `
                SELECT emotion_snap.emotion_snap_id, time_stamp, joy, anger, contempt, surprise, fear, disgust, sadness, name 
                FROM emotion_snap
                LEFT JOIN emotion_snap_context_trigger ON emotion_snap.emotion_snap_id = emotion_snap_context_trigger.emotion_snap_id
                LEFT JOIN context_trigger ON emotion_snap_context_trigger.context_trigger_id = context_trigger.context_trigger_id
                WHERE user_id = ?`;

            console.log('Before querying database');

            // Use async/await to wait for the query results
            const results = await new Promise((resolve, reject) => {
                conn.query(sql, userId, (err, results) => {
                    if (err) {
                        res.status(500);
                        res.json({
                            status: 'failure',
                            message: err
                        });
                    }
                    resolve(results);
                });
            });

            //console.log('Results:', results);

            // Process the results and store them in groupedResults
            groupedResults = addTriggersToSnaps(results);

            console.log(groupedResults);

            // Send the fetched snapshots as JSON response
            res.status(200).json({
                status: 'success',
                message: `${results.length} records retrieved`,
                results: groupedResults
            });
        } else {
            // If the user ID is not provided, send a 400 Bad Request response
            res.status(400).json({ error: 'User ID not provided' });
        }
    } catch (error) {
        console.error('Error handling getPrevSnap:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.postChangePassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    console.log("userId:", userId, "newPassword:", newPassword);

    try {
        // Check password strength
        await checkPasswordStrength(newPassword);

        // Declare cost factor
        const saltRounds = 10;

        // Salt and hash plain password with bcrypt
        const hash = await bcrypt.hash(newPassword, saltRounds);

        // Update user's password in the database
        const sql = 'UPDATE `user` SET `password` = ? WHERE `user_id` = ?';
        const values = [hash, userId];
        console.log(values);

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (results.affectedRows === 0) {
                console.log(`User with ID ${userId} not found`);
                return res.status(404).json({ error: 'User not found' });
            }
            console.log("Success: Password updated");
            res.status(200).json({ status: 'success', message: `Password updated successfully for User ID ${userId}` });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: 'Invalid request' });
    }
};



exports.postSelectDeleteSnap = (req, res) => {

    const snapID = req.body.snapID;
    console.log('snapID', snapID);

    if (!snapID) {
        // If snapID is not present in the request parameters, respond with a 400 Bad Request
        return res.status(400).json({ error: 'Snap ID is missing.' });
    }

    const sql = 'SELECT emotion_snap.emotion_snap_id, time_stamp, joy, anger, contempt, surprise, fear, disgust, sadness, name FROM emotion_snap LEFT JOIN emotion_snap_context_trigger ON emotion_snap.emotion_snap_id = emotion_snap_context_trigger.emotion_snap_id LEFT JOIN context_trigger ON emotion_snap_context_trigger.context_trigger_id = context_trigger.context_trigger_id WHERE emotion_snap.emotion_snap_id  = ?';
    console.log('Before querying database');

    // Declare the results variable in the outer scope
    let results;

    conn.query(sql, snapID, (err, results) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        }

        console.log('Results:', results);

        // Process the results and store them in groupedResults
        const groupedResults = addTriggersToSnaps(results);

        console.log('Grouped results:', groupedResults);

        // Send the fetched snapshot details as JSON response
        res.status(200);
        res.json({
            status: 'success',
            message: `${results.length} records retrieved`,
            result: results,
            deleteSnap: groupedResults,
            snapshotId: groupedResults.length > 0 ? groupedResults[0].emotion_snap_id : null
        });
    });
};

exports.postSelectEditSnap = (req, res) => {

    const snapID = req.body.snapID;
    console.log('snapID', snapID);

    if (!snapID) {
        // If snapID is not present in the request parameters, respond with a 400 Bad Request
        return res.status(400).json({ error: 'Snap ID is missing.' });
    }

    const sql = 'SELECT emotion_snap.emotion_snap_id, time_stamp, joy, anger, contempt, surprise, fear, disgust, sadness, name FROM emotion_snap LEFT JOIN emotion_snap_context_trigger ON emotion_snap.emotion_snap_id = emotion_snap_context_trigger.emotion_snap_id LEFT JOIN context_trigger ON emotion_snap_context_trigger.context_trigger_id = context_trigger.context_trigger_id WHERE emotion_snap.emotion_snap_id  = ?';

    console.log('Before querying database');

    // Declare the results variable in the outer scope
    let results;

    conn.query(sql, snapID, (err, results) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        }

        console.log('Results:', results);

        groupedResults = addTriggersToSnaps(results);

        console.log('Grouped results:', groupedResults);

        // Send the fetched snapshot details as JSON response
        res.status(200);
        res.json({
            status: 'success',
            message: `${results.length} records retrieved`,
            result: results,
            editSnap: groupedResults,
            snapshotId: groupedResults.length > 0 ? groupedResults[0].emotion_snap_id : null
        });
    });
};

exports.deleteSnap = (req, res) => {

    const snapID = req.query.snapID;
    console.log('snapID', snapID);

    if (!snapID) {
        // If snapID is not present in the request parameters, respond with a 400 Bad Request
        return res.status(400).json({ error: 'Snap ID is missing.' });
    }

    // SQL query for deleting from emotion_snap_context_trigger
    const deleteContextTriggerQuery = 'DELETE FROM emotion_snap_context_trigger WHERE emotion_snap_id = ?';

    // SQL query for deleting from emotion_snap
    const deleteEmotionSnapQuery = 'DELETE FROM emotion_snap WHERE emotion_snap_id = ?';

    // Begin the transaction
    conn.beginTransaction((err) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {

        }

        // Execute the first query
        conn.query(deleteContextTriggerQuery, [snapID], (err1) => {
            if (err1) {
                // If there's an error, rollback the transaction
                console.error('Error deleting from emotion_snap_context_trigger:', err1);
                conn.rollback(() => {
                    res.status(500);
                    res.json({
                        status: 'failure',
                        message: err
                    });
                });
                return;
            }

            // Execute the second query
            conn.query(deleteEmotionSnapQuery, [snapID], (err2) => {
                if (err2) {
                    // If there's an error, rollback the transaction
                    console.error('Error deleting from emotion_snap:', err2);
                    conn.rollback(() => {
                        res.status(500);
                        res.json({
                            status: 'failure',
                            message: err
                        });
                    });
                    return;
                }

                // Commit the transaction if both queries were successful
                conn.commit((err3) => {
                    if (err3) {
                        console.error('Error committing transaction:', err3);
                        return conn.rollback(() => {
                            res.status(500).json({ status: 'failure', message: err3 });
                        });
                    }

                    // Send success message after committing the transaction
                    res.status(200).json({ status: 'success', message: `Snap ID ${snapID} deleted successfully` });
                });
            });
        });
    });
};

exports.postEditSnap = async (req, res) => {

    const snapID = req.body.snapID;
    let contextTriggers = req.body.contextTriggers;
    console.log('snapID:', snapID, 'contextTriggers', contextTriggers);

    if (!snapID) {
        // If snapID is not present in the request parameters, respond with a 400 Bad Request
        return res.status(400).json({ error: 'Snap ID is missing.' });
    }

    // Ensure contextTriggers is always treated as an array
    if (!Array.isArray(contextTriggers)) {
        contextTriggers = contextTriggers ? [contextTriggers] : [];
    }

    // SQL query for deleting context triggers for the selected snap_id from emotion_snap_context_trigger
    const deleteContextTriggerQuery = 'DELETE FROM emotion_snap_context_trigger WHERE emotion_snap_id = ?';

    // Execute the query to delete existing context triggers
    conn.query(deleteContextTriggerQuery, [snapID], async (err1) => {
        if (err1) {
            console.error('Error deleting context triggers:', err1);
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
            return;
        }

        try {
            // Insert entries into the many-to-many table for each context trigger
            // Only attempt insertion if contextTriggers is not empty, ie the user has deselected the triggers
            if (contextTriggers.length > 0) {
                await Promise.all(contextTriggers.map(trigger => insertEmotionContextTrigger(snapID, trigger)));
            }

            // Respond with success message
            res.status(200);
            res.json({
                status: 'success',
                message: `Contextual Triggers of Snap ID ${snapID} edited successfully`,
            });
        } catch (error) {
            console.error('Error inserting context triggers:', error);
            return res.status(500).json({ status: 'failure', message: error.message });
        }
    });

};   


exports.getChart = async (req, res) => {
    try {
        const userId = req.query.userId;
        // Get the user ID from session, or if no session, from the request body when using Postman
        //const userId = req.session.user ? req.session.user.userId : req.body.userId;
        console.log("userID:", userId);

        // Fetch previous snapshots from the database based on userId
        const values = userId;
        const sql = `
            SELECT emotion_snap.emotion_snap_id, time_stamp, joy, anger, contempt, surprise, fear, disgust, sadness, name 
            FROM emotion_snap
            LEFT JOIN emotion_snap_context_trigger ON emotion_snap.emotion_snap_id = emotion_snap_context_trigger.emotion_snap_id
            LEFT JOIN context_trigger ON emotion_snap_context_trigger.context_trigger_id = context_trigger.context_trigger_id
            WHERE user_id = ?`;

        console.log('Before querying database');

        // Use async/await to wait for the query results
        const results = await new Promise((resolve, reject) => {
            conn.query(sql, values, (err, results) => {
                if (err) {
                    console.error('Error querying database:', err);
                    res.status(500).json({ error: 'Database query failed' });
                    return;
                }
                resolve(results);
            });
        });

        console.log('Results:', results);

        // Process the results and store them in groupedResults
        const groupedResults = addTriggersToSnaps(results);

        console.log(groupedResults);

        // Process the data for chart rendering, declare some arrays and values to hold trigger counts
        const xValues = [];
        const joyData = [];
        const surpriseData = [];
        const angerData = [];
        const disgustData = [];
        const fearData = [];
        const sadnessData = [];
        const contemptData = [];
        const triggerData = [];
        const triggerCounts = {
            study: 0,
            work: 0,
            family: 0,
            weather: 0,
            financial: 0,
            health: 0,
            theNews: 0,
            none: 0
        };

        // Loop through the grouped results and populate our arrays
        groupedResults.forEach((snap) => {
            const dateTimeString = new Date(snap.time_stamp).toLocaleDateString() + ' ' + new Date(snap.time_stamp).toLocaleTimeString();
            xValues.push(dateTimeString);
            joyData.push(snap.joy);
            surpriseData.push(snap.surprise);
            angerData.push(snap.anger);
            disgustData.push(snap.disgust);
            fearData.push(snap.fear);
            sadnessData.push(snap.sadness);
            contemptData.push(snap.contempt);

            triggerData.push(snap.triggers);
        });

        // Loop through each emotional snapshot
        triggerData.forEach(triggerSet => {
            if (triggerSet.length === 0) {
                // If no triggers, increment 'none' count
                triggerCounts.none++;
            } else {
                // Loop through triggers in snapshot
                triggerSet.forEach(trigger => {
                    // Increment corresponding trigger count
                    const triggerName = trigger.name
                    if (triggerCounts.hasOwnProperty(triggerName)) {
                        triggerCounts[triggerName]++;
                    }
                });
            }
        });

        console.log(xValues,
            joyData,
            surpriseData,
            angerData,
            disgustData,
            fearData,
            sadnessData,
            contemptData,
            triggerData, 
            triggerCounts);

        // Send the JSON response with the fetched data
        res.status(200).json({
            status: 'success',
            message: `${groupedResults.length} records retrieved`,
            xValues,
            joyData,
            surpriseData,
            angerData,
            disgustData,
            fearData,
            sadnessData,
            contemptData,
            triggerData,
            triggerCounts
        });
    } catch (error) {
        console.error('Error handling getChart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


