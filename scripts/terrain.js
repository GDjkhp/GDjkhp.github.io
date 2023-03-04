// canvas
var canvastag = document.getElementById('canvas');
var WIDTH = canvastag.width, HEIGHT = canvastag.height;

// classes
function map(valueCoord1, startCoord1, endCoord1, startCoord2, endCoord2) {
    var offset = startCoord2;
    var ratio = (endCoord2 - startCoord2) / (endCoord1 - startCoord1);
    return ratio * (valueCoord1 - startCoord1) + offset;
}
class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class Polygon {
    constructor(...points) {
        this.points = points;
    }

    rotate(cw, xDeg, yDeg, zDeg) {
        this.points.forEach(p => {
            rotateX(p, cw, xDeg);
            rotateY(p, cw, yDeg);
            rotateZ(p, cw, zDeg);
        });
    }

    getAverageX() {
        var sum = 0;
        this.points.forEach(p => {
            sum += p.x;
        });

        return sum/this.points.length;
    }

    addPoint(x, y) {
        this.points.push({ x, y });
    }

    render(ctx) {
        // convert to 2D
        var poly = new Polygon();
        for (var i = 0; i < this.points.length; i++) {
            var p = convertPoint(this.points[i]);
            poly.addPoint(p.x, p.y);
        }

        // graphics
        ctx.beginPath();
        ctx.moveTo(poly.points[0].x, poly.points[0].y);
        for (let i = 1; i < poly.points.length; i++) {
            ctx.lineTo(poly.points[i].x, poly.points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba("+col+")";
        ctx.stroke();
    }
}
class Tetrahedron {
    constructor(polygons) {
        this.polygons = polygons;
    }

    rotate(cw, xDeg, yDeg, zDeg) {
        this.polygons.forEach(p => {
            p.rotate(cw, xDeg, yDeg, zDeg);
        });
    }

    render(ctx) {
        this.polygons.forEach(poly => {
            poly.render(ctx);
        })
    }
}

// point converter
var localScale = 1, zoomFactor = 1.2, centerPoint = new Point(WIDTH / 2, HEIGHT / 2);
function convertPoint(point) {
    var x3d = point.y * localScale;
    var y3d = point.z * localScale;
    var depth = point.x * localScale;
    var newVal = scale(x3d, y3d, depth);

    var x2d = centerPoint.x + newVal.x;
    var y2d = centerPoint.y - newVal.y;
    return new Point(x2d, y2d);
}
function scale(x3d, y3d, depth) {
    var dist = Math.sqrt(x3d * x3d + y3d * y3d);
    var theta = Math.atan2(y3d, x3d);
    var depth2 = 15 - depth;
    var localScale1 = Math.abs(1400/(depth2+1400));
    dist *= localScale1;
    return new Point(dist * Math.cos(theta), dist * Math.sin(theta));
}
function rotateX(p, cw, degrees) {
    var radius = Math.sqrt(p.y * p.y + p.z * p.z);
    var theta = Math.atan2(p.y, p.z);
    theta += 2 * Math.PI / 360 * degrees * (cw ? -1 : 1);
    p.y = radius * Math.sin(theta);
    p.z = radius * Math.cos(theta);
}
function rotateY(p, cw, degrees) {
    var radius = Math.sqrt(p.x * p.x + p.z * p.z);
    var theta = Math.atan2(p.x, p.z);
    theta += 2 * Math.PI / 360 * degrees * (cw ? -1 : 1);
    p.x = radius * Math.sin(theta);
    p.z = radius * Math.cos(theta);
}
function rotateZ(p, cw, degrees) {
    var radius = Math.sqrt(p.y * p.y + p.x * p.x);
    var theta = Math.atan2(p.y, p.x);
    theta += 2 * Math.PI / 360 * degrees * (cw ? -1 : 1);
    p.y = radius * Math.sin(theta);
    p.x = radius * Math.cos(theta);
}
function zoomIn() {
    localScale *= zoomFactor;
}
function zoomOut() {
    localScale /= zoomFactor;
}

// p5js terrain
var scl = 20;
var unit = 1000;
var limit = unit / scl;
var flying = 0;
var terrain = new Array(limit);
for (var i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(limit);
}
noise.seed(Math.random());
var xDif = 45, yDif = 0, zDif = -90;
var range = 100;
var col = "255,255,255,1";

function darw() {
    var ctx = canvastag.getContext('2d');
	ctx.fillStyle='#000';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    flying -= 0.1;
    var yoff = flying;
    for (var y = 0; y < limit; y++) {
        var xoff = 0;
        for (var x = 0; x < limit; x++) {
            terrain[x][y] = map(noise.simplex2(xoff, yoff), 0, 1, -range, range);
            //console.log(terrain[x][y]);
            xoff += 0.2;
        }
        yoff += 0.2;
    }

    var triangles = [];

    for (var y = 0; y < limit; y++) {
        for (var x = 0; x < limit; x++) {
            var v1, v2, v3;

            v1 = new Point(x*scl, y*scl, terrain[x][y]);
            v2 = new Point(x*scl, (y+1)*scl, terrain[x][y+1]);

            if (x + 1 < limit) {
                v3 = new Point((x + 1) * scl, y * scl, terrain[x + 1][y]);
            } else {
                v3 = new Point(x * scl, y * scl, terrain[x][y]); // FIXME: end triangles are unclosed
            }

            // center test
            v1 = new Point(v1.x - unit / 2, v1.y - unit / 2, v1.z);
            v2 = new Point(v2.x - unit / 2, v2.y - unit / 2, v2.z);
            v3 = new Point(v3.x - unit / 2, v3.y - unit / 2, v3.z);

            triangles.push(new Polygon(v1, v2, v3));
        }
    }
    var triangleStrip = new Tetrahedron(triangles);
    // TODO: add transform codes
    triangleStrip.rotate(true, -xDif, -yDif, -zDif);
    //console.log(triangleStrip);

    triangleStrip.render(ctx);
}

zoomOut();
zoomOut();
zoomOut();
zoomOut();
zoomOut(); // zoom out x5

range = 25;
var r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256), a = 1;
col = r + "," + g + "," + b + "," + a;
setInterval(darw, 1);