const PASSWORD = "486927";

let enteredPassword = "";
let currentPageIndex = 0;
let hasReadOnce = false;

let titleTypingTimer = null;
let textTypingTimer = null;

let isChangingPage = false;
let typingSession = 0;
let isTyping = false;

let envelopeOpened = false;
let floatingHeartTimer = null;

/* ================================= */
/* 📖 NỘI DUNG CÁC TRANG THƯ */
/* ================================= */

const pages = [{
    title: "Gửi cậu ❤️",
    text: `Hi cậu, lần đầu tớ làm cái này có lẽ sẽ không được mượt cho lắm nhưng mà tớ vẫn muốn gửi gắm tình cảm này của mình vào nó để chuyển đến cậu hihi.

Nếu cậu thích những kiểu như này thì sau này tớ sẽ làm nhiều thêm. Hì hì.

Tớ yêu cậu ❤️`
}];

/* ================================= */
/* 🔐 NHẬP MẬT KHẨU */
/* ================================= */

function enterNumber(number) {
    if (enteredPassword.length >= 6) return;

    enteredPassword += number;
    updatePasswordDots();

    if (enteredPassword.length === 6) {
        setTimeout(checkPassword, 300);
    }
}

function deleteNumber() {
    enteredPassword = enteredPassword.slice(0, -1);
    updatePasswordDots();
}

function updatePasswordDots() {
    const dots = document.querySelectorAll(".password-dots span");

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index < enteredPassword.length);
    });
}

function checkPassword() {
    const message = document.getElementById("passwordMessage");

    if (enteredPassword === PASSWORD) {
        message.textContent = "Đúng rồi ❤️";

        setTimeout(() => {
            document.getElementById("passwordScreen").classList.add("hidden");
            document.getElementById("envelopeScreen").classList.remove("hidden");

            startFloatingHearts();
        }, 700);
    } else {
        message.textContent = "Sai rồi nè 🥺";

        const box = document.querySelector(".password-box");
        box.classList.add("shake");

        setTimeout(() => {
            box.classList.remove("shake");
        }, 400);

        enteredPassword = "";

        setTimeout(() => {
            updatePasswordDots();
            message.textContent = "";
        }, 700);
    }
}

/* ================================= */
/* 💌 MỞ PHONG THƯ */
/* ================================= */

function openEnvelope() {
    if (envelopeOpened) return;

    envelopeOpened = true;

    const envelope = document.getElementById("envelope");
    const music = document.getElementById("bgMusic");

    if (music) {
        music.volume = 0.5;
        music.play().catch(() => {});
    }

    envelope.classList.add("open");

    setTimeout(() => {
        document.getElementById("envelopeScreen").classList.add("hidden");
        document.getElementById("letterScreen").classList.remove("hidden");

        currentPageIndex = 0;
        hasReadOnce = false;
        isChangingPage = false;

        showPage();
    }, 1200);
}

/* ================================= */
/* 📖 HIỂN THỊ TRANG */
/* ================================= */

function showPage() {
    const page = pages[currentPageIndex];

    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    typingSession++;
    const session = typingSession;

    document.getElementById("currentPage").textContent = currentPageIndex + 1;
    document.getElementById("totalPages").textContent = pages.length;

    document.getElementById("pageTitle").textContent = "";
    document.getElementById("typedText").textContent = "";

    document.getElementById("prevButton").disabled = currentPageIndex === 0;

    const isLastPage = currentPageIndex === pages.length - 1;

    document.getElementById("pageHint").textContent = isLastPage ?
        "Đọc xong rồi hãy bấm nhé ❤️" :
        "Bấm → để đọc tiếp";

    if (hasReadOnce) {
        document.getElementById("pageTitle").textContent = page.title;
        document.getElementById("typedText").textContent = page.text;

        isTyping = false;
        return;
    }

    isTyping = true;

    typeTitle(page.title, 0, session);
}

/* ================================= */
/* ⌨️ GÕ TIÊU ĐỀ */
/* ================================= */

function typeTitle(text, index, session) {
    if (session !== typingSession) return;

    if (index >= text.length) {
        typeText(pages[currentPageIndex].text, 0, session);
        return;
    }

    document.getElementById("pageTitle").textContent += text[index];

    titleTypingTimer = setTimeout(() => {
        typeTitle(text, index + 1, session);
    }, 45);
}

/* ================================= */
/* ⌨️ GÕ NỘI DUNG */
/* ================================= */

function typeText(text, index, session) {
    if (session !== typingSession) return;

    if (index >= text.length) {
        isTyping = false;
        return;
    }

    document.getElementById("typedText").textContent += text[index];

    textTypingTimer = setTimeout(() => {
        typeText(text, index + 1, session);
    }, 35);
}

/* ================================= */
/* 📖 TRANG TIẾP */
/* ================================= */

function nextPage() {
    if (isChangingPage) return;

    if (!hasReadOnce && isTyping) return;

    isChangingPage = true;

    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    if (currentPageIndex < pages.length - 1) {
        currentPageIndex++;
        showPage();
    } else {
        hasReadOnce = true;
        closeLetter();
    }

    setTimeout(() => {
        isChangingPage = false;
    }, 150);
}

/* ================================= */
/* 📖 TRANG TRƯỚC */
/* ================================= */

function previousPage() {
    if (isChangingPage) return;
    if (currentPageIndex <= 0) return;

    isChangingPage = true;

    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    currentPageIndex--;
    showPage();

    setTimeout(() => {
        isChangingPage = false;
    }, 150);
}

/* ================================= */
/* 💌 ĐÓNG LÁ THƯ */
/* ================================= */

function closeLetter() {
    document.getElementById("letterScreen").classList.add("hidden");
    document.getElementById("finalScreen").classList.remove("hidden");

    createFinalHearts();
}

/* ================================= */
/* 💌 ĐỌC LẠI THƯ */
/* ================================= */

function readLetterAgain() {
    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    typingSession++;
    isTyping = false;
    isChangingPage = false;

    currentPageIndex = 0;
    hasReadOnce = true;

    document.getElementById("finalScreen").classList.add("hidden");
    document.getElementById("letterScreen").classList.remove("hidden");

    showPage();
}

/* ================================= */
/* ❤️ TIM BAY */
/* ================================= */

function startFloatingHearts() {
    if (floatingHeartTimer) return;

    createHeart();

    floatingHeartTimer = setInterval(() => {
        createHeart();
    }, 900);
}

function createHeart() {
    const container = document.getElementById("floatingHearts");

    if (!container) return;

    const heart = document.createElement("div");

    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = 12 + Math.random() * 20 + "px";
    heart.style.animationDuration = 5 + Math.random() * 5 + "s";

    heart.style.color = Math.random() > 0.5 ?
        "#ef6aa6" :
        "#ffffff";

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

function createFinalHearts() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }
}

/* ================================= */
/* 🎵 BẬT / TẮT NHẠC */
/* ================================= */

function toggleMusic() {
    const music = document.getElementById("bgMusic");
    const button = document.getElementById("musicButton");

    if (!music || !button) return;

    if (music.paused) {
        music.play().catch(() => {});
        button.textContent = "🔊";
    } else {
        music.pause();
        button.textContent = "🔇";
    }
}