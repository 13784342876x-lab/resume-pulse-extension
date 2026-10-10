import assert from "node:assert/strict";
import {buildVisualLines,parseResumeDocument} from "../resume-parser.js";

const rebuilt=buildVisualLines([
  {str:"2024年09月 - 2027年06月",transform:[1,0,0,1,450,596],width:109},
  {str:"林晓雨",transform:[1,0,0,1,37,782],width:45},
  {str:"示例工业大学",transform:[1,0,0,1,37,596],width:54}
]);
assert.deepEqual(rebuilt,["林晓雨","示例工业大学 2024年09月 - 2027年06月"]);

const lines=[
  "林晓雨",
  "电话：13800000001 | 邮箱：student.one@example.com | 现居城市：北京",
  "当前状态：27届应届毕业生",
  "个人总结",
  "具备机器学习、现代密码学和高级网络安全等专业基础。",
  "教育经历",
  "示例工业大学 2024年09月 - 2027年06月",
  "网络空间安全 | 硕士 全日制 北京",
  "GPA：3.87 / 4.00",
  "示例科技学院 2019年09月 - 2023年06月",
  "物联网工程 | 本科 全日制 秦皇岛",
  "GPA：3.39 / 4.00",
  "学术进展",
  "Example Research: Secure Model Deployment（示例论文）",
  "围绕可信执行环境资源受限展开研究。",
  "实习经历",
  "示例信息技术有限公司 | IT 解决方案实习生 2026年06月 - 2026年09月",
  "售前支持与投标响应：累计完成 10 份项目标书。",
  "示例研发科技有限公司 | 嵌入式研发实习生 2023年04月 - 2023年08月",
  "参与 IoT 设备相关嵌入式软件开发与产品 Demo 演示。",
  "技能/证书",
  "技术能力：Python、C、Java；熟悉 Linux、Git、MySQL",
  "证书：CET-6、计算机二级 Java、普通话二级甲等、高中数学教师资格证、C2驾驶证"
];
const result=parseResumeDocument({lines,fileName:"示例工业大学_网络空间安全_林晓雨_20260914.pdf"});
assert.equal(result.parsed.name,"林晓雨");assert.equal(result.parsed.phone,"13800000001");assert.equal(result.parsed.email,"student.one@example.com");
assert.equal(result.parsed.education.length,2);assert.deepEqual(result.parsed.education.map(item=>[item.school,item.major,item.level]),[["示例工业大学","网络空间安全","硕士研究生"],["示例科技学院","物联网工程","本科"]]);
assert.equal(result.parsed.workExperience.length,2);assert.deepEqual(result.parsed.workExperience.map(item=>item.company),["示例信息技术有限公司","示例研发科技有限公司"]);
assert.deepEqual(result.parsed.workExperience.map(item=>item.role),["IT 解决方案实习生","嵌入式研发实习生"]);
assert.equal(result.parsed.languages.length,1);assert.equal(result.parsed.languages[0].name,"英语");assert.match(result.parsed.languages[0].certificate,/六级/);
assert.equal(result.parsed.publications.length,1);assert.match(result.summary,/2 段教育、2 段工作\/实习、0 段校园经历、0 个项目、1 项外语/);
console.log(JSON.stringify({summary:result.summary,education:result.parsed.education,work:result.parsed.workExperience.map(item=>({company:item.company,role:item.role})),languages:result.parsed.languages},null,2));

const ocrText=`本 而 随时 到 岗 角 01/2002
琵 生 王 明 远 回 student@example.com 以 13800000002
让 7> 甸 回 北京 Q 微 信 : xxxxxx6973
教育 经 历
示例 工业 大 学 计算 机 技术 · 硕士 · GPA 3.8 09/2024 - 0612027
主 修 机 器 学 习 ， 信 息 安全
示例 工业 大 学 信息 安全 · 本 科 · GPA 3.8 09/2020 - 0612024
学 术 成 果
面向 云端 模型 研究 黑盒 完整 性 校验 方法
实习 经 历
示例 游戏 agent 开 发 实习 生 04/2026 - 07/2026
负责 RAG 检索链路与 Agent 架构设计。
示例 智能 后 端 开发 实习 生 07/2026 - 09/2026
负责 AI 外呼意向分析模块。
校园 经 历
示例 工业 大学 网络 安全 协会 | 会长 09/2021 - 06/2022
组织校内安全技术分享。
项目 经 历
AI Agent 综合 应用 智能体 平台 01/2026 - 04/2026
基于 Spring AI + MCP + RAG 搭建智能体平台。`;
const ocrResult=parseResumeDocument({text:ocrText,fileName:"简历-agent-23.pdf"});assert.equal(ocrResult.parsed.name,"王明远");assert.equal(ocrResult.parsed.phone,"13800000002");assert.equal(ocrResult.parsed.education.length,2);assert.deepEqual(ocrResult.parsed.education.map(item=>[item.school,item.major,item.start,item.end]),[["示例工业大学","计算机技术","2024-09","2027-06"],["示例工业大学","信息安全","2020-09","2024-06"]]);assert.deepEqual(ocrResult.parsed.workExperience.map(item=>[item.company,item.role]),[["示例游戏","agent 开发实习生"],["示例智能","后端开发实习生"]]);assert.equal(ocrResult.parsed.campusExperience.length,1);assert.equal(ocrResult.parsed.projects.length,1);assert.equal(ocrResult.parsed.projects[0].name,"AI Agent 综合应用智能体平台");
console.log(JSON.stringify({ocr:ocrResult.summary,name:ocrResult.parsed.name,education:ocrResult.parsed.education.length,work:ocrResult.parsed.workExperience.length,campus:ocrResult.parsed.campusExperience.length,projects:ocrResult.parsed.projects.length}));
