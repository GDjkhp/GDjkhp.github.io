function killChildren() {
	for (var sel = 0; sel < extras.length; sel++)
		extras[sel].style.display = "none";
}
function toggleChildren() {
	for (var sel = 0; sel < extras.length; sel++)
		extras[sel].style.display = "block";
    resetGSAP();
}
function toggleAbout() {
	killChildren();
	about.style.display = "block";
    resetGSAP();
}
function toggleMusic() {
    killChildren();
    moosic.style.display = "block";
    resetGSAP();
}
function toggleAnime() {
    killChildren();
    anime.style.display = "block";
    resetGSAP();
}
// TODO
function toggleGames() {
    killChildren();
    games.style.display = "block";
    resetGSAP();
}
function toggleAUM() {
    killChildren();
    aum.style.display = "block";
}
function resetGSAP() {
    createScrollAnimation('rss2html-embed-item');
    createScrollAnimation('track');
    createScrollAnimation('works');
}