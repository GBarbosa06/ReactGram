const moogose = require('mongoose');
const {Schema} = moogose;

const UserSchema = new Schema ({
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
},
{
    timestamps: true,
    versionKey: false
});

const User = moogose.model("User", UserSchema);

module.exports = User;