var style = document.createElement("style");
style.innerHTML = `
#canvasdonut2 { 
    position: fixed;
    width: 1500;
    height: 1500;
	z-index: -1;
    left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
} 
.markdown-body {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
}
body { 
    background-color: black; 
    color: white; 
}
tr, th, td {
    background-color: black;
}
`;
document.head.appendChild(style);

var donutCanvas = document.createElement("canvas");
donutCanvas.setAttribute("id", "canvasdonut2");
document.body.appendChild(donutCanvas);

var donutScript = document.createElement("script");
donutScript.setAttribute("src", "https://GDjkhp.github.io/scripts/donut.js");
donutScript.onload = function() {
    anim2();
};
document.body.appendChild(donutScript);