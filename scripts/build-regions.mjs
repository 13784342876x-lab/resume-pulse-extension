import fs from "node:fs";
const root=new URL("../node_modules/province-city-china/dist/",import.meta.url);
const provinces=JSON.parse(fs.readFileSync(new URL("province.json",root),"utf8"));
const cities=JSON.parse(fs.readFileSync(new URL("city.json",root),"utf8"));
const areas=JSON.parse(fs.readFileSync(new URL("area.json",root),"utf8"));
const direct=new Set(["11","12","31","50","81","82","71"]);
const data=provinces.map(province=>{
  let children=cities.filter(city=>city.province===province.province);
  if(!children.length||direct.has(province.province))children=[{code:`${province.province}0100`,name:province.name,province:province.province,synthetic:true}];
  return {code:province.code,name:province.name,cities:children.map(city=>({code:city.code,name:city.name,areas:areas.filter(area=>area.province===province.province&&(city.synthetic||area.city===city.city)).map(area=>({code:area.code,name:area.name}))}))};
});
fs.writeFileSync(new URL("../region-data.js",import.meta.url),`// Generated from province-city-china 8.5.8 (GB/T 2260 dataset)\nexport const REGION_DATA=${JSON.stringify(data)};\n`);
