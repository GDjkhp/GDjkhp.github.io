// canvas
var canvastag = document.getElementById('canvas');
var WIDTH = canvastag.width, HEIGHT = 1250; // constant to trick the camera of the terrain floor = 1250

// Global flags
let cullingEnabled = true;
let useViewport = true;
let debugMode = false;
let devMode = false;

// FPS
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;
let animationInterval;

// Define camera viewport
const cameraViewport = {
    x: 0, // WIDTH * 0.25
    y: 0, // HEIGHT * 0.25
    width: WIDTH, // WIDTH * 0.5
    height: HEIGHT * 0.75 // HEIGHT * 0.5
};

// Full screen viewport
const fullscreenViewport = {
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT
};

// Function to get current active viewport
function getActiveViewport() {
    return useViewport ? cameraViewport : fullscreenViewport;
}

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
        let visible = isPolygonVisible(this);
        // convert to 2D
        var poly = new Polygon();
        for (var i = 0; i < this.points.length; i++) {
            var p = convertPoint(this.points[i]);
            poly.addPoint(p.x, p.y);
        }

        // If polygon is not visible and culling is enabled, don't render
        if (!visible) {
            // Optionally draw in red for debug purposes
            if (debugMode) {
                ctx.beginPath();
                ctx.moveTo(poly.points[0].x, poly.points[0].y);
                for (let i = 1; i < poly.points.length; i++) {
                    ctx.lineTo(poly.points[i].x, poly.points[i].y);
                }
                ctx.closePath();
                ctx.strokeStyle = "rgba(255,0,0,1)";
                ctx.stroke();
            }
            return false;
        }

        // graphics
        ctx.beginPath();
        ctx.moveTo(poly.points[0].x, poly.points[0].y);
        for (let i = 1; i < poly.points.length; i++) {
            ctx.lineTo(poly.points[i].x, poly.points[i].y);
        }
        ctx.closePath();
        // ctx.fillStyle = "black";
        // ctx.fill();
        ctx.strokeStyle = "rgba("+col+")";
        ctx.stroke();

        return true;
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
        // Sort polygons by depth for better rendering
        this.polygons.sort((a, b) => {
            // Get average depth of each polygon
            const avgDepthA = a.points.reduce((sum, p) => sum + p.x, 0) / a.points.length;
            const avgDepthB = b.points.reduce((sum, p) => sum + p.x, 0) / b.points.length;
            // Sort from farthest to nearest for proper layering
            return avgDepthB - avgDepthA;
        });
        
        // Counter for rendered polygons (for debugging)
        let renderedCount = 0;
        let totalCount = this.polygons.length;
        
        // Render each polygon
        this.polygons.forEach(poly => {
            const wasRendered = poly.render(ctx);
            if (wasRendered) {
                renderedCount++;
            }
        });
        
        // Draw active viewport for visualization
        if (devMode) {
            const viewport = getActiveViewport();
            const viewportColor = cullingEnabled ? 
                (useViewport ? "rgba(0, 255, 0, 0.8)" : "rgba(0, 100, 255, 0.8)") : 
                "rgba(255, 0, 0, 0.8)";
                
            ctx.strokeStyle = viewportColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                viewport.x, 
                viewport.y, 
                viewport.width, 
                viewport.height
            );
        }
        ctx.lineWidth = 1;
        
        // Update FPS counter
        frameCount++;
        const currentTime = performance.now();
        const elapsedTime = currentTime - lastTime;
        
        if (elapsedTime >= 1000) { // Update FPS every second
            fps = Math.round((frameCount * 1000) / elapsedTime);
            frameCount = 0;
            lastTime = currentTime;
        }
        
        // Show debug info
        if (devMode) {
            ctx.fillStyle = "white";
            ctx.font = "14px Arial";
            ctx.fillText(`FPS: ${fps}`, 10, 20);
            ctx.fillText(`Culling: ${cullingEnabled ? "ON" : "OFF"}`, 10, 40);
            ctx.fillText(`Viewport: ${useViewport ? "Custom" : "Fullscreen"}`, 10, 60);
            ctx.fillText(`Rendered: ${renderedCount}/${totalCount} (${Math.round(renderedCount/totalCount*100)}%)`, 10, 80);
            ctx.fillText(`Culled: ${totalCount - renderedCount}`, 10, 100);
        }
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
function isPolygonVisible(polygon) {
    // If culling is disabled, consider everything visible
    if (!cullingEnabled) {
        return true;
    }
    
    // First convert all points to 2D screen space
    const screenPoints = polygon.points.map(p => convertPoint(p));
    
    // Get current viewport
    const viewport = getActiveViewport();
    
    // Check if polygon is outside the viewport
    let allLeft = true, allRight = true, allTop = true, allBottom = true;
    
    for (const p of screenPoints) {
        // Check against viewport with margin
        const margin = 20;
        
        if (p.x > viewport.x - margin) allLeft = false;
        if (p.x < viewport.x + viewport.width + margin) allRight = false;
        if (p.y > viewport.y - margin) allTop = false;
        if (p.y < viewport.y + viewport.height + margin) allBottom = false;
    }
    
    // If all points are on one side of the viewport, the polygon is not visible
    return !(allLeft || allRight || allTop || allBottom);
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

function darw() {
    var ctx = canvastag.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    flying -= 0.1;
    var yoff = flying;
    for (var y = 0; y < limit; y++) {
        var xoff = 0;
        for (var x = 0; x < limit; x++) {
            terrain[x][y] = map(noise.simplex2(xoff, yoff), 0, 1, -range, range);
            xoff += smth;
        }
        yoff += smth;
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
    triangleStrip.render(ctx);
    zDif -= zRot;
    
    // Request next frame
    requestAnimationFrame(darw);
}

// p5js terrain
var scl = 20;
var unit = 2000; // 1000
var limit = unit / scl;
var flying = 0;
var terrain = new Array(limit);
for (var i = 0; i < terrain.length; i++) {
    terrain[i] = new Array(limit);
}
// noise.seed(Math.random());
var xDif = 0, yDif = 0, zDif = -90;
zRot = 0.1;
smth = 0.03; // 0.2
// var range = 100;
// var col = "255,255,255,1";
range = 100;
var r = Math.floor(Math.random() * 256), g = Math.floor(Math.random() * 256), b = Math.floor(Math.random() * 256), a = 1;
col = r + "," + g + "," + b + "," + a;

function setupControls() {
    // Container for controls
    const controlsContainer = document.createElement('div');
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.top = '10px';
    controlsContainer.style.right = '10px';
    controlsContainer.style.padding = '10px';
    controlsContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    controlsContainer.style.borderRadius = '5px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.flexDirection = 'column';
    controlsContainer.style.gap = '5px';
    
    // Style for buttons
    const buttonStyle = 'padding: 5px 10px; margin: 2px 0; cursor: pointer;';
    
    // Toggle culling button
    const cullingButton = document.createElement('button');
    cullingButton.innerText = 'Culling: ON';
    cullingButton.style = buttonStyle;
    cullingButton.addEventListener('click', () => {
        cullingEnabled = !cullingEnabled;
        cullingButton.innerText = `Culling: ${cullingEnabled ? 'ON' : 'OFF'}`;
    });
    
    // Toggle viewport button
    const viewportButton = document.createElement('button');
    viewportButton.innerText = 'Viewport: Custom';
    viewportButton.style = buttonStyle;
    viewportButton.addEventListener('click', () => {
        useViewport = !useViewport;
        viewportButton.innerText = `Viewport: ${useViewport ? 'Custom' : 'Fullscreen'}`;
    });
    
    // Toggle debug mode button
    const debugButton = document.createElement('button');
    debugButton.innerText = 'Debug: OFF';
    debugButton.style = buttonStyle;
    debugButton.addEventListener('click', () => {
        debugMode = !debugMode;
        debugButton.innerText = `Debug: ${debugMode ? 'ON' : 'OFF'}`;
    });
    
    // Add buttons to container
    controlsContainer.appendChild(cullingButton);
    controlsContainer.appendChild(viewportButton);
    controlsContainer.appendChild(debugButton);
    
    // Add container to body
    document.body.appendChild(controlsContainer);
    
    // Also add key bindings
    document.addEventListener('keydown', (e) => {
        if (e.key === 'c') {
            cullingEnabled = !cullingEnabled;
            cullingButton.innerText = `Culling: ${cullingEnabled ? 'ON' : 'OFF'}`;
        } else if (e.key === 'v') {
            useViewport = !useViewport;
            viewportButton.innerText = `Viewport: ${useViewport ? 'Custom' : 'Fullscreen'}`;
        } else if (e.key === 'd') {
            debugMode = !debugMode;
            debugButton.innerText = `Debug: ${debugMode ? 'ON' : 'OFF'}`;
        }
    });
}

function startAnimation() {
    // Initialize time and FPS
    lastTime = performance.now();
    frameCount = 0;
    fps = 0;
    
    // Cancel any existing interval
    if (animationInterval) {
        clearInterval(animationInterval);
    }
    
    // Start the animation loop
    requestAnimationFrame(darw);
}

window.addEventListener('load', () => {
    if (devMode) setupControls();
    startAnimation();
});

// Make sure this is the last part of the script to override any previous setInterval
clearInterval(animationInterval); // Clear any existing interval
zoomIn();