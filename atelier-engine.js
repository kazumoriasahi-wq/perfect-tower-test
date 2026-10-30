(function(r){'use strict';const B=r.Tower||require('./engine.js'),MAX=212,goals={height:18,chain:5,perfect:10};
function create(mode='atelier',goal='height'){return Object.assign(B.create(),{mode:mode==='classic'?'classic':'atelier',goal:goals[goal]?goal:'height',goalDone:false,focus:0,focusLeft:2,focusUsed:0,repairs:0});}
function start(s){const mode=s.mode,goal=s.goal;Object.assign(s,create(mode,goal));B.start(s);}
function step(s,dt){if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.05,dt);const slow=s.mode==='atelier'&&s.focus>0&&s.phase==='playing';s.focus=Math.max(0,s.focus-dt);B.step(s,dt*(slow?.4:1));}
function focus(s){if(s.mode!=='atelier'||s.phase!=='playing'||s.focus>0||s.focusLeft<1)return false;s.focusLeft--;s.focusUsed++;s.focus=2;return true;}
function progress(s){return s.goal==='height'?s.height:s.goal==='chain'?s.bestCombo:s.perfects;}
function drop(s){const ev=B.drop(s);if(!ev)return ev;s.focus=0;if(ev.type==='miss')return ev;ev.restored=0;ev.recharged=false;ev.goal=false;if(s.mode==='atelier'&&ev.type==='perfect'&&s.combo%3===0){const w=Math.min(MAX,s.w+12),x=Math.max(24,Math.min(336-w,s.base.x-(w-s.w)/2));ev.restored=w-s.w;s.w=w;s.x=x;s.base={x,w};Object.assign(s.blocks.at(-1),{x,w,repaired:ev.restored>0});s.repairs++;s.focusLeft=Math.min(2,s.focusLeft+1);ev.recharged=true;ev.x=x;ev.w=w;}
if(s.mode==='atelier'&&!s.goalDone&&progress(s)>=goals[s.goal]){s.goalDone=true;s.score+=500;ev.goal=true;}return ev;}
function snapshot(s){if(!['playing','settling'].includes(s.phase))return null;return JSON.parse(JSON.stringify(s));}
function restore(v){if(!v||!['playing','settling'].includes(v.phase)||!['classic','atelier'].includes(v.mode)||!goals[v.goal]||!Number.isInteger(v.height)||v.height<0||v.height>100000||!Number.isSafeInteger(v.score)||v.score<0)return null;const nums=['combo','bestCombo','perfects','focusLeft','focusUsed','repairs'];for(const k of nums)if(!Number.isInteger(v[k])||v[k]<0||v[k]>100000)return null;if(v.focusLeft>2||v.perfects>v.height||v.combo>v.bestCombo||v.bestCombo>v.perfects||typeof v.goalDone!=='boolean')return null;
const valid=b=>b&&Number.isFinite(b.x)&&Number.isFinite(b.w)&&b.w>=5&&b.w<=MAX&&b.x>=24&&b.x+b.w<=336.00001;if(!valid(v.base)||!Number.isFinite(v.x)||v.x<24||v.x+v.base.w>336.00001||v.w!==v.base.w||![-1,1].includes(v.dir)||!Array.isArray(v.blocks)||!v.blocks.length||v.blocks.length>70)return null;let last=-1;for(const b of v.blocks){if(!valid(b)||!Number.isInteger(b.n)||b.n<=last||b.n>v.height)return null;last=b.n;}const top=v.blocks.at(-1);if(top.n!==v.height||top.x!==v.base.x||top.w!==v.base.w)return null;
const s=Object.assign(create(v.mode,v.goal),v);s.blocks=v.blocks.map(b=>({...b}));s.base={...v.base};s.event=null;s.focus=0;s.speed=Math.min(210,96+s.height*4.2);s.timer=s.phase==='settling'?.32:0;return s;}
const api={create,start,step,drop,focus,progress,goals,snapshot,restore,MAX};r.AtelierTower=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);

