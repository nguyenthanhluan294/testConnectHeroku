var express = require('express');
var router = express.Router();
const path = require('path');
var jsforce = require('jsforce');
const app = express();
require('dotenv').config();
var conn;
var url;
const {LOGIN_URL, SALESFORCE_USERNAME , SALESFORCE_PASSWORD , SALESFORCE_TOKEN ,  CONSUMER_ID, CONSUMER_SECRET, SALESFORCE_CALLBACK} = process.env
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : this.url,
  clientId : process.env.CONSUMER_ID,
  clientSecret : process.env.CONSUMER_SECRET,
  redirectUri :  process.env.SALESFORCE_CALLBACK
});
//
// Get authorization url and redirect to it.
//
router.get('/oauth2/auth', function(req, res) {
    if(req.param('enviroment') === 'test'){
        this.url = 'https://test.salesforce.com';
    }
    else{
        this.url = 'https://login.salesforce.com';
    }
    console.log(url);
  res.redirect(oauth2.getAuthorizationUrl({  }));
});

router.get('/', function(req, res){
    res.render('login');
});

router.get('/gettoken', function(req, res) {
    conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.param('code');
    conn.authorize(code, function(err, userInfo) {
      if (err) { return console.error(err); }
      // Now you can get the access token, refresh token, and instance URL information.
      // Save them to establish connection next time.
      console.log(conn.accessToken);
      console.log(conn.refreshToken);
      console.log(conn.instanceUrl);
      console.log("User ID: " + userInfo.id);
      console.log("Org ID: " + userInfo.organizationId);
      // ...
      res.redirect('/index');// or your desired response
    });
  });
router.get('/index' , (req , res)=>{
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
            res.redirect('/index');
        }
    })
})

router.post('/update' , (req , res)=>{
    conn.sobject("Account").update({Id: req.body.id ,  Name: req.body.name}, function(err, result) {
        if (err) { 
            return console.error(err);
        }
        else {
            res.redirect('/index');
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
            res.redirect('/index');
        }
    })
})
//ttest
module.exports = router;
