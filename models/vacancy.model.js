const mongoose = require('mongoose');

var vacancySchema = new mongoose.Schema({
    vacancyName: {
        type: String,
        required: 'Это поле обязательно для заполнения.'
    },
    compName: {
        type: String,
        required: 'Это поле обязательно для заполнения.'
    },
    salary: {
        type: String
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String
    }
});

mongoose.model('Vacancy', vacancySchema);