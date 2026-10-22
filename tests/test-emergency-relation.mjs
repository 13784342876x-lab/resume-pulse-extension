import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
for(const relation of ['父亲','']){
 const dom=new JSDOM('<label>紧急联系人姓名<input id="name"></label><label>紧急联系人<input id="relation" placeholder="请填写紧急联系人和您的关系"></label><label>紧急联系人电话<input id="phone"></label>',{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={emergencyName:'示例联系人',emergencyRelation:relation,emergencyPhone:'13000000000'};await w.eval(code);assert.equal(w.document.querySelector('#name').value,'示例联系人');assert.equal(w.document.querySelector('#relation').value,relation);assert.equal(w.document.querySelector('#phone').value,'13000000000');w.close();
}
console.log('Emergency relationship hint outranks name; missing relation stays blank');
{
 const dom=new JSDOM('<label>是否有专业技能证书<select id="has"><option></option><option>是</option><option>否</option></select></label><section><label>证书名称<input id="name"></label><label>颁发机构<input id="issuer"></label><label>获取时间<input id="date"></label></section>',{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={hasProfessionalCertificates:'是',certificates:[{name:'示例证书',issuer:'示例机构',date:'2022-06-01'}]};await w.eval(code);for(const [id,value] of Object.entries({has:'是',name:'示例证书',issuer:'示例机构',date:'2022-06-01'}))assert.equal(w.document.getElementById(id).value,value);w.close();
}
