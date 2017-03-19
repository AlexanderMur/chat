var server = require('http').createServer(accept)
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');
var fs = require('fs');
var io = require('socket.io').listen(server),
	i = 0
server.listen(8080)
json = JSON.parse(fs.readFileSync('test.json', 'utf8'))
accs = json.accounts
arr = json.comments
function Comment(name, message, govorilka, volume, id) {
	this.name = name
	this.message = message
	this.time = new Date().toLocaleString()
	this.govorilka = govorilka
	this.volume = volume
	this.id = id
}

function parseCookies(cookie,m) {
	return cookie.split(';').reduce(
		function(prev, curr) {
			var m = / *([^=]+)=(.*)/.exec(curr);
			var key = m[1];
			var value = decodeURIComponent(m[2]);
			prev[key] = value;
			return prev;
		}, {}
	);
}

function accept(req, res) {
	file.serve(req, res)
}

function Account(name, id) {
	this.name = name
	this.id = id
}
io.sockets.on('connection', function(socket) {
	io.emit('count', ++i - 1)
	socket.on('send', function(data) {
		json = JSON.parse(fs.readFileSync('test.json', 'utf8'))
		accs = json.accounts
		arr = json.comments
		if(!socket.handshake.headers.cookie){
			return
		}
		if (typeof socket.handshake.headers.cookie == 'string') {
			cookie = parseCookies(socket.handshake.headers.cookie)
		} else {
			cookie = socket.handshake.headers.cookie
		}
		if(cookie){
			if(!cookie.id){
				io.emit('registr',accs.length)
				return
			}
		} else {
			return
		}
		comment = new Comment(accs[cookie.id].name, data.message, data.govorilka, data.volume, data.id)
		arr.push(comment)
		stringify = JSON.stringify(json)
		fs.writeFile('test.json', stringify)
		io.emit('new', comment)
	})
	socket.on('newAcc', function(data) {
		console.log(data+'sa')
		json = JSON.parse(fs.readFileSync('test.json', 'utf8'))
		accs = json.accounts
		arr = json.comments
		accs.push(new Account(data.name, data.id))
		socket.handshake.headers.cookie = {}
		socket.handshake.headers.cookie.name = data.name
		socket.handshake.headers.cookie.id = data.id
		stringify = JSON.stringify(json)
		fs.writeFile('test.json', stringify)
			//console.log(data.id)
	})
	socket.on('disconnect', function() {
		io.emit('count', --i - 1)
	})
	socket.on('conne', function(data) {
		io.emit('down',fs.readFileSync('test.json', 'utf8'))
		json = JSON.parse(fs.readFileSync('test.json', 'utf8'))
		accs = json.accounts
		arr = json.comments
		cookie = parseCookies(data,1)
		if (!cookie.id) {
			io.emit('registr', accs.length)
			return
		}
	})
	socket.on('changeName',function(data){
		if(typeof socket.handshake.headers.cookie == 'string'){
			cok = parseCookies(socket.handshake.headers.cookie,2)
		} else {
			cok = socket.handshake.headers.cookie
		}
		accs[cok.id].name = data
		fs.writeFile('test.json',JSON.stringify(json))
	})
})