var express = require('express');
var app = express();

if (process.env.authurl) {
    app.use(express.static(__dirname + '/compile'));
} else {
    app.use(express.static(__dirname + '/build'));
}

app.get('*', function(req, res) {
    res.sendFile('index.html');
});

if (!process.env.PORT) {
    var server = app.listen(4451, function () {
        var port = server.address().port;
        console.log('Example app listening on port: ',  port);

    });
} else {
    var server = app.listen(process.env.PORT, function () {
        var port = server.address().port;
        console.log('Example app listening on port: ',  port);
    });
}
