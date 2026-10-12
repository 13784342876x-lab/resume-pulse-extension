import fs from 'node:fs';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const code=fs.readFileSync(new URL('../autofill.js',import.meta.url),'utf8');
const dom=new JSDOM('<h2>基本信息</h2><table><tr><td>个人简介</td><td><textarea id="intro"></textarea></td><td>出生日期</td><td><input id="profile_birth"></td></tr><tr><td>籍贯</td><td><input id="profile_native"></td><td>生源地</td><td><input id="profile_origin"></td></tr></table>',{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.CSS={escape:String};const p={summary:'示例个人简介',birthday:'2000-01-16',nativePlace:'河北省',studentOrigin:'北京市'};
const run=async()=>{w.__RESUME_PULSE_PROFILE__=p;w.__RESUME_PULSE_OPTIONS__={overwrite:true};await w.eval(code);};
await run();assert.equal(d.querySelector('#intro').value,p.summary);assert.equal(d.querySelector('#profile_birth').value,p.birthday);assert.equal(d.querySelector('#profile_native').value,p.nativePlace);assert.equal(d.querySelector('#profile_origin').value,p.studentOrigin);
p.birthday='这不是日期';d.querySelector('#profile_birth').value='';await run();assert.equal(d.querySelector('#profile_birth').value,'');console.log('Local labels beat profile IDs and neighboring columns; invalid birthday blocked');w.close();
