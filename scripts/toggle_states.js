function killChildren() {
	for (var sel = 0; sel < extras.length; sel++)
		extras[sel].style.display = "none";
}
function toggleChildren() {
	for (var sel = 0; sel < extras.length; sel++)
		extras[sel].style.display = "block";
}
function toggleAbout() {
	killChildren();
	about.style.display = "block";
}
function toggleMusic() {
    killChildren();
    moosic.style.display = "block";
    createScrollAnimation('track');
}
function toggleAnime() {
    killChildren();
    anime.style.display = "block";
    createScrollAnimation('rss2html-embed-item');
}
// TODO
function toggleGames() {
    killChildren();
    games.style.display = "block";
    createScrollAnimation('works');
}
function toggleAUM() {
    killChildren();
    aum.style.display = "block";
}
function resetGSAP() {
    createScrollAnimation('track');
    createScrollAnimation('works');
}