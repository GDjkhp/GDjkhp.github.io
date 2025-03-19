var landscapeState;
var mql = window.matchMedia("(min-width: 1024px)");

if(mql.matches) {
    landscape();
} else {
    portrait();
}

mql.addListener(function(m) {
    if(m.matches) {
        landscape();
    }
    else {
        portrait();
    }
});

function portrait() {
    landscapeState = false;
}

function landscape() {
    landscapeState = true;
}

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
    if (i < 10) {i = "0" + i}; // add zero in front of numbers < 10
    return i;
}