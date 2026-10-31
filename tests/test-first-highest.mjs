import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const fields={学校:'school',专业:'major',开始时间:'start',毕业时间:'end',学历:'level'};
for(const absent of [false,true]){
 const html=['第一学历','最高学历'].map(prefix=>Object.keys(fields).map(label=>`<label>${prefix}${label}<input id="${prefix}${label}" placeholder="请输入${prefix}${label}"></label>`).join('')).join('')+['配偶','子/女'].map(role=>`<label>${role}姓名<input id="${role}" placeholder="若没有请填写“无”"></label>`).join('');
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};
 const education=[{school:'甲大学',major:'甲专业',level:'硕士研究生',start:'2024-09',end:'2027-06',isHighest:'是'},{school:'乙大学',major:'乙专业',level:'本科',start:'2020-09',end:'2024-06',isFirst:'是'}];
 w.__RESUME_PULSE_PROFILE__={education,hasSpouse:absent?'否':'',hasChildren:absent?'否':'',name:'本人'};await w.eval(code);
 for(const [prefix,record] of [['第一学历',education[1]],['最高学历',education[0]]])for(const [label,key] of Object.entries(fields))assert.equal(w.document.getElementById(prefix+label).value,record[key],prefix+label);
 for(const role of ['配偶','子/女'])assert.equal(w.document.getElementById(role).value,absent?'无':'');w.close();
}console.log('First/highest education suffixes and explicit family absence passed');
