# 一起做完 · AI×UX 共學平台

依 PRD v0.4／SDD v0.2 製作的第一版可操作原型，使用虛構資料，適合工作坊展示與組員討論。

## 網頁操作

成果整理 → 確認本人定稿 → 選擇保留成果及用途同意 → 補充名片 → 切換已審核示例 → 確認公開範圍 → 接受候選 → 模擬對方接受 → 約定小任務 → 記錄成果。

側欄另有工作坊五關、輪盤與 Prompt 牌卡、營運工作台；右上可切換主持投影。頁面底部展示控制可模擬無候選、對方婉拒、AI 待處理、儲存失敗與重設。

## GitHub Pages

靜態網站位於 `docs/`，不需要安裝套件或建置。Pages 設定採 Deploy from a branch，分支 `main`，目錄 `/docs`。

私人 repository 使用 GitHub Pages 需有支援的 GitHub 方案；原始碼私人與發布網頁的可見性是兩種不同設定。

## 本機預覽

在 repository 根目錄執行 `python3 -m http.server 4173 --directory docs`，開啟 `http://localhost:4173`。

## 原型範圍

虛構資料僅保存在目前瀏覽器分頁的 sessionStorage。沒有正式登入、AI 推論、外部通知、付款或原 POC 跨站同步。所有前端程式與示例資料會隨網站提供給瀏覽者。

## 參考

原 POC：https://value-quest-game.lovable.app/

本原型重新撰寫示例題庫與 Prompt，延續原 POC 的真人訪談、AI 補充、本人確認及復盤流程。
