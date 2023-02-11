async function getAllLink(){
	const data = document.getElementsByClassName('rss2html-embed-item');
	data[data.length-1].parentNode.removeChild(data[data.length-1]); // remove credits
	
	for(x = 0; x < data.length; x++){
		const str = data[x].getElementsByTagName('a')[0].href;
		const res = str.split("?"); 
		const id = res[0].slice(30, res[0].lastIndexOf("/"));
		
		const result = await fetch(`https://api.jikan.moe/v4/anime/${id}`).then(res => res.json());
		const seriesData = result.data;
		
		const img = document.createElement("img");
		img.src = seriesData.images.jpg.image_url;
		
		const tag = document.createElement("a"); 
		tag.href = res;
		tag.appendChild(img);
		
		data[x].insertBefore(tag, document.getElementsByClassName('rss2html-embed-item-title')[x]);
		
		await delay();
	}
}

getAllLink();

function delay() {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 500);
	});
}