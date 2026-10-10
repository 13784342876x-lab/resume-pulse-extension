import assert from "node:assert/strict";
import fs from "node:fs";
import {JSDOM} from "jsdom";

const html=`<!doctype html><html><body>
<h2>基本情况</h2><table>
  <tr><td>姓名 *</td><td><input id="f01"></td></tr>
  <tr><td>性别 *</td><td><select id="f02"><option>--请选择--</option><option>男</option><option>女</option></select></td></tr>
  <tr><td>民族 *</td><td><input id="f03"></td></tr>
  <tr><td>户口所在地 *</td><td><select id="f04"><option>请选择</option><option>江苏省</option></select><select id="f05"><option>请选择</option><option>苏州市</option></select></td></tr>
  <tr><td>是否有北京户口落户需求 *</td><td><label><input type="radio" name="hukouNeed" value="1">是</label><label><input type="radio" name="hukouNeed" value="0">否</label></td></tr>
  <tr><td>电子邮件</td><td><input id="f06"></td></tr>
  <tr><td>常住地址</td><td><input id="f07"></td></tr>
  <tr><td>照片 *</td><td><input type="file" id="photo"></td></tr>
</table>
<h2>教育经历</h2><fieldset><legend>教育经历 1</legend><label>学校名称 <input id="school1"></label><label>学历层次 <input id="level1"></label></fieldset>
<fieldset><legend>教育经历 2</legend><label>学校名称 <input id="school2"></label><label>学历层次 <input id="level2"></label></fieldset>
</body></html>`;
const dom=new JSDOM(html,{url:"https://example.test",runScripts:"outside-only",pretendToBeVisual:true});
dom.window.CSS={escape:value=>String(value).replace(/[^a-zA-Z0-9_-]/g,"\\$&")};
dom.window.__RESUME_PULSE_PROFILE__={name:"陈予安",gender:"男",ethnicity:"汉族",hukouLocation:"江苏省苏州市",beijingHukouNeed:"否",email:"yuan@example.com",currentResidence:"上海市徐汇区",education:[{school:"华东理工大学",level:"硕士研究生"},{school:"苏州大学",level:"本科"}]};
const code=fs.readFileSync(new URL("../autofill.js",import.meta.url),"utf8");
const stats=await dom.window.eval(code);
const value=id=>dom.window.document.getElementById(id).value;
assert.equal(value("f01"),"陈予安");assert.equal(value("f02"),"男");assert.equal(value("f03"),"汉族");
assert.equal(value("f04"),"江苏省");assert.equal(value("f05"),"苏州市");assert.equal(value("f06"),"yuan@example.com");assert.equal(value("f07"),"上海市徐汇区");
assert.equal(dom.window.document.querySelector('input[name="hukouNeed"][value="0"]').checked,true);
assert.equal(value("school1"),"华东理工大学");assert.equal(value("school2"),"苏州大学");
assert.ok(stats.filled>=10,`expected at least 10 fields, got ${stats.filled}`);assert.equal(stats.manual,1);
console.log(JSON.stringify(stats));

const overwriteDom=new JSDOM(`<!doctype html><table><tr><td>姓名</td><td><input id="name" value="林晓雨"></td></tr><tr><td>性别</td><td><select id="gender"><option>请选择</option><option selected>女</option><option>男</option></select></td></tr><tr><td>民族</td><td><select id="ethnicity"><option>请选择</option><option selected>汉族</option><option>蒙古族</option></select></td></tr></table>`,{url:"https://example.test",runScripts:"outside-only",pretendToBeVisual:true});
overwriteDom.window.CSS={escape:value=>String(value)};overwriteDom.window.__RESUME_PULSE_PROFILE__={name:"陈予安",gender:"男",ethnicity:"蒙古族"};overwriteDom.window.__RESUME_PULSE_OPTIONS__={overwrite:true};
const overwriteStats=await overwriteDom.window.eval(code);
assert.equal(overwriteDom.window.document.getElementById("name").value,"陈予安");assert.equal(overwriteDom.window.document.getElementById("gender").value,"男");assert.equal(overwriteDom.window.document.getElementById("ethnicity").value,"蒙古族");assert.equal(overwriteStats.filled,3);
console.log(JSON.stringify({overwrite:overwriteStats}));

const sequential=new JSDOM('<h2>家庭成员及主要社会关系</h2><form><label>与本人关系<select><option value="">请选择</option><option>父亲</option><option>母亲</option></select></label><label>姓名<input id="memberName"></label><label>工作单位<input id="memberUnit"></label></form>',{url:'https://example.test',runScripts:'outside-only',pretendToBeVisual:true});
sequential.window.CSS={escape:String};
const familyProfile={name:'测试人',family:[{name:'张父',relation:'父亲',workUnit:'甲单位'},{name:'张母',relation:'母亲',workUnit:'乙单位'}]};
const fillFamily=async()=>{sequential.window.__RESUME_PULSE_PROFILE__=familyProfile;return sequential.window.eval(code);};
await fillFamily();assert.equal(sequential.window.document.querySelector('#memberName').value,'张父');
await fillFamily();assert.equal(sequential.window.document.querySelector('#memberName').value,'张父');
sequential.window.document.querySelector('form').reset();
await fillFamily();assert.equal(sequential.window.document.querySelector('#memberName').value,'张母');assert.equal(sequential.window.document.querySelector('#memberUnit').value,'乙单位');assert.equal(sequential.window.document.querySelector('select').value,'母亲');
sequential.window.document.querySelector('form').reset();
await fillFamily();assert.equal(sequential.window.document.querySelector('#memberName').value,'');
console.log('Sequential family editor: first, repeat, second, exhausted passed');

const structuredDom=new JSDOM(`<!doctype html><body>
<h2>外语能力</h2><table><tr><td>英语能力</td><td><select id="english-cert"><option>--请选择--</option><option>大学英语4级(CET4)</option><option>大学英语6级(CET6)</option><option>托福(TOEFL)</option><option>雅思(IELTS)</option></select><select id="english-score"><option>--请选择--</option><option>425</option><option>568</option></select></td></tr></table>
<h2>家庭成员及主要社会关系</h2><table>
<tr><td>父亲姓名 *</td><td><input id="father-name"></td></tr><tr><td>父亲年龄 *</td><td><input id="father-age"></td></tr><tr><td>父亲政治面貌 *</td><td><select id="father-political"><option>请选择</option><option>中共党员</option><option>群众</option></select></td></tr><tr><td>父亲工作单位 *</td><td><input id="father-unit"></td></tr><tr><td>父亲职务 *</td><td><input id="father-position"></td></tr><tr><td>父亲电话</td><td><input id="father-phone"></td></tr>
<tr><td>母亲姓名 *</td><td><input id="mother-name"></td></tr><tr><td>母亲年龄 *</td><td><input id="mother-age"></td></tr>
</table></body>`,{url:"https://example.test",runScripts:"outside-only",pretendToBeVisual:true});
structuredDom.window.CSS={escape:value=>String(value)};structuredDom.window.__RESUME_PULSE_PROFILE__={languages:[{name:"英语",level:"熟练",certificate:"大学英语六级（CET-6）",score:"568"}],family:[{relation:"父亲",name:"林建国",birthday:"1977-08",politicalStatus:"群众",workUnit:"无",position:"无",phone:"13900000001"},{relation:"母亲",name:"陈文静",birthday:"1977-11",politicalStatus:"群众",workUnit:"无",position:"无",phone:"13900000002"}]};
const structuredStats=await structuredDom.window.eval(code);const structuredValue=id=>structuredDom.window.document.getElementById(id).value;
assert.equal(structuredValue("english-cert"),"大学英语6级(CET6)");assert.equal(structuredValue("english-score"),"568");assert.equal(structuredValue("father-name"),"林建国");assert.equal(structuredValue("mother-name"),"陈文静");assert.equal(structuredValue("father-political"),"群众");assert.equal(structuredValue("father-unit"),"无");assert.equal(structuredValue("father-position"),"无");assert.equal(structuredValue("father-phone"),"13900000001");assert.ok(Number(structuredValue("father-age"))>40);assert.ok(Number(structuredValue("mother-age"))>40);
console.log(JSON.stringify({structured:structuredStats,language:structuredValue("english-cert"),father:structuredValue("father-name"),mother:structuredValue("mother-name")}));
