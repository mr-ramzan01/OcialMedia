const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follwerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});