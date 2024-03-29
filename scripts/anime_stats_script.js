async function getStats() {
	// https://api.jikan.moe/v4/users/{username}/statistics

	const result = await fetch(`https://api.jikan.moe/v4/users/gdjkhp/statistics`).then(res => res.json());
	const data = result.data.anime;
	console.log(data);
	
	var stat = document.getElementsByClassName('stats');
	var stat2 = document.getElementsByClassName('stats2');
	
	stat[0].style = "background-color: #2db039;";
	stat[0].innerHTML = "Watching: " + data.watching;
	
	stat[1].style = "background-color: #26448f;";
	stat[1].innerHTML = "Completed: " + data.completed;
	
	stat[2].style = "background-color: #f9d457;";
	stat[2].innerHTML = "On-Hold: " + data.on_hold;
	
	stat[3].style = "background-color: #a12f31;";
	stat[3].innerHTML = "Dropped: " + data.dropped;
	
	stat[4].style = "background-color: #c3c3c3;";
	stat[4].innerHTML = "Plan to Watch: " + data.plan_to_watch;

	stat2[0].innerHTML = "Total Entries: " + data.total_entries;
	stat2[1].innerHTML = "Rewatched: " + data.rewatched;
	stat2[2].innerHTML = "Episodes: " + data.episodes_watched;
	stat2[3].innerHTML = "Mean Score: " + data.mean_score;
}

getStats();