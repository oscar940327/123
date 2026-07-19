#!/usr/bin/env bash
# 複製 iOS 捷徑「取得 URL 內容」對後端送的 HTTP 請求，用來驗證後端接點。
# 用法：
#   ./test-request.sh https://api.hakkaren.uk chat.png   # 真的判讀一張截圖
#   ./test-request.sh http://localhost:8000              # demo 模式（免圖、免金鑰）
set -euo pipefail

BASE="${1:-http://localhost:8000}"
IMG="${2:-}"

if [[ -n "$IMG" ]]; then
  # 等同捷徑：POST 表單、image 為檔案、locale 文字欄位
  curl -s -X POST "$BASE/api/wingman" \
    -F "image=@$IMG" \
    -F "locale=zh-TW" | python3 -m json.tool --no-ensure-ascii
else
  # demo 模式：驗證整條路徑不需金鑰
  curl -s -X POST "$BASE/api/wingman" \
    -F "demo=true" -F "locale=zh-TW" | python3 -m json.tool --no-ensure-ascii
fi
