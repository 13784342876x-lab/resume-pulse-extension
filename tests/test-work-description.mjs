import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const records=[{company:'甲公司',detail:'甲内容'},{company:'乙公司',detail:'乙内容'}];
async function check(html,workExperience,options,expected){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={workExperience};w.__RESUME_PULSE_OPTIONS__=options;await w.eval(code);
 assert.equal(w.document.querySelector('textarea').value,expected);if(w.document.querySelector('#ref'))assert.equal(w.document.querySelector('#ref').value,'');w.close();
}
await check('<section><label>证明人工作单位<input value="甲公司"></label><label>工作单位<input value="乙公司"></label><label>工作描述<textarea></textarea></label><label>证明人职务<input id="ref"></label></section>',records,{},'乙内容');
for(const markup of ['<label>工作描述<textarea></textarea></label>','<textarea placeholder="请描述一下您在职期间的工作内容"></textarea>']){
 await check(markup,records,{},'');await check(markup,records,{workIndex:1},'乙内容');await check(markup,[records[1]],{},'乙内容');await check(markup,[],{},'');
}
console.log('Work description: standalone labels/hints, explicit selection and referee isolation passed');
