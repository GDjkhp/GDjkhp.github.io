var userid = "729554186777133088", time;
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

function timer(element, timestamp) {
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

async function updatepresence() {
    var json = await lanyard({userId: userid});
    var avatar = document.getElementById("avatar");
    var online = document.getElementById("online");
    var username = document.getElementById("username");
    var status = document.getElementById("status");
    var assetBig = document.getElementById("assetBig");
    var assetSmall = document.getElementById("assetSmall");
    var name = document.getElementById("name");
    var details = document.getElementById("details");
    var state = document.getElementById("state");
    var timestamp = document.getElementById("timestamp");
    var d = document.getElementById("d");
    var e = document.getElementById("e");
    e.style.display = "flex";
    avatar.src = json.discord_user.avatar ? "https://cdn.discordapp.com/avatars/" + userid + "/" + json.discord_user.avatar : "https://gdjkhp.github.io/img/dc.png";
    username.innerHTML = json.discord_user.username;
    online.style.backgroundColor = getStatusColor(json.discord_status);
    activities = json.activities;
    let shouldContinue = true, rpc = false;
    activities.forEach(element => {
        if (!shouldContinue) return;
        if (element.type == 4) {
            if (element.state) status.innerHTML = element.state;
        } else {
            rpc = true;
            d.style.display = "flex";
            if (element.assets) {
                if (element.assets.large_image) {
                    assetBig.style.display = "block";
                    assetBig.className = "";
                    assetBig.src = "https://cdn.discordapp.com/app-assets/" + element.application_id + '/' + element.assets.large_image;
                    if (element.assets.large_text) assetBig.title = element.assets.large_text; else assetBig.removeAttribute("title");
                } else {
                    assetBig.style.display = "block";
                    assetBig.className = "invert";
                    assetBig.src = "https://gdjkhp.github.io/img/unknown.png";
                }
                if (element.assets.small_image) {
                    assetSmall.style.display = "block";
                    assetSmall.src = "https://cdn.discordapp.com/app-assets/" + element.application_id + '/' + element.assets.small_image;
                    if (element.assets.small_text) assetSmall.title = element.assets.small_text; else assetSmall.removeAttribute("title");
                } else {
                    assetSmall.style.display = "none";
                    assetSmall.removeAttribute("title");
                }
            } else {
                assetBig.style.display = "block";
                assetBig.className = "invert";
                assetBig.src = "https://gdjkhp.github.io/img/unknown.png";
                assetSmall.style.display = "none";
                assetSmall.removeAttribute("title");
            }
            name.innerHTML = element.name;
            if (element.state) state.innerHTML = element.state; else state.innerHTML = "";
            if (element.details) details.innerHTML = element.details; else details.innerHTML = "";
            clearInterval(time);
            timestamp.innerHTML = "";
            if (element.timestamps) time = setInterval(() => timer(element, timestamp), 1);
            shouldContinue = false;
        }
    });
    if (!rpc) {
        d.style.display = "none";
        e.style.borderRadius = ".50rem .50rem .50rem .50rem";
    } else e.style.borderRadius = ".50rem .50rem 0px 0px";
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