const { HttpStatusCode } = require("axios");
const { validateAccessToken } = require("../utils/ADDTokenValidator");

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        validateAccessToken(token)
            .then(decodedToken => {
                const current_user = {
                    id: decodedToken.oid,
                    role: decodedToken.extension_UserRole,
                    name: decodedToken.given_name + ' ' + decodedToken.family_name
                }

                req.decodedToken = decodedToken;
                req.current_user = current_user;
                next();
            })
            .catch(error => {
                res.status(HttpStatusCode.Unauthorized).json({ error: error.message });
            });
    } else {
        res.status(HttpStatusCode.Unauthorized).json({ error: 'No token provided' });
    }
}

module.exports = authMiddleware;
