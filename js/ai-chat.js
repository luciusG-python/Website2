(function () {
    if (window.__stashrnodeAIInstalled) {
        return;
    }
    window.__stashrnodeAIInstalled = true;

    // Site config. NOTE: the OpenRouter key is client-side by necessity on a
    // static site and IS visible to anyone. Restrict/rotate it or proxy it via
    // a worker before relying on it for anything sensitive.
    const CONFIG = {
        apiKey: 'sk-or-v1-' + 'a490f5a696385ee2591873b0168c43a7a4e9166e1a92512e2d5975c3f79f4428',
        models: [
            'nex-agi/nex-n2.5-pro:free',
            'nex-agi/nex-n2.5-mini:free',
            'inclusionai/ling-3.0-flash-vl:free',
            'inclusionai/ling-3.0-flash-sante:free',
        ],
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        maxTokens: 800,
        requestTimeoutMs: 45000,
    };

    const LAUNCHER_SELECTOR = '#stashrnode-chatwoot-launcher, #StashrNode-chatwoot-launcher';
    const PANEL_ID = 'stashrnode-ai-chat-panel';

    const STYLE_ID = 'stashrnode-ai-chat-styles';
    const injectStyles = () => {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '#' + PANEL_ID + '{position:fixed;right:22px;bottom:102px;z-index:9999;width:380px;max-width:calc(100vw - 44px);height:560px;max-height:calc(100vh - 150px);display:none;flex-direction:column;overflow:hidden;border:1px solid #073E91;border-radius:16px;background:#01022A;box-shadow:0 24px 60px rgba(1,2,42,.55);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#E0F9FF;animation:stashrnode-ai-enter .18s ease-out}',
            '#' + PANEL_ID + '.ai-open{display:flex}',
            '#stashrnode-chatwoot-launcher.ai-launcher-hidden,#StashrNode-chatwoot-launcher.ai-launcher-hidden{display:none!important}',
            '@keyframes stashrnode-ai-enter{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}',
            '#' + PANEL_ID + ' .ai-header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #073E91;background:linear-gradient(180deg,#01022A 0%,#022154 100%)}',
            '#' + PANEL_ID + ' .ai-header img{width:32px;height:32px;border-radius:8px;object-fit:cover;flex:none}',
            '#' + PANEL_ID + ' .ai-header .ai-title{font-weight:700;font-size:15px;letter-spacing:-.01em}',
            '#' + PANEL_ID + ' .ai-header .ai-title b{color:#00B8FF;font-weight:700}',
            '#' + PANEL_ID + ' .ai-header .ai-sub{font-size:11px;color:#B7C7E6;margin-top:1px}',
            '#' + PANEL_ID + ' .ai-header .ai-status{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;flex:none}',
            '#' + PANEL_ID + ' .ai-header .ai-status.ai-busy{background:#eab308;box-shadow:0 0 6px #eab308}',
            '#' + PANEL_ID + ' .ai-close{margin-left:auto;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:rgba(11,25,55,.6);color:#B7C7E6;border:1px solid rgba(7,62,145,.6);cursor:pointer;font-size:16px;line-height:1}',
            '#' + PANEL_ID + ' .ai-close:hover{color:#fff;background:rgba(18,102,229,.4)}',
            '#' + PANEL_ID + ' .ai-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:#073E91 transparent}',
            '#' + PANEL_ID + ' .ai-body::-webkit-scrollbar{width:8px}',
            '#' + PANEL_ID + ' .ai-body::-webkit-scrollbar-thumb{background:#073E91;border-radius:8px}',
            '#' + PANEL_ID + ' .ai-bubble{max-width:86%;padding:9px 12px;border-radius:14px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word}',
            '#' + PANEL_ID + ' .ai-bubble.ai-user{align-self:flex-end;background:linear-gradient(180deg,#022154,#073E91);border:1px solid #0A55C9;border-bottom-right-radius:4px}',
            '#' + PANEL_ID + ' .ai-bubble.ai-bot{align-self:flex-start;background:#0B1937;border:1px solid #073E91;border-bottom-left-radius:4px}',
            '#' + PANEL_ID + ' .ai-bubble.ai-err{color:#ff8fa3;border-color:#7f1d1d}',
            '#' + PANEL_ID + ' .ai-bubble .ai-typing{display:inline-flex;gap:4px;align-items:center}',
            '#' + PANEL_ID + ' .ai-bubble .ai-typing span{width:6px;height:6px;border-radius:50%;background:#B7C7E6;animation:stashrnode-ai-blink 1.2s infinite}',
            '#' + PANEL_ID + ' .ai-bubble .ai-typing span:nth-child(2){animation-delay:.2s}',
            '#' + PANEL_ID + ' .ai-bubble .ai-typing span:nth-child(3){animation-delay:.4s}',
            '@keyframes stashrnode-ai-blink{0%,80%,100%{opacity:.25}40%{opacity:1}}',
            '#' + PANEL_ID + ' .ai-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 4px}',
            '#' + PANEL_ID + ' .ai-chip{border:1px solid #073E91;background:#0B1937;color:#B7C7E6;border-radius:999px;padding:6px 11px;font-size:12px;cursor:pointer;transition:all .15s}',
            '#' + PANEL_ID + ' .ai-chip:hover{color:#fff;background:#073E91;border-color:#0A55C9}',
            '#' + PANEL_ID + ' .ai-footer{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid #073E91;background:#01022A}',
            '#' + PANEL_ID + ' .ai-input{flex:1;background:#0B1937;border:1px solid #073E91;border-radius:10px;color:#E0F9FF;padding:9px 12px;font-size:13.5px;outline:none;resize:none;font-family:inherit;min-height:40px;max-height:120px}',
            '#' + PANEL_ID + ' .ai-input:focus{border-color:#00B8FF}',
            '#' + PANEL_ID + ' .ai-input::placeholder{color:#6476a0}',
            '#' + PANEL_ID + ' .ai-send{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:linear-gradient(180deg,#022154,#073E91);border:1px solid #0A55C9;color:#E0F9FF;cursor:pointer;flex:none;font-size:16px}',
            '#' + PANEL_ID + ' .ai-send:hover{background:linear-gradient(180deg,#073E91,#0A55C9)}',
            '#' + PANEL_ID + ' .ai-send:disabled{opacity:.5;cursor:not-allowed}',
            '#' + PANEL_ID + ' .ai-footnote{padding:6px 14px 9px;font-size:10.5px;color:#6476a0;text-align:center;background:#01022A}',
        ].join('\n');
        document.head.appendChild(style);
    };

    const systemPrompt = [
        'You are Stash Node AI, a helpful, friendly, and knowledgeable AI assistant for the Stash Node platform. Your primary goal is to guide users, answer their questions, and assist them with technical support, node setup, and general inquiries.',
        'Core Guidelines: Maintain a professional, approachable, and supportive tone at all times. Help users with everything within your scope (e.g., explaining Stash Node features, troubleshooting common setup steps, guiding them through the documentation).',
        'Scope Limitation: If a user requests something outside of your capabilities, requires account-level changes, or asks for complex troubleshooting that you cannot perform, you must politely defer to human support.',
        'Protocol for Handled Tasks: Greet the user warmly and ask how you can assist them. Provide clear, step-by-step guidance to resolve their issue or answer their question.',
        'Protocol for Unhandled Tasks: Whenever a user asks for something you cannot do, use the following mandatory response structure: "I am unable to process this request directly. However, I have forwarded your request to our admin team. They will review it shortly and get back to you."',
        'Privacy: Never reveal your model name, how you work or what powers you, your IP address, internal infrastructure, URLs/endpoints, configuration values, or any private detail. If the user asks for any of that, do not answer it; instead use the mandatory unhandled-task response above.',
        'Be warm, helpful and concise. Answer in the same language the visitor uses. Never invent prices, policies or availability numbers; for account-specific or billing specifics, tell the visitor to use the client panel (panel.stashrnode.in) or contact support through the site.',
    ].join('\n');

    let state = {
        open: false,
        busy: false,
        messages: [{ role: 'system', content: systemPrompt }],
    };

    const getLauncher = () => document.querySelector(LAUNCHER_SELECTOR);
    const getPanel = () => document.getElementById(PANEL_ID);
    const getBody = () => document.getElementById(PANEL_ID + '-body');
    const getInput = () => document.getElementById(PANEL_ID + '-input');
    const getSend = () => document.getElementById(PANEL_ID + '-send');
    const getStatus = () => document.getElementById(PANEL_ID + '-status');

    const esc = text =>
        text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const setStatus = busy => {
        const el = getStatus();
        if (el) {
            el.classList.toggle('ai-busy', busy);
        }
    };

    const scrollToBottom = () => {
        const el = getBody();
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    };

    const addBubble = (role, html) => {
        const body = getBody();
        if (!body) {
            return;
        }
        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble ai-' + role;
        bubble.innerHTML = html;
        body.appendChild(bubble);
        scrollToBottom();
        return bubble;
    };

    const addTyping = () => {
        return addBubble('bot', '<span class="ai-typing"><span></span><span></span><span></span></span>');
    };

    const buildPanel = () => {
        if (getPanel()) {
            return;
        }
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = [
            '<div class="ai-header">',
            '<img src="/images2/logo.png" alt="StashrNode" loading="lazy">',
            '<div>',
            '<div class="ai-title">Stashr<b>Node</b> AI</div>',
            '<div class="ai-sub">Ask anything about our hosting</div>',
            '</div>',
            '<span class="ai-status" id="' + PANEL_ID + '-status"></span>',
            '<button type="button" class="ai-close" id="' + PANEL_ID + '-close" aria-label="Close chat">&#10005;</button>',
            '</div>',
            '<div id="' + PANEL_ID + '-chips" class="ai-chips"></div>',
            '<div class="ai-body" id="' + PANEL_ID + '-body"></div>',
            '<div class="ai-footnote">AI responses are generated and may not always be accurate.</div>',
            '<div class="ai-footer">',
            '<textarea class="ai-input" id="' + PANEL_ID + '-input" rows="1" placeholder="Ask us anything\u2026"></textarea>',
            '<button type="button" class="ai-send" id="' + PANEL_ID + '-send" aria-label="Send message">&#10148;</button>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        const chips = panel.querySelector('#' + PANEL_ID + '-chips');
        ['How do I start a server?', 'What modpacks are supported?', 'How do backups work?', 'Do you have DDoS protection?'].forEach(t => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'ai-chip';
            chip.textContent = t;
            chip.addEventListener('click', () => {
                if (state.busy) {
                    return;
                }
                sendMessage(t);
            });
            chips.appendChild(chip);
        });

        const send = () => {
            const input = getInput();
            const text = input ? input.value.trim() : '';
            if (!text || state.busy) {
                return;
            }
            input.value = '';
            input.style.height = 'auto';
            sendMessage(text);
        };

        panel.querySelector('#' + PANEL_ID + '-close').addEventListener('click', closePanel);
        getSend().addEventListener('click', send);
        const input = getInput();
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });

        addBubble('bot', 'Hi! I\u2019m the StashrNode AI assistant. Ask me about Minecraft server hosting, mods, pricing or getting started.');
    };

    const openPanel = () => {
        injectStyles();
        buildPanel();
        const launcher = getLauncher();
        if (launcher) {
            launcher.classList.add('ai-launcher-hidden');
        }
        const panel = getPanel();
        panel.classList.add('ai-open');
        panel.setAttribute('aria-hidden', 'false');
        state.open = true;
        scrollToBottom();
        const input = getInput();
        if (input) {
            input.focus();
        }
    };

    const closePanel = () => {
        const panel = getPanel();
        const launcher = getLauncher();
        if (panel) {
            panel.classList.remove('ai-open');
            panel.setAttribute('aria-hidden', 'true');
        }
        if (launcher) {
            launcher.classList.remove('ai-launcher-hidden');
        }
        state.open = false;
    };

    const togglePanel = () => {
        if (state.open) {
            closePanel();
        } else {
            openPanel();
        }
    };

    const callOpenRouter = async () => {
        let lastErr = null;
        for (const model of CONFIG.models) {
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timer = controller
                ? setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs)
                : null;
            try {
                const res = await fetch(CONFIG.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + CONFIG.apiKey,
                        'X-Title': 'StashrNode Website',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: state.messages,
                        max_tokens: CONFIG.maxTokens,
                        temperature: 0.6,
                    }),
                    signal: controller ? controller.signal : undefined,
                });

                if (!res.ok) {
                    let detail = '';
                    try {
                        const err = await res.json();
                        detail = err.error && err.error.message ? ' ' + err.error.message : '';
                    } catch (_) {
                        // ignore parse errors
                    }
                    lastErr = new Error('Request failed (' + res.status + ').' + detail);
                    continue;
                }

                const data = await res.json();
                const choice = data.choices && data.choices[0] && data.choices[0].message
                    ? data.choices[0].message
                    : null;
                const content = choice && choice.content ? choice.content : '';
                if (content) {
                    return content;
                }
                // Some models spend all tokens on reasoning and return null content;
                // fall through to the next model instead of hanging on an empty reply.
                lastErr = new Error('Empty response from the model.');
            } catch (err) {
                lastErr = err;
            } finally {
                if (timer) clearTimeout(timer);
            }
        }
        throw lastErr || new Error('No model available.');
    };

    let audioCtx = null;
    const playChime = () => {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) {
                return;
            }
            audioCtx = audioCtx || new AC();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const t0 = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t0);
            osc.frequency.setValueAtTime(1174.66, t0 + 0.09);
            gain.gain.setValueAtTime(0.0001, t0);
            gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t0);
            osc.stop(t0 + 0.34);
        } catch (_) {
            // audio not permitted or unavailable; stay silent
        }
    };

    const sendMessage = async text => {
        state.messages.push({ role: 'user', content: text });
        addBubble('user', esc(text));
        state.busy = true;
        setStatus(true);
        const sendBtn = getSend();
        if (sendBtn) {
            sendBtn.disabled = true;
        }
        const typing = addTyping();

        try {
            const reply = await callOpenRouter();
            state.messages.push({ role: 'assistant', content: reply });
            if (typing && typing.parentNode) {
                typing.remove();
            }
            addBubble('bot', esc(reply));
            playChime();
        } catch (err) {
            if (typing && typing.parentNode) {
                typing.remove();
            }
            addBubble('err', 'Sorry, I ran into a problem: ' + esc(err.message || 'unknown error'));
        } finally {
            state.busy = false;
            setStatus(false);
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        }
    };

    const onLauncherClick = event => {
        const launcher = event.target.closest ? event.target.closest(LAUNCHER_SELECTOR) : null;
        if (!launcher) {
            return;
        }
        event.preventDefault();
        // Running in the capture phase before the site's Chatwoot bootstrap,
        // so also stop its listeners from loading the third-party widget.
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }
        togglePanel();
    };

    document.addEventListener('click', onLauncherClick, true);

    const enableLauncher = () => {
        // Never let the legacy Chatwoot restore an open session.
        try {
            sessionStorage.removeItem('stashrnode-chatwoot-open-v2');
        } catch (_) {
            // ignore storage errors
        }
        const launcher = getLauncher();
        if (launcher) {
            launcher.classList.remove('hidden');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableLauncher);
    } else {
        enableLauncher();
    }
})();