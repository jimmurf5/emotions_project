const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];//extract API key from request header

    //check if the API key pass provided
    if (!apiKey) {
        // If API key is not provided, return a 401 Unauthorized error
        return res.status(401).json({ error: 'Unauthorized: API key not provided' });
    }

    //check if the API key is valid
    if(apiKey !== process.env.API_KEY) {
        // If API key is invalid, return a 403 Forbidden error
        return res.status(403).json({ error: 'Invalid API key' })
    }

    //the API is present and valid, proceed to the next middleware
    next();

};

module.exports = verifyApiKey;