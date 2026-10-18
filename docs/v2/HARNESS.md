# AI×UX v2 Harness

## 目的

將四支 Skill 置於同一個可觀察、可重播的模擬執行環境，保存執行輸入、輸出、fixture 版本、錯誤與評估證據。這是本次的 mock Harness 交付，並非正式 LLM agent harness。

## 組成與執行順序

1. 載入：`dist/fixtures.mjs` 的 SKILLS 名稱與固定資料；`skills/manifest.json` 對應來源及 SHA-256。
2. 共用研究：`refreshKnowledge` 執行 A、B，先產生待審核快照；`approveKnowledge` 後供 C 使用。兩支皆成功才產生新快照組，失敗保留既有版本。
3. 個人狀態：`saveDaily` 執行 D，輸出優先方向、難度、長度、回憶與語氣；不進 A/B 快照。
4. 嚮導：`runSkill(C)` 讀核准 A/B 版本與 D，安排情境及職涯方向。依答案選擇預置回饋，沒有語意模型。
5. 契約：`validateOutput` 驗證 mode、各 Skill 必要結構及規則值。它不是完整 JSON Schema validator；匯入存檔另有範圍與來源限制。
6. 追蹤：每次執行包含 runId、Skill、adapter、fixtureVersion、input、status、output／error、起訖時間。可在 UI 展開或匯出。
7. 評估：`tests/harness.test.mjs` 為規則驗證；`harness/run.mjs` 為跨 Skill 全閉環重播；瀏覽器另檢查視覺與操作。

## 資料與失敗規則

- 所有資料使用 `mock://` 引用及虛構 fixture；禁止外部資料連線。原 Skill 中的搜尋與 104 資料取得步驟以本對話「不串接真實資料」要求覆蓋。
- 未提供欄位維持未知；不推估薪資、研究效果或心理狀態。
- 失敗要留 trace，不把 failed 寫成 passed，不部分覆蓋共用快照。
- 每個關卡最多累加一次 XP；回憶錯誤只保留待回憶。舊成果來源保留快照；新成果使舊名片不能繼續啟動媒合。
- 管理者、使用者與學伴都只是前端虛構角色。正式登入、授權、資料保留與服務層隔離尚未實作。

## 可攜存檔

以 `aiux-save-v1` JSON 攜帶 v2 模擬狀態，驗證後才取代現況。匯入時以內建 A/B 重新建立共用資料，不接受存檔注入外部知識。瀏覽器 sessionStorage 是暫存；下載不傳輸資料。

## 未來換成真模型前的缺口

先定義真模型 adapter、完整 schema、工具與角色授權、資料來源許可、提示注入防護、期限與撤回，再加入人工標註評估集、引用忠實度、主體正確性、建議可驗證性及回歸成本／延遲。現在的 26 項規則測試不抵充上述品質驗證。原始四支 Skill 文本保持不變，mock 覆蓋與實作取捨集中記於 README。
