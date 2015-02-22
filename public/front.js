window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var p = document.getElementById("p");
    var btn = document.getElementById("btn");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += messages[i] + '<br />';
            }
            p.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    btn.onclick = function() {
        console.log("click");
        var cert = "<?xml version=\"1.0\" encoding=\"utf-8\"?><PublishData><PublishProfile SchemaVersion=\"2.0\" PublishMethod=\"AzureServiceManagementAPI\"> <Subscription ServiceManagementUrl=\"https://management.core.windows.net\" Id=\"07c5cf06-8e96-4629-92f4-84cad88cfdc6\" Name=\"Azure Pass\" ManagementCertificate=\"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\" /></PublishProfile></PublishData>";
        var link = "https://github.com/AzureRocket/app.git";
        var d = { certificate: cert, github: link };
        console.log(d);
        socket.emit('send', d);
    };
 
}