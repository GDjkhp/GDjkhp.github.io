async function main() {
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
    console.log(data);
    console.log(data.recenttracks.track);
}

main();