import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const fields={school:'毕业学校 如果没有合适的内容请选择其他',schoolCampus:'毕业学校校区',majorCourses:'专业课程 请列举您主修的专业课程',start:'学历开始时间',end:'学历毕业时间',researchTopic:'研究方向',gpaScale:'学分绩点满分',gradeRank:'年级排名',institutionType:'院校类型'};
const dom=new JSDOM(`<section><label>学历<input value="硕士研究生"></label>${Object.entries(fields).map(([key,label])=>`<label>${label}<input id="${key}"></label>`).join('')}</section>`,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};
const record={level:'硕士研究生',school:'示例大学',schoolCampus:'示例大学（东校区）',major:'安全',majorCourses:'算法、密码学',start:'2024-09',end:'2027-06',researchTopic:'模型安全',gpaScale:'4',gradeRank:'前10%',institutionType:'普通高校'};
w.__RESUME_PULSE_PROFILE__={education:[record]};await w.eval(code);
for(const key of Object.keys(fields))assert.equal(w.document.getElementById(key).value,key==='school'?'':record[key],key);
w.close();console.log('Course/campus/date hints isolated; unknown school selector not written as plain text');
