const {getdb} = require('../../db/connect');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const db = getdb();
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const existinguser = await db.collection('users').findOne({email});
    if (existinguser){
        return res.status(409).json({ error: 'User already exists!' });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newuser = { name, email, password: hashpassword };
    await db.collection('users').insertOne(newuser);

     res.status(201).json({ message: 'User registered successfully!' });
};

module.exports = {register};