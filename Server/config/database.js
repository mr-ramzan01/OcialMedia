const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
console.log(db_password, 'user');

const connection = async () => {
    await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@ocialmediacluster.fsdvt3k.mongodb.net/?retryWrites=true&w=majority`, (err) => {
        if(err) {
            console.log("db not connected");
        }
        else {
            console.log("db connected")
        }
    });
}

module.exports = connection;

