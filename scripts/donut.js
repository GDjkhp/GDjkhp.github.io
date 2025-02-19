var pretag = document.getElementById('d');
var canvastag = document.getElementById('canvasdonut');
var canvastag2 = document.getElementById('canvasdonut2');

var tmr1 = undefined, tmr2 = undefined, tmr3 = undefined;
var A=1, B=1;

// This is copied, pasted, reformatted, and ported directly from my original
// donut.c code
var asciiframe=function() {
	var b=[];
	var z=[];
	A += 0.07;
	B += 0.03;
	var cA=Math.cos(A), sA=Math.sin(A),
	cB=Math.cos(B), sB=Math.sin(B);
	for(var k=0;k<1760;k++) {
		b[k]=k%80 == 79 ? "\n" : " ";
		z[k]=0;
	}
	for(var j=0;j<6.28;j+=0.07) { // j <=> theta
		var ct=Math.cos(j),st=Math.sin(j);
		for(i=0;i<6.28;i+=0.02) {   // i <=> phi
			var sp=Math.sin(i),cp=Math.cos(i),
				h=ct+2, // R1 + R2*cos(theta)
				D=1/(sp*h*sA+st*cA+5), // this is 1/z
				t=sp*h*cA-st*sA; // this is a clever factoring of some of the terms in x' and y'

			var x=0|(40+30*D*(cp*h*cB-t*sB)),
				y=0|(12+15*D*(cp*h*sB+t*cB)),
				o=x+80*y,
				N=0|(8*((st*sA-sp*ct*cA)*cB-sp*ct*sA-st*cA-cp*ct*sB));
			if(y<22 && y>=0 && x>=0 && x<79 && D>z[o])
			{
				z[o]=D;
				b[o]=".,-~:;=!*#$@"[N>0?N:0];
			}
		}
	}
	pretag.innerHTML = b.join("");
};

anim1 = function() {
	if(tmr1 === undefined) {
		tmr1 = setInterval(asciiframe, 50);
	} else {
		clearInterval(tmr1);
		tmr1 = undefined;
	}
};

// This is a reimplementation according to my math derivation on the page
var R1 = 1;
var R2 = 2;
var K1 = 1500;
var K2 = 5;
var canvasframe=function() {
	var ctx = canvastag2.getContext('2d');
	ctx.fillStyle='#000';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if(tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
		A += 0.07;
		B += 0.03;
	}
	// precompute cosines and sines of A, B, theta, phi, same as before
	var cA=Math.cos(A), sA=Math.sin(A),
		cB=Math.cos(B), sB=Math.sin(B);
	for(var j=0;j<6.28;j+=0.3) { // j <=> theta
		var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
		for(i=0;i<6.28;i+=0.1) {   // i <=> phi
			var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
			var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
				oy = R1*st;

			var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
			var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
			var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
			var xp=(canvastag2.width/2+K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
			var yp=(canvastag2.height/2-K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
			// luminance, scaled back to 0 to 1
			var L=0.7*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
			if(L > 0) {
				ctx.fillStyle = 'rgba(255,255,255,'+L+')';
				ctx.fillRect(xp, yp, 3, 3);
			}
		}
	}
}

anim2 = function() {
	if(tmr2 === undefined) {
		tmr2 = setInterval(canvasframe, 50);
	} else {
		clearInterval(tmr2);
		tmr2 = undefined;
	}
};

var spacing = .0625;
var distance = 1;
var size = 200;
var pixel = 1;

var canvasframe2=function() {
	var ctx = canvastag2.getContext('2d');
	ctx.fillStyle='#000';
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if(tmr1 === undefined) { // only update A and B if the first animation isn't doing it already
		A += 0.07;
		B += 0.03;
	}
	
	// precompute cosines and sines of A, B, theta, phi, same as before
	var cA=Math.cos(A), sA=Math.sin(A),
		cB=Math.cos(B), sB=Math.sin(B);

    // precomputer rotation matrix
	var rotx = [
		[1, 0, 0],
		[0, cA, sA],
		[0, -sA, cA]
	];

	var rotz = [
		[cB, sB, 0],
		[-sB, cB, 0],
		[0, 0, 1]
	];

    for (var h = -1; h < 1 + spacing; h+=spacing) {
		for (var v = -1; v < 1 + spacing; v+=spacing) {
			for (var side = 0; side < 6; side++) {
				// compute 6 sides
				var x = 0;
				var y = 0;
				var z = 0;

				if (side == 0) { // (0,0,1)
					x = h;
					y = v;
					z = 1;
				}
				if (side == 1) { // (0,0,-1)
					x = h;
					y = v;
					z = -1;
				}
				if (side == 2) { // (0,1,0)
					x = h;
					y = 1;
					z = v;
				}
				if (side == 3) { // (0,-1,0)
					x = h;
					y = -1;
					z = v;
				}
				if (side == 4) { // (1,0,0)
					x = 1;
					y = h;
					z = v;
				}
				if (side == 5) { // (-1,0,0)
					x = -1;
					y = h;
					z = v;
				}

				var point = [x, y, z];
				// apply rotation to the point
				point = rotate(point, rotx);
				point = rotate(point, rotz);

				// project point onto 2D screen
				var xp = point[0] * distance / (point[2] + distance);
				var yp = point[1] * distance / (point[2] + distance);

				// adjust projection to fit inside canvas
				xp = xp * size + canvastag2.width/2;
				yp = -yp * size + canvastag2.height/2;

				ctx.fillStyle = 'rgba(255,255,255,.5)';
                ctx.fillRect(xp, yp, pixel, pixel);
			}
		}
	}
}

function rotate(point, matrix) {
	var result = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		result[i] = 0;
		for (var j = 0; j < 3; j++) {
			result[i] += point[j] * matrix[j][i];
		}
	}
	return result;
}

anim3 = function() {
	if(tmr3 === undefined) {
		tmr3 = setInterval(canvasframe2, 50);
	} else {
		clearInterval(tmr3);
		tmr3 = undefined;
	}
};

//anim1();
//anim2();
//anim3();