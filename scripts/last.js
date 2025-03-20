async function main() {
    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=GDjkhp&period=12month&limit=1000&api_key=a564a411fff98ed4362d09de1af9710f&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.toptracks.track);

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=GDjkhp&period=12month&limit=1000&api_key=a564a411fff98ed4362d09de1af9710f&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.topalbums.album);

    var url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=GDjkhp&period=12month&limit=1000&api_key=a564a411fff98ed4362d09de1af9710f&format=json`;
    data = await fetch(url).then(res => res.json());
    console.log(data);
    console.log(data.topartists.artist);
}

main();