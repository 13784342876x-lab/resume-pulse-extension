(async()=>{
  const p=window.__RESUME_PULSE_PROFILE__||{};
  delete window.__RESUME_PULSE_PROFILE__;
  const options=window.__RESUME_PULSE_OPTIONS__||{};delete window.__RESUME_PULSE_OPTIONS__;
  const overwrite=Boolean(options.overwrite);
  const lists={education:p.education||[],workExperience:p.workExperience||[],campusExperience:p.campusExperience||[],projects:p.projects||[],languages:p.languages||[],awards:p.awards||[],competitions:p.competitions||[],certificates:p.certificates||[],publications:p.publications||[],family:p.family||[]};
  const compact=value=>String(value||"").toLowerCase().replace(/四/g,"4").replace(/六/g,"6").replace(/八/g,"8").replace(/[\s_\-:：/（）()【】\[\].·*]/g,"");
  const textOf=node=>String(node?.innerText||node?.textContent||"").trim();
  const labelText=node=>{const copy=node?.cloneNode(true);copy?.querySelectorAll('input,select,textarea,[role="listbox"],button').forEach(item=>item.remove());return textOf(copy);};
  const precedingHeading=el=>{
    let node=el;
    for(let depth=0;node&&depth<5;depth++,node=node.parentElement){
      let previous=node.previousElementSibling;
      for(let i=0;previous&&i<4;i++,previous=previous.previousElementSibling){
        if(/^(父亲|母亲|配偶|家庭关系)$/.test(textOf(previous)))return textOf(previous);
        const heading=previous.matches?.("h1,h2,h3,h4,h5,legend,.title,[class*='title'],[class*='Title']")?previous:previous.querySelector?.("h1,h2,h3,h4,h5,legend,.title,[class*='title'],[class*='Title']");
        if(heading&&textOf(heading))return textOf(heading);
      }
    }
    return "";
  };
  const localLabel=el=>{
    if(el.type==='radio'){
      const cell=el.closest('td,th'),group=el.closest('.form-item,.field,.ant-form-item,.el-form-item');
      if(cell?.previousElementSibling)return compact(labelText(cell.previousElementSibling));
      if(group)return compact(labelText(group));
    }
    const explicit=[...(el.labels||[])].map(labelText).join(' ')||labelText(el.closest('label'))||el.getAttribute('aria-label')||el.getAttribute('data-label');
    if(explicit)return compact(explicit);
    const cell=el.closest('td,th');
    if(cell?.previousElementSibling&&!cell.previousElementSibling.querySelector('input,select,textarea'))return compact(labelText(cell.previousElementSibling));
    const group=el.closest('.form-item,.field,.ant-form-item,.el-form-item,.layui-form-item');
    if(group)return compact(labelText(group));
    for(const sibling of [el.previousElementSibling,el.parentElement?.previousElementSibling]){
      if(sibling&&!sibling.matches('input,select,textarea')&&!sibling.querySelector('input,select,textarea')&&textOf(sibling).length<100)return compact(labelText(sibling));
    }
    return '';
  };
  const fieldContext=el=>{
    const direct=localLabel(el);
    if(direct)return compact(direct+' '+precedingHeading(el));
    const labels=(el.labels?[...el.labels].map(labelText).join(" "):"")||labelText(el.closest('label'));
    const byFor=el.id?textOf(document.querySelector(`label[for="${CSS.escape(el.id)}"]`)):"";
    const row=el.closest("tr"),cell=el.closest("td,th");
    const rowChildren=row?[...row.children]:[];
    const cells=rowChildren.map(labelText).join(" ");
    const previousCells=cell?rowChildren.slice(0,rowChildren.indexOf(cell)).map(labelText).join(" "):"";
    const previous=labels?" ":[el.previousElementSibling,el.parentElement?.previousElementSibling,cell?.previousElementSibling].map(textOf).join(" ");
    const group=el.closest(".form-item,.field,.ant-form-item,.el-form-item,.layui-form-item,[class*='formItem'],[class*='field'],li,fieldset,dl");
    const groupText=labels||row?"":labelText(group).slice(0,220);
    return compact([labels,byFor,el.getAttribute("aria-label"),el.getAttribute("data-label"),el.placeholder,el.name,el.id,el.autocomplete,previousCells,previous,cells,groupText,textOf(el.closest("fieldset")?.querySelector("legend")),precedingHeading(el)].join(" "));
  };
  const at=(key,index,field)=>lists[key]?.[index]?.[field]||"";
  const rules=[
    {id:"beijingHukouNeed",re:/(是否有北京户口落户需求|北京户口.*需求|进京落户.*需求|落户北京)/,get:()=>p.beijingHukouNeed},
    {id:"emergencyPhone",re:/(紧急联系电话|紧急联系方式|紧急联系人手机|紧急联系人电话)/,get:()=>p.emergencyPhone},
    {id:"emergencyName",re:/(紧急联系人姓名|紧急联系人(?!电话|手机|关系))/,get:()=>p.emergencyName},
    {id:"emergencyRelation",re:/(紧急联系人关系|与紧急联系人关系|紧急联系人.*关系)/,get:()=>p.emergencyRelation},
    {id:"familyName",re:/(家庭成员\d*|主要亲属\d*|家庭主要成员\d*|亲属\d*).*(姓名|name)/,get:i=>at("family",i,"name")},
    {id:"familyRelation",re:/(与本人关系|成员关系|亲属关系|亲属称谓|家庭成员\d*称谓)/,get:i=>at("family",i,"relation")},
    {id:"familyBirthday",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*(出生|生日)/,get:i=>at("family",i,"birthday")},
    {id:"familyAge",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*年龄/,get:i=>at("family",i,"age")},
    {id:"familyPolitical",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*政治面貌/,get:i=>at("family",i,"politicalStatus")},
    {id:"familyUnit",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*(工作单位|单位名称)/,get:i=>at("family",i,"workUnit")},
    {id:"familyPosition",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*(职务|职业)/,get:i=>at("family",i,"position")},
    {id:"familyPhone",re:/(家庭成员|主要亲属|家庭主要成员|亲属).*(电话|手机|联系方式)/,get:i=>at("family",i,"phone")},
    {id:"email",re:/(电子邮件|电子邮箱|邮箱|email|mailbox)/,get:()=>p.email},
    {id:"phone",re:/(手机号码|手机|联系电话|手机号|mobile|phone|tel)/,get:()=>p.phone},
    {id:"wechat",re:/(微信号|微信账号|wechat|weixin)/,get:()=>p.wechat},
    {id:"website",re:/(个人主页|个人网站|作品集|portfolio|homepage|website|github|blog)/,get:()=>p.website},
    {id:"idNumber",re:/(身份证号码|身份证号|证件号码|证件号|idnumber|identitynumber)/,get:()=>p.idNumber},
    {id:"idType",re:/(证件类型|证件类别|idtype)/,get:()=>p.idType},
    {id:"formerName",re:/(曾用名|原名|formername)/,get:()=>p.formerName},
    {id:"ethnicity",re:/(民族|ethnicity|ethnicgroup)/,get:()=>p.ethnicity},
    {id:"nationality",re:/(国籍|nationality|citizenship)/,get:()=>p.nationality},
    {id:"politicalDate",re:/(入党时间|入团时间|加入党派时间|政治面貌取得时间)/,get:()=>p.politicalDate},
    {id:"politicalStatus",re:/(政治面貌|党派|政治身份|politicalstatus)/,get:()=>p.politicalStatus},
    {id:"height",re:/(身高|height)/,get:()=>p.height},{id:"weight",re:/(体重|weight)/,get:()=>p.weight},
    {id:"maritalStatus",re:/(婚姻状况|婚姻状态|婚否|maritalstatus)/,get:()=>p.maritalStatus},
    {id:"healthStatus",re:/(健康状况|身体状况|healthstatus)/,get:()=>p.healthStatus},
    {id:"birthPlace",re:/(出生地|出生所在地|出生地点|birthplace)/,get:()=>p.birthPlace},
    {id:"householdType",re:/(户口性质|户籍性质|户口类别|householdtype)/,get:()=>p.householdType},
    {id:"hukouLocation",re:/(户口所在地|户籍所在地|户口地址|户籍地址)/,get:()=>p.hukouLocation},
    {id:"nativePlace",re:/(籍贯|祖籍|nativeplace)/,get:()=>p.nativePlace},
    {id:"studentOrigin",re:/(生源所在地|生源地|studentorigin)/,get:()=>p.studentOrigin},
    {id:"archiveLocation",re:/(档案所在地|档案保管地|人事档案|archivelocation)/,get:()=>p.archiveLocation},
    {id:"candidateType",re:/(人员类别|人员类型|考生类别|毕业生类别|candidatetype)/,get:()=>p.candidateType},
    {id:"communicationAddress",re:/(通信地址|通讯地址|邮寄地址|联系地址|correspondenceaddress|mailingaddress)/,get:()=>p.currentResidence||p.communicationAddress},
    {id:"currentResidence",re:/(常住地址|目前居住地|现居住地|现居地|居住地址|当前住址|currentresidence)/,get:()=>p.currentResidence||p.communicationAddress},
    {id:"postalCode",re:/(邮政编码|邮编|zipcode|postalcode)/,get:()=>p.postalCode},
    {id:"eduSchoolCity",re:/(学校所在城市|学校城市|院校所在地|院校所在城市)/,get:i=>at("education",i,"schoolCity")},
    {id:"eduSchoolType",re:/(学校类型|院校类型|院校类别)/,get:i=>at("education",i,"schoolType")},
    {id:"eduStatus",re:/(学历状态|教育经历.*状态|完成状态|在读状态)/,get:i=>at("education",i,"educationStatus")},
    {id:"eduFaculty",re:/(院系名称|所在院系|学院名称|院系)/,get:i=>at("education",i,"faculty")},
    {id:"eduMajorCategory",re:/(专业类别|专业大类|学科门类)/,get:i=>at("education",i,"majorCategory")},
    {id:"eduDuration",re:/(学制年|学制（年）|学制\(年\)|在校年数|学制)/,get:i=>at("education",i,"duration")},
    {id:"eduAdmissionType",re:/(招生类别|招生类型|入学方式)/,get:i=>at("education",i,"admissionType")},
    {id:"eduGpa",re:/(成绩绩点|平均绩点|绩点|gpa)/,get:i=>at("education",i,"gpa")},
    {id:"eduRank",re:/(专业排名|成绩排名|排名百分比)/,get:i=>at("education",i,"majorRank")},
    {id:"eduJoint",re:/(是否联合培养|联合培养)/,get:i=>at("education",i,"jointTraining")},
    {id:"eduSchool",re:/(毕业院校|学校名称|院校名称|就读学校|学校|university|college|school)/,get:i=>at("education",i,"school")},
    {id:"eduLevel",re:/(最高学历|学历层次|学历|educationlevel)/,get:i=>at("education",i,"level")},
    {id:"eduDegree",re:/(学位名称|所获学位|学位|degree)/,get:i=>at("education",i,"degree")},
    {id:"eduMajor",re:/(专业名称|所学专业|主修专业|专业|major)/,get:i=>at("education",i,"major")},
    {id:"eduStart",re:/(教育开始|入学时间|入学日期|就读开始|edustart)/,get:i=>at("education",i,"start")},
    {id:"eduEnd",re:/(教育结束|毕业时间|毕业日期|就读结束|eduend)/,get:i=>at("education",i,"end")},
    {id:"studyForm",re:/(学习形式|学习方式|教育方式|培养方式|是否全日制|studyform)/,get:i=>at("education",i,"studyForm")},
    {id:"educationType",re:/(学历性质|教育类型|educationtype)/,get:i=>at("education",i,"educationType")},
    {id:"languageName",re:/(外语|语言).*(语种|名称)|语种/,get:i=>at("languages",i,"name")},
    {id:"languageLevel",re:/(外语|语言).*(等级|级别|水平)|外语能力/,get:i=>at("languages",i,"level")},
    {id:"languageCertificate",re:/(外语|语言).*(证书|考试)/,get:i=>at("languages",i,"certificate")},
    {id:"languageScore",re:/(外语|语言).*(成绩|分数)/,get:i=>at("languages",i,"score")},
    {id:"workCompany",re:/(工作|实习|任职|就业).*(公司名称|单位名称|工作单位|实习单位)/,get:i=>at("workExperience",i,"company")},
    {id:"workRole",re:/(工作|实习|任职|就业).*(岗位|职位|职务)/,get:i=>at("workExperience",i,"role")},
    {id:"workStart",re:/(工作|实习|任职).*(开始时间|起始时间|入职时间)/,get:i=>at("workExperience",i,"start")},
    {id:"workEnd",re:/(工作|实习|任职).*(结束时间|截止时间|离职时间)/,get:i=>at("workExperience",i,"end")},
    {id:"workDetail",re:/(工作|实习|任职).*(工作内容|经历描述|主要职责|工作描述|业绩)/,get:i=>at("workExperience",i,"detail")},
    {id:"campusOrganization",re:/(校园经历|校内经历|学生工作).*(组织名称|单位名称|学校名称|社团名称|组织)/,get:i=>at("campusExperience",i,"organization")},
    {id:"campusRole",re:/(校园经历|校内经历|学生工作).*(职务|角色|职位)/,get:i=>at("campusExperience",i,"role")},
    {id:"campusStart",re:/(校园经历|校内经历|学生工作).*(开始时间|起始时间)/,get:i=>at("campusExperience",i,"start")},
    {id:"campusEnd",re:/(校园经历|校内经历|学生工作).*(结束时间|截止时间)/,get:i=>at("campusExperience",i,"end")},
    {id:"campusDetail",re:/(校园经历|校内经历|学生工作).*(经历描述|工作内容|主要职责|成果)/,get:i=>at("campusExperience",i,"detail")},
    {id:"projectName",re:/(项目经历|项目经验).*(项目名称|项目名|名称)/,get:i=>at("projects",i,"name")},
    {id:"projectRole",re:/(项目经历|项目经验).*(项目角色|担任角色|职务|职责)/,get:i=>at("projects",i,"role")},
    {id:"projectStart",re:/(项目经历|项目经验).*(开始时间|起始时间)/,get:i=>at("projects",i,"start")},
    {id:"projectEnd",re:/(项目经历|项目经验).*(结束时间|截止时间)/,get:i=>at("projects",i,"end")},
    {id:"projectDetail",re:/(项目经历|项目经验).*(项目描述|主要内容|项目内容|项目成果)/,get:i=>at("projects",i,"detail")},
    {id:"awardName",re:/(奖惩名称|奖励名称|奖项名称|荣誉名称|处分名称)/,get:i=>at("awards",i,"name")},
    {id:"awardType",re:/(奖惩类型|奖励处分类型)/,get:i=>at("awards",i,"type")},
    {id:"awardLevel",re:/(奖惩级别|奖励级别|荣誉级别)/,get:i=>at("awards",i,"level")},
    {id:"awardDate",re:/(获奖时间|奖励时间|处分时间|奖惩时间)/,get:i=>at("awards",i,"date")},
    {id:"awardIssuer",re:/(授予单位|颁奖单位|处分单位)/,get:i=>at("awards",i,"issuer")},
    {id:"competitionName",re:/(竞赛名称|比赛名称|大赛名称)/,get:i=>at("competitions",i,"name")},
    {id:"competitionAward",re:/(竞赛奖项|比赛奖项|获奖情况|获奖名次)/,get:i=>at("competitions",i,"award")},
    {id:"competitionLevel",re:/(竞赛级别|比赛级别)/,get:i=>at("competitions",i,"level")},
    {id:"competitionDate",re:/(参赛时间|竞赛时间|比赛时间)/,get:i=>at("competitions",i,"date")},
    {id:"certificateName",re:/(证书名称|资格名称|职业资格|技能证书)/,get:i=>at("certificates",i,"name")},
    {id:"certificateLevel",re:/(证书等级|考试成绩|资格等级)/,get:i=>at("certificates",i,"level")},
    {id:"certificateNumber",re:/(证书编号|资格证号)/,get:i=>at("certificates",i,"number")},
    {id:"certificateDate",re:/(证书取得时间|发证时间|取证时间)/,get:i=>at("certificates",i,"date")},
    {id:"publicationTitle",re:/(论文题目|专著名称|专利名称|成果名称|论文名称)/,get:i=>at("publications",i,"title")},
    {id:"publicationType",re:/(成果类型|论文类型|著作类型)/,get:i=>at("publications",i,"type")},
    {id:"publicationVenue",re:/(期刊名称|出版社|发表刊物|授权单位)/,get:i=>at("publications",i,"venue")},
    {id:"publicationRank",re:/(作者排序|作者位次|署名顺序)/,get:i=>at("publications",i,"authorRank")},
    {id:"publicationDate",re:/(发表时间|出版时间|授权时间)/,get:i=>at("publications",i,"date")},
    {id:"personalReport",re:/(个人情况报告|个人事项报告|本人情况报告)/,get:()=>p.personalReport},
    {id:"abilityStatement",re:/(请说明本人的能力|本人能力|能力说明|胜任能力)/,get:()=>p.abilityStatement},
    {id:"jobSeekingMethod",re:/(谋职方式|应聘渠道|招聘渠道|获知渠道)/,get:()=>p.jobSeekingMethod},
    {id:"specialNotes",re:/(特别提示说明|特殊情况说明|其他需要说明|补充说明)/,get:()=>p.specialNotes},
    {id:"employmentStatus",re:/(就业状态|工作状态|目前状态|在职状态|employmentstatus)/,get:()=>p.employmentStatus},
    {id:"summary",re:/(个人优势|自我评价|个人简介|自我介绍|个人总结|summary|profile|aboutme)/,get:()=>p.summary},
    {id:"birthday",re:/(出生日期|生日|出生年月|dateofbirth|birthday|dob)/,get:()=>p.birthday},
    {id:"gender",re:/(性别|gender|sex)/,get:()=>p.gender},
    {id:"name",re:/(中文姓名|真实姓名|应聘者姓名|候选人姓名|本人姓名|姓名|fullname|candidatename|applicantname)/,get:()=>p.name}
  ];
  const custom=(p.customFields||[]).filter(x=>compact(x.label).length>=2&&x.value);
  // Keep the record choice across button clicks, including editors reused for the next member.
  const familyKey=JSON.stringify([p.name,lists.family]);
  const familyState=window.__RESUME_PULSE_FAMILY_STATE__?.key===familyKey?window.__RESUME_PULSE_FAMILY_STATE__:{key:familyKey,next:0,groups:new WeakMap()};
  window.__RESUME_PULSE_FAMILY_STATE__=familyState;
  const familyAssignments=new WeakMap();
  let labelCache=new WeakMap(),controlCache=new WeakMap();
  const cachedControls=(node,kind,build)=>{let entry=controlCache.get(node);if(!entry){entry={};controlCache.set(node,entry);}return entry[kind]||(entry[kind]=build());};
  const familyFields=[[/与本人关系|成员关系|亲属关系|称谓|^关系$/,"relation"],[/姓名|name/i,"name"],[/年龄/,"age"],[/出生|生日/,"birthday"],[/政治面貌|政治身份/,"politicalStatus"],[/工作单位.*职务|单位及职务/,"unitAndPosition"],[/工作单位|单位名称/,"workUnit"],[/职务|职业/,"position"],[/电话|手机|联系方式/,"phone"],[/居住.*国家|居住国/,"residenceCountry"],[/备注/,"notes"]];
  const labelOnly=el=>{if(labelCache.has(el))return labelCache.get(el);const value=localLabel(el);labelCache.set(el,value);return value;};
  const familyEditorHit=(text,el)=>{
    const label=labelOnly(el);
    // Modern forms use nested divs rather than a form/table. Find the smallest
    // member card with its own relationship and name, excluding sidebar text.
    const controlsIn=node=>cachedControls(node,'family',()=>[...node.querySelectorAll('input,select,textarea,[role="combobox"],.el-select,.ant-select')].filter(item=>!item.disabled&&item.type!=='hidden'&&visible(item)&&!(item.closest(comboSelector)&&item.closest(comboSelector)!==item)));
    const fieldOf=item=>familyFields.find(([pattern])=>pattern.test(labelOnly(item)))?.[1];
    let group=null;
    for(let node=el.parentElement;node&&node!==document.body;node=node.parentElement){
      const items=controlsIn(node),names=items.filter(item=>fieldOf(item)==='name');
      if(names.length===1&&items.some(item=>fieldOf(item)==='relation')){group=node;break;}
    }
    group ||= el.closest('[role="dialog"],dialog,fieldset,form,table')||el.parentElement;
    const structural=controlsIn(group).some(item=>fieldOf(item)==='relation');
    if(!structural&&!/(家庭|亲属|社会关系)/.test(text+textOf(group?.querySelector('legend,h1,h2,h3'))+precedingHeading(group)))return null;
    const field=fieldOf(el);if(!field)return {id:'familyUnknown',value:''};
    const role=familyRoleHit(label);if(role)return role;
    if(roleAliases.some(([,pattern])=>pattern.test(label)))return {id:'familyMissingRole',value:''};
    if(!familyAssignments.has(group)){
      const controls=controlsIn(group);
      const identity=controls.filter(item=>['name','relation'].includes(familyFields.find(([pattern])=>pattern.test(labelOnly(item)))?.[1]));
      // Repeated rows remain handled by the ordinary per-field counters.
      if(identity.filter(item=>fieldOf(item)==='name').length>1)return {id:'familyAmbiguous',value:''};
      const previous=familyState.groups.get(group);
      const hasIdentity=identity.some(item=>!empty(item));
      const relation=identity.find(item=>fieldOf(item)==='relation'&&!empty(item));
      const read=item=>compact(item.tagName==='SELECT'?textOf(item.selectedOptions[0]):isCombo(item)?comboValue(item):item.value);
      const candidates=lists.family.map((member,index)=>({member,index})).filter(({member})=>relation?read(relation)===compact(member.relation):identity.some(item=>fieldOf(item)==='name'&&!empty(item)&&read(item)===compact(member.name)));
      const matched=candidates.length===1?candidates[0].index:-1;
      const explicit=Number.isInteger(options.familyIndex)&&options.familyIndex>=0&&options.familyIndex<lists.family.length?options.familyIndex:null;
      // A selected relationship is authoritative, even if a stale name belongs
      // to the applicant. Unknown/duplicate relationships must never fall back.
      const index=relation?matched:explicit!==null?explicit:matched>=0?matched:previous&&hasIdentity?previous.index:hasIdentity?-1:familyState.next;
      familyAssignments.set(group,{index,controls});
    }
    const assignment=familyAssignments.get(group),member=lists.family[assignment.index];
    return {id:`familyEditor:${field}`,value:member?(field==='age'?ageOf(member):field==='unitAndPosition'?[member.workUnit,member.position].filter(Boolean).join(' / '):member[field]):'',familyGroup:group,familyIndex:assignment.index};
  };
  const ageOf=member=>{if(member?.age)return member.age;const match=String(member?.birthday||"").match(/((?:19|20)\d{2})(?:[-/](\d{1,2}))?/);if(!match)return "";const now=new Date(),month=Number(match[2]||1);return String(now.getFullYear()-Number(match[1])-(now.getMonth()+1<month?1:0));};
  const roleAliases=[
    ["父亲",/(父亲|爸爸)/],["母亲",/(母亲|妈妈)/],["配偶",/(配偶)/],["丈夫",/(丈夫|先生)/],["妻子",/(妻子|太太)/],["儿子",/(儿子)/],["女儿",/(女儿)/],["兄弟",/(兄弟|哥哥|弟弟)/],["姐妹",/(姐妹|姐姐|妹妹)/],["祖父",/(祖父|爷爷)/],["祖母",/(祖母|奶奶)/],["外祖父",/(外祖父|外公)/],["外祖母",/(外祖母|外婆)/]
  ];
  const familyRoleHit=text=>{const alias=roleAliases.find(([,pattern])=>pattern.test(text));if(!alias)return null;const member=lists.family.find(item=>item.relation===alias[0]||roleAliases.find(entry=>entry[0]===alias[0])?.[1].test(item.relation||""));if(!member)return null;const fields=[[/姓名|name/,"name"],[/年龄/,"age"],[/出生|生日/,"birthday"],[/政治面貌|政治身份/,"politicalStatus"],[/工作单位|单位名称/,"workUnit"],[/职务|职业/,"position"],[/电话|手机|联系方式/,"phone"],[/与本人关系|成员关系|称谓/,"relation"]];const hit=fields.find(([pattern])=>pattern.test(text));if(!hit)return null;return{id:`family:${alias[0]}:${hit[1]}`,value:hit[1]==="age"?ageOf(member):member[hit[1]]};};
  const languageRowHit=(text,el)=>{if(el?.tagName!=="SELECT"||!/(英语能力|外语能力)/.test(text))return null;const row=el.closest("tr,.form-item,.field,.ant-form-item,.el-form-item,.layui-form-item,li,fieldset,dl")||el.parentElement;const selects=[...row.querySelectorAll("select")].filter(visible);if(selects.length<2)return null;const index=selects.indexOf(el);if(index<0)return null;const language=lists.languages.find(item=>/英语|english/i.test(item.name||""))||lists.languages[0];if(!language)return null;const optionText=selects.map(select=>[...select.options].map(option=>textOf(option)).join(" ")).join(" ");if(index===0&&/(CET|大学英语|托福|雅思|英语专业)/i.test(optionText))return{id:"languageCertificate",value:language.certificate};if(index===1)return{id:"languageScore",value:language.score||language.level};return null;};
  // Bind a whole education/work card to one record, not one counter per label.
  const recordKey=JSON.stringify([p.name,lists.education,lists.workExperience,lists.projects]);
  const records=window.__RESUME_PULSE_RECORDS__?.key===recordKey?window.__RESUME_PULSE_RECORDS__:{key:recordKey,education:{next:0,groups:new WeakMap()},workExperience:{next:0,groups:new WeakMap()},projects:{next:0,groups:new WeakMap()}};
  window.__RESUME_PULSE_RECORDS__=records;
  const assigned=new WeakMap();
  const mappings={
    projects:[[/项目名称|项目名|项目标题/,'name'],[/项目职责|具体职责|承担.*工作|负责.*工作/,'responsibilities'],[/项目角色|担任.*角色|担任.*职务|项目职务/,'role'],[/所在单位|所属单位|所属公司|单位名称/,'organization'],[/团队规模|团队人数|项目人数/,'teamSize'],[/开始|起始|启动/,'start'],[/结束|截止|完成时间/,'end'],[/项目介绍|项目描述|项目概况|项目内容|项目成果|背景意义/,'detail']],
    workExperience:[[/单位性质|公司性质|企业性质/,'companyType'],[/工作性质|任职性质/,'workType'],[/单位名称|公司名称|企业名称|实习单位|工作单位/,'company'],[/职位|岗位|职务/,'role'],[/开始|起始|入职/,'start'],[/结束|截止|离职/,'end'],[/工作内容|工作描述|主要职责|工作业绩|主要工作|成果/,'detail'],[/工作地区|工作地点|工作城市/,'location'],[/补充说明|备注/,'notes']],
    education:[[/是否.*该段学历/,'hasEducation'],[/专升本/,'upgraded'],[/双学位/,'dualDegree'],[/学生干部/,'studentLeader'],[/专业分类|专业类别|学科门类/,'majorCategory'],[/学校名称|毕业院校|就读学校|学校$/,'school'],[/学历|学历层次/,'level'],[/学位/,'degree'],[/专业/,'major'],[/院系|学院名称/,'faculty'],[/入学|开始|起始/,'start'],[/毕业时间|毕业日期|结束|截止/,'end'],[/全日制|教育方式|学习形式/,'studyForm'],[/统招|招生类别|招生类型/,'admissionType'],[/gpa|绩点|成绩/,'gpa'],[/学制/,'duration']]
  };
  mappings.education.unshift([/学位证书.*号|学位证.*号/,'degreeCertificateNumber'],[/学历证书.*号|毕业证.*号/,'educationCertificateNumber'],[/绩点制|绩点满分|gpa满分/,'gpaScale'],[/研究方向|研究课题|研究.*课题/,'researchTopic'],[/学历形式/,'studyForm'],[/院校中文名称/,'school']);
  familyFields.unshift([/职位|岗位/,'position'],[/地址|住址/,'address']);
  const recordHit=el=>{
    const local=item=>compact(labelOnly(item)+' '+(item.placeholder||'')+' '+(item.getAttribute('aria-label')||''));
    const controls=node=>cachedControls(node,'record',()=>[...node.querySelectorAll('input,select,textarea')].filter(item=>item.type!=='hidden'&&visible(item)));
    let group=null,kind=null;
    for(let node=el.parentElement;node&&node!==document.body;node=node.parentElement){
      const items=controls(node),labels=items.map(local);
      if(labels.some(t=>/与本人关系|亲属关系/.test(t)))return null;
      const schools=labels.filter(t=>/学校名称|毕业院校|就读学校/.test(t)).length;
      const companies=labels.filter(t=>/单位名称|公司名称|企业名称|实习单位/.test(t)).length;
      const projects=labels.filter(t=>/项目名称|项目名|项目标题/.test(t)).length;
      if(projects===1&&labels.some(t=>/项目角色|项目职责|项目介绍|项目描述|团队规模/.test(t))){group=node;kind='projects';break;}
      if(schools===1&&labels.some(t=>/学历|专业/.test(t))){group=node;kind='education';break;}
      if(companies===1&&labels.some(t=>/职位|岗位|职务|工作内容/.test(t))){group=node;kind='workExperience';break;}
    }
    if(!group)return null;
    const items=controls(group),label=local(el);
    let field=mappings[kind].find(([pattern])=>pattern.test(label))?.[1];
    if(field==='gpa'&&!/gpa|绩点/.test(label))return {id:'ambiguousScore',value:''};
    if(!field&&/就读年月|在校时间|起止时间|在职时间/.test(label)){
      const row=el.closest('.el-form-item,.ant-form-item,.form-item,label')||el.parentElement;
      const dates=controls(row);field=dates.length===2?(dates.indexOf(el)===0?'start':'end'):null;
    }
    if(!field)return null;
    if(!assigned.has(group)){
      const state=records[kind],identityField=kind==='education'?'school':kind==='projects'?'name':'company';
      const identity=items.find(item=>mappings[kind].find(([pattern])=>pattern.test(local(item)))?.[1]===identityField);
      const read=item=>item.tagName==='SELECT'?textOf(item.selectedOptions[0]):isCombo(item)?comboValue(item):item.value;
      const identityValue=identity&&!empty(identity)?compact(read(identity)):'';
      const levelControl=kind==='education'?items.find(item=>mappings[kind].find(([pattern])=>pattern.test(local(item)))?.[1]==='level'):null;
      const levelValue=levelControl&&!empty(levelControl)?compact(read(levelControl)):'';
      const matches=lists[kind].map((record,index)=>({record,index})).filter(({record})=>(identityValue||levelValue)&&(!identityValue||compact(record[identityField])===identityValue)&&(!levelValue||compact(record.level)===levelValue));
      const previous=state.groups.get(group);
      const nonempty=Boolean(identityValue);
      const index=matches.length===1?matches[0].index:previous&&nonempty?previous.index:identityValue||levelValue?-1:state.next;
      assigned.set(group,index);
      if(index>=0&&lists[kind][index])state.next=Math.max(state.next,index+1);
    }
    const index=assigned.get(group),record=lists[kind][index];
    if(!record)return {id:'recordMissing',value:''};
    let value=record[field];
    if(field==='majorCategory')value=record.majorCategoryPath||value;
    if(field==='workType')value=value||(record.type==='实习'?'实习':'');
    // Persist the selection across clicks, including a reused cleared editor.
    records[kind].groups.set(group,{index});
    return {id:`record:${kind}:${field}`,value};
  };
  const resolve=(text,counters,el)=>{
    const fieldLabel=localLabel(el),heading=compact(precedingHeading(el));
    const familyHeading=/^(父亲|母亲|配偶)$/.test(heading)?heading:null;
    if(familyHeading){
      const member=lists.family.find(item=>compact(item.relation)===familyHeading);
      const field=familyFields.find(([pattern])=>pattern.test(fieldLabel))?.[1];
      return {id:'familyHeading',value:member&&field?(field==='age'?ageOf(member):field==='unitAndPosition'?[member.workUnit,member.position].filter(Boolean).join(' / '):member[field]):''};
    }
    // Never fall through from a certificate number to a degree/education label.
    if(/(学位|学历|毕业).*证.*(号|编码)/.test(fieldLabel))return recordHit(el)||{id:'educationCertificateMissing',value:''};
    const editorHit=familyEditorHit(text,el);if(editorHit)return editorHit;
    const roleHit=familyRoleHit(labelOnly(el));if(roleHit)return roleHit;
    const own=compact(labelOnly(el)+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||''));
    const languageContext=own+' '+compact(precedingHeading(el));
    // Language scores must never fall through to GPA or general certificates.
    if(!/gpa|绩点/.test(own)&&/成绩|分数|得分|score/.test(own)&&/英语|外语|语言|cet|雅思|托福|ielts|toefl/i.test(languageContext)){
      const exam=languageContext.match(/cet[46]|雅思|托福|ielts|toefl/i)?.[0];
      const candidates=lists.languages.filter(item=>exam?compact(item.certificate).includes(exam)||(/雅思|ielts/.test(exam)&&/雅思|ielts/.test(compact(item.certificate)))||(/托福|toefl/.test(exam)&&/托福|toefl/.test(compact(item.certificate))):/英语/.test(languageContext)?/英语|english/i.test(item.name||''):true);
      return {id:'languageScore',value:candidates.length===1?candidates[0].score:''};
    }
    const languageHit=languageRowHit(text,el);if(languageHit)return languageHit;
    const record=recordHit(el);if(record)return record;
    const customHit=custom.find(x=>text.includes(compact(x.label)));if(customHit)return{id:`custom:${customHit.label}`,value:customHit.value};
    const direct=localLabel(el);
    const rule=rules.find(x=>x.re.test(direct))||rules.find(x=>x.re.test(text)&&!(x.id==='summary'&&!/个人优势|自我评价|个人简介|自我介绍|个人总结|summary|aboutme/.test(direct)));if(!rule)return null;
    let index=counters[rule.id]||0;
    if(/Birthday|birthday|Start$|End$|Date$/.test(rule.id)&&el.tagName==='SELECT'){
      const group=el.closest('tr,label,.form-item,.field,.ant-form-item,.el-form-item')||el.parentElement;
      const cache=counters.dateGroups||(counters.dateGroups=new WeakMap());let entry=cache.get(group);if(!entry){entry={};cache.set(group,entry);}if(entry[rule.id]!==undefined)index=entry[rule.id];else{entry[rule.id]=index;counters[rule.id]=index+1;}
    }else counters[rule.id]=index+1;
    return{id:rule.id,value:rule.get(index)};
  };
  const layoutCapable=document.documentElement.getClientRects().length>0;
  const visible=el=>{if(!el||el.closest('[hidden],[aria-hidden="true"]'))return false;for(let node=el;node;node=node.parentElement){const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden')return false;}return !layoutCapable||el.getClientRects().length>0;};
  const comboSelector='[role="combobox"],[aria-haspopup="listbox"],.el-select,.ant-select,.el-cascader,.ivu-select,.next-select,.semi-select,.arco-select';
  const isCombo=el=>el.tagName!=='SELECT'&&(el.matches(comboSelector)||Boolean(el.closest(comboSelector)));
  const scan=()=>[...document.querySelectorAll(`input,textarea,select,${comboSelector}`)].filter(el=>!el.disabled&&el.getAttribute('aria-disabled')!=='true'&&(!el.readOnly||isCombo(el))&&el.type!=="hidden"&&!['password','file','submit','button','reset','checkbox','radio'].includes(el.type)&&visible(el)&&!(el.closest(comboSelector)&&el.closest(comboSelector)!==el)&&!(el.matches('[role="combobox"]')&&el.parentElement?.closest('.el-select,.ant-select,.el-cascader')));
  let eligible=scan();
  const comboValue=el=>{const selected=el.querySelector('.ant-select-selection-item,.el-select__selected-item:not(.is-placeholder),.el-input__inner,.ivu-select-selected-value,.next-select-values,.semi-select-selection-text,.arco-select-view-value,input');return String(el.value||selected?.value||textOf(selected)||'').trim();};
  const empty=el=>el.tagName==="SELECT"?(el.value===''||/(请选择|请选|选择|select|--)/i.test(textOf(el.options[el.selectedIndex]))):isCombo(el)?!comboValue(el)||/^(请选择|选择|请选)/.test(comboValue(el)):String(el.value||"").trim()==="";
  const dateParts=value=>{const match=String(value).trim().match(/^(\d{4})[年./-](\d{1,2})(?:[月./-](\d{1,2}))?[日月]?$/);if(!match)return null;const year=Number(match[1]),month=Number(match[2]),day=match[3]?Number(match[3]):null;if(month<1||month>12||day!==null&&(day<1||day>new Date(year,month,0).getDate()))return null;return {year,month,day};};
  const datePartFor=el=>{const hint=[el.name,el.id,el.getAttribute('aria-label'),el.placeholder].join(' ').toLowerCase();if(/year|年份|出生年/.test(hint))return 'year';if(/month|月份|出生月/.test(hint))return 'month';if(/day|日份|出生日/.test(hint)&&!/birthday/.test(hint))return 'day';if(el.tagName!=='SELECT')return null;const labels=[...el.options].map(textOf).filter(text=>!/(选择|--)/.test(text));if(labels.some(text=>/^\d{4}年?$/.test(text)))return 'year';if(labels.some(text=>/^\d{1,2}月$/.test(text)))return 'month';if(labels.some(text=>/^\d{1,2}日$/.test(text)))return 'day';const group=el.closest('tr,label,.form-item,.field,.ant-form-item,.el-form-item')||el.parentElement;const selects=[...group.querySelectorAll('select')];const yearIndex=selects.findIndex(item=>[...item.options].some(option=>/^\d{4}年?$/.test(textOf(option))));if(yearIndex>=0){const offset=selects.indexOf(el)-yearIndex;return ['year','month','day'][offset]||null;}return null;};
  const optionToken=value=>compact(value).replace(/^(?:\d{2,6})[、：:\s]+/,'').replace(/族$/,'');
  const matchChoice=(items,value)=>{const target=optionToken(value);if(!target)return null;const valid=items.filter(item=>!item.disabled&&item.getAttribute?.('aria-disabled')!=='true'&&!/(请选择|请选|--)/.test(textOf(item)));const exact=valid.find(item=>optionToken(textOf(item))===target);if(exact)return exact;const synonyms={是:['有','需要','需求'],否:['无','不需要','无需'],男:['男性'],女:['女性']}[String(value)]||[];const synonym=valid.find(item=>synonyms.includes(textOf(item)));if(synonym)return synonym;if(/^\d+$/.test(target))return valid.find(item=>/^\d+$/.test(textOf(item))&&Number(textOf(item))===Number(target))||null;const shortened=value=>optionToken(value).replace(/(特别行政区|壮族自治区|回族自治区|维吾尔自治区|自治区|省|市)$/,'');const region=valid.filter(item=>{const label=shortened(textOf(item));return label.length>=2&&target.includes(label);}).sort((a,b)=>textOf(b).length-textOf(a).length);return region[0]||valid.find(item=>{const label=optionToken(textOf(item));return label.length>=2&&(label.includes(target)||target.includes(label));})||null;};
  const selectOption=(el,value)=>{
    const date=dateParts(value);if(date){const part=datePartFor(el);if(!part||date[part]===null)return null;return [...el.options].find(option=>!option.disabled&&/^\d+[年月日]?$/.test(textOf(option))&&Number(textOf(option).replace(/[年月日]/g,''))===date[part])||null;}
    if(/^\d+(\.\d+)?$/.test(String(value))&&/学制/.test(labelOnly(el)))return [...el.options].find(option=>!option.disabled&&textOf(option).replace(/年$/,'')===String(value))||null;
    return matchChoice([...el.options].filter(option=>option.value!==''),value);
  };
  const highlights=window.__RESUME_PULSE_HIGHLIGHTS__||(window.__RESUME_PULSE_HIGHLIGHTS__=new Map());
  const highlight=el=>{
    let entry=highlights.get(el);
    if(!entry){entry={outline:el.style.getPropertyValue('outline'),priority:el.style.getPropertyPriority('outline'),offset:el.style.outlineOffset,shadow:el.style.getPropertyValue('box-shadow'),shadowPriority:el.style.getPropertyPriority('box-shadow')};highlights.set(el,entry);}
    clearTimeout(entry.timer);el.style.outlineOffset='-2px';el.style.setProperty('outline','2px solid #12b879','important');el.style.setProperty('box-shadow','inset 0 0 0 2px #12b879','important');
    entry.timer=setTimeout(()=>{el.style.setProperty('outline',entry.outline,entry.priority);el.style.outlineOffset=entry.offset;el.style.setProperty('box-shadow',entry.shadow,entry.shadowPriority);highlights.delete(el);},12000);
  };
  const setValue=(el,value)=>{
    if(value===undefined||value===null||String(value).trim()==="")return false;
    if(/出生日期|出生年月|生日/.test(localLabel(el))&&!dateParts(value))return false;
    if(el.tagName==="SELECT"){const option=selectOption(el,value);if(!option)return false;const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value')?.set;setter?setter.call(el,option.value):el.value=option.value;}
    else{let final=String(value).trim();const date=dateParts(final);if(date){const part=datePartFor(el);if(part){if(date[part]===null)return false;final=String(date[part]);}else{if(el.type==='date'&&date.day===null)return false;const separator=/yyyy\/|yyyy\//i.test(el.placeholder||'')?'/':/yyyy\./i.test(el.placeholder||'')?'.':'-';final=[String(date.year),String(date.month).padStart(2,'0'),...(date.day!==null&&el.type!=='month'?[String(date.day).padStart(2,'0')]:[])].join(separator);}}const proto=el.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;const setter=Object.getOwnPropertyDescriptor(proto,"value")?.set;setter?setter.call(el,final):el.value=final;if(el.value!==final)return false;}
    for(const type of ["input","change","blur"])el.dispatchEvent(new Event(type,{bubbles:true}));
    highlight(el);return true;
  };
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  let dropdownBlocked=false;
  const fillCombo=async(el,value)=>{
    if(!value||dropdownBlocked)return false;
    const listSelector='[role="listbox"],.el-select-dropdown,.ant-select-dropdown,.el-cascader__dropdown,.ivu-select-dropdown,.next-overlay-wrapper,.semi-select-option-list,.arco-select-dropdown';
    const before=new Set([...document.querySelectorAll(listSelector)].filter(visible));
    const input=el.matches('input')?el:el.querySelector('input');const original=input?.value||'';let searched=false;
    const trigger=el.querySelector('.ivu-select-selection,.next-select-inner,.ant-select-selector,.arco-select-view')||input||el;
    trigger.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));trigger.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));trigger.click();let picked=false;
    const used=new Set(),ownedPopups=new Set();let ambiguous=false,lastChoice=null;
    for(let step=0;step<4;step++){
      let choice=null;
      for(let attempt=0;attempt<8&&!choice;attempt++){
        if(attempt)await pause(100);
        const owners=[el,input,el.querySelector('[role="combobox"]')].filter(Boolean);
        const ids=owners.flatMap(node=>[node.getAttribute('aria-controls'),node.getAttribute('aria-owns')]).filter(Boolean).join(' ').split(/\s+/);
        const linked=ids.map(id=>document.getElementById(id)).filter(visible);
        const candidates=[...document.querySelectorAll(listSelector)].filter(node=>visible(node)&&(!before.has(node)||el.contains(node)));
        const roots=candidates.filter(node=>!candidates.some(parent=>parent!==node&&parent.contains(node)));
        const popups=linked.length?linked:roots.length===1?roots:[];
        if(!linked.length&&roots.length>1){ambiguous=true;roots.forEach(node=>ownedPopups.add(node));break;}
        popups.forEach(node=>ownedPopups.add(node));
        const choices=popups.flatMap(node=>[...node.querySelectorAll('[role="option"],.el-select-dropdown__item,.ant-select-item-option,.el-cascader-node,.ivu-select-item,.next-menu-item,.semi-select-option,.arco-select-option')]).filter(node=>visible(node)&&!used.has(node)&&!node.classList.contains('is-disabled')&&!node.classList.contains('ivu-select-item-disabled'));
        choice=matchChoice(choices,value);
        if(!choice&&attempt===2&&!searched&&input&&!input.readOnly&&!el.matches('.el-cascader')){
          const query=String(value).match(/^.+?(?:省|自治区|特别行政区)/)?.[0]||String(value);
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,query);input.dispatchEvent(new Event('input',{bubbles:true}));searched=true;
        }
      }
      if(!choice||ambiguous)break;
      used.add(choice);choice.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));choice.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));choice.click();picked=true;lastChoice=choice;
      if(!el.matches('.el-cascader'))break;
    }
    // A click is not a commit. Confirm the selected label/value, not search text.
    let confirmed=false;
    for(let attempt=0;picked&&attempt<6;attempt++){
      const selected=el.querySelector('.ant-select-selection-item,.el-select__selected-item:not(.is-placeholder),.ivu-select-selected-value,.next-select-values,.semi-select-selection-text,.arco-select-view-value');
      const actual=selected?textOf(selected):searched?'':comboValue(el);
      confirmed=optionToken(actual)===optionToken(value)||Boolean(lastChoice?.getAttribute('aria-selected')==='true'&&optionToken(textOf(lastChoice))===optionToken(value));
      if(confirmed)break;await pause(100);
    }
    if(!picked&&searched){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,original);input.dispatchEvent(new Event('input',{bubbles:true}));}
    if([...ownedPopups].some(visible)){
      trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));input?.blur();
      document.body.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));document.body.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));document.body.dispatchEvent(new MouseEvent('click',{bubbles:true}));
      await pause(100);
      // An unclosed/ambiguous popup blocks subsequent dropdowns in this run.
      dropdownBlocked=[...ownedPopups].some(visible);
    }
    if(confirmed)highlight(el);
    return confirmed;
  };
  let filled=0,skipped=0,matched=0;const filledElements=new WeakSet(),matchedElements=new WeakSet(),skippedElements=new WeakSet();
  const attemptedCombos=new WeakSet();
  const runPass=async()=>{labelCache=new WeakMap();controlCache=new WeakMap();eligible=scan();const counters={};for(const el of eligible){const hit=resolve(fieldContext(el),counters,el);if(!hit||filledElements.has(el))continue;if(!matchedElements.has(el)){matched++;matchedElements.add(el);}if(!overwrite&&!empty(el)){if(!skippedElements.has(el)){skipped++;skippedElements.add(el);}continue;}const combo=isCombo(el);if(combo&&attemptedCombos.has(el))continue;if(combo)attemptedCombos.add(el);if(combo?await fillCombo(el,hit.value):setValue(el,hit.value)){filled++;filledElements.add(el);if(hit.familyGroup){familyState.groups.set(hit.familyGroup,{index:hit.familyIndex});familyState.next=Math.max(familyState.next,hit.familyIndex+1);}}}};
  await runPass();
  for(const delay of [250,500,750]){
    const pendingNative=eligible.some(el=>matchedElements.has(el)&&!filledElements.has(el)&&!skippedElements.has(el)&&!isCombo(el));
    const pendingDisabled=[...document.querySelectorAll('select:disabled,input:disabled')].some(visible);
    if(!pendingNative&&!pendingDisabled)break;
    await pause(delay);await runPass();
  }
  const radioGroups=new Map();document.querySelectorAll('input[type="radio"]:not(:disabled)').forEach(el=>{if(!visible(el))return;const key=el.name||`__${el.id}`;if(!radioGroups.has(key))radioGroups.set(key,[]);radioGroups.get(key).push(el);});
  const radioCounters={};for(const group of radioGroups.values()){
    if(!overwrite&&group.some(x=>x.checked))continue;const hit=resolve(fieldContext(group[0]),radioCounters,group[0]);if(!hit||!hit.value)continue;
    const target=compact(hit.value),yes=/^(是|有|需要|有需求)$/.test(String(hit.value)),no=/^(否|无|不需要|无需)$/.test(String(hit.value));
    const choice=group.find(el=>compact(el.labels?[...el.labels].map(textOf).join(' '):textOf(el.parentElement))===target)||group.find(el=>{const option=compact([el.value,el.labels?[...el.labels].map(textOf).join(" "):"",textOf(el.parentElement)].join(" "));return option===target||(option.includes(target)&&!(target==='全日制'&&option.includes('非全日制')))||(yes&&/(是|有|需要)/.test(option)&&!/(不|无)/.test(option))||(no&&/(否|无|不需要|无需)/.test(option));});
    if(choice){choice.click();highlight(choice);filledElements.add(choice);filled++;matched++;}
  }
  const manual=[...document.querySelectorAll('input[type="file"],input[type="checkbox"][required],input[type="checkbox"][name*="agree" i]')].filter(visible).length;
  // Keep feedback visible after slow dropdowns finish, not just while filling.
  for(const el of eligible)if(filledElements.has(el))highlight(el);
  const missing=eligible.filter(el=>matchedElements.has(el)&&!filledElements.has(el)&&!skippedElements.has(el)).length;
  return {filled,skipped,matched,total:eligible.length,manual,unfilled:missing,unrecognized:eligible.filter(el=>!matchedElements.has(el)).length,dropdownBlocked:Number(dropdownBlocked)};
})()
