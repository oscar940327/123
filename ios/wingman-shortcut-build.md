# iOS 捷徑建構指南（打後端版）

因為有了後端，iOS 捷徑**不用放 OpenAI key**——只打我們自己的 `/api/wingman`。
這是可靠路徑：有 iPhone 的人照著建，約 10 分鐘。捷徑送的 HTTP 請求可先用
[`test-request.sh`](test-request.sh) 對後端驗證（已實測與捷徑的 multipart 上傳等價）。

## 流程總覽

```
敲擊背面兩下 → 擷取螢幕畫面 → POST 圖到 /api/wingman
→ 解析三風格回覆 → 選單選一個 → 複製到剪貼簿 → 回聊天長按貼上
```

## 前置

- 後端已部署、有公開 URL（如 `https://api.hakkaren.uk`）
- 設定 → 捷徑 → 進階 → 允許不受信任的捷徑（若要匯入 plist）

## 動作逐步（在捷徑 app 新增）

1. **文字 (Text)**：輸入後端網址，例如 `https://api.hakkaren.uk`
   → 接 **設定變數 (Set Variable)** 命名 `BASE`
   （之後要換網址只改這一格；分享時對這格加「匯入問題」讓對方填自己的後端）

2. **擷取螢幕畫面 (Take Screenshot)**
   截的是觸發當下的聊天畫面。**務必用敲擊背面觸發**，不要用 Siri。

3. **取得 URL 內容 (Get Contents of URL)**
   - URL：`BASE`（變數）後面接 `/api/wingman` → 即 `[BASE]/api/wingman`
   - 展開 → 方法：**POST**
   - 要求主體：**表單 (Form)**
     - 新增欄位 `image`，型別選 **檔案**，值 = 上一步的「螢幕畫面」
     - 新增欄位 `locale`，型別文字，值 `zh-TW`
   > 後端吃 multipart 檔案上傳，已實測可用。

4. 解析回應（回應是 JSON，捷徑自動當字典）——用 **取得字典值 (Get Dictionary Value)** 各抓一次，記得設成變數：
   | Get Value for（鍵路徑） | Set Variable |
   |---|---|
   | `chat_death_index` | `指數` |
   | `replies.1.text` | `認真` |
   | `replies.2.text` | `幽默` |
   | `replies.3.text` | `曖昧` |
   > 鍵路徑用點記法，**陣列索引從 1 起算**（不是 0）。來源都選「取得 URL 內容」。

5. **從選單選擇 (Choose from Menu)**
   - 提示：`軍師建議（聊死指數 [指數]）`　←「指數」放變數
   - 三個選項，標籤放變數：
     - `🎯 認真：[認真]`
     - `😏 幽默：[幽默]`
     - `💘 曖昧：[曖昧]`

6. 每個選項底下各放：
   - **拷貝到剪貼簿 (Copy to Clipboard)** = 對應變數（認真/幽默/曖昧）
   - **顯示通知 (Show Notification)**：`已複製，回聊天長按貼上 👍`

## 綁定觸發

設定 → 輔助使用 → 觸控 → 敲擊背面 → 點兩下 → 選此捷徑。
**iOS 18+：關掉「顯示橫幅 (Show Banner)」**，否則橫幅會被截進畫面。

## Demo 保底

現場網路爛時，把第 3 步 Form 加一個欄位 `demo` = `true`，後端直接回寫死範本，
整條流程照跑不打 API。demo 演完再拔掉這欄。

## 已知坑（來自研究報告 II）

- 不要用 Siri 觸發（會截到 Siri 介面）；不要依賴小白點（可能入鏡）
- 全螢幕 PNG 較大，若逾時：在第 2、3 步之間插「調整影像大小」寬 1080
- 分享捷徑務必用「匯入問題」清掉 BASE，避免連到你的私有後端
