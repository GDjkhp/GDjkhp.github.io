function startTime() {
	var today = new Date();
	
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	
	m = checkTime(m);
	s = checkTime(s);
	
	document.getElementById('txt').innerHTML = 
	landscapeState ? strftime("%a %b %e %r %Y %Z", today) : (h < 13 ? h : h - 12) + ":" + m + ":" + s + (h < 13 ? " AM" : " PM");
	
	setTimeout(startTime, 1);
}

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}