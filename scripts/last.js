function song_template() {
    const t = `
        <a href="https://www.last.fm/user/GDjkhp" target="_blank" class="track-link" style="text-decoration: none;">
            <div class="track" style="display: flex;">
                <img src="https://lastfm.freetls.fastly.net/i/u/300x300/d30cca7a97dc4686b74a9128eb597d2a.png" width=80 class="track-cover">
                <div style="padding: 8px;">
                    <span class="track-title">title</span><br>
                    <span class="track-artist">artist</span><br>
                    <span class="track-album">album</span><br>
                    <span class="track-date">01/29/2003</span>
                </div>
            </div>
        </a>
    `
    const body = document.getElementById("lastfm");
    body.insertAdjacentHTML('beforeend', t);
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function mainfm() {
    user = "GDjkhp"
    period = "12month"
    limit = "1000"
    api = "a564a411fff98ed4362d09de1af9710f";

    // var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&period=${period}&limit=${limit}&api_key=${api}&format=json`;
    // data = await fetch(url).then(res => res.json());
    // console.log(data);
    // console.log(data.toptracks.track);

    // var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${user}&period=${period}&limit=${limit}&api_key=${api}&format=json`;
    // data = await fetch(url).then(res => res.json());
    // console.log(data);
    // console.log(data.topalbums.album);

    // var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${user}&period=${period}&limit=${limit}&api_key=${api}&format=json`;
    // data = await fetch(url).then(res => res.json());
    // console.log(data);
    // console.log(data.topartists.artist);

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&period=${period}&limit=${limit}&api_key=${api}&format=json`;
    data = await fetch(url).then(res => res.json());
    // console.log(data);
    // console.log(data.recenttracks.track);

    number = 0;
    data.recenttracks.track.forEach(async t => {
        song_template();
        let img   = document.getElementsByClassName("track-cover") [number];
        let title = document.getElementsByClassName("track-title") [number];
        let artist= document.getElementsByClassName("track-artist")[number];
        let album = document.getElementsByClassName("track-album") [number];
        let time  = document.getElementsByClassName("track-date")  [number];
        let link  = document.getElementsByClassName("track-link")  [number];
        number++;
        img.src = t.image[3]["#text"];
        title.innerHTML = t.name;
        link.href = t.url;
        artist.innerHTML = t.artist["#text"];
        album.innerHTML = t.album["#text"];
        time.innerHTML = t["@attr"] ? "Now playing" : strftime("%a %b %e %r %Y %Z", new Date(t.date["uts"]*1000));
    });
	createScrollAnimation('track');
	window.addEventListener('resize', createScrollAnimation('track'));
}

mainfm();