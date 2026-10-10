const HEADING=/^(个人总结|教育经历|教育背景|学术进展|学术成果|科研经历|项目经历|实习经历|工作经历|校园经历|技能\s*[\/／、]?\s*证书|专业技能|证书|外语能力|语言能力)$/;
const SCHOOL=/[\u4e00-\u9fa5A-Za-z·]{2,40}(?:大学|学院|中学|学校)/;
const DATE=/(?:(?:19|20)\d{2}\s*[年.\/-]\s*\d{1,2}|\d{1,2}\s*[.\/-]\s*(?:19|20)\d{2})\s*月?/g;
const COMMON_SURNAME="赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄穆萧尹姚邵汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万柯管卢莫房解应宗丁邓郁单杭洪包诸左石崔吉龚程邢裴陆荣翁荀羊惠甄曲家封芮储靳段富巫乌焦巴牧山谷车侯全班秋仲伊宫宁栾甘厉祖武符刘景詹束龙叶幸司黎白怀从卓池乔曾沙鞠关查荆红游权盖益桓付";

const clean=value=>String(value||"").replace(/\u00a0/g," ").replace(/\b(0[1-9]|1[0-2])1((?:19|20)\d{2})\b/g,"$1/$2").replace(/([\u4e00-\u9fa5])\s+(?=[\u4e00-\u9fa5])/g,"$1").replace(/[ \t]+/g," ").trim();
const uniqueBy=(items,key)=>items.filter((item,index)=>index===items.findIndex(other=>key(other)===key(item)));
function joinNarrative(lines=[]){
  const paragraphs=[];
  for(const raw of lines){const line=clean(raw).replace(/^[•·●▪]\s*/,"");if(!line)continue;const previous=paragraphs.at(-1)||"";const newParagraph=!previous||/[。；;！？]$/.test(previous)||/^[\u4e00-\u9fa5A-Za-z0-9 /]{2,18}[：:]/.test(line);if(newParagraph)paragraphs.push(line);else paragraphs[paragraphs.length-1]+=(/[A-Za-z0-9]$/.test(previous)&&/^[A-Za-z0-9]/.test(line)?" ":"")+line;}
  return paragraphs.join("\n");
}
export function normalizedDate(value=""){
  const source=clean(value);const monthFirst=source.match(/(?:^|\D)(0?[1-9]|1[0-2])\s*[.\/-]\s*((?:19|20)\d{2})(?:\D|$)/);if(monthFirst)return `${monthFirst[2]}-${String(monthFirst[1]).padStart(2,"0")}`;
  const yearFirst=source.match(/((?:19|20)\d{2})(?:\s*[年.\/-]\s*(\d{1,2}))?/);return yearFirst?`${yearFirst[1]}-${String(yearFirst[2]||"01").padStart(2,"0")}`:"";
}
const datesIn=value=>[...clean(value).matchAll(new RegExp(DATE.source,"g"))].map(match=>normalizedDate(match[0])).filter(Boolean);
export function buildVisualLines(items=[]){
  const rows=[];
  for(const item of items){
    const text=clean(item.str);if(!text)continue;
    const x=Number(item.transform?.[4]||0),y=Number(item.transform?.[5]||0);
    let row=rows.find(candidate=>Math.abs(candidate.y-y)<=2);
    if(!row){row={y,items:[]};rows.push(row);}row.items.push({x,text,width:Number(item.width||0)});
  }
  return rows.sort((a,b)=>b.y-a.y).map(row=>{
    const parts=row.items.sort((a,b)=>a.x-b.x);let value="",end=0;
    for(const part of parts){const gap=part.x-end;if(value&&gap>2&&!/^[,，。；;：:|｜）)\/]/.test(part.text))value+=" ";value+=part.text;end=Math.max(end,part.x+part.width);}
    return clean(value).replace(/\s+([,，。；;：:|｜）)])/g,"$1");
  }).filter(Boolean);
}
function section(lines,matcher){
  const start=lines.findIndex(line=>matcher.test(clean(line)));
  if(start<0)return [];
  let end=lines.length;for(let index=start+1;index<lines.length;index++){if(HEADING.test(clean(lines[index]))){end=index;break;}}
  return lines.slice(start+1,end).map(clean).filter(Boolean);
}
function labeled(text,labels,pattern="[^\\n|]{1,80}"){
  const match=text.match(new RegExp(`(?:${labels})\\s*[：:]\\s*(${pattern})`,"i"));return clean(match?.[1]||"").replace(/\s{2,}.*/,"");
}
function filenameHints(fileName=""){
  const base=fileName.replace(/\.[^.]+$/,"").replace(/[_-](?:19|20)\d{6}$/,"");const parts=base.split(/[_＿]/).map(clean).filter(Boolean);
  return {school:parts.find(part=>SCHOOL.test(part))||"",major:parts.find(part=>/专业|工程|安全|管理|文学|经济|金融|法学|医学|教育|计算机|物联网|电子|自动化/.test(part)&&!SCHOOL.test(part))||"",name:[...parts].reverse().find(part=>/^[\u4e00-\u9fa5·]{2,4}$/.test(part)&&!SCHOOL.test(part))||""};
}
function majorCategory(major=""){
  if(/计算机|软件|网络|信息安全|网络空间安全|物联网|电子|通信|自动化|机械|土木|材料|能源|电气|建筑|工程/.test(major))return "工学";
  if(/数学|物理|化学|生物|地理|统计/.test(major))return "理学";
  if(/金融|经济|财政|贸易/.test(major))return "经济学";
  if(/管理|会计|工商|行政|物流|旅游/.test(major))return "管理学";
  if(/法学|政治|社会|公安/.test(major))return "法学";
  if(/教育|体育/.test(major))return "教育学";
  if(/中文|汉语言|外语|新闻|传播/.test(major))return "文学";
  if(/临床|医学|药学|护理/.test(major))return "医学";
  if(/农学|林学|园艺|动物/.test(major))return "农学";
  return "";
}
function parseEducation(lines,hints){
  const block=section(lines,/^(教育经历|教育背景)$/);const result=[];
  for(let index=0;index<block.length;index++){
    const school=block[index].match(SCHOOL)?.[0];if(!school)continue;
    const nearby=[block[index],...block.slice(index+1,index+4).filter(line=>!SCHOOL.test(line)&&!HEADING.test(line))];const joined=nearby.join(" ");
    const dates=datesIn(joined);
    const levelHit=joined.match(/博士研究生|博士|硕士研究生|硕士|研究生|本科|大专|专科|高中|中专/)?.[0]||"";
    const level=/博士/.test(levelHit)?"博士研究生":/硕士|研究生/.test(levelHit)?"硕士研究生":levelHit==="专科"?"大专":levelHit;
    const detail=nearby.slice(1).find(line=>/[|｜]/.test(line)||/(博士|硕士|本科|大专|专科|高中|中专)/.test(line))||"";
    const inline=clean(block[index].replace(school,"").replace(new RegExp(DATE.source,"g"),"").replace(/GPA\s*[：:]?\s*\d+(?:\.\d+)?/ig,"").replace(/博士研究生|博士|硕士研究生|硕士|研究生|本科|大专|专科|高中|中专/g,"").replace(/[-—–至·|｜,，;；'“”]+/g," "));
    let major=inline&&inline.length<=30?inline:clean(detail.split(/[|｜]/)[0]).replace(/^(专业|主修)\s*[：:]?/,"");
    if(!major||/(北京|上海|天津|重庆|全日制|非全日制)/.test(major))major=school===hints.school?hints.major:"";
    const schoolCity=detail.match(/(?:全日制|非全日制)\s+([\u4e00-\u9fa5]{2,14})/)?.[1]||"";const gpa=joined.match(/GPA\s*[：:]?\s*(\d+(?:\.\d+)?)/i)?.[1]||"";
    const start=dates[0]||"",end=dates[1]||"";let duration="";if(start&&end){const months=(Number(end.slice(0,4))-Number(start.slice(0,4)))*12+Number(end.slice(5,7))-Number(start.slice(5,7));duration=String(Math.round(months/6)/2);}
    const currentMonth=new Date().toISOString().slice(0,7);result.push({school,faculty:"",major,majorCategory:majorCategory(major),level,degree:/博士/.test(level)?"博士":/硕士/.test(level)?"硕士":level==="本科"?"学士":"",schoolCity,schoolType:"",educationStatus:end&&end>=currentMonth?"在读":end?"已毕业":"",duration,start,end,studyForm:/非全日制/.test(joined)?"非全日制":/全日制/.test(joined)?"全日制":"",admissionType:"",gpa,majorRank:"",jointTraining:""});
  }
  return uniqueBy(result,item=>`${item.school}|${item.start}|${item.level}`).sort((a,b)=>(b.start||"").localeCompare(a.start||""));
}
function parseWork(lines){
  const blocks=[{type:"实习",lines:section(lines,/^实习经历$/)},{type:"工作",lines:section(lines,/^工作经历$/)}];const result=[];
  for(const block of blocks){
    for(let index=0;index<block.lines.length;index++){
      const line=block.lines[index];const dates=datesIn(line);if(!dates.length)continue;
      const withoutDates=clean(line.replace(new RegExp(DATE.source,"g"),"").replace(/\s*[-—–至]\s*$/,"")).replace(/\s*[-—–至]\s*$/,"");
      let company="",role="";const split=withoutDates.split(/[|｜]/).map(clean).filter(Boolean);
      if(split.length>1){company=split[0];role=split.slice(1).join("｜");}
      else{const roleHit=withoutDates.match(/((?:AI|Agent|Java|Python|算法|后端|前端|软件|测试|产品|数据|运营|财务|人力|审计|咨询|研发)?\s*(?:开发)?(?:工程师|实习生|经理|专员|顾问|助理|研究员))$/i);if(roleHit){role=roleHit[1];company=clean(withoutDates.slice(0,roleHit.index));}}
      if(!company||!role)continue;
      const detail=[];let cursor=index+1;
      while(cursor<block.lines.length){const next=block.lines[cursor];if(datesIn(next).length&&(/(实习生|工程师|经理|专员|顾问|助理|研究员)/i.test(next)||/[|｜]/.test(next)))break;detail.push(next.replace(/^[•·●▪]\s*/,""));cursor++;}
      result.push({type:/实习/.test(role)?"实习":block.type,company:clean(company),role:clean(role).replace(/^[-—–至]+|[-—–至]+$/g,"").trim(),start:dates[0]||"",end:dates[1]||"",detail:joinNarrative(detail)});index=cursor-1;
    }
  }
  return uniqueBy(result,item=>`${item.company}|${item.role}|${item.start}`);
}
function parseTimeline(lines,heading,type){
  const block=section(lines,heading),result=[];
  for(let index=0;index<block.length;index++){
    const line=block[index],dates=datesIn(line);if(!dates.length)continue;
    const header=clean(line.replace(new RegExp(DATE.source,"g"),"").replace(/\s*[-—–至]\s*$/,"")).replace(/^[-—–至]+|[-—–至]+$/g,"").trim();if(!header)continue;
    const parts=header.split(/[|｜]/).map(clean).filter(Boolean),detail=[];let cursor=index+1;
    while(cursor<block.length&&!datesIn(block[cursor]).length){detail.push(block[cursor].replace(/^[•·●▪]\s*/,""));cursor++;}
    if(type==="project")result.push({name:parts[0],role:parts.slice(1).join("｜"),start:dates[0]||"",end:dates[1]||"",detail:joinNarrative(detail)});
    else result.push({organization:parts[0],role:parts.slice(1).join("｜"),start:dates[0]||"",end:dates[1]||"",detail:joinNarrative(detail)});
    index=cursor-1;
  }
  return uniqueBy(result,item=>`${item.name||item.organization}|${item.start}`);
}
function parseCertificates(text){
  const line=text.match(/(?:证书|资格证书)\s*[：:]\s*([^\n]+)/)?.[1]||"";
  return uniqueBy(line.split(/[、，,；;]/).map(clean).filter(Boolean).map(name=>({name,level:"",number:"",date:"",issuer:"",expiry:""})),item=>item.name.toLowerCase());
}
function parseLanguages(text,certificates){
  const result=[];
  const english=text.match(/(?:CET\s*[-]?\s*([46])|大学英语([四六])级|英语([四六])级)(?:\s*[：:]?\s*(\d{2,3}))?/i);
  if(english){const token=english[1]||english[2]||english[3],six=/6|六/.test(token);result.push({name:"英语",level:six?"熟练":"良好",certificate:six?"大学英语六级（CET-6）":"大学英语四级（CET-4）",score:english[4]||"",oral:"",writing:""});}
  const ielts=text.match(/(?:雅思|IELTS)\s*(\d(?:\.\d)?)/i);if(ielts)result.push({name:"英语",level:"熟练",certificate:"雅思",score:ielts[1],oral:"",writing:""});
  const toefl=text.match(/(?:托福|TOEFL)\s*(\d{2,3})/i);if(toefl)result.push({name:"英语",level:"熟练",certificate:"托福",score:toefl[1],oral:"",writing:""});
  if(!result.length&&certificates.some(item=>/英语|CET|雅思|托福/i.test(item.name)))result.push({name:"英语",level:"",certificate:certificates.find(item=>/英语|CET|雅思|托福/i.test(item.name)).name,score:"",oral:"",writing:""});
  return uniqueBy(result,item=>`${item.name}|${item.certificate}`);
}
export function parseResumeDocument({text="",lines=[],fileName=""}={}){
  const visualLines=(lines.length?lines:String(text).split(/\r?\n/)).map(clean).filter(Boolean);const joined=visualLines.join("\n");const hints=filenameHints(fileName);const parsed={};
  const firstName=visualLines.slice(0,10).find(line=>/^[\u4e00-\u9fa5·]{2,4}$/.test(line)&&!HEADING.test(line)&&!/(大学|学院)/.test(line));
  const contactLine=visualLines.slice(0,10).find(line=>/@|(?<!\d)1[3-9]\d{9}(?!\d)/.test(line))||"";const surnameName=contactLine.match(new RegExp(`([${COMMON_SURNAME}][\\u4e00-\\u9fa5·]{1,2})(?=回|邮|电|手机|1[3-9]|[^\\u4e00-\\u9fa5]|$)`))?.[1]||"";
  parsed.name=labeled(joined,"姓名|Name","[\\u4e00-\\u9fa5·A-Za-z ]{2,24}")||firstName||surnameName||hints.name;
  parsed.phone=labeled(joined,"手机号码|手机号|手机|联系电话|电话","(?:\\+?86[- ]?)?1[3-9]\\d{9}")||joined.match(/(?<!\d)1[3-9]\d{9}(?!\d)/)?.[0]||"";
  parsed.email=labeled(joined,"电子邮件|电子邮箱|邮箱|E-?mail","[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}")||joined.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]||"";
  parsed.currentResidence=labeled(joined,"现居城市|常住地址|目前居住地|现居住地|居住地址","[^\\n|]{1,40}");
  parsed.candidateType=labeled(joined,"当前状态|求职状态","[^\\n|]{1,40}");
  parsed.gender=labeled(joined,"性别","男|女|其他");
  const birth=labeled(joined,"出生年月|出生日期|生日","(?:19|20)\\d{2}(?:[年.\\/-]\\d{1,2})(?:[月.\\/-]\\d{1,2}日?)?");
  const birthParts=birth.match(/^(\d{4})[年.\/-](\d{1,2})(?:[月.\/-](\d{1,2}))?/);
  if(birthParts)parsed.birthday=[birthParts[1],birthParts[2].padStart(2,'0'),...(birthParts[3]?[birthParts[3].padStart(2,'0')]:[])].join('-');
  parsed.ethnicity=labeled(joined,"民族","[\\u4e00-\\u9fa5]{1,10}(?:族)?");parsed.nationality=labeled(joined,"国籍","[^\\n| ]{1,12}");parsed.politicalStatus=labeled(joined,"政治面貌|政治身份","[^\\n|]{1,16}");
  parsed.hukouLocation=labeled(joined,"户口所在地|户籍所在地|户籍地址","[^\\n|]{1,50}");parsed.nativePlace=labeled(joined,"籍贯|祖籍","[^\\n|]{1,30}");parsed.studentOrigin=labeled(joined,"生源所在地|生源地","[^\\n|]{1,30}");
  parsed.education=parseEducation(visualLines,hints);parsed.workExperience=parseWork(visualLines);parsed.campusExperience=parseTimeline(visualLines,/^校园经历$/,"campus");parsed.projects=parseTimeline(visualLines,/^项目经历$/,"project");parsed.certificates=parseCertificates(joined);parsed.languages=parseLanguages(joined,parsed.certificates);
  const summaryLines=section(visualLines,/^个人总结$/);if(summaryLines.length)parsed.summary=joinNarrative(summaryLines);
  const skillLines=section(visualLines,/^(技能\s*[\/／、]?\s*证书|专业技能)$/).filter(line=>!/^(证书|资格证书)\s*[：:]/.test(line));if(skillLines.length)parsed.skills=joinNarrative(skillLines);
  const academic=section(visualLines,/^(学术进展|学术成果|科研经历)$/);if(academic.length){const title=academic.find(line=>line.length>8&&!/^[•·●▪]/.test(line));if(title)parsed.publications=[{type:"论文",title,venue:"",authorRank:"",date:"",identifier:""}];}
  for(const key of Object.keys(parsed)){if(parsed[key]===""||(Array.isArray(parsed[key])&&!parsed[key].length))delete parsed[key];}
  const basic=["name","phone","email","currentResidence","candidateType","gender","birthday","ethnicity","nationality","politicalStatus","hukouLocation","nativePlace","studentOrigin"].filter(key=>parsed[key]).length;
  const summary=`${basic} 项基础信息、${parsed.education?.length||0} 段教育、${parsed.workExperience?.length||0} 段工作/实习、${parsed.campusExperience?.length||0} 段校园经历、${parsed.projects?.length||0} 个项目、${parsed.languages?.length||0} 项外语、${parsed.certificates?.length||0} 项证书`;
  const warnings=[];if(!parsed.name)warnings.push("未可靠识别姓名");if(!parsed.education?.length)warnings.push("未识别教育经历");
  return {parsed,summary,warnings,lines:visualLines};
}
