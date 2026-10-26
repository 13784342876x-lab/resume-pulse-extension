import fs from 'node:fs';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
for(const wording of ['工作职责','主要工作与成果','实习期间的贡献','岗位职责','工作描述']){
  const dom=new JSDOM(`<section><label>工作单位<input value="乙公司"></label><label>${wording}<textarea id="detail"></textarea></label></section>`,{runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.CSS={escape:String};
  w.__RESUME_PULSE_PROFILE__={workExperience:[{company:'甲公司',detail:'甲成果'},{company:'乙公司',detail:'乙成果'}]};
  await w.eval(code);assert.equal(w.document.querySelector('#detail').value,'乙成果',wording);w.close();
}
for(const city of ['乙城市','']){
  const dom=new JSDOM('<section><label>学校名称<input value="乙大学"></label><label>学历<input value="本科"></label><label>学校所在城市<input id="city"></label></section>',{runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.CSS={escape:String};
  w.__RESUME_PULSE_PROFILE__={education:[{school:'甲大学',level:'硕士',schoolCity:'甲城市'},{school:'乙大学',level:'本科',schoolCity:city}]};
  await w.eval(code);assert.equal(w.document.querySelector('#city').value,city);w.close();
}
console.log('Context-bound work narratives and school cities passed');
