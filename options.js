import * as pdfjsLib from "./vendor/pdf.min.mjs";
import {buildVisualLines,parseResumeDocument} from "./resume-parser.js";
import {REGION_DATA} from "./region-data.js";
pdfjsLib.GlobalWorkerOptions.workerSrc=chrome.runtime.getURL("vendor/pdf.worker.min.mjs");

const storage = globalThis.chrome?.storage?.local || { get: async()=>({}), set: async()=>{} };
const form = document.getElementById("profileForm");
const arrays = ["education","workExperience","campusExperience","projects","languages","awards","competitions","certificates","publications","family","customFields"];
const schemas = {
  education: { title:"教育经历", fields:[
    ["level","学历层次","select",["","博士研究生","硕士研究生","本科","大专","高中","中专 / 中职","其他"]],
    ["school","学校名称","text"],["faculty","院系名称","text"],["major","专业名称","text"],
    ["majorCategory","专业类别","major-category"],["degree","学位","text"],["schoolCity","学校所在城市","region"],
    ["schoolType","学校类型","select",["","双一流","985 工程","211 工程","普通本科","高职高专","中学","境外院校","其他"]],
    ["educationStatus","学历状态","select",["","在读","已毕业","结业","肄业","其他"]],
    ["duration","学制（年）","select",["","1","1.5","2","2.5","3","3.5","4","5","6","7","8"]],
    ["start","入学时间","date-select"],["end","毕业时间","date-select"],["range","起止时间（自动计算）","range"],
    ["studyForm","教育方式","select",["","全日制","非全日制","函授","自考","网络教育","在职教育","其他"]],
    ["admissionType","招生类别","select",["","统招","单招","专升本","定向","委培","保送","自主招生","其他"]],
    ["gpa","成绩绩点","number"],["majorRank","专业排名（前 %）","select",["","1","3","5","10","20","30","50","100"]],
    ["jointTraining","是否联合培养","select",["","是","否"]]
  ]},
  workExperience: { title:"工作 / 实习经历", fields:[
    ["type","经历类型","select",["","工作","实习","项目"]],["company","单位名称","text"],["role","岗位 / 职务","text"],
    ["start","开始时间","month"],["end","结束时间","month"],["detail","主要工作与成果","textarea"]
  ]},
  campusExperience: { title:"校园经历", fields:[
    ["organization","学校 / 组织名称","text"],["role","职务 / 角色","text"],["start","开始时间","month"],["end","结束时间","month"],["detail","主要工作与成果","textarea"]
  ]},
  projects: { title:"项目经历", fields:[
    ["name","项目名称","text"],["role","项目角色","text"],["start","开始时间","month"],["end","结束时间","month"],["detail","项目描述与成果","textarea"]
  ]},
  languages: { title:"外语能力", fields:[
    ["name","语种","select",["","英语","日语","俄语","法语","德语","西班牙语","韩语","其他"]],["level","熟练程度","select",["","母语","精通","熟练","良好","一般"]],["certificate","考试 / 证书","select",["","大学英语四级（CET-4）","大学英语六级（CET-6）","英语专业四级","英语专业八级","托福（TOEFL）","雅思（IELTS）","其他"]],["score","成绩","text"],["oral","口语能力","select",["","精通","熟练","良好","一般"]],["writing","读写能力","select",["","精通","熟练","良好","一般"]]
  ]},
  awards: { title:"奖惩记录", fields:[
    ["type","类型","select",["","奖励","处分"]],["name","奖项 / 处分名称","text"],["level","级别","text"],["date","时间","month"],["issuer","授予 / 处理单位","text"],["detail","补充说明","textarea"]
  ]},
  competitions: { title:"竞赛记录", fields:[
    ["name","竞赛名称","text"],["award","获奖情况","text"],["level","竞赛级别","text"],["date","时间","month"],["organizer","主办单位","text"],["role","本人角色","text"]
  ]},
  certificates: { title:"证书", fields:[
    ["name","证书 / 资格名称","text"],["level","等级 / 成绩","text"],["number","证书编号","text"],["date","取得时间","month"],["issuer","颁发机构","text"],["expiry","有效期至","month"]
  ]},
  publications: { title:"学术成果", fields:[
    ["type","成果类型","select",["","论文","专著","专利","软件著作权","研究报告","其他"]],["title","题目 / 名称","text"],["venue","期刊 / 出版社 / 授权单位","text"],["authorRank","作者排序","text"],["date","发表 / 授权时间","month"],["identifier","DOI / ISBN / 专利号","text"]
  ]},
  family: { title:"家庭成员", fields:[
    ["relation","与本人关系","select",["","父亲","母亲","配偶","丈夫","妻子","儿子","女儿","兄弟","姐妹","祖父","祖母","外祖父","外祖母","其他"]],["name","姓名","text"],["birthday","出生年月","month"],["age","年龄","number"],["politicalStatus","政治面貌","select",["","中共党员","中共预备党员","共青团员","群众","民主党派","其他"]],["workUnit","工作单位","text"],["position","职务 / 职业","text"],["phone","联系电话","text"]
  ]},
  customFields: { title:"自定义字段", fields:[
    ["label","网页字段名称","text"],["value","需要填写的内容","textarea"]
  ]}
};
const example = {
  name:"陈予安", formerName:"", gender:"男", birthday:"1999-05-18", birthPlace:"江苏省苏州市", ethnicity:"汉族", nationality:"中国", politicalStatus:"中共党员", politicalDate:"2021-06", height:"175", weight:"65", maritalStatus:"未婚", healthStatus:"良好", idType:"居民身份证", idNumber:"", householdType:"城镇", hukouLocation:"江苏省苏州市", beijingHukouNeed:"否", nativePlace:"江苏苏州", studentOrigin:"江苏苏州", candidateType:"应届毕业生", archiveLocation:"华东理工大学学生档案室",
  phone:"13800000000", email:"yuan.chen@example.com", currentResidence:"上海市徐汇区", postalCode:"200237", website:"https://portfolio.example.com", emergencyName:"陈建国", emergencyRelation:"父亲", emergencyPhone:"13900000000", wechat:"",
  employmentStatus:"在校", summary:"责任心强，具备扎实的数据分析和项目协作能力，能够快速理解复杂业务并推进落地。",
  education:[
    {level:"硕士研究生",school:"华东理工大学",faculty:"商学院",major:"管理科学与工程",majorCategory:"管理学",degree:"管理学硕士",schoolCity:"上海市",schoolType:"双一流",educationStatus:"在读",duration:"3",start:"2023-09-01",end:"2026-06-30",studyForm:"全日制",admissionType:"统招",gpa:"3.8",majorRank:"10",jointTraining:"否"},
    {level:"本科",school:"苏州大学",faculty:"计算机科学与技术学院",major:"信息管理与信息系统",majorCategory:"管理学",degree:"管理学学士",schoolCity:"江苏省苏州市",schoolType:"211 工程",educationStatus:"已毕业",duration:"4",start:"2019-09-01",end:"2023-06-30",studyForm:"全日制",admissionType:"统招",gpa:"3.6",majorRank:"20",jointTraining:"否"},
    {level:"高中",school:"苏州市第一中学",faculty:"",major:"",majorCategory:"",degree:"",schoolCity:"江苏省苏州市",schoolType:"中学",educationStatus:"已毕业",duration:"3",start:"2016-09-01",end:"2019-06-30",studyForm:"全日制",admissionType:"统招",gpa:"",majorRank:"",jointTraining:"否"}
  ],
  workExperience:[{type:"实习",company:"某数据科技公司",role:"数据分析实习生",start:"2024-07",end:"2024-10",detail:"整理业务数据并搭建分析看板，支持周度经营复盘。"}],
  campusExperience:[{organization:"华东理工大学学生会",role:"部门负责人",start:"2023-09",end:"2024-06",detail:"组织校园活动并协调跨部门志愿者。"}],
  projects:[{name:"经营数据分析看板",role:"项目负责人",start:"2024-03",end:"2024-06",detail:"完成指标设计、数据清洗与可视化交付。"}],
  languages:[{name:"英语",level:"熟练",certificate:"大学英语六级（CET-6）",score:"568",oral:"良好",writing:"熟练"}],
  awards:[{type:"奖励",name:"研究生国家奖学金",level:"国家级",date:"2025-10",issuer:"教育部",detail:""}],
  competitions:[{name:"全国大学生创新创业竞赛",award:"省级金奖",level:"省级",date:"2022-08",organizer:"省教育厅",role:"项目负责人"}],
  certificates:[{name:"大学英语六级",level:"568 分",number:"",date:"2021-12",issuer:"教育部教育考试院",expiry:""}],
  publications:[{type:"论文",title:"数字化转型对组织效率的影响研究",venue:"管理科学学报",authorRank:"第二作者",date:"2025-05",identifier:""}],
  family:[
    {relation:"父亲",name:"陈建国",birthday:"1972-03",age:"",politicalStatus:"中共党员",workUnit:"苏州某制造企业",position:"工程师",phone:""},
    {relation:"母亲",name:"李敏",birthday:"1974-08",age:"",politicalStatus:"群众",workUnit:"苏州市某中学",position:"教师",phone:""}
  ], personalReport:"",abilityStatement:"具备数据分析、跨部门沟通和项目推进能力，能够快速理解复杂业务并形成可执行方案。",jobSeekingMethod:"校园招聘",specialNotes:"",customFields:[]
};
let draft = normalizeProfile({});
let profileStore={profiles:[],activeProfileId:""};
const ETHNICITIES=["","汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族","哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族","土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族","乌孜别克族","俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族","其他"];

function esc(value="") { return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
const newId=()=>globalThis.crypto?.randomUUID?.()||`profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const shortRegion=value=>String(value||"").replace(/(特别行政区|维吾尔自治区|壮族自治区|回族自治区|自治区|省|市|地区|自治州|盟|区|县)$/g,"");
function regionSelection(value=""){
  const source=String(value||"").replace(/\s/g,"");
  const province=REGION_DATA.find(item=>source.includes(item.name)||source.includes(shortRegion(item.name)));
  const city=province?.cities.find(item=>source.includes(item.name)||source.includes(shortRegion(item.name)));
  const area=city?.areas.find(item=>source.includes(item.name)||source.includes(shortRegion(item.name)));
  return {province,city,area};
}
const optionTags=(items,selected,placeholder)=>`<option value="">${placeholder}</option>${items.map(item=>`<option value="${esc(item.code||item)}"${(item.code||item)===selected?" selected":""}>${esc(item.name||item)}</option>`).join("")}`;
function regionPickerMarkup(value="",attrs=""){
  const {province,city,area}=regionSelection(value);
  return `<div class="region-picker" ${attrs}><select data-region-part="province">${optionTags(REGION_DATA,province?.code,"选择省份")}</select><select data-region-part="city" ${province?"":"disabled"}>${optionTags(province?.cities||[],city?.code,"选择城市")}</select><select data-region-part="area" ${city?.areas?.length?"":"disabled"}>${optionTags(city?.areas||[],area?.code,"选择区县")}</select></div>`;
}
function datePickerMarkup(value="",includeDay=false,attrs=""){
  const [year="",month="",day=""]=String(value||"").split(/[-/]/);const current=new Date().getFullYear();const years=[];for(let y=current+12;y>=1950;y--)years.push(String(y));const months=Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0"));const days=Array.from({length:31},(_,i)=>String(i+1).padStart(2,"0"));
  return `<div class="date-picker" ${attrs} data-day="${includeDay}"><select data-date-part="year">${optionTags(years,year,"年")}</select><select data-date-part="month">${optionTags(months,month,"月")}</select>${includeDay?`<select data-date-part="day">${optionTags(days,day,"日")}</select>`:""}</div>`;
}
function pickerValue(container){
  if(container.classList.contains("region-picker")){const names=[...container.querySelectorAll("select")].map(select=>select.selectedOptions[0]?.textContent||"").filter(value=>value&&!/^选择/.test(value));return [...new Set(names)].join("");}
  const year=container.querySelector('[data-date-part="year"]')?.value||"",month=container.querySelector('[data-date-part="month"]')?.value||"",day=container.querySelector('[data-date-part="day"]')?.value||"";if(!year||!month)return "";return day?`${year}-${month}-${day}`:`${year}-${month}`;
}
function normalizeProfile(input={}) {
  const next={...input};
  if(!next.currentResidence&&next.communicationAddress)next.currentResidence=next.communicationAddress;
  delete next.communicationAddress;
  if(!Array.isArray(next.education)) next.education=[];
  if(!next.education.length && (next.school||next.degree||next.major)) next.education=[{level:next.degree||"",school:next.school||"",major:next.major||"",degree:"",start:next.eduStart||"",end:next.eduEnd||"",studyForm:"",educationType:""}];
  next.education=next.education.map(item=>{const value={...item};if(!value.admissionType&&value.unifiedEnrollment==="是")value.admissionType="统招";delete value.unifiedEnrollment;return value;});
  arrays.forEach(key=>{if(!Array.isArray(next[key]))next[key]=[];});
  for(const key of ["careerStart","company","workRole","workStart","workEnd","workDetail","skills"])delete next[key];
  delete next.role;
  return next;
}
function renderField(list,index,[key,label,type,options],value) {
  const attr=`data-list="${list}" data-index="${index}" data-key="${key}"`;
  if(type==="select") return `<label><span>${label}</span><select ${attr}>${options.map(x=>`<option value="${esc(x)}"${x===value?" selected":""}>${esc(x||"请选择")}</option>`).join("")}</select></label>`;
  if(type==="major-category") {const categories=["","哲学","经济学","法学","教育学","文学","历史学","理学","工学","农学","医学","军事学","管理学","艺术学","交叉学科","其他"];const disabled=!draft[list][index]?.level;return `<label><span>${label}</span><select ${attr}${disabled?" disabled":""}>${categories.map(x=>`<option value="${esc(x)}"${x===value?" selected":""}>${esc(x|| (disabled?"请先选择学历":"请选择"))}</option>`).join("")}</select></label>`;}
  if(type==="region") return `<label class="wide"><span>${label}</span>${regionPickerMarkup(value,`data-dynamic-list="${list}" data-index="${index}" data-key="${key}"`)}</label>`;
  if(type==="date-select") return `<label><span>${label}</span>${datePickerMarkup(value,true,`data-dynamic-list="${list}" data-index="${index}" data-key="${key}"`)}</label>`;
  if(type==="month") return `<label><span>${label}</span>${datePickerMarkup(value,false,`data-dynamic-list="${list}" data-index="${index}" data-key="${key}"`)}</label>`;
  if(type==="range") return `<label class="wide"><span>${label}</span><input value="${esc([draft[list][index]?.start,draft[list][index]?.end].filter(Boolean).join(" - "))}" readonly data-range-display="${index}" /></label>`;
  if(type==="textarea") return `<label class="wide"><span>${label}</span><textarea ${attr}>${esc(value)}</textarea></label>`;
  return `<label><span>${label}</span><input type="${type}"${type==="number"?' step="0.1" min="0"':""} value="${esc(value)}" ${attr} /></label>`;
}
function renderList(list) {
  const container=document.getElementById(`${list}List`); const schema=schemas[list];
  if(!draft[list].length){container.innerHTML=`<div class="empty-list">暂未添加${schema.title}</div>`;return;}
  container.innerHTML=draft[list].map((item,index)=>`<article class="list-card"><header><strong>${schema.title} ${String(index+1).padStart(2,"0")}</strong><div>${index?`<button type="button" data-move="${list}" data-index="${index}" data-dir="-1" title="上移">↑</button>`:""}${index<draft[list].length-1?`<button type="button" data-move="${list}" data-index="${index}" data-dir="1" title="下移">↓</button>`:""}<button type="button" data-remove="${list}" data-index="${index}" title="删除">×</button></div></header><div class="form-grid compact">${schema.fields.map(field=>renderField(list,index,field,item[field[0]]||"")).join("")}</div></article>`).join("");
}
function renderAllLists(){arrays.forEach(renderList);}
function renderStaticWidgets(profile={}){
  document.querySelectorAll("[data-region-field]").forEach(container=>{const field=container.dataset.regionField;container.outerHTML=regionPickerMarkup(profile[field]||"",`data-region-field="${field}"`);});
  document.querySelectorAll("[data-static-date]").forEach(container=>{const field=container.dataset.staticDate;container.outerHTML=datePickerMarkup(profile[field]||"",container.dataset.day==="true",`data-static-date="${field}"`);});
}
function fillStatic(profile={}){[...form.elements].forEach(el=>{if(el.name)el.value=profile[el.name]||"";});renderStaticWidgets(profile);}
function syncLists(){
  arrays.forEach(list=>{document.querySelectorAll(`[data-list="${list}"]`).forEach(el=>{const i=Number(el.dataset.index);if(draft[list][i])draft[list][i][el.dataset.key]=el.value.trim();});});
  document.querySelectorAll("[data-dynamic-list]").forEach(container=>{const item=draft[container.dataset.dynamicList]?.[Number(container.dataset.index)];if(item)item[container.dataset.key]=pickerValue(container);});
}
function readProfile(){syncLists();document.querySelectorAll("[data-region-field],[data-static-date]").forEach(container=>{const field=container.dataset.regionField||container.dataset.staticDate;const hidden=form.elements.namedItem(field);if(hidden)hidden.value=pickerValue(container);});const data=Object.fromEntries([...new FormData(form).entries()].map(([k,v])=>[k,String(v).trim()]));return normalizeProfile({...data,...Object.fromEntries(arrays.map(k=>[k,draft[k]]))});}
function loadProfile(profile){draft=normalizeProfile(structuredClone(profile||{}));fillStatic(draft);renderAllLists();}
function showToast(text){const el=document.getElementById("toast");el.textContent=text;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1900);}
function activeEntry(){return profileStore.profiles.find(item=>item.id===profileStore.activeProfileId);}
function renderProfileSwitch(){const select=document.getElementById("profileSwitch");select.innerHTML=profileStore.profiles.map((item,index)=>`<option value="${esc(item.id)}"${item.id===profileStore.activeProfileId?" selected":""}>${esc(item.data?.name||`未命名档案 ${index+1}`)}</option>`).join("");}
async function persistStore(){const entry=activeEntry();if(entry)entry.data=draft;await storage.set({profiles:profileStore.profiles,activeProfileId:profileStore.activeProfileId,profile:draft});renderProfileSwitch();}
async function saveProfile({quiet=false}={}){draft=readProfile();await persistStore();document.getElementById("saveState").textContent="刚刚保存到本地";if(!quiet)showToast("个人档案已保存");}
async function initializeStore(){const stored=await storage.get(["profiles","activeProfileId","profile"]);let profiles=Array.isArray(stored.profiles)?stored.profiles.filter(item=>item?.id&&item?.data):[];if(!profiles.length){profiles=[{id:newId(),data:normalizeProfile(stored.profile||{})}];}profileStore={profiles:profiles.map(item=>({...item,data:normalizeProfile(item.data)})),activeProfileId:stored.activeProfileId};if(!profileStore.profiles.some(item=>item.id===profileStore.activeProfileId))profileStore.activeProfileId=profileStore.profiles[0].id;renderProfileSwitch();loadProfile(activeEntry().data);await persistStore();}

function setImportProgress(fileName,message){const review=document.getElementById("importReview");document.getElementById("importFileName").textContent=fileName;document.getElementById("importSummary").textContent=message;review.hidden=false;}
async function createOcrWorker(fileName,label="图片简历"){
  const ocrModule=await import("./vendor/tesseract/tesseract.esm.min.js"),createWorker=ocrModule.createWorker||ocrModule.default?.createWorker;if(typeof createWorker!=="function")throw new Error("OCR 模块加载失败，请重新安装完整的插件包");let lastPercent=-1;
  return createWorker(["chi_sim","eng"],1,{workerPath:chrome.runtime.getURL("vendor/tesseract/worker.min.js"),corePath:chrome.runtime.getURL("vendor/tesseract/core/tesseract-core-simd-lstm.wasm.js"),langPath:chrome.runtime.getURL("vendor/tesseract/lang"),workerBlobURL:false,gzip:true,logger:message=>{if(message.status!=="recognizing text")return;const percent=Math.round((message.progress||0)*100);if(percent!==lastPercent&&percent%5===0){lastPercent=percent;setImportProgress(fileName,`${label}正在本地 OCR：${percent}%`);}}});
}
async function ocrPdf(pdf,fileName){
  const worker=await createOcrWorker(fileName,"该 PDF 没有文字层，");
  const pages=[];
  try{
    for(let number=1;number<=pdf.numPages;number++){
      setImportProgress(fileName,`该 PDF 没有文字层，正在本地 OCR 第 ${number}/${pdf.numPages} 页…`);
      const page=await pdf.getPage(number),viewport=page.getViewport({scale:2.35}),canvas=document.createElement("canvas");canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);const context=canvas.getContext("2d",{alpha:false});context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);await page.render({canvasContext:context,canvas,viewport}).promise;
      const result=await worker.recognize(canvas);pages.push(result.data.text||"");canvas.width=1;canvas.height=1;
    }
  }finally{await worker.terminate();}
  const text=pages.join("\n");return {text,lines:text.split(/\r?\n/).filter(Boolean),ocr:true};
}
async function ocrImage(file){const worker=await createOcrWorker(file.name);try{const result=await worker.recognize(file),text=result.data.text||"";return {text,lines:text.split(/\r?\n/).filter(Boolean),ocr:true};}finally{await worker.terminate();}}
async function extractText(file){
  const extension=file.name.split(".").pop()?.toLowerCase();
  if(extension==="json")return {json:JSON.parse(await file.text())};
  if(extension==="txt"||extension==="md"){const text=await file.text();return {text,lines:text.split(/\r?\n/)};}
  if(extension==="docx"){
    const result=await globalThis.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return {text:result.value,lines:result.value.split(/\r?\n/)};
  }
  if(["png","jpg","jpeg","webp"].includes(extension))return ocrImage(file);
  if(extension==="pdf"){
    const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const lines=[];
    for(let number=1;number<=pdf.numPages;number++){const content=await (await pdf.getPage(number)).getTextContent();lines.push(...buildVisualLines(content.items));}
    if(lines.join("").replace(/\s/g,"").length<40)return ocrPdf(pdf,file.name);
    return {text:lines.join("\n"),lines,ocr:false};
  }
  throw new Error("仅支持 PDF、DOCX、PNG、JPG、WEBP、TXT、Markdown 或 JSON 文件");
}
async function importResume(file){
  const review=document.getElementById("importReview");
  showToast("正在本地解析简历…");
  setImportProgress(file.name,"正在检查 PDF / DOCX 的文字层与结构…");
  try{
    const extracted=await extractText(file);let recognized="";
    const current=readProfile(),preserve=document.getElementById("mergeImport").checked;let imported,differentPerson=false;
    if(extracted.json){imported=normalizeProfile(extracted.json);recognized="JSON 档案已载入";}
    else{const result=parseResumeDocument({text:extracted.text,lines:extracted.lines,fileName:file.name});imported=normalizeProfile(result.parsed);recognized=`${extracted.ocr?"图片型 PDF 已完成本地 OCR；":""}已识别：${result.summary}${result.warnings.length?`；${result.warnings.join("、")}`:""}`;}
    if(imported.name&&current.name&&imported.name!==current.name){differentPerson=true;const old=activeEntry();if(old)old.data=current;let target=profileStore.profiles.find(item=>item.data?.name===imported.name);if(!target){target={id:newId(),data:normalizeProfile({})};profileStore.profiles.push(target);}profileStore.activeProfileId=target.id;loadProfile(normalizeProfile({...((preserve&&target.data)||{}),...imported}));}
    else loadProfile(normalizeProfile({...((preserve&&current)||{}),...imported}));
    await saveProfile({quiet:true});
    document.getElementById("importFileName").textContent=file.name;document.getElementById("importSummary").textContent=`${recognized}。${differentPerson?`已新建“${imported.name}”独立档案，旧档案不会混入。`:"已更新当前档案。"} 请继续核对。`;review.hidden=false;review.scrollIntoView({behavior:"smooth",block:"center"});showToast("解析完成并已保存为本地档案");
  }catch(error){showToast(`解析失败：${error.message}`);}
}

document.getElementById("ethnicitySelect").innerHTML=ETHNICITIES.map(value=>`<option value="${esc(value)}">${esc(value||"请选择民族")}</option>`).join("");
initializeStore();
document.querySelectorAll("[data-add]").forEach(button=>button.addEventListener("click",()=>{syncLists();draft[button.dataset.add].push({});renderList(button.dataset.add);document.getElementById(`${button.dataset.add}List`).lastElementChild?.scrollIntoView({behavior:"smooth",block:"center"});}));
document.addEventListener("click",event=>{
  const remove=event.target.closest("[data-remove]"); if(remove){syncLists();draft[remove.dataset.remove].splice(Number(remove.dataset.index),1);renderList(remove.dataset.remove);return;}
  const move=event.target.closest("[data-move]"); if(move){syncLists();const list=move.dataset.move,index=Number(move.dataset.index),target=index+Number(move.dataset.dir);[draft[list][index],draft[list][target]]=[draft[list][target],draft[list][index]];renderList(list);}
});
document.addEventListener("change",event=>{
  const select=event.target.closest(".region-picker select");if(select){const container=select.closest(".region-picker"),provinceSelect=container.querySelector('[data-region-part="province"]'),citySelect=container.querySelector('[data-region-part="city"]'),areaSelect=container.querySelector('[data-region-part="area"]');const province=REGION_DATA.find(item=>item.code===provinceSelect.value);if(select.dataset.regionPart==="province"){citySelect.innerHTML=optionTags(province?.cities||[],"","选择城市");citySelect.disabled=!province;areaSelect.innerHTML=optionTags([],"","选择区县");areaSelect.disabled=true;}else if(select.dataset.regionPart==="city"){const city=province?.cities.find(item=>item.code===citySelect.value);areaSelect.innerHTML=optionTags(city?.areas||[],"","选择区县");areaSelect.disabled=!city?.areas?.length;}const field=container.dataset.regionField;if(field){const hidden=form.elements.namedItem(field);if(hidden)hidden.value=pickerValue(container);}return;}
  const level=event.target.matches('[data-list="education"][data-key="level"]');if(level){syncLists();renderList("education");return;}
  const picker=event.target.closest("[data-dynamic-list]");if(picker){syncLists();if(picker.dataset.dynamicList==="education"&&["start","end"].includes(picker.dataset.key)){const index=Number(picker.dataset.index),display=document.querySelector(`[data-range-display="${index}"]`);if(display)display.value=[draft.education[index].start,draft.education[index].end].filter(Boolean).join(" - ");}}
});
document.getElementById("profileSwitch").addEventListener("change",async event=>{await saveProfile({quiet:true});profileStore.activeProfileId=event.target.value;loadProfile(activeEntry().data);await persistStore();showToast(`已切换到 ${draft.name||"未命名档案"}`);});
document.getElementById("newProfileBtn").addEventListener("click",async()=>{await saveProfile({quiet:true});const item={id:newId(),data:normalizeProfile({})};profileStore.profiles.push(item);profileStore.activeProfileId=item.id;loadProfile(item.data);await persistStore();showToast("已新建空白档案");});
document.getElementById("deleteProfileBtn").addEventListener("click",async()=>{const name=draft.name||"未命名档案";if(!confirm(`确定删除“${name}”吗？此操作只删除浏览器本地档案。`))return;profileStore.profiles=profileStore.profiles.filter(item=>item.id!==profileStore.activeProfileId);if(!profileStore.profiles.length)profileStore.profiles.push({id:newId(),data:normalizeProfile({})});profileStore.activeProfileId=profileStore.profiles[0].id;loadProfile(activeEntry().data);await persistStore();showToast("档案已删除");});
document.getElementById("sampleBtn").addEventListener("click",async()=>{await saveProfile({quiet:true});let item=profileStore.profiles.find(entry=>entry.id==="example-chen-yuan");if(!item){item={id:"example-chen-yuan",data:normalizeProfile(example)};profileStore.profiles.push(item);}else item.data=normalizeProfile(structuredClone(example));profileStore.activeProfileId=item.id;loadProfile(item.data);await saveProfile({quiet:true});showToast("已创建并切换到陈予安示例档案");});
document.getElementById("saveBtn").addEventListener("click",saveProfile);
form.addEventListener("submit",async event=>{event.preventDefault();await saveProfile();});
document.getElementById("exportBtn").addEventListener("click",()=>{const profile=readProfile();const blob=new Blob([JSON.stringify(profile,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${profile.name||"个人档案"}-简历脉冲.json`;a.click();URL.revokeObjectURL(url);showToast("JSON 备份已生成");});
const fileInput=document.getElementById("fileInput"),importDrop=document.getElementById("importDrop");
document.getElementById("importBtn").addEventListener("click",()=>fileInput.click());document.getElementById("chooseResumeBtn").addEventListener("click",()=>fileInput.click());
fileInput.addEventListener("change",async event=>{const file=event.target.files[0];if(file)await importResume(file);event.target.value="";});
for(const type of ["dragenter","dragover"]){importDrop.addEventListener(type,event=>{event.preventDefault();importDrop.classList.add("dragging");});}
for(const type of ["dragleave","drop"]){importDrop.addEventListener(type,event=>{event.preventDefault();importDrop.classList.remove("dragging");});}
importDrop.addEventListener("drop",event=>{const file=event.dataTransfer.files[0];if(file)importResume(file);});
document.getElementById("dismissImport").addEventListener("click",()=>document.getElementById("importReview").hidden=true);
