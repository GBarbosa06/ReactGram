const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUserId = req.user._id;

    const user = await User.findById(reqUserId);
    if (!user) {
        return res.status(404).json({errors: ["User not found!"]});
    }

    // Create a new photo
    const newPhoto = new Photo({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // If photo is not saved, return an error
    if (!newPhoto) {
        return res.status(422).json({errors: ["Houve um erro ao salvar a foto!"]});
    }
    res.status(201).json(newPhoto);
    const savedPhoto = await newPhoto.save();
    res.status(201).json(savedPhoto);
    
}

// Remove the photo from the database
const removePhoto = async (req, res) => {
    const {id} = req.params;

    const reqUser = req.user;
    try {
        
        const photo = await Photo.findById(id);
        


        // Check if the photo exists
        if (!photo) {
            return res.status(404).json({errors: ["Photo not found!"]});
        }

        // Check if the user is the owner of the photo
        if (!photo.userId.equals(reqUser._id)) {
            res
              .status(422)
              .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
          }
        await Photo.findByIdAndDelete(photo._id);
        res.status(200).json({id: photo._id, message: "Foto removida com sucesso!"});
    } catch (error) {
        res.status(500).json({errors: ["Erro ao remover a foto"]});
    }
}

module.exports = {
    insertPhoto,
    removePhoto,
}