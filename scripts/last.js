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

async function morefm() {
    trackpage++;

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${trackuser}&period=${trackperiod}&page=${trackpage}&limit=${tracklimit}&api_key=${trackapi}&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.toptracks.track);

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${trackuser}&period=${trackperiod}&page=${trackpage}&limit=${tracklimit}&api_key=${trackapi}&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.topalbums.album);

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${trackuser}&period=${trackperiod}&page=${trackpage}&limit=${tracklimit}&api_key=${trackapi}&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.topartists.artist);
}

let trackpage = 0;
let tracklimit = 100;
let trackuser = "GDjkhp";
let trackperiod = "12month";
let trackapi = "a564a411fff98ed4362d09de1af9710f";

async function mainfm() {
    trackpage++; // every +100 click
    let tracknumber = 0; // reset
    // destroy all
    const elements = document.getElementsByClassName('track-link');
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    for (let indexpage = 1; indexpage < trackpage + 1; indexpage++) {
        var url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${trackuser}&period=${trackperiod}&page=${indexpage}&limit=${tracklimit}&api_key=${trackapi}&format=json`;
        data = await fetch(url).then(res => res.json());
        // console.log(data);
        // console.log(data.recenttracks.track);
        data.recenttracks.track.forEach(async trackdata => {
            if (trackdata["@attr"]) return;
            song_template();
            let img   = document.getElementsByClassName("track-cover") [tracknumber];
            let title = document.getElementsByClassName("track-title") [tracknumber];
            let artist= document.getElementsByClassName("track-artist")[tracknumber];
            let album = document.getElementsByClassName("track-album") [tracknumber];
            let time  = document.getElementsByClassName("track-date")  [tracknumber];
            let link  = document.getElementsByClassName("track-link")  [tracknumber];
            tracknumber++;
            img.src = trackdata.image[3]["#text"];
            title.innerHTML = trackdata.name;
            link.href = trackdata.url;
            artist.innerHTML = trackdata.artist["#text"];
            album.innerHTML = trackdata.album["#text"];
            time.innerHTML = strftime("%a %b %e %r %Y %Z", new Date(trackdata.date["uts"]*1000));
        });
    }
	createScrollAnimation('track');
	window.addEventListener('resize', createScrollAnimation('track'));
}
mainfm();