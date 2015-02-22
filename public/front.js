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
        var cert = '<?xml version="1.0" encoding="utf-8"?> \
<PublishData> \
  <PublishProfile \
    SchemaVersion="2.0" \
    PublishMethod="AzureServiceManagementAPI"> \
    <Subscription \
      ServiceManagementUrl="https://management.core.windows.net" \
      Id="18227031-bbb9-4d42-87f0-84cb1633d277" \
      Name="Free Trial" \
      ManagementCertificate="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" /> \
  </PublishProfile> \
</PublishData> \
';
       var link = "https://github.com/AzureRocket/app.git";
        var d = { certificate: cert, github: link };
        console.log(d);
        socket.emit('send', d);
    };
 
}