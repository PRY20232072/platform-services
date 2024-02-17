const crypto = require('crypto');
const { Constants } = require('../Constants');

class CryptoHelper {
    static getCryptoSecretKey() {
        return Constants.CRYPTO_SECRET_KEY;
    }

    static getSalt() {
        // return random 256 bit salt
        return Constants.CRYPTO_SECRET_SALT;
    }

    static generateKey() {
        return crypto.pbkdf2Sync(CryptoHelper.getCryptoSecretKey(), CryptoHelper.getSalt(), 10000, 32, 'sha256');
    }

    static encrypt(data) {
        data = JSON.stringify(data);
        const key = this.generateKey();
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
    }

    static decrypt(data) {
        const key = this.generateKey();
        const iv = Buffer.from(data.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(data.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
}

module.exports.CryptoHelper = CryptoHelper;