const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    compName: {
        type: String,
        required: 'Это поле обязательно для заполнения.'
    },
    city: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    profArea: {
        type: String
    }
});

//custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Некоректный e-mail.');

mongoose.model('Employee', employeeSchema);