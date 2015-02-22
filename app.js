var express = require("express");
var fs = require('fs');
var scripty = require('azure-scripty');
var unirest = require('unirest');

var app = express();
var port = process.env.PORT || 3000;

var USR = 'rocket';
var PWD = 'Rocket123';
 
 //remove
app.set('views', __dirname);
app.set('view engine', "jade");
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("index");
});
 
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        var certificate = data.certificate;
        var github = data.github;
        var parts = github.split('.');
        var name = parts[parts.length-2].split('/').pop() + "-"+(Date.now() / 1000 | 0);
        var path = "/tmp/"+name+".publishsettings";

        fs.writeFile(path, certificate, function(err) {
            if(err) {
                console.log(err);
            } else {
                io.sockets.emit('message', { message: "Certificate acquired", command: "fs.writeFile" });

                scripty.invoke('account import '+path, function(err, results){
                    console.log(err);
                    
                    if(!err) {
                        io.sockets.emit('message', { message: "Account imported", command: "azure account import"});
                        var loc = "East US";
                        scripty.invoke('site create '+name+' --location="'+loc+'"', function(err, results){
                            console.log(err);
                            if(!err) {
                                io.sockets.emit('message', { message: "App created (location: "+loc+")", command: "azure site create"});

                                var j = JSON.stringifiy({'format': 'basic', 'url': github});

                                io.sockets.emit('message', { message: "Clearing the skies...", command: null});
                                io.sockets.emit('message', { message: "Building the app...", command: null});

                                var Request = unirest.post('https://'+name+'.scm.azurewebsites.net/deploy')
                                .header('Content-Type', 'applications/json')
                                .send(j)
                                .auth({username: USR, password: PWD})
                                .end(function (response) {
                                    console.log(response);

                                    io.sockets.emit('message', { message: "Success!", link: "http://"+name+".azurewebsites.net"});
                                });
                            }
                        });

                    }
                });
            }
        }); 

        io.sockets.emit('message', { message: data.github });
    });
});

console.log("Listening on port " + port);