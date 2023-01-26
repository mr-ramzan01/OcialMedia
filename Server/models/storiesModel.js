const mongoose = require("mongoose");

const storiesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});


const StoriesModel = mongoose.model('stories', storiesSchema);

module.exports = StoriesModel;