const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Vacancy = mongoose.model('Vacancy')

mongoose.set('useFindAndModify', false);

router.get('/', (req, res) => {
    res.render("vacancy/addOrEditVac", {
        viewTitle: "Добавить вакансию",
        btnTitle: 'Добавить',
        parentId: req.query.id,
        parentName: req.query.name
    });
});

router.post('/', (req, res) => {
    if(req.body._id == ''){
        insertVacancy(req, res, req.body.parent_id);
    } else
        updateVacancy(req, res);
});

function insertVacancy(req, res, compId){
    var vacancy = new Vacancy();
    vacancy.vacancyName = req.body.vacancyName;
    vacancy.compName = req.body.compName;
    vacancy.salary = req.body.salary;
    vacancy.description = req.body.description;
    if(compId){
        var parent = new mongoose.mongo.ObjectId(compId);
        vacancy.parentId = parent;
    }
    vacancy.save((err, doc) => {
        if(!err)
            res.redirect('vacancy/vacancy_list');
        else
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("vacancy/addOrEditVac", {
                    viewTitle: "Добавить вакансию",
                    btnTitle: 'Добавить',
                    vacancies: req.body
                });
            } else
                console.log('Error during record insertion in vacancy');
    });
}

function updateVacancy(req, res){
    Vacancy.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('vacancy/vacancy_list');
        } else {
            if(err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("vacancy/addOrEditVac", {
                    viewTitle: 'Обновить данные о вакансии',
                    btnTitle: 'Обновить',
                    vacancies: req.body
                })
            } else{
                console.log("Error during vacancy update: " + err);
            }
        }
    });
}

router.get('/vacancy_list/:id', (req, res) => {
    Vacancy.find({parentId: req.params.id}, (err, docs) => {
        if(!err){
            res.render("vacancy/vacancy_list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving vacancy list: ' + err);
        }
    });
});

router.get('/vacancy_list', (req, res) => {
    Vacancy.find((err, docs) => {
        if(!err){
            res.render("vacancy/vacancy_list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving vacancy list: ' + err);
        }
    });
});

function handleValidationError(err, body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'vacancyName':
                body['vacNameError'] = err.errors[field].message;
                break;
            case 'compName':
                body['compNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Vacancy.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("vacancy/addOrEditVac", {
                viewTitle: "Обновить данные вакансии",
                btnTitle: 'Обновить',
                vacancy: doc
            })
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Vacancy.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/vacancy/vacancy_list');
        }
        else { console.log('Error in vacancy delete :' + err); }
    });
});

module.exports = router;