var express = require('express');
var router = express.Router();
const path = require('path');
var jsforce = require('jsforce');
const app = express();
require('dotenv').config();

var conn;
// const {LOGIN_URL, SALESFORCE_USERNAME , SALESFORCE_PASSWORD , SALESFORCE_TOKEN } = process.env
// const conn = new jsforce.Connection({/
//     loginUrl: LOGIN_URL
// });


//  conn.login(process.env.SALESFORCE_USERNAME , process.env.SALESFORCE_PASSWORD+process.env.SALESFORCE_TOKEN , function(err, userInfo) {
//    if (err) { 
//      return console.error(err); 
//  }
//  else{
//     console.log(conn.accessToken);
//     console.log(conn.instanceUrl);
//     console.log("User ID: " + userInfo.id);
//     console.log("Org ID: " + userInfo.organizationId);
//  }

// });


//
// OAuth2 client information can be shared with multiple connections.
//
const {LOGIN_URL, SALESFORCE_USERNAME , SALESFORCE_PASSWORD , SALESFORCE_TOKEN ,  CONSUMER_ID, CONSUMER_SECRET, SALESFORCE_CALLBACK} = process.env
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : process.env.LOGIN_URL,
  clientId : process.env.CONSUMER_ID,
  clientSecret : process.env.CONSUMER_SECRET,
  redirectUri :  process.env.SALESFORCE_CALLBACK
});
//
// Get authorization url and redirect to it.
//
router.get('/oauth2/auth', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web refresh_token' }));
});

router.get('/getAccessToken', function(req, res) {
    conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.body.code;
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
      res.send('success'); // or your desired response
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
