import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const f=(label,id)=>`<label>${label}<input id="${id}"></label>`;
const dom=new JSDOM(f('年龄','age')+'<section><h2>本科教育经历</h2>'+f('本科学位','degree')+f('本科入学时间','start')+f('本科学习方式','form')+'</section><section><h2>获得证书</h2>'+f('获取时间','date')+f('证书名称','name')+f('证书编号','number')+f('颁证机构','issuer')+'</section><section><h2>实习经历</h2>'+f('开始时间','workStart')+f('实习单位部门及职位','work')+f('说明','detail')+'</section>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={birthday:'2000-12-31',education:[{level:'硕士研究生',degree:'硕士',start:'2024-09'},{level:'本科',degree:'学士',start:'2019-09',studyForm:'全日制'}],certificates:[{name:'测试证书',date:'2020-10',number:'TEST123',issuer:'测试机构'}],workExperience:[{company:'示例公司',department:'研发部',role:'实习生',start:'2023-06',detail:'测试说明'}]};
await w.eval(code);const now=new Date();assert.equal(w.document.getElementById('age').value,String(now.getFullYear()-2000-(now.getMonth()===11&&now.getDate()===31?0:1)));
for(const [id,value] of Object.entries({degree:'学士',start:'2019-09',form:'全日制',date:'2020-10',name:'测试证书',number:'TEST123',issuer:'测试机构',work:'示例公司 / 研发部 / 实习生',detail:'测试说明',workStart:'2023-06'}))assert.equal(w.document.getElementById(id).value,value,id);
w.close();console.log('Age, level-scoped education, certificate card and combined internship fields passed');
