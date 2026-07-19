# 深度研究報告 II：iOS 捷徑路線實作指南（2026-07-19）

> 方法：多來源搜尋 + 每條 claim 3 票對抗式驗證。結論：**可行，有活的先例**，
> 但觸發方式要改——用「敲擊背面」而不是小白點。

## 結論先講

「截圖 → vision API → 三風格回覆 → 剪貼簿」免寫 app 完全做得到，
而且**沒有人做過聊天回覆/rizz 用途的公開捷徑——這個利基是空的**。
可直接參考的同構先例：

- **AppleVis「Describe Screenshot」**（2024-01，盲人社群用）：Take Screenshot
  → GPT-4o vision 描述畫面，綁 VoiceOver 手勢/敲擊背面——把 prompt 換成
  「產生三種風格回覆」就是我們的東西
- **RoutineHub「GPT Vision」**（@VGC_，2,345 下載，2026-05 仍在更新）：
  證明 Get Contents of URL 直打 OpenAI vision API 可行

## ⚠️ 重要修正：不要用小白點

Take Screenshot 截的是「觸發當下畫面」，**但觸發方式不能在畫面上疊 UI**：

| 觸發方式 | 可用？ | 備註 |
|---|---|---|
| **敲擊背面 Back Tap** | ✅ 主方案 | 所有機型；**iOS 18+ 要關「Show Banner」**（設定→輔助使用→觸控→敲擊背面），否則橫幅會截進去 |
| 動作按鈕 | ✅ | 僅 iPhone 15 Pro 以上有此硬體，demo 前確認機型 |
| VoiceOver 手勢 | ✅ | 一般用戶不實用 |
| AssistiveTouch 小白點 | ⚠️ 未經實測 | 小白點本身疊在畫面上，可能截進去——避用 |
| Siri | ❌ | 會截到 Siri 介面 |
| 「截圖時」自動化 | ❓ 未證實 | 免確認執行與通知行為的 claims 全被駁回，別押這條 |

好消息：Take Screenshot **不會**把截圖存進相簿（要存得另接 Save 動作），
直接餵 API 不留垃圾。

## 今日照做步驟

1. 新捷徑，動作串：
   ```
   擷取螢幕畫面 (Take Screenshot)
   → Base64 編碼
   → 文字動作：手寫 OpenAI JSON body
       model: gpt-4o
       messages 內 image_url 用 "data:image/png;base64,<Base64結果>"
       prompt 要求以 JSON 回傳 {認真, 幽默, 曖昧, 解說, 聊死指數}
   → 取得 URL 內容 (Get Contents of URL)
       POST https://api.openai.com/v1/chat/completions
       Header: authorization = Bearer <API_KEY>
       Request Body: File（貼上面的文字）——巢狀 JSON 用字典 UI 很難組，File 模式較穩
   → 取得字典值：choices.1.message.content   ← 索引從 1 起算，不是 0！
   → （模型回的 JSON 再解析一層）
   → 從選單選擇：三個選項，標籤放三個變數（官方支援變數當選單標籤）
   → 拷貝到剪貼簿
   ```
2. 觸發：設定 → 輔助使用 → 觸控 → 敲擊背面 → 點兩下 = 此捷徑，**關 Show Banner**
3. 分享給隊友：對 API key 欄位加**匯入問題 (Import Questions)** 再產 iCloud
   連結——寫死的 key 會隨連結整包外流，這是所有 GPT 捷徑（S-GPT 等）的標準做法。
   注意 iOS 18.5 起有「作者端無法新增匯入問題」的 bug 回報，分享前先驗證

## 現場要自測的（研究查不到實測數據）

- base64 後的全螢幕 PNG（1-3MB → 再膨脹 33%）會不會逾時？保險起見先接
  「調整影像大小」壓到寬 1080 或轉 JPEG
- Choose from Menu 對長文字/多行/emoji 的截斷行為
- 從 Back Tap 觸發時選單以什麼形式彈出（sheet 或橫幅）

## 對 pitch 的意義

- Android 原生浮動球 = 主 demo（完整體驗、面板 UI、聊死指數儀表）
- iOS 捷徑 = 「零安裝、掃連結就能用」的跨平台佐證，兩台手機並排演同一動作
- 話術：「我們不是做一個 app，是定義『軍師浮在戰場上』這個形態——
  Android 用原生球，iOS 用系統能力，同一顆腦」
