async function injectPanel(tabId) {
  await chrome.scripting.executeScript({target:{tabId},func:()=>{window.__RESUME_PULSE_FORCE_PANEL__=true;}});
  await chrome.scripting.executeScript({target:{tabId},files:["panel.js"]});
}

chrome.action.onClicked.addListener(async tab=>{
  if(!tab.id)return;
  try{await injectPanel(tab.id);}catch(error){console.warn("简历脉冲无法在该页面运行",error);}
});

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message?.type==="resume-pulse-open-options"){
    chrome.runtime.openOptionsPage();
    sendResponse({ok:true});
    return;
  }
  if(message?.type!=="resume-pulse-fill"||!sender.tab?.id)return;
  (async()=>{
    const {profile={}}=await chrome.storage.local.get("profile");
    if(!profile.name){sendResponse({ok:false,error:"请先在“管理简历资料”中保存个人档案。"});return;}
    const tabId=sender.tab.id;
    await chrome.scripting.executeScript({
      target:{tabId,allFrames:true},
      func:(value,options)=>{window.__RESUME_PULSE_PROFILE__=value;window.__RESUME_PULSE_OPTIONS__=options;},
      args:[profile,{overwrite:Boolean(message.overwrite),familyIndex:message.familyIndex}]
    });
    const executions=await chrome.scripting.executeScript({target:{tabId,allFrames:true},files:["autofill.js"]});
    const stats=executions.reduce((sum,item)=>{
      const value=item.result||{};
      sum.frames+=1;
      for(const key of ["filled","skipped","matched","total","manual"])sum[key]+=Number(value[key]||0);
      return sum;
    },{frames:0,filled:0,skipped:0,matched:0,total:0,manual:0});
    sendResponse({ok:true,stats});
  })().catch(error=>sendResponse({ok:false,error:error?.message||"当前页面不允许插件访问。"}));
  return true;
});
