import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const dom=new JSDOM('<label>民族<div class="ivu-select"><div class="ivu-select-selection"><span class="ivu-select-selected-value">请选择</span></div></div></label><label>政治面貌<div class="next-select"><span class="next-select-inner"><span class="next-select-values">请选择</span></span></div></label><label>不明控件<input></label><label>身高<input></label><div class="ivu-select-dropdown" hidden><div class="ivu-select-item">汉族</div></div><div class="next-overlay-wrapper" hidden><div class="next-menu-item">群众</div></div>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.CSS={escape:String};
for(const [trigger,popup,option,value] of [['.ivu-select-selection','.ivu-select-dropdown','.ivu-select-item','.ivu-select-selected-value'],['.next-select-inner','.next-overlay-wrapper','.next-menu-item','.next-select-values']]){
 d.querySelector(trigger).addEventListener('mousedown',()=>d.querySelector(popup).hidden=false);
 d.querySelector(option).addEventListener('click',()=>{d.querySelector(value).textContent=d.querySelector(option).textContent;d.querySelector(popup).hidden=true;});
}
w.__RESUME_PULSE_PROFILE__={ethnicity:'汉族',politicalStatus:'群众'};const stats=await w.eval(code);
assert.equal(d.querySelector('.ivu-select-selected-value').textContent,'汉族');assert.equal(d.querySelector('.next-select-values').textContent,'群众');assert.equal(stats.filled,2);assert.equal(stats.unrecognized,1);assert.equal(stats.unfilled,1);assert.match(d.querySelector('.ivu-select').style.boxShadow,/inset/);console.log('Additional dropdowns, inset highlights and incomplete-fill diagnostics passed');w.close();
