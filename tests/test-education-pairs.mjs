import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const html='<section><label>学校名称(中文)<input id="school"></label><label>学校名称(英文)<input id="english"></label><label>学历<input id="level"></label><label>专业名称<input></label><div class="field">专业排名<input id="rank"> / <input id="total"></div><div class="field">学分绩点<input id="gpa"> / <input id="scale"></div><label>主修课程<textarea id="courses"></textarea></label></section>';
for(const scale of ['4','5','']){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window,d=w.document;w.CSS={escape:String};
 w.__RESUME_PULSE_PROFILE__={education:[{school:'示例研究大学',schoolEnglish:'Example Graduate University',level:'硕士研究生',major:'计算机',gpa:'3.87',gpaScale:scale,majorRank:'5',majorRankPosition:'3',majorRankTotal:'60',majorCourses:'算法、数据库'}, {school:'另一大学',level:'本科',gpa:'3.39',majorRank:'10'}]};
 await w.eval(code);for(const [id,value] of Object.entries({school:'示例研究大学',english:'Example Graduate University',level:'硕士研究生',gpa:'3.87',scale:scale||'4',rank:'3',total:'60',courses:'算法、数据库'}))assert.equal(d.getElementById(id).value,value,id);w.close();
}
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.CSS={escape:String};w.__RESUME_PULSE_PROFILE__={education:[{school:'大学一',level:'硕士研究生',majorRank:'5',gpa:'4.5'},{school:'大学二',gpa:'3.39'}]};await w.eval(code);for(const id of ['english','rank','total','scale','courses'])assert.equal(w.document.getElementById(id).value,'',id);w.close();console.log('Bilingual school, GPA numerator/scale, ordinal/total and courses stay on one education record');
