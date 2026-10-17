const assert=require('node:assert/strict'),E=require('./engine.js');let n=0;function test(name,fn){fn();console.log('PASS '+name);n++;}function game(){let s=E.create();E.start(s);return s;}function settle(s){for(let i=0;i<30&&s.phase==='settling';i++)E.step(s,.02);}
test('No movement before start',()=>{let s=E.create();E.step(s,.05);assert.equal(s.x,24);assert.equal(E.drop(s),null);});
test('New game has wide base and zero score',()=>{let s=game();assert.equal(s.w,212);assert.equal(s.height,0);assert.equal(s.score,0);});
test('Movement reflects at both edges',()=>{let s=game();for(let i=0;i<300;i++){E.step(s,.02);assert(s.x>=24&&s.x+s.w<=336);}assert.equal(s.height,0);});
test('Perfect landing snaps to base and preserves width',()=>{let s=game();s.x=78;let e=E.drop(s);assert.equal(e.type,'perfect');assert.deepEqual(s.base,{x:74,w:212});assert.equal(s.score,160);});
test('Right overhang cuts exactly its excess',()=>{let s=game();s.x=94;let e=E.drop(s);assert.equal(e.type,'placed');assert.equal(s.w,192);assert.deepEqual(e.cut,{x:286,w:20});});
test('Left overhang retains correct intersection',()=>{let s=game();s.x=54;let e=E.drop(s);assert.equal(s.base.x,74);assert.equal(s.w,192);assert.deepEqual(e.cut,{x:54,w:20});});
test('Double taps while falling are ignored',()=>{let s=game();s.x=74;E.drop(s);assert.equal(E.drop(s),null);assert.equal(s.height,1);});
test('Next block alternates direction and matches new width',()=>{let s=game();s.x=90;E.drop(s);settle(s);assert.equal(s.dir,-1);assert.equal(s.x,336-s.w);});
test('Perfect chain grows and a normal landing resets it',()=>{let s=game();for(let i=0;i<4;i++){s.x=s.base.x;E.drop(s);settle(s);}assert.equal(s.combo,4);assert.equal(s.bestCombo,4);s.x=s.base.x+12;E.drop(s);assert.equal(s.combo,0);assert.equal(s.perfects,4);});
test('Non-overlap ends game without adding a floor',()=>{let s=game();s.base={x:180,w:30};s.w=30;s.x=24;assert.equal(E.drop(s).type,'miss');assert.equal(s.height,0);assert.equal(s.phase,'over');});
test('Sub-five-pixel landing ends instead of invisible blocks',()=>{let s=game();s.base={x:180,w:30};s.w=30;s.x=207;E.drop(s);assert.equal(s.phase,'over');});
test('Finished game cannot score or move',()=>{let s=game();s.base={x:200,w:20};s.w=20;s.x=24;E.drop(s);let x=s.x;E.step(s,.05);assert.equal(s.x,x);assert.equal(E.drop(s),null);});
test('Speed is capped and rendering history stays bounded',()=>{let s=game();for(let i=0;i<200;i++){s.x=s.base.x;E.drop(s);settle(s);}assert.equal(s.height,200);assert.equal(s.speed,210);assert.equal(s.blocks.length,70);});
test('Restart clears prior run completely',()=>{let s=game();s.x=74;E.drop(s);E.start(s);assert.equal(s.height,0);assert.equal(s.combo,0);assert.equal(s.blocks.length,1);assert.equal(s.w,212);});
console.log(n+' gameplay checks passed');

