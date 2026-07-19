"""聊天軍師後端 — 實作 docs/api.md 的 POST /api/wingman。

收聊天截圖 → GPT-4o vision 判讀 → 回固定 JSON（聊死指數 + 三風格回覆 + 軍師解說）。
金鑰與 prompt 留在伺服器端，客戶端（Android / iOS 捷徑）不碰 OpenAI。
"""
import base64
import json
import os

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

from prompt import DEMO_RESPONSE, SYSTEM_PROMPT

app = Flask(__name__)
app.json.ensure_ascii = False  # 回傳中文不轉義，方便除錯
CORS(app)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
MODEL = os.environ.get("WINGMAN_MODEL", "gpt-4o")
TIMEOUT = int(os.environ.get("WINGMAN_TIMEOUT", "30"))
STYLES = ["認真", "幽默", "曖昧"]


def _normalize_image(raw):
    """把請求的 image 欄位轉成 data URL。接受 base64 字串或 data URL。"""
    if not raw:
        return None
    if raw.startswith("data:"):
        return raw
    return "data:image/png;base64," + raw


def _call_vision(data_url, locale):
    """打 GPT-4o vision，回 dict（已解析）。失敗丟例外。"""
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"locale={locale}。請判讀這張聊天截圖並依規則回 JSON。"},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            },
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 800,
    }
    resp = requests.post(
        OPENAI_URL,
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
        json=payload,
        timeout=TIMEOUT,
    )
    resp.raise_for_status()
    content = resp.json()["choices"][0]["message"]["content"]
    return json.loads(content)


def _coerce(data):
    """把模型輸出強制對齊 API 合約：三筆 replies、順序固定、欄位補齊。"""
    replies_in = {r.get("style"): r for r in data.get("replies", []) if isinstance(r, dict)}
    replies = []
    for style in STYLES:
        r = replies_in.get(style, {})
        replies.append({
            "style": style,
            "text": str(r.get("text", "")).strip(),
            "why": str(r.get("why", "")).strip(),
        })
    idx = data.get("chat_death_index", 50)
    try:
        idx = max(0, min(100, int(idx)))
    except (TypeError, ValueError):
        idx = 50
    return {
        "chat_death_index": idx,
        "context": str(data.get("context", "")).strip(),
        "replies": replies,
    }


@app.route("/api/wingman", methods=["POST"])
def wingman():
    # 支援 JSON 與 multipart 兩種請求（見 docs/api.md）
    if request.content_type and "multipart/form-data" in request.content_type:
        locale = request.form.get("locale", "zh-TW")
        demo = request.form.get("demo", "false").lower() == "true"
        file = request.files.get("image")
        image = base64.b64encode(file.read()).decode() if file else None
    else:
        body = request.get_json(silent=True) or {}
        locale = body.get("locale", "zh-TW")
        demo = bool(body.get("demo", False))
        image = body.get("image")

    if demo:
        return jsonify(DEMO_RESPONSE)

    data_url = _normalize_image(image)
    if not data_url:
        return jsonify({"error": "missing image"}), 400
    if not OPENAI_API_KEY:
        return jsonify({"error": "server missing OPENAI_API_KEY"}), 500

    try:
        raw = _call_vision(data_url, locale)
        return jsonify(_coerce(raw))
    except requests.Timeout:
        return jsonify({"error": "vision timeout"}), 504
    except Exception as e:  # noqa: BLE001 — hackathon: 統一回錯讓客戶端退 demo
        return jsonify({"error": str(e)}), 502


@app.route("/health")
def health():
    return jsonify({"ok": True, "model": MODEL, "has_key": bool(OPENAI_API_KEY)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8000")), debug=True)
