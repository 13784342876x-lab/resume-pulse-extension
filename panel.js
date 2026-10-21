(()=>{
  const forced=Boolean(window.__RESUME_PULSE_FORCE_PANEL__);delete window.__RESUME_PULSE_FORCE_PANEL__;
  const pageText=String(document.body?.innerText||"").slice(0,24000);
  const formSignals=["姓名","性别","出生年月","教育经历","工作经历","实习经历","手机号码","电子邮件","简历附件","应聘"].filter(word=>pageText.includes(word)).length;
  const urlSignal=/(career|job|recruit|resume|apply|campus|zhaopin|xyzp|talent|join)/i.test(location.href);
  const hostId="resume-pulse-floating-host",existing=document.getElementById(hostId);
  if(existing){if(forced)existing.shadowRoot?.querySelector(".panel")?.toggleAttribute("hidden");return;}
  if(!forced&&!urlSignal&&!(formSignals>=3&&document.querySelectorAll("input,select,textarea").length>=5))return;

  const host=document.createElement("div");host.id=hostId;host.style.cssText="all:initial;position:fixed;right:24px;bottom:84px;width:58px;height:58px;z-index:2147483647";
  const root=host.attachShadow({mode:"open"});
  root.innerHTML=`<style>
    *{box-sizing:border-box}button,select,input{font:inherit}.bubble{position:absolute;right:0;bottom:0;display:grid;place-items:center;width:58px;height:58px;border:0;border-radius:50%;background:linear-gradient(145deg,#12b879,#087a52);color:white;cursor:pointer;box-shadow:0 13px 34px rgba(9,113,75,.36),0 0 0 7px rgba(18,184,121,.12);transition:.2s}.bubble:hover{transform:translateY(-2px) scale(1.04)}.bubble svg{width:29px;height:29px}.bubble::after{content:"";position:absolute;inset:-7px;border:1px solid rgba(18,184,121,.34);border-radius:50%;animation:pulse 2.4s infinite}@keyframes pulse{0%,100%{transform:scale(.88);opacity:.25}50%{transform:scale(1.13);opacity:.65}}
    .panel{position:absolute;right:0;bottom:72px;width:370px;overflow:hidden;border:1px solid #dce7e0;border-radius:18px;background:radial-gradient(circle at 100% 0,#dcfaed,transparent 34%),#fbfcfa;color:#13231c;font:13px/1.5 Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;box-shadow:0 24px 70px rgba(16,43,31,.24)}.panel[hidden]{display:none}
    header{display:flex;align-items:center;gap:10px;padding:17px 18px;border-bottom:1px solid #e3e9e5}.mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#10281e;color:#50e5aa;font-weight:900}.brand{display:grid}.brand b{font-size:15px}.brand small{font-size:8px;letter-spacing:1.7px;color:#8a9690}.local{margin-left:auto;padding:4px 8px;border-radius:99px;background:#e2f8ef;color:#0e8256;font-size:9px;font-weight:800}.icon{border:0;background:transparent;color:#6f7d75;font-size:19px;cursor:pointer}
    main{padding:18px}.profile{display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:11px;padding:13px;border:1px solid #e1e8e3;border-radius:13px;background:white}.avatar{display:grid;place-items:center;width:44px;height:44px;border-radius:12px;background:#13231c;color:#58e3ad;font-weight:900}.info{min-width:0}.profile-select{width:100%;border:0;background:transparent;color:#13231c;font-weight:850;outline:none}.info span{display:block;margin-top:3px;color:#78847d;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.edit{border:0;background:transparent;color:#078958;font-size:11px;font-weight:800;cursor:pointer}
    .hint{margin:14px 0 10px;padding:12px 13px;border-radius:12px;background:linear-gradient(135deg,#edf9f4,#ddf7eb);color:#52685d;font-size:10px}.hint b{display:block;margin-bottom:2px;color:#173d2e;font-size:11px}.overwrite{display:flex;align-items:center;gap:8px;margin:0 2px 12px;color:#495c53;font-size:10px}.overwrite input{accent-color:#0cab70}.overwrite strong{color:#9a493e}.fill{display:flex;align-items:center;justify-content:space-between;width:100%;height:50px;padding:0 17px;border:0;border-radius:12px;background:#0cab70;color:white;font-weight:850;cursor:pointer;box-shadow:0 10px 24px rgba(12,171,112,.2)}.fill:hover{background:#078958}.fill:disabled{opacity:.6;cursor:wait}.fill i{font-style:normal;font-size:20px}
    .result{display:none;margin-top:11px;padding:10px 12px;border-radius:10px;font-size:10px}.result.show{display:block}.result.ok{background:#eaf8f1;color:#116644}.result.warn{background:#fff0ed;color:#a24a40}.foot{display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px solid #e2e8e4;color:#8a958f;font-size:9px}.foot button{border:0;background:transparent;color:#46584f;font-size:10px;font-weight:800;cursor:pointer}
  </style><button class="bubble" title="打开简历脉冲"><svg viewBox="0 0 32 32" fill="none"><rect x="7" y="16" width="4" height="9" rx="2" fill="currentColor"/><rect x="14" y="8" width="4" height="17" rx="2" fill="currentColor"/><rect x="21" y="12" width="4" height="13" rx="2" fill="currentColor"/></svg></button><section class="panel"><header><span class="mark">脉</span><span class="brand"><b>简历脉冲</b><small>RESUME PULSE</small></span><span class="local">仅本地</span><button class="icon close" title="收起到悬浮按钮">×</button></header><main><div class="profile"><span class="avatar">简</span><span class="info"><select class="profile-select" aria-label="选择简历档案"></select><span class="summary">请先完善个人资料</span></span><button class="edit">编辑</button></div><div class="hint"><b>准备填写当前网页</b>支持旧式表格、常见组件与可访问的内嵌页面。</div><label class="overwrite"><input type="checkbox" />覆盖页面已有内容 <strong>（切换测试人员时请勾选）</strong></label><button class="fill"><span>一键填写当前页面</span><i>→</i></button><div class="result" role="status"></div><div class="foot"><span>不读取密码 · 不自动提交</span><button class="manage">管理全部简历</button></div></main></section>`;
  document.documentElement.appendChild(host);
  const $=selector=>root.querySelector(selector),panel=$(".panel");
  const memberLabel=document.createElement('label');memberLabel.style.cssText='display:block;margin:10px 0;font-size:11px';memberLabel.textContent='逐条填写家庭成员：';
  const memberSelect=document.createElement('select');memberSelect.className='family-select';memberSelect.setAttribute('aria-label','选择要填写的家庭成员');memberSelect.style.cssText='width:100%;padding:7px;margin-top:5px;border:1px solid #dce7e0;border-radius:8px;background:white';memberLabel.appendChild(memberSelect);$('.fill').before(memberLabel);
  function renderMembers(){const previous=memberSelect.dataset.profile===activeId?memberSelect.value:'';memberSelect.replaceChildren(new Option('自动按顺序填写',''));(current()?.data?.family||[]).forEach((member,index)=>memberSelect.add(new Option(`${index+1}. ${member.relation||'家庭成员'} · ${member.name||'未填写姓名'}`,String(index))));memberSelect.dataset.profile=activeId;memberSelect.value=[...memberSelect.options].some(option=>option.value===previous)?previous:'';memberLabel.hidden=!current()?.data?.family?.length;}
  $(".bubble").onclick=()=>panel.toggleAttribute("hidden");$(".close").onclick=()=>panel.setAttribute("hidden","");
  $(".edit").onclick=$(".manage").onclick=()=>chrome.runtime.sendMessage({type:"resume-pulse-open-options"});
  let profiles=[],activeId="";const htmlEscape=value=>String(value||"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  function current(){return profiles.find(item=>item.id===activeId);}
  const originalRenderMembers=renderMembers;renderMembers=()=>{originalRenderMembers();renderWork();renderManual();};
  const workLabel=document.createElement('label');workLabel.textContent='本次填写的工作 / 实习经历：';workLabel.style.cssText='display:block;margin:8px 0;font-size:11px';
  const workSelect=document.createElement('select');workSelect.style.cssText=memberSelect.style.cssText;workSelect.setAttribute('aria-label','选择工作或实习经历');workLabel.append(workSelect);$('.fill').before(workLabel);
  function renderWork(){const previous=workSelect.dataset.profile===activeId?workSelect.value:'';workSelect.replaceChildren(new Option('自动按顺序填写',''));(current()?.data?.workExperience||[]).forEach((item,index)=>workSelect.add(new Option(`${index+1}. ${item.company||'未填写单位'} · ${item.role||''}`,String(index))));workSelect.dataset.profile=activeId;workSelect.value=[...workSelect.options].some(item=>item.value===previous)?previous:'';workLabel.hidden=!current()?.data?.workExperience?.length;}
  const manual=document.createElement('details');manual.className='manual-fill';
  const manualTitle=document.createElement('summary');manualTitle.textContent='定点填写 · 点击档案内容填入选中的输入框';manual.append(manualTitle);
  const targetStatus=document.createElement('p');targetStatus.className='manual-status';targetStatus.textContent='先点击网页中的输入框，再选择下方资料。';manual.append(targetStatus);
  const search=document.createElement('input');search.placeholder='搜索字段或内容';search.setAttribute('aria-label','搜索定点填写资料');search.style.cssText='width:100%;padding:8px';manual.append(search);
  const fieldList=document.createElement('div');fieldList.className='manual-fields';fieldList.style.cssText='max-height:230px;overflow:auto;display:grid;gap:5px;margin-top:8px';manual.append(fieldList);$('.foot').before(manual);
  panel.style.maxHeight='calc(100vh - 180px)';panel.style.overflowY='auto';
  let manualTarget=null,manualBusy=false;
  const allowed=el=>el?.matches?.('textarea,select,input:not([type]),input[type="text"],input[type="email"],input[type="tel"],input[type="url"],input[type="search"],input[type="number"],input[type="date"],input[type="month"],input[type="time"]');
  const rememberTarget=event=>{
    const path=event.composedPath();if(path.includes(host))return;
    const target=path.find(allowed);manualTarget=target||null;
    targetStatus.textContent=target?'已选中：'+(target.getAttribute('aria-label')||[...(target.labels||[])].map(label=>label.textContent.trim()).join(' ')||target.placeholder||'网页输入框'):'未选中输入框，请重新点击网页输入框。';
  };
  document.addEventListener('focusin',rememberTarget,true);document.addEventListener('pointerdown',rememberTarget,true);
  window.addEventListener('blur',()=>setTimeout(()=>{if(document.activeElement?.tagName==='IFRAME'){manualTarget=null;targetStatus.textContent='当前焦点在内嵌页面中，定点填写暂不支持，请勿使用上一次目标。';}},0));
  const fieldNames={name:'姓名 / 名称',gender:'性别',birthday:'出生日期',age:'年龄',phone:'电话',email:'邮箱',ethnicity:'民族',politicalStatus:'政治面貌',nationality:'国籍',healthStatus:'健康状况',height:'身高',weight:'体重',maritalStatus:'婚姻状况',idNumber:'证件号码',idType:'证件类型',nativePlace:'籍贯',birthPlace:'出生地',hukouLocation:'户籍所在地',householdType:'户口性质',studentOrigin:'生源地',currentResidence:'现居住地址',communicationAddress:'通信地址',emergencyName:'紧急联系人姓名',emergencyPhone:'紧急联系电话',emergencyRelation:'紧急联系人关系',summary:'个人简介',school:'学校',faculty:'院系',major:'专业',majorCategory:'专业类别',level:'学历 / 等级',degree:'学位',start:'开始时间',end:'结束时间',studyForm:'学习形式',admissionType:'招生类别',gpa:'绩点',gpaScale:'绩点制',researchTopic:'研究方向及课题',isFirst:'是否为第一学历',isHighest:'是否为最高学历',company:'单位名称',department:'工作部门',role:'职位 / 角色',detail:'描述',relation:'与本人关系',workUnit:'工作单位',position:'职务',address:'地址',date:'获取时间',number:'编号',issuer:'颁发机构',certificate:'考试证书',score:'成绩',organization:'所在单位',responsibilities:'职责',teamSize:'团队规模',value:'内容',label:'字段名称'};
  const sectionNames={education:'教育经历',workExperience:'工作 / 实习',family:'家庭成员',projects:'项目经历',campusExperience:'校园经历',languages:'外语能力',certificates:'获得证书',awards:'奖惩',competitions:'竞赛',publications:'学术成果',customFields:'自定义字段'};
  function renderManual(){
    Object.assign(fieldNames,{researchDirection:'论文研究方向',publicationStatus:'论文发表状态',educationLevel:'论文所属教育经历',publicationCount:'论文发表数量',yearIssue:'年度及期次',indexingOrganization:'核心期刊或收录机构',hasAcademicResults:'是否有学术成果或论文发表'});
    Object.assign(fieldNames,{schoolEnglish:'学校英文名称',majorCourses:'主修课程',majorRankPosition:'专业排名名次',majorRankTotal:'专业排名总人数',majorRank:'专业排名前百分比'});
    fieldList.replaceChildren();const query=search.value.trim().toLowerCase();
    const add=(key,value,section)=>{
      if(value===null||value===undefined||typeof value==='object'||String(value).trim()==='')return;
      const label=`${section} · ${fieldNames[key]||key}`,text=String(value);
      if(query&&!`${label} ${text}`.toLowerCase().includes(query))return;
      const button=document.createElement('button');button.type='button';button.className='manual-value';button.textContent=`${label}：${text}`;button.title='将此内容填入选中的网页输入框';button.style.cssText='text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;border:1px solid #dce7e0;border-radius:6px;background:white;padding:8px;cursor:pointer';button.onclick=()=>fillManual(text);fieldList.append(button);
    };
    for(const [key,value] of Object.entries(current()?.data||{})){
      if(Array.isArray(value))value.forEach((item,index)=>{const section=`${sectionNames[key]||key} ${index+1}${item.relation?' · '+item.relation:''}${item.school?' · '+item.school:''}${item.company?' · '+item.company:''}`;if(item&&typeof item==='object')Object.entries(item).forEach(([field,content])=>add(field,content,section));});else add(key,value,'基本资料');
    }
    if(!fieldList.children.length)fieldList.textContent='没有符合条件的已保存资料。请先编辑并保存档案。';
  }
  search.addEventListener('input',renderManual);
  async function fillManual(value){
    if(manualBusy)return;const target=manualTarget;
    if(!target?.isConnected||!allowed(target)||target.disabled){targetStatus.textContent='目标已失效或不可填写，请重新点击网页输入框。';return;}
    if(target.readOnly||target.getAttribute('role')==='combobox'||target.closest('.el-select,.ant-select,.el-cascader')){targetStatus.textContent='这是只读或自定义选择控件，请在网站弹窗中选择；未强行写入。';return;}
    if(target.value&&!$('.overwrite input').checked&&!(target.tagName==='SELECT'&&/请选择|--/.test(target.selectedOptions[0]?.textContent||''))){targetStatus.textContent='目标已有内容。如需替换，请勾选“覆盖页面已有内容”。';return;}
    let next=value;
    if(target.tagName==='SELECT'){
      const matches=[...target.options].filter(option=>!option.disabled&&option.textContent.trim()===value.trim());
      if(matches.length!==1){targetStatus.textContent='没有唯一同名选项，请手动选择。';return;}next=matches[0].value;
    }else if(target.type==='date'&&!/^\d{4}-\d{2}-\d{2}$/.test(value)||target.type==='month'&&!/^\d{4}-\d{2}$/.test(value)){targetStatus.textContent='日期精度与输入框不一致，请手动补全；不会补成 1 月 1 日。';return;}
    manualBusy=true;
    try{
      const prototype=target.tagName==='SELECT'?HTMLSelectElement.prototype:target.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
      const previous=target.value,setter=Object.getOwnPropertyDescriptor(prototype,'value').set;setter.call(target,next);
      if(target.value!==next){setter.call(target,previous);targetStatus.textContent='输入框不接受此格式，请手动填写。';return;}
      for(const type of ['input','change','blur'])target.dispatchEvent(new Event(type,{bubbles:true}));
      await new Promise(resolve=>setTimeout(resolve,80));
      if(!target.isConnected||target.value!==next){targetStatus.textContent='网站未保留填入值，请复核；未计为成功。';return;}
      targetStatus.textContent='已填入选中的输入框，请复核后手动保存。';
      const old=target.style.outline;target.style.outline='2px solid #12b879';setTimeout(()=>{target.style.outline=old;},3000);
    }catch(error){targetStatus.textContent='填写失败：'+error.message;}finally{manualBusy=false;}
  }
  function renderProfiles(){const select=$(".profile-select");select.innerHTML=profiles.map((item,index)=>`<option value="${htmlEscape(item.id)}"${item.id===activeId?" selected":""}>${htmlEscape(item.data?.name||`未命名档案 ${index+1}`)}</option>`).join("");const profile=current()?.data||{};const edu=profile.education?.[0];$(".summary").textContent=[edu?.level,edu?.school].filter(Boolean).join(" · ")||"请先完善个人资料";$(".avatar").textContent=(profile.name||"简").slice(0,1);renderMembers();}
  async function loadProfiles(){const stored=await chrome.storage.local.get(["profiles","activeProfileId","profile"]);profiles=Array.isArray(stored.profiles)&&stored.profiles.length?stored.profiles:[{id:"legacy",data:stored.profile||{}}];activeId=stored.activeProfileId||profiles[0].id;if(!profiles.some(item=>item.id===activeId))activeId=profiles[0].id;renderProfiles();}
  $(".profile-select").onchange=async event=>{activeId=event.target.value;const profile=current()?.data||{};await chrome.storage.local.set({activeProfileId:activeId,profile});renderProfiles();};
  $(".fill").onclick=async()=>{
    const button=$(".fill"),result=$(".result"),overwrite=$(".overwrite input").checked,start=Date.now();
    button.disabled=true;button.firstElementChild.textContent="正在识别并填写…";
    result.className="result show";result.textContent="正在扫描表单，请稍候…";
    try{
      const response=await chrome.runtime.sendMessage({type:"resume-pulse-fill",overwrite,workIndex:workSelect.value===""?null:Number(workSelect.value),familyIndex:memberSelect.value===""?null:Number(memberSelect.value)});
      if(!response?.ok)throw new Error(response?.error||"填写失败");
      const s=response.stats;result.className=`result show ${s.unfilled||s.unrecognized||!s.filled?'warn':'ok'}`;
      result.textContent=`${overwrite?'已覆盖/填写':'已填写'} ${s.filled} 个字段，跳过 ${s.skipped||0} 个已有内容；扫描 ${s.total} 个控件，用时 ${((Date.now()-start)/1000).toFixed(1)} 秒。`;
      if(s.unfilled)result.textContent+=` ${s.unfilled} 个匹配字段未填入（档案缺值或控件选择失败）。`;
      if(s.unrecognized)result.textContent+=` ${s.unrecognized} 个控件尚未识别。`;
      if(s.timedOut)result.textContent+=' 填充达到时间预算，已停止继续扫描；请复核后分段填写。';
      if(s.dropdownBlocked)result.textContent+=' 下拉弹层未关闭，已暂停其余下拉项，避免连续弹窗；请关闭弹层后手动选择。';
      result.textContent+=' 绿色边框表示已执行填写，请复核网站是否接受。';
      if(s.manual)result.textContent+=` ${s.manual} 个上传/承诺项需手动完成。`;
    }catch(error){result.className="result show warn";result.textContent=error.message;}
    finally{button.disabled=false;button.firstElementChild.textContent="一键填写当前页面";}
  };
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==="local"&&(changes.profiles||changes.activeProfileId||changes.profile))loadProfiles();});
  loadProfiles();
})();
