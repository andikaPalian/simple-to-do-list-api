const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
                if (err) {
                    return res.status(401).json({message: "User is not authorized"});
                };
                req.user = decoded.user || {id: decoded.id};
                next();
            });
        } else {
            return res.status(401).json({message: "Token is missing or not provided"});
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    };
};

module.exports = validateToken;