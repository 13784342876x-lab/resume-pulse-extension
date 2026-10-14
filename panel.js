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
  function renderProfiles(){const select=$(".profile-select");select.innerHTML=profiles.map((item,index)=>`<option value="${htmlEscape(item.id)}"${item.id===activeId?" selected":""}>${htmlEscape(item.data?.name||`未命名档案 ${index+1}`)}</option>`).join("");const profile=current()?.data||{};const edu=profile.education?.[0];$(".summary").textContent=[edu?.level,edu?.school].filter(Boolean).join(" · ")||"请先完善个人资料";$(".avatar").textContent=(profile.name||"简").slice(0,1);renderMembers();}
  async function loadProfiles(){const stored=await chrome.storage.local.get(["profiles","activeProfileId","profile"]);profiles=Array.isArray(stored.profiles)&&stored.profiles.length?stored.profiles:[{id:"legacy",data:stored.profile||{}}];activeId=stored.activeProfileId||profiles[0].id;if(!profiles.some(item=>item.id===activeId))activeId=profiles[0].id;renderProfiles();}
  $(".profile-select").onchange=async event=>{activeId=event.target.value;const profile=current()?.data||{};await chrome.storage.local.set({activeProfileId:activeId,profile});renderProfiles();};
  $(".fill").onclick=async()=>{
    const button=$(".fill"),result=$(".result"),overwrite=$(".overwrite input").checked,start=Date.now();
    button.disabled=true;button.firstElementChild.textContent="正在识别并填写…";
    result.className="result show";result.textContent="正在扫描表单，请稍候…";
    try{
      const response=await chrome.runtime.sendMessage({type:"resume-pulse-fill",overwrite,familyIndex:memberSelect.value===""?null:Number(memberSelect.value)});
      if(!response?.ok)throw new Error(response?.error||"填写失败");
      const s=response.stats;result.className=`result show ${s.unfilled||s.unrecognized||!s.filled?'warn':'ok'}`;
      result.textContent=`${overwrite?'已覆盖/填写':'已填写'} ${s.filled} 个字段，跳过 ${s.skipped||0} 个已有内容；扫描 ${s.total} 个控件，用时 ${((Date.now()-start)/1000).toFixed(1)} 秒。`;
      if(s.unfilled)result.textContent+=` ${s.unfilled} 个匹配字段未填入（档案缺值或控件选择失败）。`;
      if(s.unrecognized)result.textContent+=` ${s.unrecognized} 个控件尚未识别。`;
      if(s.dropdownBlocked)result.textContent+=' 下拉弹层未关闭，已暂停其余下拉项，避免连续弹窗；请关闭弹层后手动选择。';
      result.textContent+=' 绿色边框表示已执行填写，请复核网站是否接受。';
      if(s.manual)result.textContent+=` ${s.manual} 个上传/承诺项需手动完成。`;
    }catch(error){result.className="result show warn";result.textContent=error.message;}
    finally{button.disabled=false;button.firstElementChild.textContent="一键填写当前页面";}
  };
  chrome.storage.onChanged.addListener((changes,area)=>{if(area==="local"&&(changes.profiles||changes.activeProfileId||changes.profile))loadProfiles();});
  loadProfiles();
})();
