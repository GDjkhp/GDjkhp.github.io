// Find matches
var mql = window.matchMedia("(orientation: portrait)");

// If there are matches, we're in portrait
if(mql.matches) {  
	// Portrait orientation
	portrait();
} else {  
	// Landscape orientation
	landscape();
}

// Add a media query change listener
mql.addListener(function(m) {
	if(m.matches) {
		// Changed to portrait
		portrait();
	}
	else {
		// Changed to landscape
		landscape();
	}
});

function portrait() {
	const collection = document.getElementsByClassName("column");
	collection[0].style.height = "auto";
	collection[1].style.height = "auto";
	collection[2].style.height = "auto";
}

function landscape() {
	const collection = document.getElementsByClassName("column");
	collection[0].style.height = "500px";
	collection[1].style.height = "500px";
	collection[2].style.height = "500px";
}