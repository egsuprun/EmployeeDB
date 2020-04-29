const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee')

mongoose.set('useFindAndModify', false);

router.get('/', (req, res) => {
    res.render("employee/addOrEditEmp", {
        viewTitle: "Добавить компанию",
        btnTitle: 'Добавить'
    });
});

router.post('/', (req, res) => {
    if(req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res){
    var employee = new Employee();
    employee.compName = req.body.compName;
    employee.email = req.body.email;
    employee.phone = req.body.phone;
    employee.city = req.body.city;
    employee.profArea = req.body.profArea;
    employee.save((err, doc) => {
        if(!err)
            res.redirect('employee/employee_list');
        else
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEditEmp", {
                    viewTitle: "Добавить компанию",
                    btnTitle: 'Добавить',
                    employee: req.body
                });
            } else
                console.log('Error during record insertion');
    });
}

function updateRecord(req, res){
    Employee.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('employee/employee_list');
        } else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("employee/addOrEditEmp", {
                    viewTitle: 'Обновить данные о компании',
                    btnTitle: 'Обновить',
                    employee: req.body
                })
            } else{
                console.log("Error during record update: " + err);
            }
        }
    });
}

router.get('/employee_list', (req, res) => {
    Employee.find((err, docs) => {
        if(!err){
            res.render("employee/employee_list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving employee list: ' + err);
        }
    });
});

function handleValidationError(err, body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'compName':
                body['compNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("employee/addOrEditEmp", {
                viewTitle: "Обновить данные о компании",
                btnTitle: 'Обновить',
                employee: doc
            })
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/employee_list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});
module.exports = router;