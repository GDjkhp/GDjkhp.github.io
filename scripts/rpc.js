var userid = "729554186777133088";
var formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 3600) % 60);
    return [hours, minutes, seconds].map(v => String(v).padStart(2,0)).join(':');
}
const getStatusColor = status => ({
    online: "green",
    dnd: "red",
    idle: "orange"
}[status] || "gray");

function normal_timer(element, timestamp) {
    if (element.timestamps.start) {
        var current_time = element.timestamps.start,
        exp_time = Math.floor(Date.now() / 1000),
        diff = (exp_time * 1000) - current_time;
        timestamp.innerHTML = formatTime(diff)+" elapsed";
    }
    else if (element.timestamps.end) {
        var current_time = element.timestamps.end,
        exp_time = Math.floor(Date.now() / 1000),
        diff = current_time - (exp_time * 1000);
        timestamp.innerHTML = formatTime(diff)+" left";
    }
}

function spotify_timer(progress, timestamps) {
    var start = timestamps.start;
    var end = timestamps.end;

    var current_time = Date.now();
    var elapsed_time = current_time - start;
    var total_time = end - start;

    // var progressbar = progress.parentElement;
    // var parent = progress.parentElement.parentElement;
    // progressbar.style.width = parent.clientWidth/1.5;

    var progressPercent = (elapsed_time / total_time) * 100;
    progress.style.width = `${Math.min(progressPercent, 100)}%`;
}

function addRPC() {
    const rpcHtml = `
        <div class="c rpc" style="display: none;">
            <div style="position: relative;">
                <img class="assetBig" width="80" style="border-radius: 0.75rem;" src="https://gdjkhp.github.io/img/unknown.png">
                <img class="assetSmall" width="24" style="border-radius: 9999px; position: absolute; bottom: 0px; right: 0px;" src="https://gdjkhp.github.io/img/unknown.png">
            </div>
            <div style="padding: 8px;">
                <span class="name" style="font-weight: bold; font-size: 24px;"></span>
                <br>
                <span class="details"></span>
                <br>
                <span class="state"></span>
                <br>
                <div class="album" style="display: none;">
                    <span class="albumreal"></span>
                </div>
                <div class="progressbar" style="width: 180px; height: 4px; background-color: gray; display: none;">
                    <div class="progress" style="width: 50%; height: 4px; background-color: white;"></div>
                </div>
                <span class="timestamp"></span>
            </div>
        </div>
    `;
    const body = document.getElementById('rpcdiv');
    body.insertAdjacentHTML('beforeend', rpcHtml);
}

function addProfile() {
    // NOTE: there are lots of magic numbers here, because pixels
    // 144px - 120px = 24px
    // 24px ÷ 2 = 12px (-12px)
    avatar = 80;
    deco = 96;
    offset = -(deco - avatar)/2;
    const rpcHtml = `
        <div class="c" id="e" style="display: none;">
            <div style="position: relative; height: ${avatar}px; margin-right: 8px">
                <img id="avatar" width="${avatar}" style="border-radius: 9999px;" src="https://gdjkhp.github.io/img/dc.png">
                <img id="deco" width="${deco}" style="position: absolute; top: ${offset}px; left: ${offset}px;" src="https://gdjkhp.github.io/img/dc.png">
                <span id="online" style="width: 24px; height: 24px; border-radius: 9999px; position: absolute; bottom: 0px; right: 0px; background-color: gray; border: black 4px solid;">
            </div>
            <div style="padding: 8px;">
                <span id="globalname" style="font-weight: bold; font-size: 24px; display: inline-block; vertical-align: middle;"></span>
                <span id="clan-span" style="font-size: 16px; display: none; vertical-align: middle;">
                    [<img id="clan-badge" style="width: 16px; vertical-align: middle;></img><span id="clan-name"></span>]
                </span>
                <br>
                <span id="username" style="font-size: 20px;"></span>
                <br>
                <span id="status-emoji" style="font-size: 24px;"></span>
                <img id="status-nitro" style="display: none; width: 24px; vertical-align: middle;"></img>
                <span id="status" style="font-size: 16px;"></span>
            </div>
        </div>
    `;
    const body = document.getElementById('rpcdiv');
    body.insertAdjacentHTML('beforeend', rpcHtml);
}

function destroyRPC() {
    const elements = document.getElementsByClassName('c', 'rpc');
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

async function updatepresence() {
    destroyRPC();
    addProfile();
    var json = await lanyard({userId: userid});
    var avatar = document.getElementById("avatar");
    var deco = document.getElementById("deco");
    var online = document.getElementById("online");
    var globalname = document.getElementById("globalname");
    var username = document.getElementById("username");
    var clanbadge = document.getElementById("clan-badge");
    var clanname = document.getElementById("clan-name");
    var clanspan = document.getElementById("clan-span");
    var username = document.getElementById("username");
    var status = document.getElementById("status");
    var emoji = document.getElementById("status-emoji");
    var nitro = document.getElementById("status-nitro");
    var e = document.getElementById("e");
    e.style.display = "flex";
    avatar.src = json.discord_user.avatar ? `https://cdn.discordapp.com/avatars/${userid}/${json.discord_user.avatar}` : "https://gdjkhp.github.io/img/dc.png";
    deco.src = json.discord_user.avatar_decoration_data ? `https://cdn.discordapp.com/avatar-decoration-presets/${json.discord_user.avatar_decoration_data.asset}` : "https://gdjkhp.github.io/img/dc.png";
    deco.style.opacity = json.discord_user.avatar_decoration_data ? 1 : 0;
    globalname.innerHTML = `${json.discord_user.global_name}`;
    username.innerHTML = `${json.discord_user.username}`;
    if (json.discord_user.primary_guild.tag) {
        clanspan.style.display = "inline-block";
        clanbadge.src = `https://cdn.discordapp.com/clan-badges/${json.discord_user.primary_guild.identity_guild_id}/${json.discord_user.primary_guild.badge}`;
        clanname.innerHTML = `${json.discord_user.primary_guild.tag}`;
    }
    online.style.backgroundColor = getStatusColor(json.discord_status);
    let activities = json.activities;
    // rpc = false; 
    number = 0;
    activities.forEach(element => {
        let sp = element.id == "spotify:1";
        if (element.type == 4) {
            if (element.state) status.innerHTML = element.state;
            if (element.emoji) {
                if (element.emoji.id) {
                    nitro.src = `https://cdn.discordapp.com/emojis/${element.emoji.id}`;
                    nitro.style.display = "inline-block";
                    nitro.style.verticalAlign = "middle";
                }
                else emoji.innerHTML = element.emoji.name;
            }
        } else {
            // rpc = true;
            addRPC();
            var assetBig =      document.getElementsByClassName("assetBig")     [number];
            var assetSmall =    document.getElementsByClassName("assetSmall")   [number];
            var name =          document.getElementsByClassName("name")         [number];
            var details =       document.getElementsByClassName("details")      [number];
            var state =         document.getElementsByClassName("state")        [number];
            var timestamp =     document.getElementsByClassName("timestamp")    [number];
            var d =             document.getElementsByClassName("rpc")          [number];
            var progressbar =   document.getElementsByClassName("progressbar")  [number];
            var progress =      document.getElementsByClassName("progress")     [number];
            var albumdiv =      document.getElementsByClassName("album")        [number];
            var album =         document.getElementsByClassName("albumreal")    [number];
            d.style.display = "flex";
            number++;
            if (element.assets) {
                if (element.assets.large_image) {
                    assetBig.style.display = "block";
                    if (element.assets.large_image.includes("mp:external/"))
                        assetBig.src = `https://media.discordapp.net/external/${element.assets.large_image.replace("mp:external/", "")}`;
                    else
                        assetBig.src = sp ? json.spotify.album_art_url : `https://cdn.discordapp.com/app-assets/${element.application_id}/${element.assets.large_image}`;
                    if (element.assets.large_text) assetBig.title = element.assets.large_text; else assetBig.removeAttribute("title");
                } else {
                    assetBig.style.display = "block";
                    assetBig.classList.add('invert');
                    assetBig.src = "https://gdjkhp.github.io/img/unknown.png";
                }
                if (element.assets.small_image) {
                    assetSmall.style.display = "block";
                    assetSmall.src = `https://cdn.discordapp.com/app-assets/${element.application_id}/${element.assets.small_image}`;
                    if (element.assets.small_text) assetSmall.title = element.assets.small_text; else assetSmall.removeAttribute("title");
                } else {
                    if (sp) {
                        assetSmall.style.display = "block";
                        assetSmall.src = "https://gdjkhp.github.io/img/Spotify_App_Logo.svg.png";
                        assetSmall.title = "Spotify";
                    } else {
                        assetSmall.style.display = "none";
                        assetSmall.removeAttribute("title");
                    }
                }
            } else {
                assetBig.style.display = "block";
                assetBig.classList.add('invert');
                assetBig.src = "https://gdjkhp.github.io/img/unknown.png";
                assetSmall.style.display = "none";
                assetSmall.removeAttribute("title");
            }
            name.innerHTML = element.name;
            if (element.state) state.innerHTML = element.state; else state.innerHTML = ""; // element.type == 2 ? `${element.state} &bull; ${json.spotify.album}` : 
            if (element.details) details.innerHTML = element.details; else details.innerHTML = "";
            if (sp) {
                var a = document.createElement('a');
                a.href = `https://open.spotify.com/track/${json.spotify.track_id}`;
                a.target = "spotify"; // bug: doesn't reuse the loaded tab
                details.appendChild(a).appendChild(a.previousSibling);
            }
            var time, stime;
            clearInterval(time);
            timestamp.innerHTML = "";
            if (element.timestamps) time = setInterval(() => normal_timer(element, timestamp), 1);
            if (element.type == 2) {
                if (sp) {
                    albumdiv.style.display = "block";
                    album.innerHTML = json.spotify.album;
                }
                if (element.timestamps.start && element.timestamps.end) {
                    progressbar.style.display = "block";
                    clearInterval(stime);
                    stime = setInterval(() => spotify_timer(progress, element.timestamps), 1);
                }
            }
        }
    });
    // if (!rpc) {
    //     d.style.display = "none";
    //     e.style.borderRadius = ".50rem .50rem .50rem .50rem";
    // } else e.style.borderRadius = ".50rem .50rem 0px 0px";
}

const onload = async () => {
    // start the websocket to automatically fetch the new details on presence update
    lanyard({
        userId: userid,
        socket: true,
        onPresenceUpdate: updatepresence
    })
}
onload();