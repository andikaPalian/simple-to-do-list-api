const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "Please provide all required fields"});
        };
        const userAvailable = await User.findOne({email});
        if (userAvailable) {
            return res.status(400).json({message: "User already exists"});
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hashed Passowrd : ${hashedPassword}`);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        console.log(`User created ${user}`);
        if (user) {
            return res.status(201).json({message: "User created successfully", _id: user.id, email: user.email});
        } else {
            return res.status(400).json({message: "User data is not valid"});
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Please fill all the fields"});
        };
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                id: user._id,
            }, process.env.ACCESS_TOKEN, {expiresIn: "1d"});
            user.password = undefined;
            return res.status(200).json({message: "User logged in successfully", user, token});
        } else {
            return res.status(401).json({message: "Email or Password is not valid"});
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", error});
    };
};

module.exports = {registerUser, loginUser};