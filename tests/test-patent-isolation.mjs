import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const fields={title:'专利名称',patentType:'专利类别',patentStatus:'专利状态',identifier:'专利号',applicationDate:'专利申请日期',authorRank:'个人排序',grantCountry:'授权国家',owner:'所有者',date:'专利授权日期',protectionYears:'保护期限'};
const patent={type:'专利',title:'测试装置',patentType:'发明专利',patentStatus:'已授权',identifier:'TEST123',applicationDate:'2020-01-02',authorRank:'2',grantCountry:'中国',owner:'测试机构',date:'2022-03-04',protectionYears:'20'};
for(const records of [[],[patent]]){
 const dom=new JSDOM(`<section>${Object.entries(fields).map(([key,label])=>`<label>${label}<input id="${key}"></label>`).join('')}</section>`,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};
 w.__RESUME_PULSE_PROFILE__={publications:[{type:'论文',title:'不能填入的论文',date:'2025-01-01'},...records]};await w.eval(code);
 for(const key of Object.keys(fields))assert.equal(w.document.getElementById(key).value,records.length?patent[key]:'',key);w.close();
}console.log('Patent fields use only patent records; absent patents never borrow papers');
