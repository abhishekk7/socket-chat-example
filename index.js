var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var names = [
    "Ronald Weasley",
    "Hermoine Granger",
    "Harry Potter",
    "Albus Dumbledore",
    "Joker",
    "Lex Luthor",
    "Loki",
    "Bane",
    "Ultron",
    "Hulk",
    "Wonder Woman",
    "Tyrion Lannister",
    "Daenerys Targaryen",
    "King Slayer",
    "Cersie Lannister",
    "Sansa Stark",
    "Captain America",
    "Ironman",
    "Black Widow",
    "Thor",
    "Spiderman",
    "Logan",
    "Batman",
    "Jon Snow",
    "Flash",
    "Superman"
];

var curr_users = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket) {
    console.log(socket.request.connection.remoteAddress);
    var ip = getNameIndex(socket);
    addCurrUser(names[ip]);
    io.emit('update list', curr_users);

    io.emit('conn msg', names[ip] + " connected.");

    socket.on('chat message', function(msg) {
        var ip = getNameIndex(socket);
        io.emit('chat message', names[ip] + '|' + msg);
    });

    socket.on('disconnecting', function(reason) {
        var ip = getNameIndex(socket);
        removeCurrUser(names[ip]);
        console.log(names[ip] + " disconnected.");
        console.log(curr_users);
        io.emit('update list', curr_users);
        io.emit('conn msg', names[ip] + " disconnected.");
    });


});

http.listen(3000, function() {
    console.log('listening on *: 3000');
});


function addCurrUser(user) {
    if (curr_users.indexOf(user) == -1)
        curr_users.push(user);
}

function removeCurrUser(user) {
    var index = curr_users.indexOf(user);
    if (index > -1) {
        curr_users.splice(index, 1);
    }
}


function getNameIndex(socket) {
    var ip = socket.request.connection.remoteAddress;
    ip = ip.split('.');
    ip = ip[ip.length - 1] % 26;
    return ip;
}
