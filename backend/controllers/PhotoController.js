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

// Get all photos
const getAllPhotos = async (req, res) => {

    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    if (!photos || photos.length === 0) {
        return res.status(404).json({errors: ["Nenhuma foto encontrada!"]});
    }

    res.status(200).json(photos);

}

// Get photos by user
const getUserPhotos = async (req, res) => {

    const {id} = req.params;

    const photos = await Photo.find({userId: id}).sort([["createdAt", -1]]).exec();
    
    if (!photos || photos.length === 0) {
        return res.status(404).json({errors: ["Nenhuma foto encontrada para este usuário!"]});
    }

    res.status(200).json(photos);
}

// get photos by id
const getPhotoById = async (req, res) => {
    const {id} = req.params;

    const photo = await Photo.findById(id);
    
    if (!photo) {
        return res.status(404).json({errors: ["Photo not found!"]});
    }

    res.status(200).json(photo);
}

// update photo
const updatePhoto = async (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const photo = await Photo.findById(id);
    const reqUser = req.user;

    if (!photo) {
        return res.status(404).json({errors: ["Photo not found!"]});
    }

    // Check if the user is the owner of the photo
    if (!photo.userId.equals(reqUser._id)) {
        return res.status(422).json({errors: ["Você não tem permissão para editar esta foto!"]});
    }

    if (!title || title.trim() === "") {
        return res.status(422).json({errors: ["Título é obrigatório!"]});
    }
    photo.title = title;
    const updatedPhoto = await photo.save();
    res.status(200).json({updatedPhoto, message: "Foto atualizada com sucesso!"});
};

// Like func
const likePhoto = async(req, res) =>{

    const {id} = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if (!photo) {
        return res.status(404).json({errors: ["Foto não encontrada!"]});
    }

    if (photo.likes.includes(reqUser._id)) {
        return res.status(422).json({errors: ["Você já curtiu esta foto!"]});
    }

    photo.likes.push(reqUser._id);

    await photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message: "Foto curtida com sucesso!"});
}

// Comment on a photo
const commentPhoto = async (req, res) => {
    const {id} = req.params;
    const {comment} = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    const photo = await Photo.findById(id);

    if (!photo) {
        return res.status(404).json({errors: ["Foto não encontrada!"]});
    }

    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComment);
    await photo.save();

    res.status(200).json({comment: userComment, message: "Comentário adicionado com sucesso!"});
}

module.exports = {
    insertPhoto,
    removePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
}