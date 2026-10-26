import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const card=i=>`<section><label>开始时间<input id="start${i}"></label><label>结束时间<input id="end${i}"></label><label>校内任职职务<input id="role${i}"></label><label>校园经历信息<textarea id="detail${i}"></textarea></label></section>`;
for(const campusExperience of [[],[{role:'班长',detail:'组织班级活动',start:'2020-09',end:'2021-06'},{role:'社团负责人',detail:'组织社团活动',start:'2021-09',end:'2022-06'}]]){
 const dom=new JSDOM(`<h2>校园经历</h2>${card(0)}${card(1)}`,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};
 const profile={campusExperience,workExperience:[{company:'测试公司',role:'实习生',detail:'工作成果',start:'2025-01',end:'2025-06'}]};
 for(let pass=0;pass<2;pass++){
 w.__RESUME_PULSE_PROFILE__=profile;await w.eval(code);
 for(let i=0;i<2;i++)for(const field of ['role','detail','start','end'])assert.equal(w.document.getElementById(field+i).value,campusExperience[i]?.[field]||'',`${pass}:${i}:${field}`);
 }w.close();
}
console.log('Campus cards: role, narrative and dates isolated from employment; missing records stay blank');
