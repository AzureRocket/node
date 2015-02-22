var express = require("express");
var fs = require('fs');
var scripty = require('azure-scripty');
var unirest = require('unirest');

var app = express();
var port = 3000;

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
    // socket.emit('message', { message: 'welcome to the chat' });
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
                console.log("The file was saved!");
                io.sockets.emit('message', { message: "generated certs for user @ " + path });

                scripty.invoke('account import '+path, function(err, results){
                    console.log(err);
                    if(!err) {
                        io.sockets.emit('message', { message: "imported user"});
                        
                        scripty.invoke('site create '+name+' --location="East US"', function(err, results){
                            console.log(err);
                            if(!err) {
                                console.log("worked!");

                                // var b64 = new Buffer(USERNAME+":"+PASSWORD).toString('base64');
                                var j = JSON.stringify({'format': 'basic', 'url': github});
                                console.log(j);

                                var Request = unirest.post('https://'+name+'.scm.azurewebsites.net/deploy')
                                .header('Content-Type', 'applications/json')
                                .send(j)
                                .auth({username: USR, password: PWD})
                                // .header('Authorization', "Basic " + b64)
                                .end(function (response) {
                                    console.log(response);
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