import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const dom=new JSDOM('<div role="dialog"><label>工作单位名称<input id="company"></label><label>职位<input id="role"></label><label>省（地区）<input id="province"></label><label>城市<input id="city"></label><label>所属行业<input id="industry"></label></div>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.CSS={escape:String};const p={nativePlace:'山西省',currentResidence:'上海市',workExperience:[{company:'示例公司',role:'实习生',location:'北京市海淀区',industry:'信息技术服务'}]};
const run=async()=>{w.__RESUME_PULSE_PROFILE__=p;w.__RESUME_PULSE_OPTIONS__={overwrite:true};await w.eval(code);};
await run();assert.equal(d.querySelector('#province').value,'北京市');assert.equal(d.querySelector('#city').value,'北京市');assert.equal(d.querySelector('#industry').value,'信息技术服务');
p.workExperience[0].location='江苏省苏州市工业园区';await run();assert.equal(d.querySelector('#province').value,'江苏省');assert.equal(d.querySelector('#city').value,'苏州市');
p.workExperience[0].location='';p.workExperience[0].industry='';d.querySelector('#province').value='';d.querySelector('#city').value='';d.querySelector('#industry').value='';await run();assert.equal(d.querySelector('#province').value,'');assert.equal(d.querySelector('#city').value,'');assert.equal(d.querySelector('#industry').value,'');
console.log('Work province/city/industry: municipality, province-city and missing data isolation passed');w.close();
