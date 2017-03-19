var socket = io.connect(),
	i = 0,
	id = Math.random(),
	down
document.cookie = 'a=1;b=0'
socket.on('down',function(data){
	comments = JSON.parse(data).comments
	text = ''
	for (var i = 0, len = comments.length; i < len; i++) {
		comment = comments[i]
		text += '<div class="message"> <div class="messageTop"> <span class="name">' + comment.name + '</span> <div class="date">' + comment.time + '</div></div><div class="messageBot">' + comment.message + '</div></div><br>'
	}
	chatView.innerHTML += text
	chatView.scrollTop = chatView.scrollHeight - chatView.clientHeight
})
socket.emit('conne', document.cookie)
socket.on('new', function(data) {
	if (data.govorilka && data.id != id) {
		document.title = 'Чат-сервис(' + ++i + ')'
		audio = new Audio('sounds/message.wav')
		audio.volume = 0.1
		audio.play()
		responsiveVoice.speak(data.message, 'Russian Female', {
			volume: data.volume
		})
	} else if (data.id != id) {
		document.title = 'Чат-сервис(' + ++i + ')'
		audio = new Audio('sounds/message.wav')
		audio.volume = 0.1
		audio.play()
	} else {
		audio = new Audio('sounds/otprav.wav')
		audio.volume = 0.1
		audio.play()
	}
	chatView.innerHTML += '<div class="message"> <div class="messageTop"> <span class="name">' + data.name + '</span> <div class="date">' + data.time + '</div></div><div class="messageBot">' + data.message + '</div></div><br>'
	chatView.scrollTop = chatView.scrollHeight - chatView.clientHeight
})
socket.on('count', function(data) {
	count.innerHTML = data + ' онлайн'
})
socket.on('registr', function(data) {
	aske = false
	if (!document.cookie.includes('id=')) {
		aske = prompt('create new account')
	}
	if (aske) {
		console.log('as')
		socket.emit('newAcc', {
			name: aske,
			id: data
		})
		document.cookie = 'id=' + data
	}
})


sendButton.onclick = function() {
	socket.emit('send', {
		message: input.value,
		id: id
	})
	input.value = ''
}
govorilka.onclick = function() {
	socket.emit('send', {
		message: input.value,
		govorilka: true,
		volume: 0.2,
		id: id
	})
	input.value = ''
}
input.onkeyup = function(e) {
	if (e.keyCode == 13) {
		socket.emit('send', {
			message: input.value,
			id: id
		})
		input.value = ''
	}
}
changer.onclick = function(){
	ask = prompt('Введите новое имя')
	if(ask){
		socket.emit('changeName',ask)
	}
}
window.onresize = function() {
	width = parseFloat(getComputedStyle(chat).width)
	if (innerWidth > width) {
		chat.style.left = innerWidth / 2 - width / 2 + 'px'
	} else {
		chat.style.left = 0 + 'px'
	}
}
window.onfocus = function() {
	document.title = 'Чат-сервис'
	i = 0
}
window.onresize()

