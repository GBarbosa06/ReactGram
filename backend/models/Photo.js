const moogose = require('mongoose');

const {Schema} = moogose;

const PhotoSchema = new Schema ({
    image: String,
    title: String,
    likes: Array,
    comments: Array,
    userId: moogose.ObjectId,
    userName: String,
},
{
    timestamps: true,
    versionKey: false
});

const Photo = moogose.model("Photo", PhotoSchema);
module.exports = Photo;