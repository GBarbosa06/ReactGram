const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
    return jwt.sign({id}, jwtSecret, {
        expiresIn: '7d'
    });
};

// Register a new user and sign in
const register = async (req, res) => {
    const {name, email, password} = req.body;

    // Check if user exists
    const user = await User.findOne({email});
    if(user){
        res.status(422).json({errors: ["Email já utilizado"]});
        return;
    }

    // generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
        name, email, password: passwordHash
    })

    //Check if user was successfully created and return the token
    if(!newUser){
        res.status(422).json({errors: ["Houver um erro, tente novamente mais tarde"]});
        return
    }
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    })
};

//Sign user in
const login = async(req, res) => {
    const {email, password} = req.body;
    
    // Searchs for e-mail
    const user = await User.findOne({email});

    // Verify if user exists
    if(!user){
        res.status(404).json({errors: ["Usuário não encontrado"]});
        return
    }

    // Verify password
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ["Senha inválida"]});
        return;
    }

    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

// Get current logged in user
const getCurrentUser = async(req, res) =>{
    const user = req.user

    res.status(200).json(user);
}

// Update an user
const update = async (req, res) => {
    
    const {name, password, bio} = req.body

    let profileImage = null

    if(req.file){
        profileImage = req.file.filename
    }
    const reqUser = req.user

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")

    if(name){
        user.name = name
    }

    if(password) {
        // generate password hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash
    }
    
    if(profileImage){
        user.profileImage
    }

    if(bio){
        user.bio = bio
    }
    await user.save()
    res.status(200).json(user)

};

// get user by id
const getUserById = async(req, res) => {
    const {id} = req.params

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")
        if(!user){
            res.status(404).json({errors: ["Usuário não encontrado"]})
        }
    
        res.status(200).json(user)
    
    } catch (error) {
        res.status(422).json({errors: ["Usuário não encontrado"]})
    }

   
}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
}