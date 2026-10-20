import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
// 51job offers both selectors and "other" inputs in the SAME record.
for(const level of ['硕士','本科']){
 const dom=new JSDOM(`<section><h2>教育经历</h2><label>学历层次<input value="${level}"></label><label>入学时间<input id="start"></label><label>毕业时间<input id="end"></label><label>毕业学校<select><option>其他</option></select></label><label>其他学校<input id="otherSchool"></label><label>专业<select><option>其他</option></select></label><label>其他专业<input id="otherMajor"></label><label>主修课程<textarea id="courses"></textarea></label></section>`,{runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.CSS={escape:String};
 w.__RESUME_PULSE_PROFILE__={education:[{level:'硕士研究生',school:'研究大学',major:'安全研究',start:'2024-09',end:'2027-06',majorCourses:'密码学'},{level:'本科',school:'本科大学',major:'软件工程',start:'2020-09',end:'2024-06',majorCourses:'数据结构'}]};
 const expected=w.__RESUME_PULSE_PROFILE__.education[level==='硕士'?0:1];
 await w.eval(code);
 for(const [id,key] of Object.entries({otherSchool:'school',otherMajor:'major',start:'start',end:'end',courses:'majorCourses'}))assert.equal(w.document.getElementById(id).value,expected[key],`${level}/${id}`);
 w.close();
}
const html='<section><label>学校名称(中文)<input id="school"></label><label>学校名称(英文)<input id="english"></label><label>学历<input id="level"></label><label>专业名称<input></label><div class="field">专业排名<input id="rank"> / <input id="total"></div><div class="field">学分绩点<input id="gpa"> / <input id="scale"></div><label>主修课程<textarea id="courses"></textarea></label></section>';
for(const scale of ['4','5','']){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;w.CSS={escape:String};
 w.__RESUME_PULSE_PROFILE__={education:[{school:'示例研究大学',schoolEnglish:'Example Graduate University',level:'硕士研究生',major:'计算机',gpa:'3.87',gpaScale:scale,majorRank:'5',majorRankPosition:'3',majorRankTotal:'60',majorCourses:'算法、数据库'}, {school:'另一大学',level:'本科',gpa:'3.39',majorRank:'10'}]};
 await w.eval(code);for(const [id,value] of Object.entries({school:'示例研究大学',english:'Example Graduate University',level:'硕士研究生',gpa:'3.87',scale:scale||'4',rank:'3',total:'60',courses:'算法、数据库'}))assert.equal(d.getElementById(id).value,value,id);w.close();
}
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={education:[{school:'大学一',level:'硕士研究生',majorRank:'5',gpa:'4.5'},{school:'大学二',gpa:'3.39'}]};await w.eval(code);for(const id of ['english','rank','total','scale','courses'])assert.equal(w.document.getElementById(id).value,'',id);w.close();console.log('Bilingual school, GPA numerator/scale, ordinal/total and courses stay on one education record');
