
/* =====================================
   SAFIN AKAZY — BIRTHDAY WEBSITE
   Frontend JavaScript
   Backend: PythonAnywhere
===================================== */

// 1. BACKEND CONFIGURATION
const API_URL = "https://jkham72.pythonanywhere.com";

// 2. BIRTHDAY DATE
const BIRTHDAY = new Date("2026-10-05T00:00:00+05:30");

// 3. SELECT HTML ELEMENTS
const form = document.getElementById("wishForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// 4. TOAST NOTIFICATION
function showToast(message, success = true) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "15px 22px",
    borderRadius: "14px",
    background: success ? "#123b2b" : "#4a1717",
    color: "#fff",
    fontSize: "14px",
    zIndex: "99999",
    boxShadow: "0 5px 25px #0005",
    textAlign: "center",
    maxWidth: "90%",
    transition: "0.3s"
  });

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    toast.remove();
  }, 3500);
}

// 5. COUNTDOWN TIMER
function updateCountdown() {
  const now = new Date();
  const difference = BIRTHDAY.getTime() - now.getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (difference <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// 6. SEND WISH TO BACKEND
if (form) {
  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim() || "";
    const message = messageInput?.value.trim();

    if (!name || !message) {
      showToast("Please fill your name and message.", false);
      return;
    }

    if (name.length > 80 || message.length > 1000) {
      showToast("Please shorten your message.", false);
      return;
    }

    const oldText = sendBtn?.textContent;

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending your wish...";
    }

    try {
      const response = await fetch(`${API_URL}/wish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      showToast("🎉 Your wish has been sent successfully!");

      form.reset();

      // Celebration effect if canvas-confetti is loaded
      if (typeof confetti === "function") {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 }
        });
      }

    } catch (error) {
      console.error("Backend error:", error);

      showToast(
        "Unable to send wish. Please try again.",
        false
      );

    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = oldText || "Send Wish";
      }
    }
  });
}

// 7. FLOATING STARS
function createStars() {
  const container = document.querySelector(".stars");

  if (!container) return;

  for (let i = 0; i < 35; i++) {
    const star = document.createElement("span");

    star.textContent = "✦";

    Object.assign(star.style, {
      position: "absolute",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      opacity: Math.random() * 0.7 + 0.2,
      fontSize: Math.random() * 12 + 5 + "px",
      color: "#e8c879",
      pointerEvents: "none"
    });

    container.appendChild(star);
  }
}

createStars();

// 8. CONSOLE BRANDING
console.log(
  "%c🎂 SAFIN AKAZY BIRTHDAY WEBSITE",
  "color:#e8c879;font-size:18px;font-weight:bold;"
);

console.log("Backend:", API_URL);
console.log("Status: Frontend loaded successfully");
