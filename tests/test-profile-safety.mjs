import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const f=(label,id)=>`<label>${label}<input id="${id}"></label>`;
const dom=new JSDOM(f('健康状态','health')+'<section><h2>紧急联系人</h2>'+f('姓名','name')+f('手机号码','phone')+'</section><section><h2>本科教育经历</h2>'+f('本科是否最高学历','highest')+f('本科是否全日制','full')+f('本科是否统招','unified')+f('本科研究方向','research')+'</section><section>'+f('实习单位','company')+f('职位','role')+'</section>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={name:'本人',phone:'10000000000',emergencyName:'联系人',emergencyPhone:'10000000001',healthStatus:'健康',education:[{level:'硕士'},{level:'本科',studyForm:'全日制',admissionType:'统招',researchTopic:'示例课题'}],workExperience:[{company:'单位一',role:'职位一'},{company:'单位二',role:'职位二'}]};w.__RESUME_PULSE_OPTIONS__={workIndex:1};await w.eval(code);
for(const [id,value] of Object.entries({health:'健康',name:'联系人',phone:'10000000001',highest:'否',full:'是',unified:'是',research:'示例课题',company:'单位二',role:'职位二'}))assert.equal(w.document.getElementById(id).value,value,id);
w.close();console.log('Emergency isolation, education boolean conversion, health alias, research and explicit second work record passed');
