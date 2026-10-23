import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
for(const responsibilities of ['项目专属职责','']){
 const dom=new JSDOM('<div role="dialog"><h3>项目经验</h3><input placeholder="项目名称" id="name"><input placeholder="开始时间" id="start"><input placeholder="结束时间" id="end"><textarea placeholder="主要职责" id="duties"></textarea></div>',{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={projects:[{name:'示例项目',start:'2024-02-03',end:'2025-06-07',responsibilities}],workExperience:[{role:'不得借用的岗位',detail:'不得借用的职责'}]};await w.eval(code);for(const [id,value] of Object.entries({name:'示例项目',start:'2024-02-03',end:'2025-06-07',duties:responsibilities}))assert.equal(w.document.getElementById(id).value,value,id);w.close();
}
console.log('Minimal project dialog recognized without borrowing work duties');
