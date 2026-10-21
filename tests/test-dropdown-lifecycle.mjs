import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
for(const mode of ['commit','no-commit','stuck','rollback','aria-only']){
 const dom=new JSDOM('<label>民族<input readonly role="combobox" aria-controls="p1" id="eth"></label><label>政治面貌<input readonly role="combobox" aria-controls="p2" id="pol"></label><div id="p1" role="listbox" hidden><div role="option">汉族</div></div><div id="p2" role="listbox" hidden><div role="option">群众</div></div>',{runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.CSS={escape:String};let secondOpened=false;
 for(const [id,pop,value] of [['eth','p1','汉族'],['pol','p2','群众']]){
  const el=d.getElementById(id),popup=d.getElementById(pop);
  el.addEventListener('click',()=>{popup.hidden=false;if(id==='pol')secondOpened=true;});
  popup.firstElementChild.addEventListener('click',()=>{if(mode==='commit'){w.setTimeout(()=>{el.value=value;popup.hidden=true;},80);}else if(mode==='rollback'){el.value=value;popup.hidden=true;w.setTimeout(()=>el.value='',80);}else if(mode==='aria-only'){popup.firstElementChild.setAttribute('aria-selected','true');popup.hidden=true;}else if(mode==='no-commit')popup.hidden=true;});
 }
 w.__RESUME_PULSE_PROFILE__={ethnicity:'汉族',politicalStatus:'群众'};const stats=await w.eval(code);
 if(mode==='commit'){assert.equal(stats.filled,2);assert.equal(stats.dropdownBlocked,0);}
 else {assert.equal(stats.filled,0);assert.equal(d.querySelector('#eth').style.outline,'');}
 if(mode==='stuck'){assert.equal(secondOpened,false);assert.equal(stats.dropdownBlocked,1);}
 w.close();
}
console.log('Dropdown lifecycle: delayed commit verified, ignored click rejected, unclosed popup stops following dropdowns');
