// APPEAL COOLDOWN
function countdown0(timerElBan, timerId, date) {
    // Calculate time difference between now and end time
    const timeDiff = new Date(date) - new Date();
    // Calculate days, hours, minutes, seconds, and milliseconds
    const days = String(Math.floor(timeDiff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
    const milliseconds = String(Math.floor((timeDiff % 1000) / 10)).padStart(2, '0');
    const displayTime = `${days}:${hours}:${minutes}:${seconds}.${milliseconds}`;
    // Update timer display
    timerElBan.innerText = displayTime;
    // Stop the countdown when timeLeft reaches 0
    if (timeDiff <= 0) {
        clearInterval(timerId);
        timerElBan.innerText = `00:00:00:00.00`;
    }
}
let timerIdGDjkhp, others = document.getElementById('ban');
clearInterval(timerIdGDjkhp);
timerIdGDjkhp = setInterval(() => countdown0(others, timerIdGDjkhp, "2025-06-17"), 1);