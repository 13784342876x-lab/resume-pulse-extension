import fs from 'node:fs';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const field=(label,control)=>`<div class="c c2"><label>${label}</label><i>*</i><div class="sh"><div class="txt">${control}</div></div></div>`;
const html='<h2>基本信息</h2><div class="row">'+[
 field('姓名','<input id="a"><input type="hidden" value="record">'),
 field('手机','<input id="b" disabled value="locked">'),
 field('邮箱','<input id="c" value="existing@example.test">'),
 field('身份证号','<input id="d">'),
 field('民族','<select id="e"><option value="">--请选择--</option><option value="1">汉族</option></select>'),
 field('政治面貌','<select id="f"><option value="">--请选择--</option><option value="2">共青团员</option></select>'),
 field('身高','<input id="g">'),field('体重','<input id="h">'),
 field('紧急联系人','<input id="i">'),field('紧急联系电话','<input id="j">'),
 field('不认识的项目','<input id="k">')].join('')+'</div>';
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.CSS={escape:String};
w.__RESUME_PULSE_PROFILE__={name:'测试姓名',phone:'10000000000',email:'new@example.test',idNumber:'TEST-ID',ethnicity:'汉族',politicalStatus:'共青团员',height:'170',weight:'60',emergencyName:'测试联系人',emergencyPhone:'10000000001'};
w.__RESUME_PULSE_OPTIONS__={overwrite:false};
let changes=0;d.querySelector('#e').addEventListener('change',()=>changes++);
await w.eval(code);
for(const [id,value] of Object.entries({a:'测试姓名',b:'locked',c:'existing@example.test',d:'TEST-ID',e:'1',f:'2',g:'170',h:'60',i:'测试联系人',j:'10000000001',k:''}))assert.equal(d.getElementById(id).value,value,id);
assert.ok(changes>0);w.close();
console.log('Nested unbound labels: isolated columns, native selects, hidden IDs and existing/disabled fields passed');
