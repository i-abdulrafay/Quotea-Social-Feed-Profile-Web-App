const {getdb} = require('../../db/connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const {email, password} = req.body;
    const db = getdb();

    const user = await db.collection('users').findOne({email});
    if (!user){
        return res.status(409).json({ error: 'User does not exists!' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password!' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
};

module.exports = {login};