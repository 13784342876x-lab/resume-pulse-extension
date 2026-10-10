import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const card=(id,relation)=>`<div class="member"><div>家庭情况-${id}</div><div class="grid"><div class="el-form-item"><label>与本人关系</label><select id="r${id}"><option value="">请选择</option><option ${relation==='父亲'?'selected':''}>父亲</option><option ${relation==='母亲'?'selected':''}>母亲</option><option ${relation==='叔叔'?'selected':''}>叔叔</option></select></div><div class="el-form-item"><label>姓名</label><input id="n${id}" value="本人测试"></div><div class="el-form-item"><label>出生年月</label><input id="b${id}"></div><div class="el-form-item"><label>工作单位及职务</label><input id="u${id}"></div><div class="el-form-item"><label>目前居住国家</label><input id="c${id}"></div></div></div>`;
const dom=new JSDOM(`<aside>家庭情况 基本信息</aside><section><label>姓名<input id="self"></label></section><main><div>家庭情况</div>${card(1,'父亲')}${card(2,'母亲')}${card(3,'叔叔')}</main>`,{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.CSS={escape:String};
const profile={name:'本人测试',birthday:'2000-01-16',nationality:'中国',workExperience:[{company:'本人公司'}],family:[{relation:'父亲',name:'测试父亲',birthday:'1970-02',workUnit:'父亲单位',position:'工程师'},{relation:'母亲',name:'测试母亲',birthday:'1972-03',workUnit:'母亲单位',position:'教师'}]};
const run=async()=>{w.__RESUME_PULSE_PROFILE__=profile;w.__RESUME_PULSE_OPTIONS__={overwrite:true};await w.eval(code);};
await run();
assert.equal(d.querySelector('#self').value,'本人测试');
for(const [id,name,birthday,unit] of [[1,'测试父亲','1970-02','父亲单位 / 工程师'],[2,'测试母亲','1972-03','母亲单位 / 教师']]){
  assert.equal(d.querySelector(`#n${id}`).value,name);
  assert.equal(d.querySelector(`#b${id}`).value,birthday);
  assert.equal(d.querySelector(`#u${id}`).value,unit);
  assert.equal(d.querySelector(`#c${id}`).value,'');
}
assert.equal(d.querySelector('#b3').value,'');assert.equal(d.querySelector('#u3').value,'');
d.querySelector('#r1').value='母亲';await run();assert.equal(d.querySelector('#n1').value,'测试母亲');
const relation=d.querySelector('#r2');
relation.outerHTML='<div class="ant-select"><span class="ant-select-selection-item">父亲</span><input role="combobox"></div>';
await run();assert.equal(d.querySelector('#n2').value,'测试父亲');
profile.family.push({...profile.family[0],name:'另一个同关系成员'});
d.querySelector('#n2').value='';await run();assert.equal(d.querySelector('#n2').value,'');
profile.family=[];d.querySelector('#n1').value='';await run();assert.equal(d.querySelector('#n1').value,'');
console.log('Family div cards: relationship priority, multiple members, changed relationship, missing member and no applicant fallback passed');
w.close();
