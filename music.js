/* Original generative candy-pop music. No external recordings or assets. */
(function(root){'use strict';function create(){let ctx=null,timer=null,step=0,enabled=true,running=false,starting=false,generation=0;const melody=[74,0,78,81,0,78,76,0,73,0,76,81,0,78,74,0,71,0,74,78,0,81,78,0,73,0,76,78,0,76,73,0],chords=[[50,57,61,66],[47,54,57,62],[43,50,54,59],[45,52,57,61]];
function note(midi,time,duration,volume,type='sine'){if(!ctx||ctx.state!=='running')return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(volume,time+.06);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g).connect(ctx.destination);o.start(time);o.stop(time+duration+.05);}
function phrase(){if(!running||!enabled||!ctx||ctx.state!=='running')return;const time=ctx.currentTime+.025;if(melody[step%32])note(melody[step%32],time,.65,.024);if(step%8===0){for(const n of chords[Math.floor(step/8)%4])note(n,time,2.2,.009);note(chords[Math.floor(step/8)%4][0]-12,time,1.4,.016);}step++;}
async function start(){if(!enabled||running||starting)return;const token=++generation;starting=true;try{if(!ctx||ctx.state==='closed')ctx=new(window.AudioContext||window.webkitAudioContext)();const local=ctx;await local.resume();if(token!==generation||!enabled||ctx!==local||local.state!=='running')return;running=true;phrase();timer=setInterval(phrase,300);}catch{}finally{if(token===generation)starting=false;}}
function stop(){generation++;starting=false;running=false;if(timer!==null)clearInterval(timer);timer=null;if(ctx){const old=ctx;ctx=null;void old.close().catch(()=>{});}}
function effect(clear=false,combo=1){if(!enabled||!ctx||ctx.state!=='running')return;const now=ctx.currentTime;for(let i=0;i<(clear?4:1);i++)note((clear?[72,76,79,84]:[76])[i]+(clear?Math.min(12,Math.max(0,combo-1)*2):0),now+i*.12,.45,.045);}
return{start,stop,effect,set(value){enabled=!!value;if(!enabled)stop();},get enabled(){return enabled;}};}
root.TowerMusic={create};})(globalThis);


