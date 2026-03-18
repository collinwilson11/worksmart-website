(function () {
  const QUICK_REPLIES = [
    "What services do you offer?",
    "How much does it cost?",
    "How does it work?",
    "Book a free call",
  ];

  const history = [];
  let isOpen = false;

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #ws-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #2E8B57, #267a4d);
      box-shadow: 0 4px 20px rgba(46,139,87,0.5);
      cursor: pointer; border: none;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; transition: transform 0.2s;
    }
    #ws-bubble:hover { transform: scale(1.08); }

    #ws-panel {
      position: fixed; bottom: 92px; right: 24px; z-index: 99998;
      width: min(380px, calc(100vw - 32px));
      background: #0A1F3D;
      border: 1px solid rgba(46,139,87,0.4);
      border-radius: 18px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      display: none; flex-direction: column;
      overflow: hidden;
      font-family: 'DM Sans', 'Segoe UI', sans-serif;
      max-height: min(560px, calc(100vh - 120px));
    }
    #ws-panel.open { display: flex; }

    #ws-header {
      background: linear-gradient(135deg, #0A1F3D, #0d2a52);
      border-bottom: 2px solid #2E8B57;
      padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #ws-header-left { display: flex; align-items: center; gap: 10px; }
    #ws-avatar {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, #2E8B57, #3aad6e);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    #ws-name { color: #fff; font-weight: 700; font-size: 14px; }
    #ws-status { color: #2E8B57; font-size: 10px; font-weight: 500; letter-spacing: 0.5px; }
    #ws-close {
      background: rgba(255,255,255,0.08); border: none; border-radius: 6px;
      color: rgba(255,255,255,0.6); cursor: pointer; font-size: 16px;
      width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    }
    #ws-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

    #ws-messages {
      flex: 1; overflow-y: auto; padding: 16px 14px 8px;
      display: flex; flex-direction: column; gap: 12px;
    }
    #ws-messages::-webkit-scrollbar { width: 3px; }
    #ws-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

    .ws-msg { display: flex; align-items: flex-end; gap: 7px; }
    .ws-msg.user { justify-content: flex-end; }
    .ws-msg-avatar {
      width: 26px; height: 26px; border-radius: 6px; flex-shrink: 0;
      background: linear-gradient(135deg, #2E8B57, #3aad6e);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff;
    }
    .ws-bubble-text {
      max-width: 82%; padding: 10px 13px;
      font-size: 13px; line-height: 1.5; color: #fff;
    }
    .ws-bubble-text.assistant {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px 14px 14px 3px;
    }
    .ws-bubble-text.user {
      background: linear-gradient(135deg, #2E8B57, #267a4d);
      border-radius: 14px 14px 3px 14px;
    }

    #ws-typing { display: none; }
    #ws-typing.show { display: flex; }
    .ws-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #2E8B57;
      animation: ws-bounce 1.2s infinite;
    }
    .ws-dot:nth-child(2) { animation-delay: 0.2s; }
    .ws-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ws-bounce { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)} }

    #ws-quick {
      padding: 0 14px 8px; display: flex; gap: 6px; overflow-x: auto; flex-shrink: 0;
    }
    #ws-quick::-webkit-scrollbar { display: none; }
    .ws-qr {
      background: rgba(46,139,87,0.12); border: 1px solid rgba(46,139,87,0.3);
      color: #5dba80; border-radius: 20px; padding: 5px 12px;
      font-size: 11px; font-weight: 500; cursor: pointer; white-space: nowrap;
      flex-shrink: 0; font-family: inherit;
    }
    .ws-qr:hover { background: rgba(46,139,87,0.22); }

    #ws-input-row {
      padding: 0 14px 14px; display: flex; gap: 8px; flex-shrink: 0;
    }
    #ws-input {
      flex: 1; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px; padding: 10px 13px;
      color: #fff; font-size: 13px; outline: none; font-family: inherit;
    }
    #ws-input::placeholder { color: rgba(255,255,255,0.3); }
    #ws-send {
      background: linear-gradient(135deg, #2E8B57, #267a4d);
      border: none; border-radius: 10px; width: 40px; cursor: pointer;
      font-size: 16px; color: #fff; flex-shrink: 0;
    }
    #ws-send:disabled { opacity: 0.4; cursor: default; }

    #ws-footer {
      padding: 8px 14px; border-top: 1px solid rgba(255,255,255,0.06);
      text-align: center; color: rgba(255,255,255,0.25); font-size: 10px; flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────────────────────
  const panel = document.createElement("div");
  panel.id = "ws-panel";
  panel.innerHTML = `
    <div id="ws-header">
      <div id="ws-header-left">
        <div id="ws-avatar">W</div>
        <div>
          <div id="ws-name">WorkSmart SC</div>
          <div id="ws-status">● AI AGENT ONLINE</div>
        </div>
      </div>
      <button id="ws-close">✕</button>
    </div>
    <div id="ws-messages">
      <div class="ws-msg">
        <div class="ws-msg-avatar">W</div>
        <div class="ws-bubble-text assistant">Hey! 👋 I'm the WorkSmart SC AI assistant. We help Upstate SC businesses automate scheduling, communications, and admin work. What can I help you with?</div>
      </div>
      <div class="ws-msg" id="ws-typing">
        <div class="ws-msg-avatar">W</div>
        <div class="ws-bubble-text assistant" style="display:flex;gap:5px;align-items:center;">
          <div class="ws-dot"></div><div class="ws-dot"></div><div class="ws-dot"></div>
        </div>
      </div>
    </div>
    <div id="ws-quick"></div>
    <div id="ws-input-row">
      <input id="ws-input" type="text" placeholder="Ask us anything..." />
      <button id="ws-send">→</button>
    </div>
    <div id="ws-footer">WorkSmart SC · Greenville, SC · 864-419-4713</div>
  `;

  const bubble = document.createElement("button");
  bubble.id = "ws-bubble";
  bubble.innerHTML = "💬";
  bubble.title = "Chat with WorkSmart SC";

  document.body.appendChild(panel);
  document.body.appendChild(bubble);

  // ── QUICK REPLIES ────────────────────────────────────────────────────────────
  const qrContainer = document.getElementById("ws-quick");
  QUICK_REPLIES.forEach((r) => {
    const btn = document.createElement("button");
    btn.className = "ws-qr";
    btn.textContent = r;
    btn.onclick = () => send(r);
    qrContainer.appendChild(btn);
  });

  // ── TOGGLE ───────────────────────────────────────────────────────────────────
  bubble.onclick = () => {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    bubble.innerHTML = isOpen ? "✕" : "💬";
    if (isOpen) document.getElementById("ws-input").focus();
  };
  document.getElementById("ws-close").onclick = () => {
    isOpen = false;
    panel.classList.remove("open");
    bubble.innerHTML = "💬";
  };

  // ── SEND ─────────────────────────────────────────────────────────────────────
  document.getElementById("ws-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
  document.getElementById("ws-send").onclick = () => send();

  function escapeHtml(text) {
    return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  }

  function appendMessage(role, content) {
    const messages = document.getElementById("ws-messages");
    const typing = document.getElementById("ws-typing");
    const div = document.createElement("div");
    div.className = `ws-msg ${role}`;
    if (role === "assistant") {
      div.innerHTML = `<div class="ws-msg-avatar">W</div><div class="ws-bubble-text assistant">${escapeHtml(content)}</div>`;
    } else {
      div.innerHTML = `<div class="ws-bubble-text user">${escapeHtml(content)}</div>`;
    }
    messages.insertBefore(div, typing);
    messages.scrollTop = messages.scrollHeight;
  }

  async function send(text) {
    const input = document.getElementById("ws-input");
    const sendBtn = document.getElementById("ws-send");
    const typing = document.getElementById("ws-typing");
    const userText = text || input.value.trim();
    if (!userText) return;
    input.value = "";
    sendBtn.disabled = true;

    appendMessage("user", userText);
    history.push({ role: "user", content: userText });
    typing.classList.add("show");
    document.getElementById("ws-messages").scrollTop = 99999;

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, something went wrong!";
      typing.classList.remove("show");
      appendMessage("assistant", reply);
      history.push({ role: "assistant", content: reply });
    } catch (e) {
      typing.classList.remove("show");
      const fallback = "Sorry about that! Call Collin at 864-419-4713 or email collin@worksmartsc.com.";
      appendMessage("assistant", fallback);
      history.push({ role: "assistant", content: fallback });
    } finally {
      sendBtn.disabled = false;
    }
  }
})();
