const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_url = process.env.DB_URL;

const connection = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@${db_url}/ocial_media_data?retryWrites=true&w=majority`, (err) => {
        if(err) {
            console.log("db not connected");
        }
        else {
            console.log("db connected")
        }
    });
}

module.exports = connection;

