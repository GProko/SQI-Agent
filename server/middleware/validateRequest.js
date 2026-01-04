

const validateSQIRequest = (req, res, next) => {
    const { attempts } = req.body;

 
    if (!attempts || !Array.isArray(attempts)) {
        return res.status(400).json({ 
            error: "Validation Failed", 
            message: "The 'attempts' field is required and must be an array." 
        });
    }


    if (attempts.length === 0) {
        return res.status(400).json({ 
            error: "Validation Failed", 
            message: "The 'attempts' array cannot be empty." 
        });
    }

    next();
};

module.exports = validateSQIRequest;