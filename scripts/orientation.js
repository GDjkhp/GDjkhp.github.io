var landscapeState;

// https://davidwalsh.name/orientation-change

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
	landscapeState = false;
	
	// check if columns are top
	var _w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var _h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
	if (_w < _h && _w > 600) landscape();
	
	else {
		const collection = document.getElementsByClassName("column");
		
		collection[0].style.height = "auto";
		collection[1].style.height = "auto";
		collection[2].style.height = "auto";
	}
}

function landscape() {
	landscapeState = true;
	
	const collection = document.getElementsByClassName("column");
	
	collection[0].style.height = "500px";
	collection[1].style.height = "500px";
	collection[2].style.height = "500px";
}