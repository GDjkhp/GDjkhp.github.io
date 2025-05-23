function openNav() {
    const sidenav = document.getElementById("mySidenav");
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    if (sidenav.style.width === "250px") {
        closeNav();
        hamburgerMenu.classList.remove("active");
    } else {
        sidenav.style.width = "250px";
        document.getElementById("mySidenav").style.border = "white 3px dashed";
        hamburgerMenu.classList.add("active");
    }
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").style.border = "none";
    document.querySelector(".hamburger-menu").classList.remove("active");
}

function closeNavOnClick() {
    document.addEventListener('mousedown', function(event) {
        const sidenav = document.getElementById("mySidenav");
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        
        // Check if the click is outside the sidenav and not on the hamburger menu
        if (!sidenav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            // Only close if the sidenav is actually open (has a width)
            if (sidenav.style.width === "250px") {
                closeNav();
                // This will revert the hamburger icon
                hamburgerMenu.classList.remove("active");
            }
        }
    });
  }
closeNavOnClick();