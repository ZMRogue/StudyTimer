// --- Quotes from API ------------------------------------
function showQuote() {
    fetch("https://quoteslate.vercel.app/api/quotes/random")
        .then(response => response.json())
        .then(data => {
            document.getElementById("quote").innerHTML =
                `"${data.quote}" <br><strong>— ${data.author}</strong>`;
        })
        .catch(() => {
            // Try second backup API
            fetch("https://dummyjson.com/quotes/random")
                .then(response => response.json())
                .then(data => {
                    document.getElementById("quote").innerHTML =
                        `"${data.quote}" <br><strong>— ${data.author}</strong>`;
                })
                .catch(() => {
                    document.getElementById("quote").innerHTML =
                        `"I can do all things through Christ who strengthens me."
                        <br><strong>— 📖 Philippians 4:13</strong>`;
                });
        });
}

// ── Intro Screen ─────────────────────
function startApp() {
    document.getElementById("introScreen").style.display = "none";
}

// Show quote on intro screen too
fetch("https://dummyjson.com/quotes/random")
    .then(response => response.json())
    .then(data => {
        document.getElementById("introQuote").innerHTML =
            `"${data.quote}" <br><strong>— ${data.author}</strong>`;
    })
    .catch(() => {
        document.getElementById("introQuote").innerHTML =
            `"I can do all things through Christ who strengthens me."
            <br><strong>— 📖 Philippians 4:13</strong>`;
    });

// --- Variables ------------------------------------------
let timer;
let isRunning = false;
let isStudyTime = true;
let totalSeconds = 25 * 60;
let sessionCount = 0;
let totalSessionSeconds = 0;

// --- Start Timer --------------------------------------------
function startTimer() {
    if (isRunning) return;
    isRunning = true;

    if (totalSeconds === 0 || totalSeconds === undefined) {
        if (isStudyTime) {
            totalSeconds = parseInt(document.getElementById("studyTime").value) * 60;
        } else {
            totalSeconds = parseInt(document.getElementById("breakTime").value) * 60;
        }
    }

    totalSessionSeconds = totalSeconds; // ← add this
    showQuote();
    updateProgressBar();  // ← add this

    timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            isRunning = false;
            switchMode();
            return;
        }
        totalSeconds--;
        updateDisplay();
        updateProgressBar(); // ← add this
    }, 1000);
}

// ── Pause Timer ──────────────────────────
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// ── Reset Timer ──────────────────────────
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isStudyTime = true;
    totalSeconds = parseInt(document.getElementById("studyTime").value) * 60;
    updateDisplay();
    document.getElementById("status").textContent = "🟢 Study Time!";
    document.getElementById("quote").innerHTML = "Press START to begin!";
}

// --- Progress Bar -----------------------------
function updateProgressBar() {
    const percent = (totalSeconds / totalSessionSeconds) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

// ── Update Display ───────────────────────
function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    document.getElementById("timer").textContent =
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ── Dark/Light Mode ───────────────────
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const btn = document.getElementById("themeToggle");
    if (document.body.classList.contains("light-mode")) {
        btn.textContent = "☀️ Light Mode";
    } else {
        btn.textContent = "🌙 Dark Mode";
    }
}

// ── Switch between Study and Break ───────
function switchMode() {
    playAlert();
    isStudyTime = !isStudyTime;
    if (isStudyTime) {
        sessionCount++; // ← add this line
        document.getElementById("sessionCount").textContent = sessionCount;
        document.getElementById("status").textContent = "🟢 Study Time!";
        totalSeconds = parseInt(document.getElementById("studyTime").value) * 60;
        showQuote();
        alert("Break is over! Time to study! 📚");
    } else {
        document.getElementById("status").textContent = "🔵 Break Time!";
        totalSeconds = parseInt(document.getElementById("breakTime").value) * 60;
        showQuote();
        alert("Great job! Take a break! ☕");
    }
    updateDisplay();
    startTimer();
}
// ── Sound Alert ──────────────────────
function playAlert() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.5);
}

// ── Change Music ─────────────────────────
function changeMusic(videoId) {
    document.getElementById("musicPlayer").src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// ── Init ─────────────────────────────────
showQuote();
updateDisplay();