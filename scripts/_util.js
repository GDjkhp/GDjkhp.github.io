var _today = new Date();

//age
var age = document.getElementById('age');

if (strftime("%b", _today) != "Jan") 
	age.innerHTML = strftime("%Y", _today) - 2003;
else if (strftime("%e", _today) < 29)
	age.innerHTML = strftime("%Y", _today) - 2002;
else
	age.innerHTML = strftime("%Y", _today) - 2003;

// year
var year = document.getElementById('year').innerHTML = strftime("%Y", _today);