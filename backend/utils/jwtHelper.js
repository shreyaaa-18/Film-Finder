// utils/jwtHelper.js
import jwt from 'jsonwebtoken';

const SECRET = 'secret'; 

export const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
