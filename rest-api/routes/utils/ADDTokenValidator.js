require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwksClient = require('jwks-rsa');


// URL para obtener las claves públicas de Azure AD
// const jwksUri = 'https://pry20232072.b2clogin.com/pry20232072.onmicrosoft.com/B2C_1_SignUp_SignIn/discovery/v2.0/keys';
const jwksUri = `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW}/discovery/v2.0/keys`;

// Función para obtener las claves públicas de Azure AD
const client = jwksClient({
    jwksUri
});

async function getAzureADKeys() {
    try {
        const response = await axios.get(jwksUri);
        return response.data.keys;
    } catch (error) {
        console.error('Error al obtener las claves públicas de Azure AD:', error);
        throw error;
    }
}

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        var signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

// Función para validar el token de acceso
async function validateAccessToken(accessToken) {
    try {
        if (!accessToken) {
            throw new Error('Token de acceso no proporcionado');
        }
        accessToken = accessToken.replace('Bearer ', '');

        const decodedToken = jwt.decode(accessToken, { complete: true });

        if (!decodedToken) {
            throw new Error('Token inválido');
        }

        const keys = await getAzureADKeys();
        const tokenKid = decodedToken.header.kid;
        const key = keys.find(k => k.kid === tokenKid);

        if (!key) {
            throw new Error('Clave pública no encontrada');
        }

        return jwt.verify(accessToken, getKey, (err) => {
            if (err) {
                // eslint-disable-next-line no-console
                console.error('Jwt Validation Failed', err);
                throw err;
            }
        });
    } catch (error) {
        console.error('Error al validar el token de acceso:', error);
        throw error;
    }
}

module.exports = {
    validateAccessToken
};
