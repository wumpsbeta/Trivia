const mongoose = require("mongoose");

const reqString = {
    type: String,
    required: true,
};

const Schema = new mongoose.Schema({
    _id: reqString,
    userId: reqString,
    userAttempts: Number,
});

module.exports = mongoose.model("Trivia", Schema);
