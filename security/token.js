const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('security/private.key')
const publicKey = fs.readFileSync('security/public.pem');

const produceToken = (payload) => {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '60min' });
}

const verifyToken = (token, callback) => {
    jwt.verify(token, publicKey, (err, res) => {
        console.log(err,'token err')
        if (err) callback(err, null)
        else callback(null, res)
    })
}
module.exports = {produceToken,verifyToken};
