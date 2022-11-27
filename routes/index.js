var express = require('express');
var router = express.Router();
const path = require('path');
var jsforce = require('jsforce');
const app = express();
require('dotenv').config();

const {LOGIN_URL, SALESFORCE_USERNAME , SALESFORCE_PASSWORD , SALESFORCE_TOKEN } = process.env
const conn = new jsforce.Connection({
    loginUrl: LOGIN_URL
});


 conn.login(process.env.SALESFORCE_USERNAME , process.env.SALESFORCE_PASSWORD+process.env.SALESFORCE_TOKEN , function(err, userInfo) {
   if (err) { 
     return console.error(err); 
 }
 else{
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
 }

});

router.get('/' , (req , res)=>{
    conn.query("SELECT Id, Name FROM Account ORDER BY CreatedDate DESC limit 5 ", function(err, result) {
        if (err) { 
            return console.error(err);
        }
        else {
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
            res.render('index' , {data : result.records})
        }
    })
})

router.post('/create' , (req , res)=>{
    conn.sobject("Account").create({ Name: req.body.name}, function(err, result) {
        if (err) { 
            return console.error(err);
        }
        else {
            res.redirect('/');

        }
    })
})

router.post('/update' , (req , res)=>{
    conn.sobject("Account").update({Id: req.body.id ,  Name: req.body.name}, function(err, result) {
        if (err) { 
            return console.error(err);
        }
        else {
            res.redirect('/');

        }
    })
})

router.post('/delete' , (req , res)=>{
    console.log(req.body.idDelete)
    conn.sobject("Account").destroy(req.body.idDelete, function(err, result) {
        if (err) { 
            return console.error(err);
        }
        else {
            res.redirect('/');

        }
    })
})
//ttest
module.exports = router;
