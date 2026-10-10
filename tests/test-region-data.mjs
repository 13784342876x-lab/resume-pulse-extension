import assert from "node:assert/strict";
import {REGION_DATA} from "../region-data.js";
assert.ok(REGION_DATA.length>=34);
const city=(provinceName,cityName)=>REGION_DATA.find(item=>item.name===provinceName)?.cities.find(item=>item.name===cityName);
assert.ok(city("河北省","石家庄市"));assert.ok(city("江苏省","苏州市"));assert.ok(city("河北省","秦皇岛市"));
assert.ok(city("北京市","北京市")?.areas.some(item=>item.name==="海淀区"));
const totals=REGION_DATA.reduce((sum,province)=>{sum.cities+=province.cities.length;sum.areas+=province.cities.reduce((count,item)=>count+item.areas.length,0);return sum;},{cities:0,areas:0});
assert.ok(totals.cities>300);assert.ok(totals.areas>2800);console.log(JSON.stringify({provinces:REGION_DATA.length,...totals}));
