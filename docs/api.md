# API 合約（前後端共同參考）

後端負責人：bath。此合約敲定後，前端（Android / iOS 捷徑）可先用假資料
並行開發，不必等後端完成。**改這份要先講**，因為兩端都依賴它。

## 為什麼要中轉後端

- **保護金鑰**：iOS 捷徑（隨 iCloud 連結外洩）與 Android APK 都不能寫死
  OpenAI key；key 只留在後端
- **集中 prompt**：C 調的 system prompt 放後端，iOS/Android 共用，改 prompt
  不用重發客戶端
- **demo 模式**：斷網/API 掛時後端直接回寫死範本

## 端點

### `POST /api/wingman`

**請求**（擇一）：
- JSON：`{ "image": "<base64 PNG>", "locale": "zh-TW", "demo": false }`
- 或 multipart/form-data：`image` 檔案欄位 + `locale` 欄位

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| image | string(base64) 或檔案 | 是 | 聊天畫面截圖；建議客戶端先壓到寬 ≤1080 / JPEG，避免逾時 |
| locale | string | 否 | 預設 `zh-TW` |
| demo | bool | 否 | `true` 時回寫死範本，不打 API |

**回應 200**：
```json
{
  "chat_death_index": 72,
  "context": "對方在敷衍，話題快斷了",
  "replies": [
    { "style": "認真", "text": "...", "why": "為什麼這樣回的一句軍師解說" },
    { "style": "幽默", "text": "...", "why": "..." },
    { "style": "曖昧", "text": "...", "why": "..." }
  ]
}
```

| 欄位 | 型別 | 說明 |
|---|---|---|
| chat_death_index | int 0-100 | 聊死指數，前端做成儀表板；越高越快聊死 |
| context | string | 一句話語境判讀 |
| replies | array(3) | 固定三個，順序：認真 / 幽默 / 曖昧 |
| replies[].style | string | `認真` \| `幽默` \| `曖昧` |
| replies[].text | string | 可直接送出的回覆內容 |
| replies[].why | string | 軍師解說（差異化重點，勿省略） |

**錯誤**：`{ "error": "..." }` + 4xx/5xx。客戶端收到錯誤時退回 demo 範本或提示重試。

## 約定

- 後端一律回上面的 JSON 結構；vision 模型的原始輸出由後端負責解析成此格式，
  客戶端不碰 OpenAI 回應結構
- `replies` 永遠回 3 筆、順序固定，前端可直接對應三張卡片 / 捷徑三選項
- 逾時建議 30s；圖片過大先壓縮（見 image 欄位）

## 實作備註（後端自行決定技術棧）

- 既有 `line-codex` 是 Flask/Python，沿用最快；金鑰與 prompt 放環境變數
- 可掛在既有 kernel / api.hakkaren.uk 管線上
- system prompt 由 C 提供，後端保留一個 `demo` 範本常數
