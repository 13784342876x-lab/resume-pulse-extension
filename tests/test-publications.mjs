import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const labels={title:'论文（成果）名称',date:'发布时间',educationLevel:'论文发表所属教育经历',researchDirection:'论文研究方向',publicationStatus:'论文发表状态',authorRank:'作者排序',publicationCount:'论文发表数量',yearIssue:'年度及期次',indexingOrganization:'核心期刊或收录机构名称'};
const card=()=>`<section>${Object.entries(labels).map(([key,label])=>`<label>${label}<input data-key="${key}"></label>`).join('')}</section>`;
const dom=new JSDOM(`<main>${card()}${card()}</main>`,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};
const records=[{title:'论文甲',date:'2026-10-20',educationLevel:'硕士研究生',researchDirection:'模型安全',publicationStatus:'已录用',authorRank:'2',publicationCount:'1',yearIssue:'2026年第3期',indexingOrganization:'示例索引'},{title:'论文乙',date:'2024-03',educationLevel:'本科',researchDirection:'软件工程',publicationStatus:'已发表',authorRank:'1',publicationCount:'1',yearIssue:'2024年第2期',indexingOrganization:'另一索引'}];
w.__RESUME_PULSE_PROFILE__={publications:records,education:[{level:'博士研究生',researchTopic:'不能借用'}]};await w.eval(code);
w.document.querySelectorAll('section').forEach((section,i)=>section.querySelectorAll('input').forEach(input=>assert.equal(input.value,records[i][input.dataset.key],`${i}/${input.dataset.key}`)));
w.close();console.log('Publication cards keep all fields and exact dates on the same paper');
