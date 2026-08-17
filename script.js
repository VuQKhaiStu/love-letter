const PASSWORD = "486927";
let enteredPassword = "";
let currentPageIndex = 0;
let typingTimer = null;
let titleTypingTimer = null;
let textTypingTimer = null;
let envelopeOpened = false;
let pageChanging = false;
let typingSession = 0;
let isTyping = false;
let hasReadOnce = false;

/* ================================= */
/* 📖 NỘI DUNG CÁC TRANG THƯ */
/* ================================= */

const pages = [{
            title: ,
            text:

                Không biết phải bắt đầu từ đâu,
            nên thôi thì cứ để những dòng chữ này
            nói thay anh nhé.
            `
    },
    
    
    
    
    {
        title: "Điều cuối cùng",
        text: `
            Nếu em đang đọc đến đây...

            Thì anh chỉ muốn nói rằng:

                Anh yêu em.

                Không phải vì em hoàn hảo.

                Mà bởi vì với anh,
            em là một người rất đặc biệt.

            ❤️
            `
    }
];

/* ================================= */
/* 🔐 NHẬP & KIỂM TRA MẬT KHẨU */
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

    music.volume = 0.5;
    music.play().catch(() => {});

    envelope.classList.add("open");

    setTimeout(() => {
        document.getElementById("envelopeScreen").classList.add("hidden");
        document.getElementById("letterScreen").classList.remove("hidden");
        currentPageIndex = 0;
        pageChanging = false;
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

    document.getElementById("currentPage").textContent = currentPageIndex + 1;
    document.getElementById("totalPages").textContent = pages.length;
    document.getElementById("pageTitle").textContent = "";
    document.getElementById("typedText").textContent = "";

    if (hasReadOnce) {
        document.getElementById("pageTitle").textContent = page.title;
        document.getElementById("typedText").textContent = page.text;
    } else {
        typeTitle(page.title, 0);

        setTimeout(() => {
            typeText(page.text, 0);
        }, page.title.length * 45 + 300);
    }

    document.getElementById("prevButton").disabled = currentPageIndex === 0;

    const isLastPage = currentPageIndex === pages.length - 1;

    document.getElementById("pageHint").textContent =
        isLastPage ?
        "Đọc xong rồi hãy bấm nhé ❤️" :
        "Bấm → để đọc tiếp";
}

/* ================================= */
/* ⌨️ HIỆU ỨNG GÕ CHỮ */
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
    }, 40);
}

function typeText(text, index, session) {
    if (session !== typingSession) return;

    if (index >= text.length) {
        isTyping = false;
        return;
    }

    document.getElementById("typedText").textContent += text[index];

    textTypingTimer = setTimeout(() => {
        typeText(text, index + 1, session);
    }, 30);
}

/* ================================= */
/* 📖 CHUYỂN TRANG */
/* ================================= */

function nextPage() {
    if (isChangingPage) return;

    isChangingPage = true;

    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    setTimeout(() => {
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            showPage();
        } else {
            hasReadOnce = true;
            closeLetter();
        }

        isChangingPage = false;
    }, hasReadOnce ? 0 : 150);
}

function previousPage() {
    if (isChangingPage) return;
    if (currentPageIndex <= 0) return;

    isChangingPage = true;

    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    setTimeout(() => {
        currentPageIndex--;
        showPage();
        isChangingPage = false;
    }, hasReadOnce ? 0 : 150);
}
/* ================================= */
/* 💌 ĐÓNG LÁ THƯ */
/* ================================= */

function closeLetter() {
    document.getElementById("letterScreen").classList.add("hidden");
    document.getElementById("finalScreen").classList.remove("hidden");
    createFinalHearts();
}

function readLetterAgain() {
    clearTimeout(typingTimer);
    clearTimeout(titleTypingTimer);
    clearTimeout(textTypingTimer);

    typingSession++;
    isTyping = false;
    pageChanging = false;
    currentPageIndex = 0;

    document.getElementById("finalScreen").classList.add("hidden");
    document.getElementById("letterScreen").classList.remove("hidden");

    showPage();
}

/* ================================= */
/* ❤️ HIỆU ỨNG TIM BAY */
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
    heart.style.color = Math.random() > 0.5 ? "#ef6aa6" : "#ffffff";

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

function readLetterAgain() {
    document.getElementById("finalScreen").classList.add("hidden");
    document.getElementById("letterScreen").classList.remove("hidden");

    currentPageIndex = 0;
    hasReadOnce = true;

    showPage();
}