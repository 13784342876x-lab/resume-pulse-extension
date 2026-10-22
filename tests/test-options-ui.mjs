import fs from "node:fs";
import assert from "node:assert/strict";
import {JSDOM} from "jsdom";
const html=fs.readFileSync(new URL("../options.html",import.meta.url),"utf8").replace(/<script[\s\S]*?<\/script>/g,"");
const dom=new JSDOM(html,{url:"https://extension.test/options.html",pretendToBeVisual:true});
for(const key of ["window","document","FormData","Blob","Event","CustomEvent","HTMLElement","HTMLInputElement","HTMLTextAreaElement","HTMLSelectElement","Node"])globalThis[key]=dom.window[key];
globalThis.confirm=()=>true;globalThis.chrome={runtime:{getURL:path=>new URL(`../${path}`,import.meta.url).href},storage:{local:{get:async()=>({}),set:async()=>{}},onChanged:{addListener(){}}}};
await import(`../options.js?test=${Date.now()}`);await new Promise(resolve=>setTimeout(resolve,30));
assert.equal(document.querySelectorAll('#ethnicitySelect option').length,58);assert.equal(document.querySelectorAll('[data-region-field] select').length,12);assert.ok(document.querySelector('#profileSwitch option'));
document.getElementById("sampleBtn").click();await new Promise(resolve=>setTimeout(resolve,30));
assert.equal(document.querySelectorAll('#educationList .list-card').length,3);assert.ok(document.querySelector('[data-dynamic-list="education"][data-key="schoolCity"]'));assert.ok(document.querySelector('[data-list="education"][data-key="majorCategory"]'));
for(const key of ['isFirst','isHighest']){
  const choose=index=>{const el=document.querySelector(`[data-list="education"][data-key="${key}"][data-index="${index}"]`);el.value='是';el.dispatchEvent(new Event('change',{bubbles:true}));};
  choose(0);choose(1);
  const fields=[...document.querySelectorAll(`[data-list="education"][data-key="${key}"]`)];assert.equal(fields.filter(el=>el.value==='是').length,1);assert.equal(fields[1].value,'是');assert.equal(fields[0].value,'否');
}
assert.equal(document.querySelector('#educationList .form-grid [data-key]').dataset.key,'school');
assert.equal(document.querySelector('#workExperienceList .form-grid [data-key]').dataset.key,'company');
const availability=document.querySelector('[name="hasAcademicResults"]');availability.value='是';availability.dispatchEvent(new Event('change',{bubbles:true}));
const setType=value=>{const el=document.querySelector('[data-list="publications"][data-key="type"]');el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}));};
assert.equal(document.querySelector('#publicationsList .form-grid [data-key]').dataset.key,'type');
setType('专利');assert.equal(document.querySelector('#publicationsList [data-key="researchDirection"]'),null);assert.ok(document.querySelector('#publicationsList [data-key="patentType"]'));
const applicant=document.querySelector('#publicationsList [data-key="applicant"]');applicant.value='示例申请人';
setType('论文');assert.ok(document.querySelector('#publicationsList [data-key="researchDirection"]'));assert.equal(document.querySelector('#publicationsList [data-key="applicant"]'),null);
setType('专利');assert.equal(document.querySelector('#publicationsList [data-key="applicant"]').value,'示例申请人');
availability.value='否';availability.dispatchEvent(new Event('change',{bubbles:true}));assert.equal(document.querySelector('#publicationsList').closest('.subsection').hidden,true);
availability.value='是';availability.dispatchEvent(new Event('change',{bubbles:true}));assert.equal(document.querySelector('#publicationsList [data-key="applicant"]').value,'示例申请人');
assert.equal(document.querySelector('[name="communicationAddress"]'),null);assert.ok(document.querySelector('[name="currentResidence"]')?.matches('input:not([type="hidden"])'));assert.ok(document.querySelector('[name="nationality"]')?.matches('select'));assert.ok(document.querySelector('[name="healthStatus"]')?.matches('select'));assert.equal(document.querySelector('[data-list="education"][data-key="unifiedEnrollment"]'),null);assert.ok(document.querySelector('[data-list="family"][data-key="relation"]')?.matches('select'));assert.ok(document.querySelector('[data-list="family"][data-key="politicalStatus"]')?.matches('select'));for(const id of ["work-experience","campus","projects","languages","awards","academics"])assert.ok(document.getElementById(id));assert.equal(document.querySelectorAll('#campusExperienceList .list-card').length,1);assert.equal(document.querySelectorAll('#projectsList .list-card').length,1);for(const name of ["careerStart","company","workRole","workStart","workEnd","workDetail","skills"])assert.equal(document.querySelector(`[name="${name}"]`),null);assert.ok(document.querySelector('[name="jobSeekingMethod"]')?.matches('select'));
console.log(JSON.stringify({ethnicities:document.querySelectorAll('#ethnicitySelect option').length,regionSelects:document.querySelectorAll('[data-region-field] select').length,educationCards:document.querySelectorAll('#educationList .list-card').length,campusCards:1,projectCards:1,separateRecordSections:6}));
