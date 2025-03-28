async function getAllLink() {
	const data = document.getElementsByClassName('rss2html-embed-item');
	const title = document.getElementsByClassName('rss2html-embed-item-title');
	data[data.length-1].parentNode.removeChild(data[data.length-1]); // remove credits
	
	for (x = 0; x < data.length; x++) {
		const str = data[x].getElementsByTagName('a')[0].href;
		const res = str.split("?"); 
		const id = res[0].slice(30, res[0].lastIndexOf("/"));
		
		try {
			const result = await fetch(`https://api.jikan.moe/v4/anime/${id}`).then(res => res.json());
			const seriesData = result.data;
			
			const img = document.createElement("img");
			img.src = seriesData.images.jpg.image_url;
			
			// airing, duration, episodes, genres[0].name, rank, rating, score, season, source, status, studios[0].name, synopsis, title, type, year
			img.title = seriesData.title + "\n" + seriesData.type + ", " + seriesData.episodes + " episode/s";
			img.title += nullDate(seriesData);
			img.title += "\n" + joinStrings(seriesData.studios);
			img.title += "\n" + joinStrings(seriesData.genres);
			img.title += "\n" + seriesData.duration;
			img.title += "\n" + seriesData.rating;
			img.title += "\nRank: #" + seriesData.rank + ", Score: " + seriesData.score;
			img.title += "\n\n" + seriesData.synopsis;
			
			const tag = document.createElement("a"); 
			tag.href = res;
			tag.appendChild(img);
			
			data[x].insertBefore(tag, title[x]);
			
			await delay();
		} catch (error) {
			console.log(error);
			continue;
		}
	}
	createScrollAnimation('rss2html-embed-item');
	window.addEventListener('resize', createScrollAnimation('rss2html-embed-item'));
}

getAllLink();

function delay() {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 500);
	});
}
function capitalize(s) {
    if (s!=null)return s[0].toUpperCase() + s.slice(1);
	else return null;
}
function joinStrings(s) {
	var ss = "";
	s.forEach(element => {
		ss += element.name + ", ";
	});
	//console.log(ss.slice(0, -2));
	return ss.slice(0, -2);
}
function nullDate(data) {
	if (data.year != null) return "\n" + capitalize(data.season) + " " + data.year;
	else return "\n" + data.aired.string;
}