const fillBtn=document.getElementById("fillBtn");
const result=document.getElementById("result");
const openOptions=()=>chrome.runtime.openOptionsPage();
document.getElementById("editBtn").addEventListener("click",openOptions);
document.getElementById("settingsBtn").addEventListener("click",openOptions);

chrome.storage.local.get("profile").then(({profile})=>{
  const ready=profile && profile.name;
  if(ready){
    document.getElementById("avatar").textContent=profile.name.slice(0,1);
    document.getElementById("profileName").textContent=profile.name;
    const education=profile.education?.[0];
    document.getElementById("profileRole").textContent=[education?.level,education?.school].filter(Boolean).join(" · ")||"个人档案已就绪";
  }else{
    fillBtn.disabled=true;
    result.className="result error";
    result.textContent="请先点击“编辑”录入并保存简历资料。";
  }
});

fillBtn.addEventListener("click",async()=>{
  fillBtn.disabled=true; result.className="result"; result.textContent="正在识别当前页面字段…";
  try{
    const [{id:tabId,url}]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!/^https?:/i.test(url||"")) throw new Error("此页面不允许插件填写，请打开招聘网站后再试。");
    const {profile}=await chrome.storage.local.get("profile");
    await chrome.scripting.executeScript({target:{tabId},func:p=>{window.__RESUME_PULSE_PROFILE__=p;},args:[profile]});
    const [execution]=await chrome.scripting.executeScript({target:{tabId},files:["autofill.js"]});
    const stats=execution.result||{filled:0,matched:0};
    result.className=stats.filled?"result success":"result error";
    result.textContent=stats.filled?`已填写 ${stats.filled} 个字段；${stats.skipped||0} 个已有内容的字段保持不变。请复核后再提交。`:`没有找到可匹配的空字段。该网站可能使用了特殊表单，可把页面截图发给我继续适配。`;
  }catch(error){result.className="result error";result.textContent=error.message||"填写失败，请刷新招聘页面后重试。";}
  finally{fillBtn.disabled=false;}
});
