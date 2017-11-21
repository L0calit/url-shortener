//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var format = require('util').format;
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// init project
var express = require('express');
var app = express();

// Connection URL. This is where your mongodb server is running.
var id_actuel = 1000;
var creation_output = { "original_url":"null", "short_url":"null" };
//(Focus on This Variable)
var url = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
//(Focus on This Variable)

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    // do some work here with the database.
    db.listCollections().toArray(function(err, collections){
        if (err) throw err;
        var test = true;
        for (var collection in collections) {
         if (collection == "url") {
           test = false;
         }
       }
        if (test) {
            db.collection("lien");
        }
        db.collection("lien").remove({});
        //Close connection
        db.close();
    });
  }
});

app.get("/", function (req, rep) {
    rep.send("See README for Usage");
});

app.get("/new/*", function (request, response) {
  var original = "";
  var short = "https://url-shortener-project.glitch.me/";
  MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        // do some work here with the database.
        if (isUrl(request.params[0])) {
          original = request.params[0];
          db.collection('lien').count({ original_url: original }, function (err, c) {
            if (err) throw err;
            if (c == 0) {
              short += id_actuel;
              db.collection("lien").insertOne({ _id: id_actuel, original_url: original, short_url: short });
              id_actuel ++;
              creation_output.original_url = original;
              creation_output.short_url = short;
              response.send(creation_output);
            } else if (c == 1) {
              var document = db.collection('lien').findOne({original_url: original}).then(function (value) { 
                creation_output.original_url = original;
                creation_output.short_url = value.short_url;
                response.send(creation_output);
              });
            }
            //Close connection
            db.close();
          });
        } else {
          creation_output = { "original_url":"null", "short_url":"null" };
          response.send(creation_output);
        }
      }
  });
});

app.get("/*", function (req, rep) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        // do some work here with the database.
        var short = "https://url-shortener-project.glitch.me/";
        short += req.params[0];
        console.log(short);
        console.log(req.params[0]);
        db.collection('lien').findOne({short_url: short}).then(function (value) {
          if (value) {
            console.log(value.original_url[1]);
            if (value.original_url.search("http") == -1) {
              rep.redirect("https://" + value.original_url);              
            } else {
              rep.redirect(value.original_url); 
            }
          } else {
            rep.send("Pas de liens réferencé");
          }
          //Close connection
          db.close();
        });
        
      }
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function isUrl(s) {
  var regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
   return regexp.test(s);
}
