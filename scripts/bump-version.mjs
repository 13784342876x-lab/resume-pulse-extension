import fs from 'node:fs';
const version=process.argv[2];
if(!/^\d+\.\d+\.\d+$/.test(version||''))throw new Error('Usage: npm run version:set -- 0.6.4');
const root=new URL('../',import.meta.url);
for(const name of ['manifest.json','package.json','package-lock.json']){
  const path=new URL(name,root),data=JSON.parse(fs.readFileSync(path,'utf8'));data.version=version;
  if(name==='package-lock.json')data.packages[''].version=version;
  fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
}
const readme=new URL('README.md',root);
fs.writeFileSync(readme,fs.readFileSync(readme,'utf8').replace(/插件 v\d+\.\d+\.\d+/,`插件 v${version}`));
console.log(`Version updated to ${version}. Review changes before committing and tagging v${version}.`);

