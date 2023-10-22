// credits: https://cosway.org/
all_elements = 0;
//wrap random things in divs with color attribs. 
function grand(max){
	return Math.floor(Math.random()*max)
}
function corruption_step_color(){
	element = all_elements[Math.floor(Math.random() * all_elements.length)];
	if(element.innerHTML == "")
		return;
	//element.innerHTML += "CHICKEN";

	rand1 = Math.floor(Math.random() * element.innerHTML.length)
	rand2 = Math.floor(Math.random() * element.innerHTML.length)

	if(rand1 > rand2){
		x = rand1
		rand1 = rand2
		rand2 = x
	}

	part1 = element.innerHTML.substr(0,rand1)
	part2 = element.innerHTML.substr(rand1,rand2)
	part3 = element.innerHTML.substr(rand2)

	insert1 = "<span style=\"color: RGB("+grand(255)+", "+grand(255)+"," +grand(255)+")\">";
	insert2 = "</span>"
	element.innerHTML = part1 + insert1 + part2 + insert2 + part3
}


function corrupt_website() {
	all_elements = document.getElementsByTagName("*");
	// violence = parseInt(document.getElementById("violence_level").value)
	setInterval(corruption_step_color, 1)
}
