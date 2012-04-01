var express = require('express');
var formidable = require('formidable');
var util = require('util');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    display_form(request, response);
});

app.post('/upload', function(request, response) {
    upload_file(request, response);
});

var http = require('http');
var sys = require('sys');

function display_form(req, res) {
  res.send(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
  //res.finish();
}

function upload_file(req, res) {
      var form = new formidable.IncomingForm();
      form.onPart = function(part) {
      

        if (!part.filename) {
          form.handlePart(part);
          return;
        }

       part.addListener('data', function(data){
         console.log("Data chunk " + data.length);
       });
       
       part.addListener('end', function() {
         console.log("Data stream ended Name: "+ part.name + " mime: " + part.mime + " filename: " + part.filename);
        });

       part.addListener('error', function(err) {
          console.log("Data stream error ");
        });
      }

      form.on('progress', function(bytesReceived, bytesExpected){
          console.log("Pecentage done: " + (bytesReceived/bytesExpected * 100));
      });
      
       form.on('field', function(name, value){
         console.log("namevalue pair " + name + " " + value);
       });

       form.on('file', function(name, file){
         console.log("File receiving " + name + " " +  file);
       });

       form.on('aborted', function() {
         console.log("aborted");
       });

       form.on('fileBegin', function(name, file){
         console.log("Begin file " + name + " " + file);
       });

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end("Stream ended");
    });
  }

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
