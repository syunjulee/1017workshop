export const VERSION='mock-2026-10-18-v2';
export const TODAY='2026-10-18';
export const ATTRS=[['research','研究眼','◉'],['structure','結構骨','◇'],['ai','AI 觸角','✧'],['automation','自動化齒輪','⚙'],['judgment','判斷心','♡']];
export const TARGETS={ 'AI 產品設計師':['ai','research','judgment'], 'UX 研究員':['research','judgment','structure'], 'Product Designer':['structure','ai','judgment'], '對話設計師':['ai','structure','research'] };
export const JOBS=[
 {id:'J01',canonical:'job-1',title:'AI 產品設計師',company:'星河實驗室（虛構）',date:'2026-10-01',years:'0–2 年',salary:'月薪 45,000–60,000（模擬）',skills:['research','structure','ai','judgment']},
 {id:'J02',canonical:'job-2',title:'UX 研究員',company:'青苔工作室（虛構）',date:'2026-09-21',years:'2–5 年',salary:'月薪 55,000–75,000（模擬）',skills:['research','judgment']},
 {id:'J03',canonical:'job-3',title:'Product Designer',company:'暖光科技（虛構）',date:'2026-10-03',years:'2–5 年',salary:'面議（模擬）',skills:['structure','ai','automation']},
 {id:'J04',canonical:'job-4',title:'對話設計師',company:'島語設計（虛構）',date:'2026-08-18',years:'0–2 年',salary:'月薪 48,000–65,000（模擬）',skills:['research','ai','judgment']},
 {id:'J05',canonical:'job-1',title:'AI 產品設計師・重刊',company:'星河實驗室（虛構）',date:'2026-10-10',years:'0–2 年',salary:'月薪 45,000–60,000（模擬）',skills:['research','structure','ai','judgment']},
 {id:'J06',canonical:'job-6',title:'設計自動化實習',company:'小徑工坊（虛構）',date:'2024-01-01',years:'0–2 年',salary:'未提供',skills:['automation']}
].map(j=>({...j,isSynthetic:true,source:'mock://jobs/'+j.id}));
export const PRINCIPLES=[
 ['B01','自主與選擇','SDT','提供路線選擇，說明每一步的用途。','別讓唯一任務變成壓力。','框架示範'],
 ['B02','看得見的小進步','遊戲化學習','將大任務拆成可完成的小情境。','XP 只是本原型的練習紀錄。','研究情境示範'],
 ['B03','說明做對了什麼','內在動機','回饋指向具體判斷，而非只給獎勵。','不使用斷連懲罰。','研究情境示範'],
 ['B04','挑戰可以調整','心流','依自陳精力與可用時間調整關卡。','不將卡關解讀為能力不足。','理論示範'],
 ['B05','與過去的自己比','自我效能','只看自己的成長與版本。','不做公開排行榜。','理論示範'],
 ['B06','回想比重看更有用','提取練習','每三關插入回憶，答錯保留待回憶。','回憶失誤不扣分。','研究情境示範'],
 ['B07','安心試錯與共學','心理安全感','先用虛構情境試做，再自願邀請學伴。','不推測情緒或心理狀態。','理論示範'],
 ['B08','擁有與創造','Octalysis','讓怪獸與成果保留個人選擇。','不使用損失恐懼驅動。','業界框架示範']
].map(([id,title,theory,action,risk,strength])=>({id,title,theory,action,risk,strength,isSynthetic:true,source:'mock://principles/'+id,limitations:'本卡為模擬設計原則，未查核原始論文，不代表研究結論。'}));
export const QUESTS=[
 {id:'L1-01',attr:'research',title:'找到真正的卡點',scene:'受訪者說：「我想練習 AI，但回家打開工具就不知道先做什麼。」你想再多理解一點。',question:'哪個追問最能取得具體經驗？',choices:['你是不是不夠有動機？','回想上一次打開工具，當時想做什麼？停在哪一步？','你會喜歡每日排行榜嗎？'],correct:1,feedback:'你把「缺乏動機」留作假設，先追問真實發生的情境。',improve:'先問上一次發生的事，避免在問題裡先放入結論。',hint:'選擇會讓對方說出一次具體經驗的問法。',idea:'可能不是缺乏動機，而是缺少清楚的起點；仍需更多訪談驗證。',experiment:'做一張 3 分鐘起步卡，觀察是否開始。'},
 {id:'L1-02',attr:'structure',title:'把迷路變成路徑',scene:'第一次使用平台的人看到很多資料與工具，卻找不到下一步。',question:'你會先安排哪個流程？',choices:['先展示所有功能','選目標 → 試一個小任務 → 看回饋','先要求公開個人名片'],correct:1,feedback:'你讓使用者先走完一個可理解的小閉環。',improve:'先讓人完成一件小事，再逐步揭露更多工具。',hint:'想想最短的完整體驗。',idea:'漸進揭露可能降低首次使用的負擔。',experiment:'讓一位模擬使用者找出第一個可做的任務。'},
 {id:'L2-01',attr:'ai',title:'讓 AI 說明它的依據',scene:'AI 把一句訪談原話解讀成「使用者不喜歡合作」。',question:'你會怎麼呈現這個結果？',choices:['標成已驗證人格','列出原句、替代解釋與追問，保留使用者判斷','直接改寫使用者名片'],correct:1,feedback:'你保留引用、推論與本人判斷之間的界線。',improve:'把 AI 解讀標為假設，讓使用者能查看證據並拒絕。',hint:'AI 推論不等於當事人已同意的事實。',idea:'可能是當次合作成本高，而不是不願合作。',experiment:'追問一次合作順利與不順利的具體經驗。'},
 {id:'L3-01',attr:'judgment',title:'設計一個可靠的退路',scene:'AI 客服不確定退款資格，但使用者急著拿到答案。',question:'哪種回應保留使用者的掌控？',choices:['保證可以退款','說明不確定的部分，提供查核與人工協助選項','隱藏錯誤後重試十次'],correct:1,feedback:'你讓不確定性可見，也提供可行的下一步。',improve:'透明說明限制，給使用者選擇，不替他作承諾。',hint:'好的錯誤處理同時說明限制與下一步。',idea:'信任也來自看得見的限制與可選擇的退路。',experiment:'比較使用者能否說出下一步與資料去向。'},
 {id:'L4-01',attr:'automation',title:'讓整理可以重複',scene:'每次工作坊都要手動彙整大量回饋，還常把兩位受訪者的資料混在一起。',question:'自動化前，最需要先定義什麼？',choices:['只要換更快的模型','固定 ID、主體、來源版本、欄位與失敗時的處理','自動發布所有摘要'],correct:1,feedback:'你先讓資料與規則一致，才有可重現的自動化。',improve:'先定義資料契約與錯誤處理，再接進流程。',hint:'速度之外，還需要可追溯與可重試。',idea:'穩定的資料契約是安全自動化的基礎。',experiment:'用重複與缺漏資料測試去重及錯誤回復。'},
 {id:'L5-01',attr:'judgment',title:'讓作品說得出理由',scene:'作品集展示了一個漂亮的 AI 工具，但讀者不知道為何這樣設計。',question:'你會優先補上哪一段？',choices:['更多炫目的動畫','研究依據、取捨、驗證方式與尚未解決的限制','保證產品一定成功'],correct:1,feedback:'你把視覺成果連回設計判斷與驗證。',improve:'清楚說明問題、依據、取捨與下一步。',hint:'讓人看見你怎麼作出決定。',idea:'作品集碎片可以同時呈現成果與尚待驗證的假設。',experiment:'請學伴說出你的設計理由，再看是否理解一致。'}
];
export const SKILLS=[['A','ai-ux-job-scan','職缺技能掃描','共用資料'],['B','gamified-learning-research','遊戲化學習研究','共用資料'],['D','learner-daily-status','每日學習狀態','個人狀態'],['C','ai-ux-career-quest','職涯冒險嚮導','整合與引導']];
