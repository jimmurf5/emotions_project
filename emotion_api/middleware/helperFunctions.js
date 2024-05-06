function addTriggersToSnaps(results) {
    return results.reduce((acc, current) => {
        if (!current.name) {
            // Emotional snap has no trigger, include it in the results and create a new object
            acc.push({
                emotion_snap_id: current.emotion_snap_id,
                time_stamp: current.time_stamp,
                joy: current.joy,
                anger: current.anger,
                contempt: current.contempt,
                surprise: current.surprise,
                fear: current.fear,
                disgust: current.disgust,
                sadness: current.sadness,
                triggers: [] // Empty array since there are no triggers
            });
        } else {
            //Emotional snap has a trigger
            //handle it by appending the trigger to the existing object if the snap_id is already in the results or creating a new one if not
            //check accumulator for an element with same snap_id as current object being processed
            //If true, store result of find method in existingSnap
            const existingSnap = acc.find(item => item.emotion_snap_id === current.emotion_snap_id);

            //if snap_id already existed, push trigger name of current object into trigger array
            if (existingSnap) {
                // Emotional snap ID exists, append the trigger to the existing object
                existingSnap.triggers.push({ name: current.name });
            } else {
                // Emotional snap ID doesn't exist, create a new object with triggers array
                acc.push({
                    emotion_snap_id: current.emotion_snap_id,
                    time_stamp: current.time_stamp,
                    joy: current.joy,
                    anger: current.anger,
                    contempt: current.contempt,
                    surprise: current.surprise,
                    fear: current.fear,
                    disgust: current.disgust,
                    sadness: current.sadness,
                    triggers: [{ name: current.name }]
                });
            }
        }
        return acc;
    }, []);
}

function checkPasswordStrength(password) {
    return new Promise((resolve, reject) => {
        const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!complexityRegex.test(password)) {
            reject(new Error("Password should include at least one uppercase letter, one lowercase letter, one number, and one special character."));
        } else {
            resolve(true);
        }
    });
}

module.exports = { addTriggersToSnaps, checkPasswordStrength };