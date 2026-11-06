'use strict';
/* ============================== utilities ============================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const yieldUI=()=>new Promise(r=>setTimeout(r,0));
function el(tag,attrs,...kids){const e=document.createElement(tag);if(attrs)for(const[k,v]of Object.entries(attrs)){if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else if(k==='html')e.innerHTML=v;else if(k==='style')e.style.cssText=v;else if(k.startsWith('on')&&typeof v==='function')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':String(v));}for(const k of kids.flat()){if(k==null||k===false)continue;e.append(k.nodeType?k:document.createTextNode(String(k)));}return e;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
let _uid=0;const uid=p=>p+Date.now().toString(36).slice(-5)+(_uid++).toString(36);
function hexA(hex,a){const h=hex.replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}
const isPhone=()=>window.matchMedia('(max-width: 880px)').matches;
const isNarrow=()=>window.matchMedia('(max-width: 640px)').matches;
const ICON={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M4 12h7M4 17h5"/><path d="M18 19V7M15 10l3-3 3 3"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h5M4 12h7M4 17h10"/><path d="M18 5v12M15 14l3 3 3-3"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4"/><path d="M3 8h13"/><path d="M17 20l4-4-4-4"/><path d="M21 16H8"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
  face:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><path d="M9 9.5v.5M15 9.5v.5"/></svg>',
  rotl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v6h6"/><path d="M5.5 15a7 7 0 1 0 1.6-7.3L4 10"/></svg>',
  rotr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4v6h-6"/><path d="M18.5 15a7 7 0 1 1-1.6-7.3L20 10"/></svg>',
};
const iconBtn=(icon,label,fn,dis)=>el('button',{class:'iconbtn',type:'button',title:label,'aria-label':label,html:ICON[icon],onclick:fn,disabled:dis||null});

/* ============================== dates ============================== */
const WD=['일','월','화','수','목','금','토'];
const EN_M=['January','February','March','April','May','June','July','August','September','October','November','December'];
const SEASON_NAME=['봄','여름','가을','겨울'];
const seasonOf=m=>(m>=2&&m<=4)?0:(m>=5&&m<=7)?1:(m>=8&&m<=10)?2:3;
const dayKey=d=>d.getFullYear()*10000+d.getMonth()*100+d.getDate();
const pad2=n=>String(n).padStart(2,'0');
const fmtDot=d=>`${d.getFullYear()}.${pad2(d.getMonth()+1)}.${pad2(d.getDate())}`;
function fmtRange(a,b,wd){
  if(dayKey(a)===dayKey(b)) return `${a.getMonth()+1}월 ${a.getDate()}일`+(wd?` ${WD[a.getDay()]}요일`:'');
  if(a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()) return `${a.getMonth()+1}월 ${a.getDate()}–${b.getDate()}일`;
  return `${a.getMonth()+1}월 ${a.getDate()}일 – ${b.getMonth()+1}월 ${b.getDate()}일`;
}
function ageText(birth,d){
  if(!birth||!d) return ''; const b=new Date(birth+'T00:00:00'); if(isNaN(b)) return '';
  const days=Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate())-b)/864e5); if(days<0) return '';
  if(days<100) return `생후 ${days}일`;
  let months=(d.getFullYear()-b.getFullYear())*12+(d.getMonth()-b.getMonth()); if(d.getDate()<b.getDate()) months--;
  if(months<24) return `생후 ${months}개월`; const y=Math.floor(months/12),mm=months%12; return mm?`만 ${y}세 ${mm}개월`:`만 ${y}세`;
}

/* ============================== EXIF date ============================== */
async function readExifDate(file){
  try{
    const buf=await file.slice(0,262144).arrayBuffer(); const v=new DataView(buf);
    if(v.byteLength<4||v.getUint16(0)!==0xFFD8) return null; let off=2;
    while(off+4<=v.byteLength){
      if(v.getUint8(off)!==0xFF) return null; const mk=v.getUint8(off+1); if(mk===0xDA||mk===0xD9) return null;
      const len=v.getUint16(off+2);
      if(mk===0xE1&&off+10<=v.byteLength&&v.getUint32(off+4)===0x45786966) return parseTiffDate(v,off+10,Math.min(v.byteLength,off+2+len));
      off+=2+len;
    }
  }catch(e){}
  return null;
}
function parseTiffDate(v,t,end){
  if(t+8>end) return null; const le=v.getUint16(t)===0x4949; const u16=o=>v.getUint16(o,le), u32=o=>v.getUint32(o,le);
  if(u16(t+2)!==42) return null;
  const readIFD=io=>{const o=t+io,tags={};if(o+2>end)return tags;const n=u16(o);for(let i=0;i<n;i++){const e=o+2+i*12;if(e+12>end)break;const tag=u16(e),type=u16(e+2),cnt=u32(e+4);if(tag===0x8769)tags.exif=u32(e+8);else if((tag===0x9003||tag===0x9004||tag===0x0132)&&type===2){const p=cnt>4?t+u32(e+8):e+8;let s='';for(let k=0;k<Math.min(cnt,20)&&p+k<end;k++){const c=v.getUint8(p+k);if(!c)break;s+=String.fromCharCode(c);}tags[tag]=s;}}return tags;};
  const ifd0=readIFD(u32(t+4)); let s=null; if(ifd0.exif){const ex=readIFD(ifd0.exif); s=ex[0x9003]||ex[0x9004];}
  s=s||ifd0[0x0132]; if(!s) return null; const m=s.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/); if(!m) return null;
  const d=new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6]); return isNaN(d)||d.getFullYear()<1990?null:d;
}

/* ============================== images ============================== */
const PREV=1024;
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;}
function toBlob(cv,type='image/jpeg',q=.9){return new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('toBlob')),type,q));}
async function blobToImage(blob){const url=URL.createObjectURL(blob);const img=new Image();img.src=url;try{await img.decode();}catch(e){URL.revokeObjectURL(url);throw e;}return{img,url,w:img.naturalWidth,h:img.naturalHeight};}
function dropImage(o){if(o&&o.url){const u=o.url;setTimeout(()=>URL.revokeObjectURL(u),5000);}}
const srcW=s=>s.naturalWidth||s.width, srcH=s=>s.naturalHeight||s.height;
function drawRotated(img,rot,scale){
  const w=srcW(img),h=srcH(img),sw=Math.max(1,Math.round(w*scale)),sh=Math.max(1,Math.round(h*scale));
  const r=((rot%360)+360)%360; const cv=r%180?mkCanvas(sh,sw):mkCanvas(sw,sh);
  const cx=cv.getContext('2d',{willReadFrequently:true}); cx.imageSmoothingQuality='high';
  cx.translate(cv.width/2,cv.height/2); cx.rotate(r*Math.PI/180); cx.drawImage(img,-sw/2,-sh/2,sw,sh); return cv;
}
/* step-down resize: halves repeatedly so a big shrink still averages pixels */
function shrinkTo(src,tw,th){
  let c=src,w=srcW(src),h=srcH(src);
  while(w/2>tw*1.05&&h/2>th*1.05){w=Math.round(w/2);h=Math.round(h/2);const n=mkCanvas(w,h),x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,w,h);if(c!==src)c.width=c.height=1;c=n;}
  const out=mkCanvas(tw,th),x=out.getContext('2d',{willReadFrequently:true});x.imageSmoothingQuality='high';x.drawImage(c,0,0,tw,th);if(c!==src)c.width=c.height=1;return out;
}

/* ============================== analysis & enhancement ============================== */
function analyze(id){
  const{data:d,width:w,height:h}=id; const hist=new Uint32Array(256);
  let n=0,sr=0,sg=0,sb=0,mn=0,satSum=0; const step=Math.max(1,Math.floor(Math.sqrt(w*h/60000)));
  for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){const i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2];const L=(r*299+g*587+b*114)/1000|0;hist[L]++;n++;const mx=Math.max(r,g,b),mi=Math.min(r,g,b);satSum+=mx?(mx-mi)/mx:0;if(L>30&&L<225){sr+=r;sg+=g;sb+=b;mn++;}}
  const pct=p=>{const t=n*p;let c=0;for(let i=0;i<256;i++){c+=hist[i];if(c>=t)return i;}return 255;};
  let mean=0;for(let i=0;i<256;i++)mean+=i*hist[i];mean/=Math.max(1,n);
  const gs=Math.max(1,Math.floor(Math.min(w,h)/240)); let ls=0,lq=0,ln=0;
  const G=(x,y)=>{const j=(y*w+x)*4;return d[j]*.299+d[j+1]*.587+d[j+2]*.114;};
  for(let y=gs;y<h-gs;y+=gs)for(let x=gs;x<w-gs;x+=gs){const v=4*G(x,y)-G(x-gs,y)-G(x+gs,y)-G(x,y-gs)-G(x,y+gs);ls+=v;lq+=v*v;ln++;}
  const lvar=ln?lq/ln-(ls/ln)**2:0; const sat=satSum/Math.max(1,n);
  const clipLo=(hist[0]+hist[1]+hist[2])/n, clipHi=(hist[253]+hist[254]+hist[255])/n;
  const sharp=Math.log10(1+Math.max(0,lvar)), expo=1-Math.min(1,Math.abs(mean-122)/122)-(clipLo+clipHi)*2;
  return{lo:pct(.005),hi:pct(.995),med:pct(.5),mean,mr:mn?sr/mn:128,mg:mn?sg/mn:128,mb:mn?sb/mn:128,sat,sharp,clipLo,clipHi,score:sharp+expo*.8+sat*.4};
}
function autoParams(st){
  let lo=Math.min(st.lo,48),hi=Math.max(st.hi,196); lo*=.8; hi=255-(255-hi)*.8;
  if(hi-lo<60){const c=(hi+lo)/2;lo=c-30;hi=c+30;}
  const avg=(st.mr+st.mg+st.mb)/3, k=st.sat>.42?.2:.5;
  const gr=clamp(1+(avg/Math.max(1,st.mr)-1)*k,.88,1.14),gg=clamp(1+(avg/Math.max(1,st.mg)-1)*k,.92,1.08),gb=clamp(1+(avg/Math.max(1,st.mb)-1)*k,.86,1.16);
  const m=clamp((st.med-lo)/(hi-lo),.03,.97); let gamma=Math.log(.47)/Math.log(m);
  gamma=clamp(1+(gamma-1)*(st.med<45?.3:.55),.7,1.3);
  return{lo,hi,gr,gg,gb,gamma,sat:st.sat<.2?.12:st.sat<.32?.06:0,contrast:.04};
}
const FILTERS={
  none:{name:'기본'}, vivid:{name:'선명',sat:.2,contrast:.08},
  warm:{name:'따뜻',curve:(v,c)=>c===0?v+.05*(1-v):c===2?v*.93:v+.015*(1-v)},
  cool:{name:'시원',curve:(v,c)=>c===0?v*.94:c===2?v+.06*(1-v):v},
  film:{name:'필름',sat:-.1,contrast:-.04,curve:(v,c)=>{let x=.06+v*.89;if(c===0)x=x*1.02+.01;if(c===2)x=x+.03*(1-x)*(1-x);return x;}},
  soft:{name:'포근',sat:-.04,contrast:-.14,curve:v=>.04+v*.94},
  peach:{name:'복숭아',sat:-.02,curve:(v,c)=>c===0?v+.04*(1-v)+.01:c===1?v+.012*(1-v):v*.95+.03},
  retro:{name:'레트로',sat:.05,curve:(v,c)=>c===0?clamp(v*1.08-.02,0,1):c===1?v*.97+.02:v*.82+.1},
  bw:{name:'흑백',mono:'bw',contrast:.1}, sepia:{name:'세피아',mono:'sepia',contrast:.03},
};
const RETOUCH={off:{name:'끄기',skin:0,skinBright:0,skinRed:0},natural:{name:'자연스럽게',skin:35,skinBright:12,skinRed:20},bright:{name:'화사하게',skin:45,skinBright:35,skinRed:30},smooth:{name:'매끈하게',skin:75,skinBright:18,skinRed:25}};
const defAdj=auto=>({auto:!!auto,filter:'none',bright:0,contrast:0,sat:0,warm:0,tint:0,high:0,shadow:0,sharp:0,vignette:0,skin:0,skinBright:0,skinRed:0,rot:0,zoom:1,fx:.5,fy:.5,autoFocus:false});
const TONE_KEYS=['auto','filter','bright','contrast','sat','warm','tint','high','shadow','sharp','vignette'];
const PIX_KEYS=[...TONE_KEYS,'skin','skinBright','skinRed','rot'];
function buildLUTs(adj,st){
  const A=adj.auto?autoParams(st):{lo:0,hi:255,gr:1,gg:1,gb:1,gamma:1,sat:0,contrast:0};
  const F=FILTERS[adj.filter]||FILTERS.none; const warm=adj.warm/100,tint=adj.tint/100;
  const gains=[A.gr*(1+warm*.12)*(1+tint*.04),A.gg*(1-tint*.08),A.gb*(1-warm*.12)*(1+tint*.04)];
  const gamma=A.gamma*Math.pow(2,-adj.bright/100*1.1);
  const con=adj.contrast/100+A.contrast+(F.contrast||0); const kC=con>=0?1+con*.9:1+con*.7;
  const hl=adj.high/100,sh=adj.shadow/100; const luts=[new Uint8ClampedArray(256),new Uint8ClampedArray(256),new Uint8ClampedArray(256)];
  for(let c=0;c<3;c++)for(let i=0;i<256;i++){
    let v=clamp((i*gains[c]-A.lo)/(A.hi-A.lo),0,1); v=Math.pow(v,gamma); v=clamp(.5+(v-.5)*kC,0,1);
    if(hl){const w=clamp((v-.45)/.55,0,1),ww=w*w;v+=hl>0?hl*.3*ww*(1-v):hl*.35*ww*v;}
    if(sh){const w=clamp((.55-v)/.55,0,1),ww=w*w;v+=sh>0?sh*.34*ww*(1-v):sh*.35*ww*v;}
    if(F.curve)v=F.curve(v,c); luts[c][i]=v*255;
  }
  return{luts,sat:adj.sat/100+A.sat+(F.sat||0),F};
}

/* ---------- portrait retouch ---------- */
/* skin likelihood (0..1) from YCbCr; dark browns such as hair are excluded */
function skinProb(r,g,b){
  if(r<=g||r<=b) return 0; const y=.299*r+.587*g+.114*b; if(y<50||y>248) return 0;
  const cb=128-.168736*r-.331264*g+.5*b, cr=128+.5*r-.418688*g-.081312*b;
  const dcb=(cb-103)/18,dcr=(cr-151)/18,q=dcb*dcb+dcr*dcr; let p=q<1?1:q<2.4?(2.4-q)/1.4:0;
  if(y<80)p*=(y-50)/30; return p;
}
function boxBlur(a,w,h,ch,r){
  const tmp=new Float32Array(a.length),out=new Float32Array(a.length),inv=1/(2*r+1),W1=w-1,H1=h-1;
  for(let y=0;y<h;y++){const row=y*w;for(let c=0;c<ch;c++){let s=0;for(let k=-r;k<=r;k++)s+=a[(row+(k<0?0:k>W1?W1:k))*ch+c];for(let x=0;x<w;x++){tmp[(row+x)*ch+c]=s*inv;const xo=x-r<0?0:x-r,xi=x+r+1>W1?W1:x+r+1;s+=a[(row+xi)*ch+c]-a[(row+xo)*ch+c];}}}
  for(let x=0;x<w;x++){for(let c=0;c<ch;c++){let s=0;for(let k=-r;k<=r;k++)s+=tmp[((k<0?0:k>H1?H1:k)*w+x)*ch+c];for(let y=0;y<h;y++){out[(y*w+x)*ch+c]=s*inv;const yo=y-r<0?0:y-r,yi=y+r+1>H1?H1:y+r+1;s+=tmp[(yi*w+x)*ch+c]-tmp[(yo*w+x)*ch+c];}}}
  return out;
}
/* low-res skin mask, limited to the area around detected faces when there are any.
   map: {ox,oy,dw,dh} places the photo (normalized face boxes) inside this canvas */
function skinMask(src,boxes,map){
  const w=srcW(src),h=srcH(src),k=Math.min(1,256/Math.max(w,h)),mw=Math.max(8,Math.round(w*k)),mh=Math.max(8,Math.round(h*k));
  const c=shrinkTo(src,mw,mh),d=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,mw,mh).data; c.width=c.height=1;
  let m=new Float32Array(mw*mh),any=false;
  for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
    const i=y*mw+x; let p=skinProb(d[i*4],d[i*4+1],d[i*4+2]); if(!p)continue;
    if(boxes&&boxes.length){const nx=((x+.5)/mw*w-map.ox)/map.dw,ny=((y+.5)/mh*h-map.oy)/map.dh;let best=0;
      for(const b of boxes){const bw=b.x1-b.x0,bh=b.y1-b.y0,ex=bw*.35,ey=bh*.35,fx=bw*.2,fy=bh*.2;
        const dx=Math.max(b.x0-ex-nx,0,nx-(b.x1+ex)),dy=Math.max(b.y0-ey-ny,0,ny-(b.y1+ey*1.3));
        const wgt=Math.max(0,1-Math.max(dx/fx,dy/fy)); if(wgt>best)best=wgt;}
      p*=best;}
    m[i]=p; if(p>.05)any=true;
  }
  if(!any) return null; return{m:boxBlur(m,mw,mh,1,1),mw,mh};
}
/* edge-aware smoothing + brightening + redness reduction on skin only */
function retouch(id,adj,opt){
  const sm=(adj.skin||0)/100,bt=(adj.skinBright||0)/100,rd=(adj.skinRed||0)/100; if(!sm&&!bt&&!rd) return;
  const{data:d,width:w,height:h}=id; const cv=mkCanvas(w,h); cv.getContext('2d').putImageData(id,0,0);
  const M=skinMask(cv,opt&&opt.boxes,opt||{ox:0,oy:0,dw:w,dh:h}); if(!M){cv.width=cv.height=1;return;}
  let bd=null;
  if(sm>0){const bk=Math.min(1,150/Math.min(w,h)),sc=shrinkTo(cv,Math.max(4,Math.round(w*bk)),Math.max(4,Math.round(h*bk)));
    const up=mkCanvas(w,h),ux=up.getContext('2d',{willReadFrequently:true});ux.imageSmoothingEnabled=true;ux.imageSmoothingQuality='high';ux.drawImage(sc,0,0,w,h);bd=ux.getImageData(0,0,w,h).data;up.width=up.height=1;sc.width=sc.height=1;}
  cv.width=cv.height=1;
  const{m,mw,mh}=M,sx=mw/w,sy=mh/h;
  for(let y=0;y<h;y++){
    let fy=(y+.5)*sy-.5; if(fy<0)fy=0; const y0=fy|0,y1=y0+1<mh?y0+1:y0,ty=fy-y0,r0=y0*mw,r1=y1*mw;
    for(let x=0;x<w;x++){
      let fx=(x+.5)*sx-.5; if(fx<0)fx=0; const x0=fx|0,x1=x0+1<mw?x0+1:x0,tx=fx-x0;
      const a=(m[r0+x0]*(1-tx)+m[r0+x1]*tx)*(1-ty)+(m[r1+x0]*(1-tx)+m[r1+x1]*tx)*ty; if(a<.02)continue;
      const i=(y*w+x)*4; let r=d[i],g=d[i+1],b=d[i+2];
      if(bd){const br=bd[i],bg=bd[i+1],bb=bd[i+2],diff=(Math.abs(br-r)+Math.abs(bg-g)+Math.abs(bb-b))/3,ew=diff<16?1:diff>60?0:(60-diff)/44,t=a*sm*ew;r+=(br-r)*t;g+=(bg-g)*t;b+=(bb-b)*t;}
      if(rd){const t=a*rd,dd=r-g;if(dd>0){r-=dd*t*.16;g+=dd*t*.04;}}
      if(bt){const t=a*bt*.22;r+=(255-r)*t;g+=(255-g)*t;b+=(255-b)*t*.9;}
      d[i]=r;d[i+1]=g;d[i+2]=b;
    }
  }
}
function applyAdjust(id,adj,st,ropt){
  const{luts,sat,F}=buildLUTs(adj,st); const[LR,LG,LB]=luts; const d=id.data,n=d.length,mono=F.mono,doSat=Math.abs(sat)>.001;
  const wantSkin=(adj.skin||adj.skinBright||adj.skinRed)>0;
  if(wantSkin&&mono)retouch(id,adj,ropt);
  for(let i=0;i<n;i+=4){
    let r=LR[d[i]],g=LG[d[i+1]],b=LB[d[i+2]];
    if(mono){const L=r*.299+g*.587+b*.114;if(mono==='sepia'){r=L+28;g=L*.9+14;b=L*.72;}else{r=g=b=L;}}
    else if(doSat){const L=r*.299+g*.587+b*.114;let k;if(sat>0){const mx=r>g?(r>b?r:b):(g>b?g:b),mi=r<g?(r<b?r:b):(g<b?g:b);k=1+sat*(1.25-(mx?(mx-mi)/mx:0));}else k=1+sat;r=L+(r-L)*k;g=L+(g-L)*k;b=L+(b-L)*k;}
    d[i]=r;d[i+1]=g;d[i+2]=b;
  }
  if(wantSkin&&!mono)retouch(id,adj,ropt);
  if(adj.sharp>0)sharpen(id,adj.sharp/100);
}
function sharpen(id,amt){
  const{data:d,width:w,height:h}=id; const s=new Uint8ClampedArray(d); const a=amt*1.1,c0=1+4*a,W4=w*4;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++){const k=i+c;d[k]=s[k]*c0-a*(s[k-4]+s[k+4]+s[k-W4]+s[k+W4]);}}
}
function dhash(cv){const c=mkCanvas(9,8),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(cv,0,0,9,8);const d=x.getImageData(0,0,9,8).data;const bits=new Uint8Array(64);for(let y=0;y<8;y++)for(let i=0;i<8;i++){const a=(y*9+i)*4,b=a+4;bits[y*8+i]=(d[a]*.3+d[a+1]*.59+d[a+2]*.11)>(d[b]*.3+d[b+1]*.59+d[b+2]*.11)?1:0;}return bits;}
function ham(a,b){let n=0;for(let i=0;i<64;i++)n+=a[i]!==b[i];return n;}

/* ---------- face finding ---------- */
/* uses the browser's built-in face detector where it exists, else face-shaped skin regions */
let nativeFD;
async function detectFaces(cv,id){
  if(nativeFD===undefined){try{nativeFD=('FaceDetector' in window)?new window.FaceDetector({fastMode:true,maxDetectedFaces:8}):null;}catch(e){nativeFD=null;}}
  if(nativeFD){try{const fs=await nativeFD.detect(cv);if(fs&&fs.length){const W=cv.width,H=cv.height;return fs.slice(0,8).map(f=>{const b=f.boundingBox;return{x0:b.x/W,y0:b.y/H,x1:(b.x+b.width)/W,y1:(b.y+b.height)/H};});}if(fs)return[];}catch(e){nativeFD=null;}}
  return skinFaces(id);
}
function skinFaces(id){
  const{data:d,width:w,height:h}=id; const gw=72,gh=Math.max(4,Math.round(gw*h/w)),N=gw*gh; const g=new Uint8Array(N);
  for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){const x=Math.min(w-1,Math.floor((gx+.5)*w/gw)),y=Math.min(h-1,Math.floor((gy+.5)*h/gh)),i=(y*w+x)*4;if(skinProb(d[i],d[i+1],d[i+2])>.6)g[gy*gw+gx]=1;}
  const lab=new Int32Array(N).fill(-1),comps=[];
  for(let s=0;s<N;s++){if(!g[s]||lab[s]>=0)continue;const c={n:0,x0:1e9,y0:1e9,x1:-1,y1:-1},st=[s];lab[s]=comps.length;
    while(st.length){const k=st.pop(),x=k%gw,y=(k/gw)|0;c.n++;if(x<c.x0)c.x0=x;if(x>c.x1)c.x1=x;if(y<c.y0)c.y0=y;if(y>c.y1)c.y1=y;
      for(const nb of[x>0?k-1:-1,x<gw-1?k+1:-1,y>0?k-gw:-1,y<gh-1?k+gw:-1])if(nb>=0&&g[nb]&&lab[nb]<0){lab[nb]=comps.length;st.push(nb);}}
    comps.push(c);}
  /* a face has darker features (eyes, brows, mouth) inside its skin area; flowers, sand and lamps do not */
  const hasFeatures=c=>{const X0=c.x0/gw*w,X1=(c.x1+1)/gw*w,Y0=c.y0/gh*h,Y1=(c.y1+1)/gh*h,bw=X1-X0,bh=Y1-Y0,st=Math.max(1,Math.floor(Math.min(bw,bh)/48));
    let sy=0,sn=0;for(let y=Y0;y<Y1;y+=st)for(let x=X0;x<X1;x+=st){const i=((y|0)*w+(x|0))*4;if(skinProb(d[i],d[i+1],d[i+2])>.6){sy+=d[i]*.299+d[i+1]*.587+d[i+2]*.114;sn++;}}
    if(!sn)return false;const lim=sy/sn*.62;let dark=0,tot=0;
    for(let y=Y0+bh*.12;y<Y0+bh*.8;y+=st)for(let x=X0+bw*.18;x<X1-bw*.18;x+=st){const i=((y|0)*w+(x|0))*4;tot++;if(d[i]*.299+d[i+1]*.587+d[i+2]*.114<lim)dark++;}
    const f=tot?dark/tot:0;return f>=.012&&f<=.3;};
  return comps.filter(c=>{const a=c.n/N,bw=c.x1-c.x0+1,bh=c.y1-c.y0+1,fill=c.n/(bw*bh),ar=(bh*h/gh)/(bw*w/gw);return c.n>=6&&a>=.004&&a<=.3&&fill>=.42&&ar>=.7&&ar<=2.3&&hasFeatures(c);})
    .sort((a,b)=>b.n-a.n).slice(0,6).map(c=>({x0:c.x0/gw,y0:c.y0/gh,x1:(c.x1+1)/gw,y1:(c.y1+1)/gh}));
}
function faceCenter(boxes){if(!boxes||!boxes.length)return null;let sx=0,sy=0,sw=0;for(const b of boxes){const a=(b.x1-b.x0)*(b.y1-b.y0);sx+=(b.x0+b.x1)/2*a;sy+=(b.y0+b.y1)/2*a;sw+=a;}return{cx:sx/sw,cy:sy/sw};}
/* boxes after the photo's 90° rotations (same direction as drawRotated) */
function rotBoxes(p){
  const r=((p.adj.rot%360)+360)%360; if(!p.boxes)return null;
  return p.boxes.map(b=>r===90?{x0:1-b.y1,x1:1-b.y0,y0:b.x0,y1:b.x1}:r===180?{x0:1-b.x1,x1:1-b.x0,y0:1-b.y1,y1:1-b.y0}:r===270?{x0:b.y0,x1:b.y1,y0:1-b.x1,y1:1-b.x0}:b);
}
function focusOf(p,w,h,dw,dh){
  let fx=p.adj.fx,fy=p.adj.fy; const f=p.adj.autoFocus&&faceCenter(rotBoxes(p));
  if(f){if(dw-w>1)fx=clamp((w/2-f.cx*dw)/(w-dw),0,1);if(dh-h>1)fy=clamp((h*.42-f.cy*dh)/(h-dh),0,1);}
  return[fx,fy];
}

/* ============================== state ============================== */
const SIZES={
  s20:{label:'20×20cm 정사각 (8×8)',w:200,h:200}, s15:{label:'15×15cm 정사각 (6×6)',w:150,h:150}, s25:{label:'25×25cm 정사각 (10×10)',w:250,h:250},
  l2015:{label:'20×15cm 가로 (8×6)',w:200,h:150}, l2720:{label:'27×19.8cm 와이드 (11×8)',w:270,h:198}, p1927:{label:'19.5×27cm 세로 (8×11)',w:195,h:270},
  a4p:{label:'A4 세로 21×29.7cm',w:210,h:297}, a4l:{label:'A4 가로 29.7×21cm',w:297,h:210}, a5p:{label:'A5 세로 14.8×21cm',w:148,h:210},
};
const DEFAULT_BOOK={title:'',subtitle:'',family:'우리 가족',mode:'year',size:'s20',theme:'linen',concept:'family-year',density:'normal',coverStyle:'theme',showDates:true,showPageNo:true,birthday:'',intro:'',autoEnhance:true,faceAuto:true,dedupe:true};
const S={
  book:{...DEFAULT_BOOK},photos:[],byId:new Map(),pages:[],spread:0,selPage:0,selPhoto:null,tab:'photos',sample:true,ready:false,single:false,
  exp:{dpi:300,bleed:true,guides:false,name:''},themeCat:'전체',showMask:false,
  hitMap:[],base:null,view:null,shelf:[],shelfState:'loading',canEdit:false,canUpload:false,
};
function reindex(){S.byId=new Map(S.photos.map(p=>[p.id,p]));}
const inBook=p=>!p.err&&(p.forceIn||(!p.excluded&&!(S.book.dedupe&&p.dup)));
const bookPhotos=()=>S.photos.filter(inBook).sort((a,b)=>a.date-b.date);
const photosOf=pg=>(pg.photos||[]).map(id=>S.byId.get(id)).filter(Boolean);
function dateSpan(ps){if(!ps.length)return null;let a=ps[0].date,b=a;for(const p of ps){if(p.date<a)a=p.date;if(p.date>b)b=p.date;}return[a,b];}
function mainYear(){const ps=bookPhotos();if(!ps.length)return new Date().getFullYear();const c={};for(const p of ps)c[p.date.getFullYear()]=(c[p.date.getFullYear()]||0)+1;return+Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];}
function mainMonth(){const ps=bookPhotos();const c={};for(const p of ps){const k=p.date.getFullYear()*12+p.date.getMonth();c[k]=(c[k]||0)+1;}const e=Object.entries(c).sort((a,b)=>b[1]-a[1])[0];if(!e){const d=new Date();return[d.getFullYear(),d.getMonth()];}return[Math.floor(e[0]/12),e[0]%12];}

/* ============================== concepts ============================== */
const CONCEPTS=[
  {id:'family-year',name:'가족 연간 앨범',desc:'한 해를 달마다 챕터로',theme:'linen',mode:'year',density:'normal',cover:'theme',title:c=>`${c.y}, 우리 가족`,intro:'한 해 동안 함께 걷고, 먹고, 웃었던 날들을 한 권에 모았어요. 오래 두고 함께 넘겨 봐요.'},
  {id:'month',name:'이달의 우리',desc:'한 달을 날짜별로 가볍게',theme:'polaroid',mode:'month',density:'normal',cover:'theme',title:c=>`${c.y}년 ${c.m}월의 우리`,intro:'이번 달 우리가 함께 웃었던 순간들을 한 권에 담았어요.'},
  {id:'baby',name:'아이 성장 기록',desc:'생일을 넣으면 개월 수 표시',theme:'baby',mode:'year',density:'normal',cover:'theme',needBirthday:true,title:c=>`${c.y}, 무럭무럭`,intro:'작은 손이 조금씩 커 가는 한 해를 차곡차곡 모았어요.'},
  {id:'firstbday',name:'첫 돌 앨범',desc:'태어나서 첫 생일까지',theme:'water',mode:'year',density:'airy',cover:'collage',needBirthday:true,title:()=>'첫 돌을 축하해',intro:'세상에 온 날부터 첫 생일까지, 하루하루가 선물이었어.'},
  {id:'trip',name:'가족 여행',desc:'여행 날짜별로 꽉 차게',theme:'travel',mode:'month',density:'full',cover:'theme',title:c=>`${c.y} 우리의 여행`,intro:'함께 떠났던 길 위의 장면들을 여기 붙여 둡니다.'},
  {id:'camp',name:'캠핑·나들이',desc:'자연 속 하루를 기록',theme:'camp',mode:'month',density:'full',cover:'theme',title:c=>`${c.m}월의 캠핑`,intro:'불 피우고, 걷고, 별 보던 날들의 기록.'},
  {id:'news',name:'우리집 신문',desc:'한 달 소식을 신문처럼',theme:'news',mode:'month',density:'full',cover:'theme',title:()=>'우리집 신문',intro:'이번 호에는 우리 가족의 한 달 소식을 실었습니다. 소중한 독자 여러분의 변함없는 사랑에 감사드립니다.'},
  {id:'yearend',name:'연말 결산',desc:'한 해 베스트 컷 콜라주',theme:'holiday',mode:'year',density:'collage',cover:'collage',title:c=>`${c.y} 우리 가족 결산`,intro:'올해도 고마웠어요. 내년에도 함께 웃어요.'},
  {id:'pet',name:'반려동물 일기',desc:'우리 막내의 하루하루',theme:'pet',mode:'year',density:'normal',cover:'theme',title:c=>`우리 막내의 ${c.y}`,intro:'산책하고, 낮잠 자고, 간식 기다리던 날들.'},
  {id:'parents',name:'부모님께 드리는 앨범',desc:'큰 사진, 넉넉한 여백',theme:'hanji',mode:'year',density:'airy',cover:'theme',title:c=>`엄마 아빠께, ${c.y}`,intro:'늘 곁에 있어 주셔서 고맙습니다. 올해 함께한 날들을 모아 드려요.'},
  {id:'couple',name:'커플·기념일',desc:'둘만의 한 해',theme:'anniv',mode:'year',density:'normal',cover:'theme',title:c=>`우리 둘의 ${c.y}`,intro:'같이 걸었던 길, 같이 먹었던 밥, 같이 본 노을.'},
  {id:'party',name:'생일 파티',desc:'파티 하루를 꽉 채워',theme:'party',mode:'month',density:'full',cover:'collage',title:c=>`${c.m}월의 생일 파티`,intro:'촛불을 불고, 소원을 빌고, 다 같이 노래했던 날.'},
];
const CONCEPT_BY_ID=Object.fromEntries(CONCEPTS.map(c=>[c.id,c]));
function titleCtx(){const[y,m]=mainMonth();return{y:S.book.mode==='month'?y:mainYear(),m:m+1};}
function autoTitle(){const C=CONCEPT_BY_ID[S.book.concept],c=titleCtx();if(C&&!(C.id==='family-year'&&S.book.mode==='month')&&!(C.id==='month'&&S.book.mode==='year'))return C.title(c);return S.book.mode==='month'?`${c.y}년 ${c.m}월의 우리`:`${c.y}, 우리 가족`;}
function autoSubtitle(){const sp=dateSpan(bookPhotos());return sp?`${fmtDot(sp[0])} – ${fmtDot(sp[1])}`:'';}
const bookTitle=()=>S.book.title||autoTitle();
const bookSubtitle=()=>S.book.subtitle||autoSubtitle();
const introText=()=>S.book.intro||(CONCEPT_BY_ID[S.book.concept]||CONCEPTS[0]).intro;
function sealText(){const f=(S.book.family||'우리가족').replace(/\s+/g,'');return f.slice(0,4)||'우리';}

/* ============================== themes ============================== */
const SANS='"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Noto Sans CJK KR",sans-serif';
const SERIF='"AppleMyungjo","Batang","Noto Serif KR","Noto Serif CJK KR",serif';
const F=(fam,w,fb,scale)=>({fam,w:w||400,fb:fb||SANS,scale:scale||1});
const SEASON_PAPER=['#EDF1F6','#F0EFF5','#F8EDF0','#FAEEF2','#F0F5EA','#EAF4EF','#E8F3F6','#F5F2E3','#F6EEE2','#F6E9DF','#F0EBE4','#EBEEF3'];
const SEASON_ACCENT=['#4E6E8E','#6B6290','#C25B7A','#C8557A','#5D8A3E','#2F8A6E','#2B7F9A','#B38A1E','#B8702A','#B5532F','#8A5A3A','#4F6687'];
const POP_PAPER=['#FFE15A','#CDBBFF','#A4E8CD','#FFB8CA','#9FD3FF'];
const THEMES=[
  {id:'minimal',name:'여백',desc:'흰 종이에 사진만 또렷하게. 어떤 사진에도 무난해요.',tags:['모던','가족'],paper:{color:'#FFFFFF'},ink:'#1A1A1A',muted:'#8A8A8A',accent:'#1A1A1A',
   fonts:{display:F('IBM Plex Sans KR',600),body:F('IBM Plex Sans KR',400),hand:F('IBM Plex Sans KR',500)},margin:.085,gap:.016,frame:'none',label:'plain',cover:'top',chapter:'numeral',capAlign:'left',bleedOK:true},
  {id:'linen',name:'리넨 클래식',desc:'린넨 결 종이와 명조체. 오래 두고 보는 연간 앨범에.',tags:['클래식','가족'],paper:{color:'#F0EBE2',kind:'linen'},ink:'#3A3128',muted:'#8B7E6E',accent:'#8C6A3F',
   fonts:{display:F('Nanum Myeongjo',800,SERIF),body:F('Nanum Myeongjo',400,SERIF),hand:F('Nanum Myeongjo',400,SERIF)},margin:.1,gap:.022,frame:'keyline',label:'ornament',cover:'center',chapter:'center',capAlign:'center'},
  {id:'polaroid',name:'필름 다이어리',desc:'폴라로이드 프레임에 손글씨 날짜. 일상 기록에.',tags:['감성','일상'],paper:{color:'#ECEAE5',kind:'grain'},ink:'#2B2B2B',muted:'#7A7772',accent:'#D2483A',
   fonts:{display:F('Nanum Pen Script',400,SANS,1.4),body:F('IBM Plex Sans KR'),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.075,gap:.045,frame:'polaroid',label:'hand',cover:'frame',chapter:'numeral',capAlign:'center',overlapOK:true},
  {id:'scrap',name:'크래프트 스크랩북',desc:'크래프트지 위에 마스킹테이프와 낙서.',tags:['아기자기','아이'],paper:{color:'#C8A77A',kind:'kraft'},ink:'#3A2816',muted:'#6B5236',accent:'#E07A6F',washi:['#E9A6A6','#9CC5D8','#F1D27A','#A9D3A0','#C8B4E3'],
   fonts:{display:F('Gaegu',700,SANS,1.15),body:F('Gaegu',400,SANS,1.15),hand:F('Gaegu',700,SANS,1.15)},margin:.075,gap:.04,frame:'tape',label:'tag',cover:'frame',chapter:'numeral',capAlign:'center',overlapOK:true,doodles:true},
  {id:'kids',name:'꼬마 크레용',desc:'알록달록 색종이와 둥근 사진. 아이 사진이 많을 때.',tags:['아이','밝음'],paper:{color:'#F3FAFF',kind:'confetti'},ink:'#22304A',muted:'#5D6B85',accent:'#FF7A59',palette:['#FF7A59','#FFB72B','#3DB5A6','#7C8AE6','#F27BA8'],
   fonts:{display:F('Jua'),body:F('Jua'),hand:F('Jua')},margin:.075,gap:.035,frame:'kids',label:'pill',cover:'frame',chapter:'numeral',capAlign:'center'},
  {id:'travel',name:'여행 저널',desc:'모눈 노트에 우표 프레임과 소인.',tags:['여행'],paper:{color:'#F2EFE6',kind:'grid',line:'#8FAAC2'},ink:'#22313F',muted:'#5C6B78',accent:'#C0392B',accent2:'#1F4E79',
   fonts:{display:F('Nanum Gothic Coding',700,'monospace'),body:F('Nanum Gothic Coding',400,'monospace'),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.08,gap:.035,frame:'stamp',label:'postmark',cover:'frame',chapter:'numeral',capAlign:'left',airmail:true},
  {id:'seasons',name:'사계절',desc:'달마다 종이 색과 꽃잎, 낙엽 장식이 바뀌어요.',tags:['가족','자연'],paper:{color:m=>SEASON_PAPER[m],kind:'season'},ink:'#2F3437',muted:'#6F7579',accent:m=>SEASON_ACCENT[m],
   fonts:{display:F('Gowun Batang',700,SERIF),body:F('Gowun Batang',400,SERIF),hand:F('Gowun Batang',400,SERIF)},margin:.085,gap:.022,frame:'round',label:'season',cover:'top',chapter:'center',capAlign:'center',bleedOK:true},
  {id:'magazine',name:'매거진',desc:'꽉 찬 사진과 굵은 제목. 잡지 화보처럼.',tags:['모던','임팩트'],paper:{color:'#FFFFFF'},ink:'#111111',muted:'#6E6E6E',accent:'#E5321F',
   fonts:{display:F('Black Han Sans'),body:F('IBM Plex Sans KR',500),hand:F('IBM Plex Sans KR',500)},margin:.055,gap:.012,frame:'none',label:'magazine',cover:'bleed',chapter:'overlay',capAlign:'left',bleedOK:true,bleedBias:-.3,bigPageNo:true},
  {id:'gallery',name:'갤러리 블랙',desc:'짙은 먹색 바탕에 액자처럼 전시하듯.',tags:['모던','어두움'],paper:{color:'#1B1B1D',kind:'grain',grainLight:true},ink:'#EDEDED',muted:'#8F8F95',accent:'#EDEDED',
   fonts:{display:F('Hahmlet',300,SERIF),body:F('Hahmlet',300,SERIF),hand:F('Hahmlet',300,SERIF)},margin:.11,gap:.03,frame:'mat',label:'plain-center',cover:'center',chapter:'center',capAlign:'center',suggest:'bw'},
  {id:'water',name:'수채 파스텔',desc:'수채 번짐 같은 파스텔 바탕. 부드럽고 포근하게.',tags:['감성','아이'],paper:{color:'#FDFCFA',kind:'water'},ink:'#4A4458',muted:'#857D93',accent:'#C98BA0',blobs:['#F5C5CF','#C7E1F1','#D5EDCF','#FADFB3','#E2D3F2'],
   fonts:{display:F('Gowun Dodum'),body:F('Gowun Dodum'),hand:F('Gowun Dodum')},margin:.085,gap:.03,frame:'soft',label:'underline',cover:'top',chapter:'center',capAlign:'center'},
  {id:'vintage',name:'빈티지 앨범',desc:'검은 앨범지에 포토코너와 은색 펜 글씨.',tags:['레트로','어두움'],paper:{color:'#161514',kind:'grain',grainLight:true},ink:'#ECE5D6',muted:'#A59C8C',accent:'#C9B48A',
   fonts:{display:F('Nanum Pen Script',400,SANS,1.4),body:F('Nanum Pen Script',400,SANS,1.4),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.085,gap:.04,frame:'corners',label:'hand',cover:'frame',chapter:'numeral',capAlign:'center',suggest:'film'},
  {id:'hanji',name:'한지 수묵',desc:'한지 결에 먹선과 붉은 낙관. 명절과 가족 행사에.',tags:['전통','가족'],paper:{color:'#F3EEE2',kind:'hanji'},ink:'#1E1E1E',muted:'#6E675C',accent:'#B3261E',
   fonts:{display:F('Song Myung',400,SERIF),body:F('Gowun Batang',400,SERIF),hand:F('Nanum Brush Script',400,SERIF,1.35)},margin:.09,gap:.026,frame:'ink',label:'brush',cover:'top',chapter:'center',capAlign:'left',seal:true},
  {id:'baby',name:'성장 일기',desc:'아이 생일을 넣으면 페이지마다 개월 수가 크게.',tags:['아이','성장'],paper:{color:'#F4F7FC',kind:'stars'},ink:'#3B4A66',muted:'#7C88A0',accent:'#E98E83',accent2:'#8DB6E6',
   fonts:{display:F('Gowun Dodum'),body:F('Gowun Dodum'),hand:F('Gaegu',700,SANS,1.15)},margin:.08,gap:.03,frame:'baby',label:'age',cover:'frame',chapter:'numeral',capAlign:'center'},
  {id:'holiday',name:'겨울 홀리데이',desc:'짙은 초록 바탕에 금빛 눈송이. 연말 결산에.',tags:['기념일','어두움'],paper:{color:'#1D3A2E',kind:'snow'},ink:'#F1E7CF',muted:'#B9AE92',accent:'#D9B86A',
   fonts:{display:F('Nanum Myeongjo',800,SERIF),body:F('Nanum Myeongjo',400,SERIF),hand:F('Nanum Myeongjo',400,SERIF)},margin:.09,gap:.025,frame:'gold',label:'ornament',cover:'center',chapter:'center',capAlign:'center'},
  {id:'anniv',name:'기념일 로맨스',desc:'연분홍 종이에 아치 프레임. 커플·결혼기념일에.',tags:['기념일','감성'],paper:{color:'#F7ECEA',kind:'grain'},ink:'#5A3A3E',muted:'#A1858A',accent:'#C46A7A',
   fonts:{display:F('Gowun Batang',700,SERIF),body:F('Gowun Batang',400,SERIF),hand:F('Hi Melody',400,SANS,1.3)},margin:.09,gap:.03,frame:'arch',label:'heart',cover:'center',chapter:'center',capAlign:'center'},
  {id:'pet',name:'반려동물 일기',desc:'발자국 무늬와 뼈다귀 이름표. 우리 막내 기록.',tags:['반려동물','아기자기'],paper:{color:'#FBF5EA',kind:'paws'},ink:'#4A3B2C',muted:'#9A8670',accent:'#E39B4C',accent2:'#7FB3A8',
   fonts:{display:F('Poor Story',400,SANS,1.1),body:F('Poor Story',400,SANS,1.1),hand:F('Poor Story',400,SANS,1.15)},margin:.08,gap:.035,frame:'paw',label:'bone',cover:'frame',chapter:'numeral',capAlign:'center'},
  {id:'camp',name:'캠핑 기록',desc:'등고선 지도 위에 흰 테두리 사진. 아웃도어 기록.',tags:['여행','자연'],paper:{color:'#E8EBDD',kind:'topo'},ink:'#2E3B2C',muted:'#6E7A66',accent:'#C86B2C',accent2:'#4C6B47',
   fonts:{display:F('Do Hyeon'),body:F('Sunflower',500),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.08,gap:.03,frame:'border',label:'badge',cover:'top',chapter:'numeral',capAlign:'left'},
  {id:'news',name:'우리집 신문',desc:'제호와 단 구성, 흑백 사진. 한 달 소식을 신문처럼.',tags:['레트로','가족'],paper:{color:'#EDEAE2',kind:'grain'},ink:'#1C1B19',muted:'#6B675F',accent:'#1C1B19',
   fonts:{display:F('Nanum Myeongjo',800,SERIF),body:F('Nanum Myeongjo',400,SERIF),hand:F('Nanum Myeongjo',700,SERIF)},margin:.07,gap:.02,frame:'news',label:'dateline',cover:'news',chapter:'center',capAlign:'left',suggest:'bw',pageSuffix:'면'},
  {id:'botanical',name:'보태니컬',desc:'모서리마다 잎사귀 드로잉. 차분한 자연 톤.',tags:['자연','감성'],paper:{color:'#F2F4EA',kind:'leaves'},ink:'#2F3A2E',muted:'#7A8574',accent:'#5E7F55',
   fonts:{display:F('Gowun Batang',700,SERIF),body:F('Gowun Batang',400,SERIF),hand:F('Gowun Batang',400,SERIF)},margin:.1,gap:.026,frame:'leaf',label:'leafline',cover:'center',chapter:'center',capAlign:'center'},
  {id:'pop',name:'팝 컬러',desc:'쨍한 색 종이에 검은 테두리와 그림자. 경쾌하게.',tags:['모던','밝음'],paper:{color:(m,s)=>POP_PAPER[s%POP_PAPER.length],kind:'popdots'},ink:'#111111',muted:'#333333',accent:'#111111',
   fonts:{display:F('Black Han Sans'),body:F('Do Hyeon'),hand:F('Do Hyeon')},margin:.075,gap:.045,frame:'brutal',label:'sticker',cover:'frame',chapter:'numeral',capAlign:'center'},
  {id:'film',name:'필름 스트립',desc:'필름 구멍과 주황색 날짜 도장. 필름 카메라 느낌.',tags:['레트로','어두움'],paper:{color:'#262422',kind:'grain',grainLight:true},ink:'#EDE7DC',muted:'#9C958A',accent:'#F08A24',
   fonts:{display:F('Nanum Gothic Coding',700,'monospace'),body:F('Nanum Gothic Coding',400,'monospace'),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.07,gap:.035,frame:'film',label:'filmcode',cover:'frame',chapter:'numeral',capAlign:'center',dateStamp:true,suggest:'film'},
  {id:'marine',name:'마린 스트라이프',desc:'네이비 줄무늬와 빨간 포인트. 바다·여름 여행에.',tags:['여행','밝음'],paper:{color:'#FBFBF8',kind:'stripes'},ink:'#1F2F4D',muted:'#6B7790',accent:'#1F3A68',accent2:'#D9443A',palette:['#1F3A68','#D9443A'],
   fonts:{display:F('Sunflower',700),body:F('Sunflower',500),hand:F('Sunflower',500)},margin:.085,gap:.028,frame:'marine',label:'pill',cover:'top',chapter:'numeral',capAlign:'center'},
  {id:'party',name:'생일 파티',desc:'가랜드와 색종이 조각. 생일과 잔칫날에.',tags:['기념일','아이'],paper:{color:'#FFF9F2',kind:'bunting'},ink:'#3A2E4A',muted:'#8C7FA0',accent:'#F2668B',palette:['#F2668B','#FFC145','#4FC3B8','#7A8CF0','#B184E8'],
   fonts:{display:F('Dongle',700,SANS,1.6),body:F('Dongle',400,SANS,1.6),hand:F('Dongle',700,SANS,1.6)},margin:.08,gap:.035,frame:'party',label:'pill',cover:'frame',chapter:'numeral',capAlign:'center',overlapOK:true},
  {id:'diary',name:'줄노트 다이어리',desc:'줄 노트에 클립으로 꽂은 사진. 매일 쓰는 일기처럼.',tags:['일상','감성'],paper:{color:'#FDFDF8',kind:'lined'},ink:'#2D3550',muted:'#8790A8',accent:'#E05A5A',accent2:'#9DB6D9',
   fonts:{display:F('Gaegu',700,SANS,1.15),body:F('Gaegu',400,SANS,1.15),hand:F('Nanum Pen Script',400,SANS,1.4)},margin:.085,gap:.04,frame:'clip',label:'hand',cover:'frame',chapter:'numeral',capAlign:'center',overlapOK:true},
];
const THEME_BY_ID=Object.fromEntries(THEMES.map(t=>[t.id,t]));
const THEME_CATS=['전체','가족','아이','여행','기념일','감성','자연','모던','레트로','어두움'];
const curTheme=()=>THEME_BY_ID[S.book.theme]||THEMES[0];
const paperColor=(T,m,seed)=>typeof T.paper.color==='function'?T.paper.color(m,seed||0):T.paper.color;
const accentOf=(T,m)=>typeof T.accent==='function'?T.accent(m):T.accent;
const isPale=c=>['#FFFFFF','#EDEDED','#F1E7CF','#ECE5D6','#EDE7DC'].includes(c);
function pageMonth(pg){
  if(pg.kind==='chapter'&&pg.ym)return pg.ym[1]; const ps=photosOf(pg); if(ps.length)return ps[0].date.getMonth();
  const all=bookPhotos(); if(pg.kind==='back'&&all.length)return all[all.length-1].date.getMonth(); return all.length?all[0].date.getMonth():new Date().getMonth();
}
function setFont(ctx,T,role,px,weight){const f=T.fonts[role];ctx.font=`${weight||f.w||400} ${Math.max(1,px*(f.scale||1)).toFixed(2)}px "${f.fam}", ${f.fb}`;}
function txt(ctx,s,x,y,o={}){ctx.save();ctx.fillStyle=o.color||'#000';ctx.textAlign=o.align||'left';ctx.textBaseline=o.base||'alphabetic';try{ctx.letterSpacing=(o.ls||0)+'px';}catch(e){}if(o.shadow){ctx.shadowColor=o.shadow;ctx.shadowBlur=o.sb||6;}ctx.fillText(s,x,y);ctx.restore();}
function fitFont(ctx,T,role,s,px,maxW,weight){let size=px;setFont(ctx,T,role,size,weight);let g=0;while(size>4&&ctx.measureText(s).width>maxW&&g++<60){size*=.93;setFont(ctx,T,role,size,weight);}return size;}
function wrap(ctx,text,maxW){
  const out=[];
  for(const para of String(text||'').split('\n')){
    if(!para.trim()){out.push('');continue;} let line='';
    for(const word of para.split(/(\s+)/)){
      if(!word)continue; const test=line+word;
      if(ctx.measureText(test).width<=maxW){line=test;continue;}
      if(line.trim()){out.push(line.trim());line='';}
      if(/^\s+$/.test(word))continue;
      if(ctx.measureText(word).width<=maxW){line=word;continue;}
      for(const ch of word){if(ctx.measureText(line+ch).width>maxW&&line){out.push(line);line=ch;}else line+=ch;}
    }
    if(line.trim())out.push(line.trim());
  }
  return out;
}
function roundRectPath(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function archPath(ctx,x,y,w,h){const r=Math.min(w/2,h*.48);ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+r);ctx.ellipse(x+w/2,y+r,w/2,r,0,Math.PI,2*Math.PI);ctx.lineTo(x+w,y+h);ctx.closePath();}
function starPath(ctx,x,y,R,r,n){ctx.beginPath();for(let i=0;i<n*2;i++){const a=i*Math.PI/n-Math.PI/2,rad=i%2?r:R;ctx.lineTo(x+Math.cos(a)*rad,y+Math.sin(a)*rad);}ctx.closePath();}
function heartPath(ctx,x,y,s){ctx.beginPath();ctx.moveTo(x,y+s*.7);ctx.bezierCurveTo(x-s*1.4,y-s*.2,x-s*.5,y-s*1.1,x,y-s*.35);ctx.bezierCurveTo(x+s*.5,y-s*1.1,x+s*1.4,y-s*.2,x,y+s*.7);}
function pawPath(ctx,x,y,s){ctx.beginPath();ctx.ellipse(x,y+s*.25,s*.42,s*.34,0,0,7);for(const[a,b,r]of[[-.48,-.2,.17],[-.18,-.46,.18],[.18,-.46,.18],[.48,-.2,.17]]){ctx.moveTo(x+a*s+r*s,y+b*s);ctx.ellipse(x+a*s,y+b*s,r*s,r*s*1.2,0,0,7);}}
function leafSprig(ctx,x,y,len,ang,col,u){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=Math.max(.6,u*.18);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(len*.5,-len*.08,len,0);ctx.stroke();for(let i=1;i<=5;i++){const t=i/6,px=len*t,py=-len*.08*4*t*(1-t),s=(i%2?-1:1),lw=len*.16*(1-t*.4);ctx.save();ctx.translate(px,py);ctx.rotate(s*.7);ctx.beginPath();ctx.ellipse(lw*.55,0,lw*.6,lw*.24,0,0,7);ctx.fill();ctx.restore();}ctx.restore();}

/* ---------- paper textures ---------- */
const tileCache=new Map();
function getTile(T,kind,k){
  const size=Math.max(24,Math.round(160*k)); const key=`${T.id}|${kind}|${size}`; if(tileCache.has(key))return tileCache.get(key);
  const c=mkCanvas(size,size),x=c.getContext('2d'); x.scale(size/160,size/160); const r=mulberry32(7);
  if(kind==='grain'){const L=T.paper.grainLight;for(let i=0;i<1100;i++){x.fillStyle=r()<.5?(L?'rgba(255,255,255,.05)':'rgba(0,0,0,.04)'):(L?'rgba(0,0,0,.28)':'rgba(255,255,255,.4)');x.fillRect(r()*160,r()*160,.7,.7);}}
  else if(kind==='linen'){for(let y=0;y<160;y+=1.6){x.fillStyle=`rgba(90,70,40,${.02+r()*.05})`;x.fillRect(0,y,160,.55);}for(let i=0;i<160;i+=1.6){x.fillStyle=`rgba(255,255,255,${.05+r()*.08})`;x.fillRect(i,0,.55,160);}}
  else if(kind==='kraft'){for(let i=0;i<1500;i++){x.fillStyle=r()<.6?`rgba(70,45,20,${.05+r()*.12})`:`rgba(255,240,210,${.08+r()*.14})`;x.fillRect(r()*160,r()*160,.5+r()*.9,.5+r()*.9);}x.lineWidth=.35;for(let i=0;i<70;i++){x.strokeStyle=`rgba(80,55,25,${.08+r()*.12})`;const px=r()*160,py=r()*160,a=r()*6.3,l=3+r()*9;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a+.6)*l/2,py+Math.sin(a+.6)*l/2,px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}}
  else if(kind==='grid'){x.strokeStyle=hexA(T.paper.line,.5);x.lineWidth=.32;x.beginPath();for(let i=0;i<160;i+=10){x.moveTo(i+.16,0);x.lineTo(i+.16,160);x.moveTo(0,i+.16);x.lineTo(160,i+.16);}x.stroke();}
  else if(kind==='hanji'){for(let i=0;i<700;i++){x.fillStyle=r()<.5?'rgba(110,90,60,.06)':'rgba(255,255,255,.5)';x.fillRect(r()*160,r()*160,.6,.6);}x.lineWidth=.4;for(let i=0;i<110;i++){x.strokeStyle=r()<.55?'rgba(255,255,255,.65)':'rgba(120,100,70,.12)';const px=r()*160,py=r()*160,a=r()*6.3,l=6+r()*22;x.beginPath();x.moveTo(px,py);x.bezierCurveTo(px+Math.cos(a+1)*l*.3,py+Math.sin(a+1)*l*.3,px+Math.cos(a-1)*l*.7,py+Math.sin(a-1)*l*.7,px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}}
  else if(kind==='stars'){for(let i=0;i<12;i++){const px=8+r()*144,py=8+r()*144,s=1.2+r()*1.8;x.fillStyle=r()<.5?hexA(T.accent,.3):hexA(T.accent2,.32);starPath(x,px,py,s,s*.45,4);x.fill();}}
  else if(kind==='paws'){for(let i=0;i<5;i++){x.save();x.translate(18+(i%3)*50+r()*12,18+((i*37)%4)*36+r()*12);x.rotate(r()*6.3);x.fillStyle=hexA(T.accent,.13);pawPath(x,0,0,9);x.fill();x.restore();}}
  else if(kind==='popdots'){x.fillStyle='rgba(0,0,0,.13)';for(let yy=5;yy<160;yy+=10)for(let xx=5;xx<160;xx+=10){x.beginPath();x.arc(xx,yy,.8,0,7);x.fill();}}
  tileCache.set(key,c); return c;
}
function paintPaper(R){
  const{ctx,T,W,H,b,u,rng,side}=R; ctx.fillStyle=paperColor(T,R.month,R.seed); ctx.fillRect(-b,-b,W+2*b,H+2*b);
  const kind=T.paper.kind,m=T.margin*Math.min(W,H);
  if(['grain','linen','kraft','grid','hanji','stars','paws','popdots'].includes(kind)){ctx.fillStyle=ctx.createPattern(getTile(T,kind,Math.min(W,H)/420),'repeat');ctx.fillRect(-b,-b,W+2*b,H+2*b);}
  if(kind==='confetti'){for(let i=0;i<28;i++){const x=rng()*W,y=rng()*H,s=u*(.45+rng()*1.1);ctx.fillStyle=hexA(T.palette[i%5],.38);if(rng()<.5){ctx.beginPath();ctx.arc(x,y,s,0,7);ctx.fill();}else{ctx.save();ctx.translate(x,y);ctx.rotate(rng()*3);ctx.fillRect(-s,-s*.35,s*2,s*.7);ctx.restore();}}}
  if(kind==='water'){for(let i=0;i<5;i++){const x=rng()*W,y=rng()*H,rad=Math.min(W,H)*(.28+rng()*.35),c=T.blobs[(i+R.seed)%T.blobs.length];const g=ctx.createRadialGradient(x,y,rad*.08,x,y,rad);g.addColorStop(0,hexA(c,.55));g.addColorStop(.55,hexA(c,.25));g.addColorStop(1,hexA(c,0));ctx.fillStyle=g;ctx.fillRect(x-rad,y-rad,rad*2,rad*2);}}
  if(kind==='season')seasonDeco(R);
  if(kind==='snow'){for(let i=0;i<30;i++){const x=rng()*W,y=rng()*H,s=u*(.5+rng()*1.3);ctx.save();ctx.translate(x,y);ctx.rotate(rng());ctx.strokeStyle=hexA(T.accent,.28);ctx.lineWidth=Math.max(.6,u*.12);ctx.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s);}ctx.stroke();ctx.restore();}}
  if(kind==='topo'){ctx.save();ctx.strokeStyle=hexA(T.accent2,.2);ctx.lineWidth=Math.max(.6,u*.14);for(let c=0;c<3;c++){const cx=rng()*W,cy=rng()*H,ph=rng()*6;for(let k=1;k<=9;k++){const rad=k*u*4.2;ctx.beginPath();for(let a=0;a<=64;a++){const t=a/64*Math.PI*2,rr=rad*(1+.18*Math.sin(t*3+ph+k*.3)+.1*Math.cos(t*5-ph));const px=cx+Math.cos(t)*rr*1.25,py=cy+Math.sin(t)*rr;a?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.stroke();}}ctx.restore();}
  if(kind==='leaves'){const col=hexA(T.accent,.42);leafSprig(ctx,W-m*.25,m*.2,u*15,Math.PI*.78,col,u);leafSprig(ctx,W-m*.15,m*.9,u*10,Math.PI*.95,hexA(T.accent,.3),u);leafSprig(ctx,m*.25,H-m*.2,u*15,-Math.PI*.22,col,u);leafSprig(ctx,m*.15,H-m*.95,u*10,-Math.PI*.05,hexA(T.accent,.3),u);}
  if(kind==='stripes'){ctx.fillStyle=T.accent;for(let k=0;k<3;k++){ctx.fillRect(-b,-b+k*u*1.6,W+2*b,u*.8);ctx.fillRect(-b,H+b-u*.8-k*u*1.6,W+2*b,u*.8);}ctx.fillStyle=T.accent2;ctx.fillRect(-b,-b+u*4.8,W+2*b,u*.35);ctx.fillRect(-b,H+b-u*5.15,W+2*b,u*.35);}
  if(kind==='bunting'){for(let i=0;i<14;i++){ctx.fillStyle=hexA(T.palette[i%5],.3);ctx.beginPath();ctx.arc(rng()*W,m+rng()*(H-m),u*(.3+rng()*.6),0,7);ctx.fill();}ctx.save();ctx.strokeStyle=hexA(T.ink,.45);ctx.lineWidth=Math.max(.6,u*.12);const y0=m*.32,sag=m*.32,n=9,yAt=t=>y0+sag*4*t*(1-t);ctx.beginPath();for(let k=0;k<=40;k++){const t=k/40;k?ctx.lineTo(t*W,yAt(t)):ctx.moveTo(0,yAt(0));}ctx.stroke();for(let k=0;k<n;k++){const t=(k+.5)/n,x=t*W,y=yAt(t),fw=W/n*.36;ctx.fillStyle=T.palette[k%5];ctx.beginPath();ctx.moveTo(x-fw,y);ctx.lineTo(x+fw,y);ctx.lineTo(x,y+fw*1.5);ctx.closePath();ctx.fill();}ctx.restore();}
  if(kind==='lined'){ctx.save();ctx.strokeStyle=hexA(T.accent2,.5);ctx.lineWidth=Math.max(.6,u*.1);for(let y=m*1.1;y<H;y+=u*4.2){ctx.beginPath();ctx.moveTo(-b,y);ctx.lineTo(W+b,y);ctx.stroke();}const mx=side==='left'?W-m*.62:m*.62;ctx.strokeStyle=hexA(T.accent,.55);ctx.beginPath();ctx.moveTo(mx,-b);ctx.lineTo(mx,H+b);ctx.stroke();const hx=side==='left'?W-m*.3:m*.3;for(let k=0;k<7;k++){const hy=H*(k+.5)/7;ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.arc(hx,hy,u*1.05,0,7);ctx.fill();ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(hx+u*.15,hy+u*.15,u*.85,0,7);ctx.fill();}ctx.restore();}
  if(T.airmail&&(R.page.kind==='cover'||R.page.kind==='back'))airmail(R);
}
function seasonDeco(R){
  const{ctx,W,H,u,rng}=R; const s=seasonOf(R.month);
  if(s===3){for(let i=0;i<46;i++){ctx.fillStyle='rgba(120,145,175,.32)';ctx.beginPath();ctx.arc(rng()*W,rng()*H,u*(.22+rng()*.5),0,7);ctx.fill();}}
  else if(s===0){for(let i=0;i<22;i++){ctx.save();ctx.translate(rng()*W,rng()*H);ctx.rotate(rng()*6.3);ctx.fillStyle=hexA(['#F2A7B8','#F7C3CF','#EE95AA'][i%3],.55);ctx.beginPath();ctx.ellipse(0,0,u*.95,u*.5,0,0,7);ctx.fill();ctx.restore();}}
  else if(s===1){ctx.fillStyle='rgba(246,196,83,.16)';ctx.beginPath();ctx.arc(W*.92,H*.06,u*14,0,7);ctx.fill();ctx.strokeStyle='rgba(80,170,175,.32)';ctx.lineWidth=u*.35;for(let k=0;k<3;k++){ctx.beginPath();const y0=H-u*(2.2+k*1.8);for(let x=-u*2;x<=W+u*2;x+=u*2){const y=y0+Math.sin(x/(u*3)+k)*u*.5;x<=-u*2?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}}
  else{for(let i=0;i<16;i++){ctx.save();ctx.translate(rng()*W,rng()*H);ctx.rotate(rng()*6.3);ctx.fillStyle=hexA(['#D9822B','#C8553D','#E3B23C'][i%3],.6);ctx.beginPath();ctx.ellipse(0,0,u*1.15,u*.55,0,0,7);ctx.fill();ctx.strokeStyle=hexA('#7A3E1D',.45);ctx.lineWidth=u*.08;ctx.beginPath();ctx.moveTo(-u*1.4,0);ctx.lineTo(u*1.1,0);ctx.stroke();ctx.restore();}}
}
function airmail(R){
  const{ctx,T,W,H,b,u}=R; const bw=u*2.1,sw=u*2.4,cols=[T.accent,'#FFFFFF',T.accent2,'#FFFFFF']; const span=H+2*b;
  ctx.save();ctx.beginPath();ctx.rect(-b,-b,W+2*b,H+2*b);ctx.rect(bw,bw,W-2*bw,H-2*bw);ctx.clip('evenodd');
  let i=0;for(let k=-span-b;k<W+span+b;k+=sw){ctx.fillStyle=cols[i++%4];ctx.beginPath();ctx.moveTo(k,-b);ctx.lineTo(k+sw,-b);ctx.lineTo(k+sw-span,H+b);ctx.lineTo(k-span,H+b);ctx.closePath();ctx.fill();}
  ctx.restore();
}
function drawSeal(R,x,y,s,text){
  const{ctx,T}=R; ctx.save();ctx.translate(x,y);ctx.rotate(-.04);
  ctx.fillStyle=hexA(T.accent,.9);roundRectPath(ctx,0,0,s,s,s*.08);ctx.fill();
  ctx.strokeStyle='rgba(255,247,238,.85)';ctx.lineWidth=s*.035;roundRectPath(ctx,s*.09,s*.09,s*.82,s*.82,s*.05);ctx.stroke();
  const ch=[...text].slice(0,4); ctx.fillStyle='#FFF7EE';ctx.textAlign='center';ctx.textBaseline='middle';
  if(ch.length<=1){setFont(ctx,T,'display',s*.56);ctx.fillText(ch[0]||'',s/2,s/2);}
  else if(ch.length===2){setFont(ctx,T,'display',s*.36);ctx.fillText(ch[0],s/2,s*.32);ctx.fillText(ch[1],s/2,s*.68);}
  else{setFont(ctx,T,'display',s*.32);const pos=ch.length===3?[[.69,.32],[.69,.68],[.31,.5]]:[[.69,.32],[.69,.68],[.31,.32],[.31,.68]];ch.forEach((c,i)=>ctx.fillText(c,s*pos[i][0],s*pos[i][1]));}
  ctx.restore();
}

/* ============================== layouts (1–12 photos per page) ============================== */
function gridRects(cols,rows,gx,gy){const w=(1-gx*(cols-1))/cols,h=(1-gy*(rows-1))/rows,o=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)o.push([c*(w+gx),r*(h+gy),w,h]);return o;}
/* templates as letter grids: each letter is one photo, spanning the cells it covers */
function areaRects(rows,gx,gy){
  const R=rows.length,C=rows[0].length,cw=(1-gx*(C-1))/C,chh=(1-gy*(R-1))/R,box={};
  rows.forEach((row,r)=>[...row].forEach((k,c)=>{if(k==='.')return;const b=box[k]||(box[k]={r0:r,r1:r,c0:c,c1:c});b.r0=Math.min(b.r0,r);b.r1=Math.max(b.r1,r);b.c0=Math.min(b.c0,c);b.c1=Math.max(b.c1,c);}));
  return Object.keys(box).sort().map(k=>{const b=box[k],sc=b.c1-b.c0+1,sr=b.r1-b.r0+1;return[b.c0*(cw+gx),b.r0*(chh+gy),sc*cw+(sc-1)*gx,sr*chh+(sr-1)*gy];});
}
const A=(k,rows,x)=>Object.assign({k,r:(gx,gy)=>areaRects(rows,gx,gy)},x||{});
const G=(k,c,r)=>({k,r:(gx,gy)=>gridRects(c,r,gx,gy)});
const LAYOUTS={
  1:[{k:'1-fill',r:()=>[[0,0,1,1]]},{k:'1-bleed',bleed:true,r:()=>[[0,0,1,1]]},{k:'1-center',r:()=>[[.15,.03,.7,.94]]},{k:'1-wide',r:()=>[[0,.15,1,.7]]}],
  2:[G('2-cols',2,1),G('2-rows',1,2),{k:'2-big',r:(gx,gy)=>[[0,0,.62-gx/2,1],[.62+gx/2,.34,.38-gx/2,.66]]},{k:'2-tilt',overlap:true,r:()=>[[0,0,.6,.6],[.4,.4,.6,.6]]}],
  3:[A('3-left',['aab','aac']),A('3-top',['aa','bc']),G('3-cols',3,1),G('3-rows',1,3),{k:'3-scatter',overlap:true,r:()=>[[0,0,.56,.5],[.44,.24,.56,.5],[.06,.52,.5,.48]]}],
  4:[G('4-grid',2,2),A('4-strip',['aaa','aaa','bcd']),A('4-stack',['aab','aac','aad']),A('4-band',['abc','ddd']),G('4-cols',4,1),{k:'4-scatter',overlap:true,r:()=>[[0,0,.52,.48],[.48,.04,.52,.46],[.02,.5,.5,.48],[.5,.54,.5,.46]]}],
  5:[A('5-mosaic',['abc','ade']),A('5-rows',['aaabbb','ccddee']),A('5-film',['aabb','cdde']),A('5-cross',['abc','dde'])],
  6:[G('6-grid32',3,2),G('6-grid23',2,3),A('6-hero',['aab','aac','def']),A('6-band',['abc','ddd','eef'])],
  7:[A('7-hero',['aabc','aade','fgde']),A('7-band',['abc','ddd','efg']),A('7-col',['abcd','eefg'])],
  8:[G('8-grid42',4,2),G('8-grid24',2,4),A('8-hero',['aabc','aade','ffgh'])],
  9:[G('9-grid',3,3),A('9-hero',['aabc','aade','fghi'])],
  10:[A('10-band',['abcd','eeff','ghij']),G('10-grid52',5,2),A('10-hero',['aabcd','aaefg','hhijj'])],
  11:[A('11-hero',['aabc','aade','fghi','jjkk']),A('11-grid',['abcd','efgh','iijk'])],
  12:[G('12-grid43',4,3),G('12-grid34',3,4),A('12-hero',['aabcd','aaefg','hijkl'])],
};
for(const[n,list]of Object.entries(LAYOUTS))LAYOUTS[n]=list.filter(L=>L.r(.02,.02).length===+n);
const MAXP=12;
const layoutsFor=(n,T)=>(LAYOUTS[clamp(n,1,MAXP)]||[]).filter(L=>(!L.bleed||T.bleedOK)&&(!L.overlap||T.overlapOK));
function findLayout(k,n,T){const list=layoutsFor(n,T);return list.find(L=>L.k===k)||list[0];}
function frameGeom(T,w,h){
  const mn=Math.min(w,h);
  switch(T.frame){
    case 'polaroid':{const cw=w*.94,ch=h*.94,p=Math.min(cw,ch)*.055;return{cw,ch,l:p,t:p,r:p,b:p*3.4};}
    case 'tape':{const cw=w*.95,ch=h*.95,p=Math.min(cw,ch)*.035;return{cw,ch,l:p,t:p,r:p,b:p};}
    case 'clip':{const cw=w*.95,ch=h*.95,p=Math.min(cw,ch)*.03;return{cw,ch,l:p,t:p,r:p,b:p};}
    case 'stamp':{const cw=w*.95,ch=h*.95,p=Math.min(cw,ch)*.075;return{cw,ch,l:p,t:p,r:p,b:p};}
    case 'kids':{const off=mn*.03,p=mn*.028;return{cw:w-off,ch:h-off,off,l:p,t:p,r:p,b:p};}
    case 'brutal':{const off=mn*.035;return{cw:w-off,ch:h-off,off,l:0,t:0,r:0,b:0};}
    case 'soft':case 'paw':{const p=mn*.022;return{cw:w,ch:h,l:p,t:p,r:p,b:p};}
    case 'baby':{const p=mn*.025;return{cw:w,ch:h,l:p,t:p,r:p,b:p};}
    case 'corners':{const p=mn*.022;return{cw:w,ch:h,l:p,t:p,r:p,b:p};}
    case 'border':{const p=mn*.045;return{cw:w,ch:h,l:p,t:p,r:p,b:p*1.15};}
    case 'party':{const p=mn*.032;return{cw:w,ch:h,l:p,t:p,r:p,b:p};}
    case 'film':{const s=mn*.035,t=mn*.12;return{cw:w,ch:h,l:s,t,r:s,b:t};}
    default:return{cw:w,ch:h,l:0,t:0,r:0,b:0};
  }
}
function contentBox(T,W,H,cap){const mn=Math.min(W,H),u=mn/100,m=T.margin*mn,top=m+(S.book.showDates?u*6.5:u*1.5),bot=m+(cap?u*8:u*2.5);return{x:m,y:top,w:W-2*m,h:H-top-bot,m};}
const photoAR=p=>(p.adj.rot%180)?p.h/p.w:p.w/p.h;
function* perms(a){if(a.length<=1){yield a.slice();return;}for(let i=0;i<a.length;i++){const rest=a.slice(0,i).concat(a.slice(i+1));for(const p of perms(rest))yield[a[i],...p];}}
/* match photos to slots: shape fit first, best photo gets the biggest slot */
function assign(slots,photos){
  const n=photos.length; const scores=photos.map(p=>p.score); const lo=Math.min(...scores),hi=Math.max(...scores);
  const ns=scores.map(s=>hi>lo?(s-lo)/(hi-lo):.5); const totA=slots.reduce((s,x)=>s+x.area,0)||1;
  const cost=order=>{let c=0;order.forEach((pi,si)=>{c+=Math.abs(Math.log(slots[si].ar/photoAR(photos[pi])));c-=.3*ns[pi]*slots[si].area/totA;});return c;};
  if(n<=4){let best=null;for(const o of perms([...Array(n).keys()])){const c=cost(o);if(!best||c<best.c)best={c,o};}return best;}
  const o=new Array(n); let freeS=[...slots.keys()],freeP=[...photos.keys()];
  const areas=slots.map(s=>s.area).sort((a,b)=>a-b),med=areas[Math.floor(n/2)],big=freeS.reduce((m,i)=>slots[i].area>slots[m].area?i:m,freeS[0]);
  if(slots[big].area>med*1.6){const bp=freeP.reduce((m,i)=>photos[i].score>photos[m].score?i:m,freeP[0]);o[big]=bp;freeS=freeS.filter(i=>i!==big);freeP=freeP.filter(i=>i!==bp);}
  freeS.sort((a,b)=>slots[a].ar-slots[b].ar);freeP.sort((a,b)=>photoAR(photos[a])-photoAR(photos[b]));freeS.forEach((s,k)=>o[s]=freeP[k]);
  return{c:cost(o),o};
}
function slotsFor(L,T,cap){
  const sz=SIZES[S.book.size],W=sz.w*10,H=sz.h*10,box=contentBox(T,W,H,cap),gap=T.gap*Math.min(W,H);
  return L.r(gap/box.w,gap/box.h).map(r=>{const w=r[2]*box.w,h=r[3]*box.h,g=frameGeom(T,w,h);return{ar:(g.cw-g.l-g.r)/Math.max(1,g.ch-g.t-g.b),area:w*h};});
}
function pickLayout(pg,prevKey,forceKey){
  const T=curTheme(),ps=photosOf(pg).slice(0,MAXP); pg.photos=ps.map(p=>p.id); if(!ps.length){pg.layout=null;return;}
  const list=layoutsFor(ps.length,T); const rng=mulberry32(hashStr(pg.id)); let best=null;
  for(const L of list){
    if(forceKey&&L.k!==forceKey)continue;
    const a=assign(slotsFor(L,T,!!pg.caption),ps);
    const c=a.c+(L.k===prevKey?.35:0)+rng()*.12+(L.bleed?.25+(T.bleedBias||0):0)+(L.overlap?.08:0);
    if(!best||c<best.c)best={c,L,o:a.o};
  }
  if(!best)return; pg.layout=best.L.k; pg.photos=best.o.map(i=>ps[i].id);
}

/* ============================== book building ============================== */
const mkPage=(kind,extra)=>Object.assign({id:uid('pg'),kind,photos:[],layout:null,label:null,caption:'',title:null,text:''},extra||{});
const bestOf=a=>a.reduce((m,p)=>!m||p.score>m.score?p:m,null);
const DENSITY={airy:[1,2,1,2,1,1,2,2],normal:[3,2,4,3,2,4,3,3],full:[4,6,5,4,6,5,6,4],collage:[8,9,6,12,8,10,9,7]};
function chunk(items,state){
  const out=[],cyc=DENSITY[S.book.density]||DENSITY.normal; let i=0;
  while(i<items.length){
    const rem=items.length-i; let t=cyc[state.ci++%cyc.length];
    if(rem<=t){out.push(items.slice(i));break;} if(rem-t===1&&t<MAXP)t++;
    let take=1;
    while(take<t&&i+take<items.length){if(dayKey(items[i+take-1].date)!==dayKey(items[i+take].date)&&take>=Math.max(1,t-1))break;take++;}
    out.push(items.slice(i,i+take)); i+=take;
  }
  return out;
}
function rebuild(){
  const ps=bookPhotos(),pages=[]; const top=[...ps].sort((a,b)=>b.score-a.score).slice(0,6);
  pages.push(mkPage('cover',{photos:top.map(p=>p.id)})); pages.push(mkPage('title'));
  if(ps.length){
    let groups=[{key:null,items:ps}];
    if(S.book.mode==='year'){const m=new Map();for(const p of ps){const k=p.date.getFullYear()*12+p.date.getMonth();if(!m.has(k))m.set(k,[]);m.get(k).push(p);}groups=[...m.entries()].sort((a,b)=>a[0]-b[0]).map(([k,items])=>({key:[Math.floor(k/12),k%12],items}));}
    if(S.book.mode==='year'&&(S.book.density==='full'||S.book.density==='collage')){const mg=[];for(const g of groups){const last=mg[mg.length-1];if(last&&(last.items.length<6||g.items.length<6)&&last.items.length+g.items.length<=24){last.items=last.items.concat(g.items);last.key2=g.key;}else mg.push({key:g.key,items:[...g.items]});}groups=mg;}
    const chapters=S.book.mode==='year'&&groups.length>1; let prev=null; const state={ci:0};
    for(const g of groups){
      let items=g.items;
      if(chapters&&items.length>=4){const h=bestOf(items);pages.push(mkPage('chapter',{photos:[h.id],ym:g.key,ym2:g.key2||null,count:items.length}));items=items.filter(p=>p!==h);}
      for(const c of chunk(items,state)){const pg=mkPage('photos',{photos:c.map(p=>p.id)});pickLayout(pg,prev);prev=pg.layout;pages.push(pg);}
    }
  }
  pages.push(mkPage('stats')); pages.push(mkPage('back'));
  S.pages=pages; normalizePages(); S.spread=Math.min(S.spread,views().length-1); if(S.selPage>=S.pages.length)S.selPage=0;
}
function normalizePages(){const pg=S.pages.filter(p=>!p.pad);if((pg.length-2)%2===1)pg.splice(pg.length-1,0,mkPage('notes',{pad:true}));S.pages=pg;}
function spreads(){const n=S.pages.length,sp=[[0]];for(let i=1;i<n-1;i+=2)sp.push(i+1<n-1?[i,i+1]:[i]);sp.push([n-1]);return sp;}
const views=()=>S.single?S.pages.map((_,i)=>[i]):spreads();
const viewOfPage=i=>views().findIndex(s=>s.includes(i));
const sideOf=i=>(i===0||i===S.pages.length-1)?'right':(i%2===1?'left':'right');
function relayoutAll(){let prev=null;for(const pg of S.pages){if(pg.kind!=='photos')continue;const ok=layoutsFor(pg.photos.length,curTheme()).some(L=>L.k===pg.layout);pickLayout(pg,prev,pg.manual&&ok?pg.layout:null);prev=pg.layout;}}
function dedupe(){
  const ps=S.photos.filter(p=>!p.err).sort((a,b)=>a.date-b.date); for(const p of ps)p.dup=false; let i=0;
  while(i<ps.length){const grp=[ps[i]];let j=i+1;while(j<ps.length&&ps[j].date-grp[grp.length-1].date<120000){if(grp.some(q=>ham(q.hash,ps[j].hash)<=9&&Math.abs(q.stats.mean-ps[j].stats.mean)<22))grp.push(ps[j]);else break;j++;}
    if(grp.length>1){const b=bestOf(grp);for(const q of grp)if(q!==b)q.dup=true;} i=j;}
}

/* ============================== page rendering ============================== */
function autoLabel(pg){const sp=dateSpan(photosOf(pg));return sp?fmtRange(sp[0],sp[1],S.book.mode==='month'):'';}
function ageFor(pg){const sp=dateSpan(photosOf(pg));return sp?ageText(S.book.birthday,sp[0]):'';}
async function renderPage(ctx,page,W,H,o){
  const T=o.theme||curTheme(); const month=pageMonth(page);
  const R={ctx,T,page,W,H,b:o.bleed||0,u:Math.min(W,H)/100,o,hits:[],rng:mulberry32(hashStr(page.id+T.id)),month,side:o.side||'right',accent:accentOf(T,month),seed:hashStr(page.id)%5};
  ctx.save(); paintPaper(R);
  switch(page.kind){
    case 'cover':await drawCover(R);break; case 'title':drawTitlePage(R);break; case 'chapter':await drawChapter(R);break;
    case 'photos':await drawPhotosPage(R);break; case 'stats':drawStats(R);break; case 'notes':drawNotes(R);break;
    case 'text':drawTextPage(R);break; case 'back':drawBack(R);break;
  }
  ctx.restore(); return R.hits;
}
/* full-resolution photo for print: crop from the original file, then tone + portrait retouch at print size */
async function renderPhotoForExport(p,tw,th){
  const o=await blobToImage(p.file);
  try{
    const rot=((p.adj.rot%360)+360)%360,rw=rot%180?o.h:o.w,rh=rot%180?o.w:o.h;
    const s=Math.max(tw/rw,th/rh)*p.adj.zoom,dw=rw*s,dh=rh*s,[fx,fy]=focusOf(p,tw,th,dw,dh),ox=(tw-dw)*fx,oy=(th-dh)*fy;
    const cv=mkCanvas(tw,th),cx=cv.getContext('2d',{willReadFrequently:true}); cx.imageSmoothingQuality='high';
    cx.translate(ox+dw/2,oy+dh/2); cx.rotate(rot*Math.PI/180);
    const iw=rot%180?dh:dw,ih=rot%180?dw:dh; cx.drawImage(o.img,-iw/2,-ih/2,iw,ih); cx.setTransform(1,0,0,1,0,0);
    const id=cx.getImageData(0,0,cv.width,cv.height); applyAdjust(id,p.adj,p.stats,{boxes:rotBoxes(p),ox,oy,dw,dh}); cx.putImageData(id,0,0); return cv;
  }finally{URL.revokeObjectURL(o.url);}
}
async function place(R,p,rect,shape){
  const{ctx}=R; const[x,y,w,h]=rect; if(w<1||h<1)return;
  ctx.save(); if(shape==='arch')archPath(ctx,x,y,w,h); else if(shape){roundRectPath(ctx,x,y,w,h,shape);}else{ctx.beginPath();ctx.rect(x,y,w,h);} ctx.clip();
  if(!p){ctx.fillStyle='rgba(128,128,128,.22)';ctx.fillRect(x,y,w,h);ctx.restore();return;}
  if(R.o.export){
    const t=ctx.getTransform(),sc=Math.hypot(t.a,t.b);
    const cv=await renderPhotoForExport(p,Math.max(2,Math.round(w*sc)),Math.max(2,Math.round(h*sc)));
    ctx.drawImage(cv,x,y,w,h); cv.width=cv.height=1;
  }else{
    const src=p.live||(p.proc&&p.proc.img)||p.base.img; const sw=srcW(src),sh=srcH(src);
    const s=Math.max(w/sw,h/sh)*p.adj.zoom,dw=sw*s,dh=sh*s,[fx,fy]=focusOf(p,w,h,dw,dh); ctx.imageSmoothingQuality='high';
    ctx.drawImage(src,x+(w-dw)*fx,y+(h-dh)*fy,dw,dh);
  }
  if(p.adj.vignette>0){const g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*.25,x+w/2,y+h/2,Math.hypot(w,h)*.56);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${p.adj.vignette/100*.6})`);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  ctx.restore();
}
function stampCard(cw,ch,u){const c=mkCanvas(cw,ch),x=c.getContext('2d');x.fillStyle='#FFFFFF';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-out';const r=Math.max(1.5,u*.75),st=r*2.7;const dot=(a,b)=>{x.beginPath();x.arc(a,b,r,0,7);x.fill();};for(let px=st/2;px<c.width;px+=st){dot(px,0);dot(px,c.height);}for(let py=st/2;py<c.height;py+=st){dot(0,py);dot(c.width,py);}return c;}
function tapes(R,X,Y,cw,ch){
  const{ctx,T,u,rng}=R; const tw=Math.min(cw*.36,u*16),th=Math.min(u*3.1,ch*.12);
  const one=(x,y,a)=>{const col=T.washi[Math.floor(rng()*T.washi.length)];ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=.86;ctx.fillStyle=col;ctx.fillRect(-tw/2,-th/2,tw,th);ctx.globalAlpha=.3;ctx.fillStyle='#FFFFFF';for(let s=-tw/2+th*.3;s<tw/2-th*.2;s+=th*.7)ctx.fillRect(s,-th/2,th*.22,th);ctx.restore();};
  if(rng()<.5)one(X+cw/2,Y+u*.2,(rng()-.5)*.25);else{one(X+u*1.3,Y+u*1.3,-Math.PI/4);one(X+cw-u*1.3,Y+ch-u*1.3,-Math.PI/4);}
}
function paperClip(R,x,y,s){const{ctx}=R;ctx.save();ctx.translate(x,y);ctx.rotate(-.12);ctx.strokeStyle='#8D939E';ctx.lineWidth=s*.09;ctx.lineCap='round';ctx.lineJoin='round';const w=s*.34;ctx.beginPath();ctx.moveTo(w*.5,s*.75);ctx.lineTo(w*.5,s*.05);ctx.arc(0,s*.05,w*.5,0,Math.PI,true);ctx.lineTo(-w*.5,s*.95);ctx.arc(w*.05,s*.95,w*.55,Math.PI,0,true);ctx.lineTo(w*.6,s*.25);ctx.stroke();ctx.restore();}
function photoCorners(R,x,y,w,h){
  const{ctx,T,u}=R; const c=Math.min(w,h)*.11,e=u*.35; ctx.save(); ctx.fillStyle=hexA(T.accent,.92); ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=Math.max(.6,u*.08);
  const tri=(a,b,c1,d,e1,f)=>{ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c1,d);ctx.lineTo(e1,f);ctx.closePath();ctx.fill();ctx.stroke();};
  tri(x-e,y-e,x+c,y-e,x-e,y+c); tri(x+w+e,y-e,x+w-c,y-e,x+w+e,y+c); tri(x-e,y+h+e,x+c,y+h+e,x-e,y+h-c); tri(x+w+e,y+h+e,x+w-c,y+h+e,x+w+e,y+h-c); ctx.restore();
}
function inkRect(R,x,y,w,h){const{ctx,u,rng}=R;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';for(let pass=0;pass<2;pass++){ctx.strokeStyle=pass?'rgba(20,20,20,.32)':'rgba(20,20,20,.86)';ctx.lineWidth=u*(pass?.16:.3);const j=()=>(rng()-.5)*u*.35;ctx.beginPath();ctx.moveTo(x+j(),y+j());ctx.lineTo(x+w+j(),y+j());ctx.lineTo(x+w+j(),y+h+j());ctx.lineTo(x+j(),y+h+j());ctx.closePath();ctx.stroke();}ctx.restore();}
async function drawFramed(R,p,rect,i=0){
  const{ctx,T,u}=R; const[x,y,w,h]=rect; const mn=Math.min(w,h); const g=frameGeom(T,w,h);
  const inner=(X,Y)=>[X+g.l,Y+g.t,g.cw-g.l-g.r,g.ch-g.t-g.b];
  const hit=r=>{if(p)R.hits.push({pid:p.id,x:r[0],y:r[1],w:r[2],h:r[3]});};
  const shadow=(a,blur,oy)=>{ctx.shadowColor=a;ctx.shadowBlur=blur;ctx.shadowOffsetY=oy;};
  if(['polaroid','tape','stamp','clip'].includes(T.frame)){
    const ang=(R.rng()-.5)*(T.frame==='polaroid'?5:T.frame==='clip'?4.4:3.2)*Math.PI/180, cx=x+w/2, cy=y+h/2, X=-g.cw/2, Y=-g.ch/2, ir=inner(X,Y);
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang);
    ctx.save(); shadow('rgba(0,0,0,.28)',Math.min(u*1.4,mn*.06),Math.min(u*.45,mn*.02));
    if(T.frame==='stamp'){const sc=stampCard(g.cw,g.ch,Math.min(u,mn/40));ctx.drawImage(sc,X,Y,g.cw,g.ch);sc.width=sc.height=1;} else{ctx.fillStyle=T.frame==='polaroid'?'#FBFAF6':'#FFFFFF';ctx.fillRect(X,Y,g.cw,g.ch);}
    ctx.restore();
    await place(R,p,ir);
    if(T.frame==='stamp'){ctx.strokeStyle='rgba(0,0,0,.16)';ctx.lineWidth=Math.max(.5,u*.1);ctx.strokeRect(ir[0],ir[1],ir[2],ir[3]);}
    if(T.frame==='polaroid'&&p&&mn>u*12){setFont(ctx,T,'hand',g.b*.36);txt(ctx,`${p.date.getMonth()+1}.${p.date.getDate()}`,0,Y+g.ch-g.b*.4,{color:'#3A3A3A',align:'center',base:'middle'});}
    if(T.frame==='tape')tapes(R,X,Y,g.cw,g.ch);
    if(T.frame==='clip')paperClip(R,X+g.cw*(.18+R.rng()*.6),Y-mn*.07,Math.max(u*2.2,Math.min(mn*.2,u*9)));
    ctx.restore(); hit([cx+ir[0],cy+ir[1],ir[2],ir[3]]); return;
  }
  if(T.frame==='kids'||T.frame==='brutal'){
    const kids=T.frame==='kids',r=kids?mn*.07:0; ctx.save();
    ctx.fillStyle=kids?T.palette[(i+R.seed)%T.palette.length]:T.ink; roundRectPath(ctx,x+g.off,y+g.off,g.cw,g.ch,r); ctx.fill();
    if(kids){ctx.fillStyle='#FFFFFF';roundRectPath(ctx,x,y,g.cw,g.ch,r);ctx.fill();}
    ctx.restore(); const ir=inner(x,y); await place(R,p,ir,kids?Math.max(0,r-g.l):0); hit(ir);
    if(!kids){ctx.strokeStyle=T.ink;ctx.lineWidth=Math.max(1,Math.min(u*.45,mn*.02));ctx.strokeRect(ir[0],ir[1],ir[2],ir[3]);}
    return;
  }
  if(['soft','baby','corners','paw','border','party'].includes(T.frame)){
    const r=T.frame==='corners'||T.frame==='border'?0:mn*(T.frame==='baby'?.09:T.frame==='paw'?.06:.05);
    ctx.save(); shadow(T.frame==='corners'?'rgba(0,0,0,.5)':'rgba(40,40,60,.2)',Math.min(u*1.6,mn*.07),Math.min(u*.45,mn*.02));
    ctx.fillStyle=T.frame==='corners'?'#EFEBE2':'#FFFFFF'; roundRectPath(ctx,x,y,w,h,r); ctx.fill(); ctx.restore();
    const ir=inner(x,y); await place(R,p,ir,Math.max(0,r-g.l)); hit(ir);
    if(T.frame==='baby'){const o=Math.min(u*.9,mn*.04);ctx.save();ctx.setLineDash([o,o*.8]);ctx.strokeStyle=hexA(T.accent2,.8);ctx.lineWidth=Math.max(.6,o*.25);roundRectPath(ctx,x-o,y-o,w+2*o,h+2*o,r+o);ctx.stroke();ctx.restore();}
    if(T.frame==='corners')photoCorners(R,x,y,w,h);
    if(T.frame==='paw'){ctx.save();ctx.translate(x+w-mn*.07,y+h-mn*.07);ctx.rotate(-.35);ctx.fillStyle=T.accent;pawPath(ctx,0,0,Math.max(u*1.2,Math.min(mn*.11,u*4)));ctx.fill();ctx.restore();}
    if(T.frame==='party'){for(let k=0;k<5;k++){const t=R.rng();const px=t<.5?x+R.rng()*w:(R.rng()<.5?x+g.l*.5:x+w-g.l*.5),py=t<.5?(R.rng()<.5?y+g.t*.5:y+h-g.b*.5):y+R.rng()*h;ctx.fillStyle=T.palette[k%T.palette.length];ctx.beginPath();ctx.arc(px,py,g.l*.22,0,7);ctx.fill();}}
    return;
  }
  if(T.frame==='film'){
    ctx.fillStyle='#121110'; ctx.fillRect(x,y,w,h); const ir=inner(x,y); await place(R,p,ir); hit(ir);
    const hw=g.t*.32,hh=g.t*.36,step=hw*2.1; ctx.fillStyle='rgba(236,228,212,.9)';
    for(let px=x+step*.4;px<x+w-hw;px+=step){roundRectPath(ctx,px,y+g.t*.32,hw,hh,hw*.25);ctx.fill();roundRectPath(ctx,px,y+h-g.b*.32-hh,hw,hh,hw*.25);ctx.fill();}
    if(T.dateStamp&&p&&mn>u*10){const d=p.date,s=`'${String(d.getFullYear()).slice(2)} ${pad2(d.getMonth()+1)} ${pad2(d.getDate())}`;setFont(ctx,T,'display',Math.max(4,Math.min(ir[2],ir[3])*.065));txt(ctx,s,ir[0]+ir[2]*.96,ir[1]+ir[3]*.95,{color:'#FF8A1E',align:'right',shadow:'rgba(255,120,20,.8)',sb:u*.6});}
    return;
  }
  if(T.frame==='arch'){
    await place(R,p,rect,'arch'); hit(rect); const o=Math.min(u*.9,mn*.04); ctx.save(); ctx.strokeStyle=hexA(R.accent,.65); ctx.lineWidth=Math.max(.6,u*.16); archPath(ctx,x-o,y-o,w+2*o,h+o); ctx.stroke(); ctx.restore(); return;
  }
  if(T.frame==='round'||T.frame==='marine'){
    await place(R,p,rect,T.frame==='marine'?mn*.03:Math.min(u*1.2,mn*.05)); hit(rect);
    if(T.frame==='marine'){const o=Math.min(u*.8,mn*.035);ctx.strokeStyle=hexA(T.accent,.8);ctx.lineWidth=Math.max(.6,u*.18);roundRectPath(ctx,x-o,y-o,w+2*o,h+2*o,mn*.03+o);ctx.stroke();}
    return;
  }
  await place(R,p,rect); hit(rect);
  const o=Math.min(u*.9,mn*.04);
  if(T.frame==='keyline'){ctx.strokeStyle=hexA(R.accent,.6);ctx.lineWidth=Math.max(.6,u*.16);ctx.strokeRect(x-o,y-o,w+2*o,h+2*o);}
  else if(T.frame==='mat'){const q=o*1.4;ctx.strokeStyle=hexA(T.ink,.42);ctx.lineWidth=Math.max(.6,u*.1);ctx.strokeRect(x-q,y-q,w+2*q,h+2*q);}
  else if(T.frame==='gold'){ctx.strokeStyle=R.accent;ctx.lineWidth=Math.max(.6,u*.2);ctx.strokeRect(x-o,y-o,w+2*o,h+2*o);ctx.lineWidth=Math.max(.5,u*.08);ctx.strokeRect(x-o*1.8,y-o*1.8,w+o*3.6,h+o*3.6);}
  else if(T.frame==='ink')inkRect(R,x,y,w,h);
  else if(T.frame==='news'){ctx.strokeStyle=T.ink;ctx.lineWidth=Math.max(.6,u*.12);ctx.strokeRect(x,y,w,h);}
  else if(T.frame==='leaf'){ctx.strokeStyle=hexA(T.accent,.7);ctx.lineWidth=Math.max(.6,u*.12);ctx.strokeRect(x-o*.8,y-o*.8,w+o*1.6,h+o*1.6);if(mn>u*14)leafSprig(ctx,x-o,y-o,Math.min(mn*.3,u*9),Math.PI*.78,hexA(T.accent,.85),u);}
}
async function placeHit(R,p,rect){await place(R,p,rect);if(p)R.hits.push({pid:p.id,x:rect[0],y:rect[1],w:rect[2],h:rect[3]});}
function drawLabel(R,text,overlay){
  if(!S.book.showDates)return;
  const{ctx,T,W,H,u}=R; const m=T.margin*Math.min(W,H),y=m+u*3.6,age=ageFor(R.page);
  if(overlay){const s=[text,age].filter(Boolean).join(' · ');if(!s)return;setFont(ctx,T,'body',u*2.3);txt(ctx,s,m,m*.7+u*2,{color:'#FFFFFF',base:'middle',shadow:'rgba(0,0,0,.6)',sb:u,ls:u*.1});return;}
  if(!text&&!age)return;
  const full=T.label!=='age'&&age?(text?text+' · '+age:age):text;
  switch(T.label){
    case 'plain':setFont(ctx,T,'body',u*2.1);txt(ctx,full,m,y,{color:T.muted,base:'middle',ls:u*.12});break;
    case 'plain-center':setFont(ctx,T,'body',u*2.1);txt(ctx,full,W/2,y,{color:T.muted,base:'middle',align:'center',ls:u*.2});break;
    case 'ornament':{setFont(ctx,T,'body',u*2.3);const tw=ctx.measureText(full).width;txt(ctx,full,W/2,y,{color:T.ink,base:'middle',align:'center'});ctx.strokeStyle=hexA(R.accent,.7);ctx.lineWidth=Math.max(.6,u*.12);ctx.beginPath();ctx.moveTo(W/2-tw/2-u*7,y);ctx.lineTo(W/2-tw/2-u*2,y);ctx.moveTo(W/2+tw/2+u*2,y);ctx.lineTo(W/2+tw/2+u*7,y);ctx.stroke();break;}
    case 'hand':ctx.save();ctx.translate(m,y);ctx.rotate(-.02);setFont(ctx,T,'hand',u*3.1);txt(ctx,full,0,0,{color:T.ink,base:'middle'});ctx.restore();break;
    case 'tag':{setFont(ctx,T,'hand',u*2.7);const tw=ctx.measureText(full).width,bw=tw+u*5.5,bh=u*5;ctx.save();ctx.translate(m,y);ctx.rotate(-.035);ctx.shadowColor='rgba(0,0,0,.22)';ctx.shadowBlur=u*.8;ctx.shadowOffsetY=u*.2;ctx.fillStyle='#FBF6EA';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(u*1.8,-bh/2);ctx.lineTo(bw,-bh/2);ctx.lineTo(bw,bh/2);ctx.lineTo(u*1.8,bh/2);ctx.closePath();ctx.fill();ctx.shadowColor='transparent';ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.arc(u*1.7,0,u*.45,0,7);ctx.fill();txt(ctx,full,u*3.3,u*.15,{color:T.ink,base:'middle'});ctx.restore();break;}
    case 'pill':{setFont(ctx,T,'display',u*2.4);const tw=ctx.measureText(full).width,pal=T.palette||[T.accent];ctx.fillStyle=pal[R.seed%pal.length];roundRectPath(ctx,m,y-u*2.3,tw+u*4,u*4.6,u*2.3);ctx.fill();txt(ctx,full,m+u*2,y+u*.1,{color:'#FFFFFF',base:'middle'});break;}
    case 'postmark':{setFont(ctx,T,'body',u*2);txt(ctx,full,m,y,{color:T.muted,base:'middle'});const sp=dateSpan(photosOf(R.page));if(!sp)break;const d=sp[0],cx=W-m-u*6,cy=m+u*4.6,r=u*5.2;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.18);ctx.strokeStyle=hexA(T.accent2,.72);ctx.lineWidth=u*.22;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.stroke();ctx.lineWidth=u*.1;ctx.beginPath();ctx.arc(0,0,r*.8,0,7);ctx.stroke();setFont(ctx,T,'display',u*1.5);txt(ctx,String(d.getFullYear()),0,-r*.42,{color:hexA(T.accent2,.8),align:'center',base:'middle'});setFont(ctx,T,'display',u*2.2);txt(ctx,`${pad2(d.getMonth()+1)}.${pad2(d.getDate())}`,0,u*.15,{color:hexA(T.accent2,.85),align:'center',base:'middle'});ctx.lineWidth=u*.2;for(let k=0;k<3;k++){ctx.beginPath();for(let xx=-r*2.6;xx<=-r*1.05;xx+=u*.5){const yy=(k-1)*u*1.4+Math.sin(xx/u)*u*.35;xx<=-r*2.6?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);}ctx.stroke();}ctx.restore();break;}
    case 'season':setFont(ctx,T,'display',u*2.5);txt(ctx,SEASON_NAME[seasonOf(R.month)]+' · '+full,m,y,{color:R.accent,base:'middle'});break;
    case 'magazine':ctx.fillStyle=T.accent;ctx.fillRect(m,y-u*.35,u*3.2,u*.7);setFont(ctx,T,'body',u*2,700);txt(ctx,full,m+u*4.4,y,{color:T.ink,base:'middle',ls:u*.12});break;
    case 'underline':{setFont(ctx,T,'display',u*2.7);const tw=ctx.measureText(full).width;txt(ctx,full,m,y,{color:T.ink,base:'middle'});ctx.save();ctx.strokeStyle=hexA(R.accent,.5);ctx.lineWidth=u*.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(m,y+u*2);ctx.quadraticCurveTo(m+tw*.5,y+u*2.9,m+tw+u,y+u*1.7);ctx.stroke();ctx.restore();break;}
    case 'brush':{setFont(ctx,T,'hand',u*3.3);const tw=ctx.measureText(full).width;txt(ctx,full,m,y,{color:T.ink,base:'middle'});drawSeal(R,m+tw+u*1.6,y-u*1.6,u*3.2,sealText().slice(0,1));break;}
    case 'age':{if(age){setFont(ctx,T,'hand',u*3.4);const aw=ctx.measureText(age).width;txt(ctx,age,m,y,{color:R.accent,base:'middle'});setFont(ctx,T,'body',u*2);txt(ctx,text,m+aw+u*2,y,{color:T.muted,base:'middle'});}else{setFont(ctx,T,'hand',u*3);txt(ctx,text,m,y,{color:T.ink,base:'middle'});}break;}
    case 'heart':{setFont(ctx,T,'hand',u*2.9);const tw=ctx.measureText(full).width;txt(ctx,full,W/2+u*1.6,y,{color:T.ink,align:'center',base:'middle'});ctx.fillStyle=R.accent;heartPath(ctx,W/2-tw/2-u*1.2,y,u*1.1);ctx.fill();break;}
    case 'bone':{setFont(ctx,T,'display',u*2.5);const tw=ctx.measureText(full).width,bw=tw+u*5,bh=u*3.6;ctx.save();ctx.translate(m,y);ctx.fillStyle=T.accent;roundRectPath(ctx,u*1.2,-bh/2,bw-u*2.4,bh,bh*.3);ctx.fill();for(const[cx,cy]of[[u*1.2,-bh*.32],[u*1.2,bh*.32],[bw-u*1.2,-bh*.32],[bw-u*1.2,bh*.32]]){ctx.beginPath();ctx.arc(cx,cy,bh*.36,0,7);ctx.fill();}txt(ctx,full,bw/2,u*.15,{color:'#FFFFFF',align:'center',base:'middle'});ctx.restore();break;}
    case 'badge':{setFont(ctx,T,'display',u*2.3);const tw=ctx.measureText(full).width,bw=tw+u*7,bh=u*4.4;ctx.save();ctx.strokeStyle=T.accent2;ctx.lineWidth=Math.max(.8,u*.25);roundRectPath(ctx,m,y-bh/2,bw,bh,bh/2);ctx.stroke();ctx.fillStyle=T.accent2;ctx.beginPath();ctx.moveTo(m+u*1.4,y+u*1.1);ctx.lineTo(m+u*2.6,y-u*1.1);ctx.lineTo(m+u*3.4,y+u*.1);ctx.lineTo(m+u*3.9,y-u*.6);ctx.lineTo(m+u*4.9,y+u*1.1);ctx.closePath();ctx.fill();txt(ctx,full,m+u*5.6,y+u*.1,{color:T.ink,base:'middle'});ctx.restore();break;}
    case 'dateline':{ctx.strokeStyle=T.ink;ctx.lineWidth=Math.max(.6,u*.12);ctx.beginPath();ctx.moveTo(m,y-u*2.4);ctx.lineTo(W-m,y-u*2.4);ctx.moveTo(m,y+u*2.2);ctx.lineTo(W-m,y+u*2.2);ctx.stroke();ctx.lineWidth=Math.max(.6,u*.35);ctx.beginPath();ctx.moveTo(m,y-u*3);ctx.lineTo(W-m,y-u*3);ctx.stroke();setFont(ctx,T,'body',u*1.9);txt(ctx,bookTitle(),m,y,{color:T.ink,base:'middle',ls:u*.1});txt(ctx,full,W-m,y,{color:T.ink,base:'middle',align:'right'});break;}
    case 'leafline':leafSprig(ctx,m,y+u*.6,u*4,-.3,hexA(T.accent,.85),u);setFont(ctx,T,'body',u*2.3);txt(ctx,full,m+u*5,y,{color:T.ink,base:'middle',ls:u*.08});break;
    case 'sticker':{setFont(ctx,T,'body',u*2.6);const tw=ctx.measureText(full).width,bw=tw+u*3.6,bh=u*4.6;ctx.save();ctx.translate(m,y);ctx.rotate(-.04);ctx.fillStyle=T.ink;ctx.fillRect(u*.6,-bh/2+u*.6,bw,bh);ctx.fillStyle='#FFFFFF';ctx.fillRect(0,-bh/2,bw,bh);ctx.strokeStyle=T.ink;ctx.lineWidth=Math.max(1,u*.3);ctx.strokeRect(0,-bh/2,bw,bh);txt(ctx,full,u*1.8,u*.1,{color:T.ink,base:'middle'});ctx.restore();break;}
    case 'filmcode':setFont(ctx,T,'body',u*1.9);txt(ctx,`▶ ${pad2(R.o.pageNo||0)}A   ${full}`,m,y,{color:T.accent,base:'middle',ls:u*.25});break;
  }
}
const handLike=T=>['hand','tag','pill','age','heart','bone','sticker'].includes(T.label)||T.frame==='polaroid';
function drawCaption(R,text,box){
  if(!text)return; const{ctx,T,W,u}=R; const hand=handLike(T); setFont(ctx,T,hand?'hand':'body',u*(hand?2.8:2.2));
  const lines=wrap(ctx,text,box.w*.92).slice(0,2),lh=u*(hand?3.6:3.2),center=T.capAlign==='center'; let y=box.y+box.h+u*4.3;
  for(const ln of lines){txt(ctx,ln,center?W/2:box.x,y,{color:T.ink,align:center?'center':'left'});y+=lh;}
}
function drawPageNo(R,light){
  if(!S.book.showPageNo)return;
  const{ctx,T,W,H,u,side,o}=R; if(o.pageNo==null)return; const m=T.margin*Math.min(W,H),left=side==='left';
  if(T.bigPageNo){setFont(ctx,T,'display',u*3.4);txt(ctx,pad2(o.pageNo),left?m:W-m,H-m*.55,{color:light?'#FFFFFF':T.accent,align:left?'left':'right',base:'middle'});return;}
  setFont(ctx,T,'body',u*1.8); txt(ctx,String(o.pageNo)+(T.pageSuffix||''),left?m:W-m,H-m*.55,{color:light?'rgba(255,255,255,.85)':T.muted,align:left?'left':'right',base:'middle'});
}
function doodles(R){
  const{ctx,T,W,H,u,rng}=R; const m=T.margin*Math.min(W,H); ctx.save(); ctx.strokeStyle=hexA(T.ink,.5); ctx.lineWidth=u*.22; ctx.lineJoin='round';
  for(const[x,y]of[[W-m*.55,m*.6],[m*.55,H-m*.55]]){ctx.save();ctx.translate(x,y);ctx.rotate((rng()-.5)*.8);const s=u*2.1;if(rng()<.5)starPath(ctx,0,0,s,s*.45,5);else heartPath(ctx,0,0,s);ctx.stroke();ctx.restore();}
  ctx.restore();
}
async function drawPhotosPage(R){
  const{ctx,T,W,H,u,b,page}=R; const ps=photosOf(page).slice(0,MAXP); const L=findLayout(page.layout,ps.length,T);
  const label=page.label!=null&&page.label!==''?page.label:autoLabel(page);
  if(!ps.length){drawLabel(R,'빈 페이지');drawPageNo(R);return;}
  if(L&&L.bleed){
    await placeHit(R,ps[0],[-b,-b,W+2*b,H+2*b]);
    let g=ctx.createLinearGradient(0,0,0,H*.22);g.addColorStop(0,'rgba(0,0,0,.42)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-b,-b,W+2*b,H*.22+b);
    drawLabel(R,label,true);
    if(page.caption){g=ctx.createLinearGradient(0,H*.72,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=g;ctx.fillRect(-b,H*.72,W+2*b,H*.28+b);setFont(ctx,T,'body',u*2.4);const m=T.margin*Math.min(W,H);const lines=wrap(ctx,page.caption,W-2*m).slice(0,2);let y=H-m-u*(lines.length-1)*3.4;for(const ln of lines){txt(ctx,ln,m,y,{color:'#FFFFFF'});y+=u*3.4;}}
    drawPageNo(R,true); return;
  }
  const box=contentBox(T,W,H,!!page.caption), gap=T.gap*Math.min(W,H)*(ps.length>6?.7:1);
  const rects=(L?L.r(gap/box.w,gap/box.h):[[0,0,1,1]]).map(r=>[box.x+r[0]*box.w,box.y+r[1]*box.h,r[2]*box.w,r[3]*box.h]);
  for(let i=0;i<ps.length&&i<rects.length;i++)await drawFramed(R,ps[i],rects[i],i);
  if(T.doodles)doodles(R);
  drawLabel(R,label); drawCaption(R,page.caption,box); drawPageNo(R);
}
async function drawCover(R){
  const{ctx,T,W,H,u,b}=R; const ps=photosOf(R.page),p=ps[0]; const m=T.margin*Math.min(W,H);
  const title=bookTitle(),sub=bookSubtitle(),fam=S.book.family||''; const style=S.book.coverStyle==='theme'?T.cover:S.book.coverStyle;
  const acc=isPale(R.accent)?T.muted:R.accent;
  if(style==='bleed'){
    await placeHit(R,p,[-b,-b,W+2*b,H+2*b]);
    let g=ctx.createLinearGradient(0,0,0,H*.5);g.addColorStop(0,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(-b,-b,W+2*b,H*.5+b);
    g=ctx.createLinearGradient(0,H*.75,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=g;ctx.fillRect(-b,H*.75,W+2*b,H*.25+b);
    const sz=fitFont(ctx,T,'display',title,u*13,W-2*m); txt(ctx,title,m,m+sz*.9,{color:'#FFFFFF'});
    ctx.fillStyle=['#FFFFFF','#111111','#1A1A1A','#1C1B19'].includes(R.accent)||isPale(R.accent)?'#FFFFFF':R.accent;ctx.fillRect(m,m+sz*1.15,u*9,u*.9);
    setFont(ctx,T,'body',u*2.6);txt(ctx,sub,m,m+sz*1.15+u*5,{color:'#FFFFFF',ls:u*.08});
    setFont(ctx,T,'body',u*2.4,700);txt(ctx,fam,m,H-m,{color:'#FFFFFF',ls:u*.2}); return;
  }
  if(style==='collage'){
    const n=ps.length>=6?6:ps.length>=4?4:ps.length>=2?2:1, tpl=n===6?['aab','aac','def']:n===4?['ab','cd']:n===2?['ab']:['a'];
    const bw=W-2*m,bh=H*.68-m,gap=T.gap*Math.min(W,H); const rects=areaRects(tpl,gap/bw,gap/bh).map(r=>[m+r[0]*bw,m+r[1]*bh,r[2]*bw,r[3]*bh]);
    for(let i=0;i<n;i++)await drawFramed(R,ps[i],rects[i],i);
    const ty=H*.68+u*10.5; const sz=fitFont(ctx,T,'display',title,u*7,W-2*m); txt(ctx,title,W/2,ty,{color:T.ink,align:'center'});
    setFont(ctx,T,'body',u*2.4);txt(ctx,sub,W/2,ty+Math.max(u*5,sz*.7),{color:T.muted,align:'center',ls:u*.08});
    setFont(ctx,T,'body',u*2.2);txt(ctx,fam,W/2,H-m*.8,{color:acc,align:'center',ls:u*.3}); return;
  }
  if(style==='news'){
    ctx.strokeStyle=T.ink; ctx.lineWidth=u*.5; ctx.beginPath(); ctx.moveTo(m,m); ctx.lineTo(W-m,m); ctx.stroke();
    fitFont(ctx,T,'display',title,u*12,W-2*m); txt(ctx,title,W/2,m+u*12.5,{color:T.ink,align:'center'});
    const last=dateSpan(bookPhotos()); const d=last?last[1]:new Date();
    ctx.lineWidth=Math.max(.6,u*.14); ctx.beginPath(); ctx.moveTo(m,m+u*16); ctx.lineTo(W-m,m+u*16); ctx.moveTo(m,m+u*20.5); ctx.lineTo(W-m,m+u*20.5); ctx.stroke();
    setFont(ctx,T,'body',u*1.9); const yy=m+u*18.4;
    txt(ctx,`제 ${pad2(d.getMonth()+1)}호`,m,yy,{color:T.ink,base:'middle'}); txt(ctx,`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${WD[d.getDay()]}요일`,W/2,yy,{color:T.ink,base:'middle',align:'center'}); txt(ctx,`${fam||'우리 가족'} 발행`,W-m,yy,{color:T.ink,base:'middle',align:'right'});
    const pTop=m+u*23,pH=H*.47; await drawFramed(R,p,[m,pTop,W-2*m,pH]);
    const hy=pTop+pH+u*7,head=S.book.subtitle||'이번 호 소식'; fitFont(ctx,T,'display',head,u*4.4,W-2*m); txt(ctx,head,m,hy,{color:T.ink});
    setFont(ctx,T,'body',u*2.1); const colW=(W-2*m-u*3)/2; const lines=wrap(ctx,introText(),colW); const per=Math.max(1,Math.floor((H-m-hy-u*4)/(u*3.4)));
    for(let k=0;k<Math.min(lines.length,per*2);k++){const col=Math.floor(k/per),row=k%per;txt(ctx,lines[k],m+col*(colW+u*3),hy+u*5+row*u*3.4,{color:T.ink});}
    ctx.lineWidth=Math.max(.6,u*.1); ctx.beginPath(); ctx.moveTo(W/2,hy+u*2.5); ctx.lineTo(W/2,H-m); ctx.stroke(); return;
  }
  if(style==='top'){
    const ph=H*.64-m; await drawFramed(R,p,[m,m,W-2*m,ph]);
    const ty=m+ph+u*10.5; const sz=fitFont(ctx,T,'display',title,u*7,W-2*m-(T.seal?u*10:0)); txt(ctx,title,m,ty,{color:T.ink});
    setFont(ctx,T,'body',u*2.5);txt(ctx,sub,m,ty+Math.max(u*5,sz*.7),{color:T.muted,ls:u*.08});
    setFont(ctx,T,'body',u*2.3);txt(ctx,fam,W-m,H-m*.8,{color:T.muted,align:'right',ls:u*.15});
    if(T.seal)drawSeal(R,W-m-u*8,ty-u*7,u*8,sealText());
    if(T.id==='water'){ctx.save();ctx.strokeStyle=hexA(R.accent,.45);ctx.lineWidth=u*.7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(m,ty+u*1.6);ctx.quadraticCurveTo(m+u*12,ty+u*2.8,m+u*26,ty+u*1.2);ctx.stroke();ctx.restore();}
    return;
  }
  if(style==='center'){
    const ins=m*.5; ctx.strokeStyle=hexA(R.accent,.8); ctx.lineWidth=u*.25; ctx.strokeRect(ins,ins,W-2*ins,H-2*ins); ctx.lineWidth=Math.max(.6,u*.1); ctx.strokeRect(ins+u*1.1,ins+u*1.1,W-2*ins-u*2.2,H-2*ins-u*2.2);
    const pw=W*.6,ph=Math.min(H*.5,pw*.92),px=(W-pw)/2,py=H*.16; await drawFramed(R,p,[px,py,pw,ph]);
    const ty=py+ph+u*12; fitFont(ctx,T,'display',title,u*6.4,W*.76); txt(ctx,title,W/2,ty,{color:T.ink,align:'center'});
    setFont(ctx,T,'body',u*2.4);txt(ctx,sub,W/2,ty+u*5.6,{color:T.muted,align:'center',ls:u*.1});
    setFont(ctx,T,'body',u*2.1);txt(ctx,fam,W/2,H-ins-u*4,{color:R.accent,align:'center',ls:u*.4}); return;
  }
  const pw=W*.72,ph=H*.58,px=(W-pw)/2,py=H*.09; await drawFramed(R,p,[px,py,pw,ph]);
  const ty=py+ph+u*12.5; fitFont(ctx,T,'display',title,u*8,W*.82); txt(ctx,title,W/2,ty,{color:T.ink,align:'center'});
  setFont(ctx,T,'body',u*2.4);txt(ctx,sub,W/2,ty+u*5.4,{color:T.muted,align:'center',ls:u*.08});
  setFont(ctx,T,handLike(T)?'hand':'body',u*2.6);txt(ctx,fam,W/2,H-m*.85,{color:T.muted,align:'center'});
}
function drawTitlePage(R){
  const{ctx,T,W,H,u}=R; const m=T.margin*Math.min(W,H); const fam=S.book.family||''; let y=H*.26;
  if(fam){setFont(ctx,T,'body',u*2.1);txt(ctx,fam,W/2,y,{color:R.accent,align:'center',ls:u*.45});}
  y+=u*8; const sz=fitFont(ctx,T,'display',bookTitle(),u*5.4,W*.78); txt(ctx,bookTitle(),W/2,y,{color:T.ink,align:'center'});
  y+=Math.max(u*5.4,sz*.8); setFont(ctx,T,'body',u*2.2); txt(ctx,bookSubtitle(),W/2,y,{color:T.muted,align:'center',ls:u*.08});
  y+=u*5; ctx.fillStyle=hexA(R.accent,.75); ctx.fillRect(W/2-u*4,y,u*8,Math.max(1,u*.25));
  y+=u*8; setFont(ctx,T,handLike(T)?'hand':'body',u*(handLike(T)?2.8:2.4)); const lh=u*(handLike(T)?4.6:4.2);
  for(const ln of wrap(ctx,introText(),W*.64).slice(0,8)){txt(ctx,ln,W/2,y,{color:T.ink,align:'center'});y+=lh;}
  setFont(ctx,T,'body',u*1.9); txt(ctx,`사진 ${bookPhotos().length}장`,W/2,H-m,{color:T.muted,align:'center',ls:u*.15});
  drawPageNo(R);
}
async function drawChapter(R){
  const{ctx,T,W,H,u,b,page}=R; const p=photosOf(page)[0]; const m=T.margin*Math.min(W,H);
  const[yy,mo]=page.ym||[mainYear(),0],mo2=page.ym2?page.ym2[1]:null; const label=page.title||(mo2!=null?`${mo+1}–${mo2+1}월`:`${mo+1}월`); const cnt=`사진 ${page.count||0}장`; const en=mo2!=null?`${EN_M[mo]} – ${EN_M[mo2]}`:EN_M[mo];
  if(T.chapter==='overlay'){
    await placeHit(R,p,[-b,-b,W+2*b,H+2*b]); const g=ctx.createLinearGradient(0,H*.45,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.65)');ctx.fillStyle=g;ctx.fillRect(-b,H*.45,W+2*b,H*.55+b);
    setFont(ctx,T,'display',u*32);txt(ctx,pad2(mo+1),m-u*.8,H-m-u*7,{color:'#FFFFFF'});
    setFont(ctx,T,'body',u*2.6,700);txt(ctx,`${label}의 기록 · ${cnt}`,m,H-m,{color:'#FFFFFF',ls:u*.12});
    ctx.fillStyle=T.accent;ctx.fillRect(m,m,u*9,u*.9); return;
  }
  if(T.chapter==='numeral'){
    setFont(ctx,T,'display',u*22); const num=pad2(mo+1); const nw=ctx.measureText(num).width; txt(ctx,num,m,m+u*19,{color:R.accent});
    const x2=m+nw+u*3; setFont(ctx,T,'display',u*5.4); txt(ctx,label,x2,m+u*9.5,{color:T.ink});
    setFont(ctx,T,'body',u*2.2); txt(ctx,`${en} ${yy}`,x2,m+u*14.5,{color:T.muted,ls:u*.15}); txt(ctx,cnt,x2,m+u*18.6,{color:T.muted});
    await drawFramed(R,p,[m,m+u*27,W-2*m,H-2*m-u*27]); return;
  }
  setFont(ctx,T,'display',u*7.4); txt(ctx,label,W/2,H*.19,{color:T.ink,align:'center'});
  setFont(ctx,T,'body',u*2.3); txt(ctx,`${en} · ${yy}`,W/2,H*.19+u*5.4,{color:R.accent,align:'center',ls:u*.35});
  const rw=W*.64,rh=H*.5; await drawFramed(R,p,[(W-rw)/2,H*.31,rw,rh]);
  setFont(ctx,T,'body',u*2); txt(ctx,cnt,W/2,H*.31+rh+u*7,{color:T.muted,align:'center',ls:u*.15});
  drawPageNo(R);
}
function drawStats(R){
  const{ctx,T,W,H,u}=R; const m=T.margin*Math.min(W,H); const ps=bookPhotos(); const year=S.book.mode==='year';
  const[my,mm]=mainMonth(); const head=year?`${mainYear()}년의 기록`:`${mm+1}월의 기록`; const acc=isPale(R.accent)?T.ink:R.accent;
  setFont(ctx,T,'display',u*5); txt(ctx,head,m,m+u*8,{color:T.ink});
  setFont(ctx,T,'body',u*2.1); txt(ctx,year?'한 해 동안 남긴 사진을 세어 봤어요.':'한 달 동안 남긴 사진을 세어 봤어요.',m,m+u*13,{color:T.muted});
  const counts={}; for(const p of ps){const k=year?p.date.getMonth():p.date.getDate();counts[k]=(counts[k]||0)+1;}
  const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]; const faces=ps.filter(p=>p.boxes&&p.boxes.length).length;
  const cols=[[String(ps.length),'장의 사진'],[String(Object.keys(counts).length),year?'달에 걸친 기록':'일에 걸친 기록'],[top?(year?`${+top[0]+1}월`:`${top[0]}일`):'–',top?(year?`가장 많이 찍은 달 (${top[1]}장)`:`가장 많이 찍은 날 (${top[1]}장)`):''],[String(faces),'장의 인물 사진']];
  const cw=(W-2*m)/4; cols.forEach((c,i)=>{const x=m+i*cw;setFont(ctx,T,'display',u*5.8);txt(ctx,c[0],x,m+u*25,{color:acc});setFont(ctx,T,'body',u*1.7);wrap(ctx,c[1],cw-u*1.5).slice(0,2).forEach((ln,k)=>txt(ctx,ln,x,m+u*29.3+k*u*2.6,{color:T.muted}));});
  const cy=m+u*38,ch=H-m-u*9-cy,cxw=W-2*m;
  if(year){
    const yc=new Array(12).fill(0); for(const p of ps)if(p.date.getFullYear()===mainYear())yc[p.date.getMonth()]++;
    const mx=Math.max(1,...yc),bw=cxw/12,base=cy+ch-u*4;
    ctx.strokeStyle=hexA(T.ink,.3);ctx.lineWidth=Math.max(.6,u*.1);ctx.beginPath();ctx.moveTo(m,base);ctx.lineTo(m+cxw,base);ctx.stroke();
    yc.forEach((c,i)=>{const x=m+i*bw+bw*.22,w=bw*.56,h=c?(base-cy-u*4)*c/mx:u*.3;ctx.fillStyle=c?hexA(acc,.85):hexA(T.muted,.35);ctx.fillRect(x,base-h,w,h);setFont(ctx,T,'body',u*1.7);txt(ctx,String(i+1),x+w/2,base+u*2.8,{color:T.muted,align:'center'});if(c)txt(ctx,String(c),x+w/2,base-h-u*1.2,{color:T.ink,align:'center'});});
  }else{
    const first=new Date(my,mm,1).getDay(),days=new Date(my,mm+1,0).getDate(),rows=Math.ceil((first+days)/7),cs=Math.min(cxw/7,(ch-u*5)/rows);
    const x0=m+(cxw-cs*7)/2,mx=Math.max(1,...Object.values(counts));
    setFont(ctx,T,'body',u*1.7); WD.forEach((d,i)=>txt(ctx,d,x0+cs*i+cs/2,cy+u*1.5,{color:T.muted,align:'center'}));
    for(let d=1;d<=days;d++){const k=first+d-1,cx=x0+(k%7)*cs+cs/2,yy=cy+u*4+Math.floor(k/7)*cs+cs/2,c=counts[d]||0;if(c){ctx.fillStyle=hexA(acc,.82);ctx.beginPath();ctx.arc(cx,yy,cs*(.2+.24*Math.sqrt(c/mx)),0,7);ctx.fill();}setFont(ctx,T,'body',u*1.8);txt(ctx,String(d),cx,yy,{color:c?(isPale(acc)?'#111111':'#FFFFFF'):T.muted,align:'center',base:'middle'});}
  }
  const sp=dateSpan(ps); if(sp){setFont(ctx,T,'body',u*1.9);txt(ctx,`첫 사진 ${fmtDot(sp[0])} · 마지막 사진 ${fmtDot(sp[1])}`,m,H-m-u*2,{color:T.muted});}
  drawPageNo(R);
}
function drawNotes(R){
  const{ctx,T,W,H,u}=R; const m=T.margin*Math.min(W,H); setFont(ctx,T,'display',u*4); txt(ctx,'메모',m,m+u*8,{color:T.ink});
  if(T.paper.kind!=='lined'){ctx.strokeStyle=hexA(T.muted,.35); ctx.lineWidth=Math.max(.6,u*.08); for(let y=m+u*17;y<H-m;y+=u*7){ctx.beginPath();ctx.moveTo(m,y);ctx.lineTo(W-m,y);ctx.stroke();}}
  drawPageNo(R);
}
function drawTextPage(R){
  const{ctx,T,W,H,u,page}=R; const m=T.margin*Math.min(W,H); let y=m+u*12;
  if(page.title){const sz=fitFont(ctx,T,'display',page.title,u*4.6,W-2*m);txt(ctx,page.title,m,y,{color:T.ink});y+=Math.max(u*7,sz*1.1);}
  setFont(ctx,T,handLike(T)?'hand':'body',u*(handLike(T)?2.9:2.5)); const lh=u*(handLike(T)?4.6:4.3);
  for(const ln of wrap(ctx,page.text||'여기에 이야기를 적어 보세요.',W-2*m)){if(y>H-m-u*3)break;txt(ctx,ln,m,y,{color:page.text?T.ink:T.muted});y+=lh;}
  drawPageNo(R);
}
function drawBack(R){
  const{ctx,T,W,H,u}=R; const m=T.margin*Math.min(W,H);
  if(T.seal)drawSeal(R,W/2-u*5,H*.36,u*10,sealText());
  setFont(ctx,T,'display',u*3.6); txt(ctx,S.book.family||'',W/2,H*.56,{color:T.ink,align:'center'});
  setFont(ctx,T,'body',u*2.1); txt(ctx,bookTitle(),W/2,H*.56+u*5,{color:T.muted,align:'center'});
  const d=new Date(); setFont(ctx,T,'body',u*1.7); txt(ctx,`${d.getFullYear()}.${pad2(d.getMonth()+1)} · 우리북으로 엮음`,W/2,H-m,{color:T.muted,align:'center',ls:u*.12});
}

/* ============================== fonts ============================== */
const BASE_CHARS='0123456789.,·–—~:/()%\'▶ 년월일요화수목금토생후개월만세장사진의기록한해달가장많이찍은날첫마지막메모봄여름가을겨울에걸친빈페이지우리북으로엮음적어보세요이야기를여기인물제호발행면이번소식A'+EN_M.join('')+'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontJobs=new Map();
function bookText(){const parts=[bookTitle(),bookSubtitle(),S.book.family,introText(),BASE_CHARS,sealText()];for(const p of S.pages){parts.push(p.caption||'',p.label||'',p.title||'',p.text||'');}return[...new Set(parts.join(''))].join('');}
function ensureFonts(T,text){
  if(!document.fonts||!document.fonts.load)return Promise.resolve();
  const key=T.id+':'+hashStr(text); if(fontJobs.has(key))return fontJobs.get(key);
  const specs=new Set(Object.values(T.fonts).map(f=>`${f.w||400} 24px "${f.fam}"`));
  const job=Promise.race([Promise.all([...specs].map(s=>document.fonts.load(s,text).catch(()=>null))),sleep(3500)]);
  fontJobs.set(key,job); return job;
}

/* ============================== undo & autosave ============================== */
const hist={stack:[],idx:-1,lock:false};
function snapshot(){return JSON.stringify({book:S.book,pages:S.pages,ph:Object.fromEntries(S.photos.map(p=>[p.id,{adj:p.adj,excluded:p.excluded,forceIn:p.forceIn}]))});}
function commitNow(){if(hist.lock||!S.ready)return;const s=snapshot();if(hist.stack[hist.idx]===s)return;hist.stack=hist.stack.slice(0,hist.idx+1);hist.stack.push(s);if(hist.stack.length>40)hist.stack.shift();hist.idx=hist.stack.length-1;updUndo();saveSoon();}
const commitSoon=debounce(commitNow,350);
function resetHistory(){hist.stack=[];hist.idx=-1;commitNow();}
function updUndo(){$('#btnUndo').disabled=hist.idx<=0;$('#btnRedo').disabled=hist.idx>=hist.stack.length-1;}
async function restoreSnap(s){
  hist.lock=true; const o=JSON.parse(s); S.book=Object.assign({...DEFAULT_BOOK},o.book); S.pages=o.pages;
  for(const p of S.photos){const r=o.ph[p.id];if(!r)continue;const pix=PIX_KEYS.some(k=>p.adj[k]!==r.adj[k]);p.adj=r.adj;p.excluded=r.excluded;p.forceIn=r.forceIn;if(pix)await refreshProc(p);}
  tileCache.clear(); S.selPage=clamp(S.selPage,0,S.pages.length-1); S.spread=clamp(S.spread,0,views().length-1); hist.lock=false; refreshAll(true); renderStrip(true); updUndo(); saveSoon();
}
async function undo(){if(hist.idx<=0)return;hist.idx--;await restoreSnap(hist.stack[hist.idx]);toast('되돌렸어요.');}
async function redo(){if(hist.idx>=hist.stack.length-1)return;hist.idx++;await restoreSnap(hist.stack[hist.idx]);}
/* per-browser draft of the book in progress (photos + edits); safe to lose */
function mkStore(name){return{db:null,ok:(()=>{try{return typeof indexedDB!=='undefined'&&!!indexedDB;}catch(e){return false;}})(),
  async open(){if(this.db||!this.ok)return this.db;try{this.db=await new Promise((res,rej)=>{const r=indexedDB.open(name,1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}catch(e){this.ok=false;}return this.db;},
  async tx(mode,fn){const db=await this.open();if(!db)throw new Error('nodb');return new Promise((res,rej)=>{const t=db.transaction('kv',mode),req=fn(t.objectStore('kv'));t.oncomplete=()=>res(req&&req.result);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error);});},
  get(k){return this.tx('readonly',s=>s.get(k));}, put(k,v){return this.tx('readwrite',s=>s.put(v,k));}, del(k){return this.tx('readwrite',s=>s.delete(k));}, clear(){return this.tx('readwrite',s=>s.clear());}
};}
const store=mkStore('uribook');
const savedFiles=new Set(); let saving=false,saveTimer=null;
function setSaveState(t){$('#saveState').textContent=t;}
function saveSoon(){if(S.sample||!store.ok)return;clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,1600);}
async function masterBlob(p){if(Math.max(p.w,p.h)<=3200)return p.file;const o=await blobToImage(p.file);try{const k=3200/Math.max(o.w,o.h),c=mkCanvas(o.w*k,o.h*k);c.getContext('2d').drawImage(o.img,0,0,c.width,c.height);const b=await toBlob(c,'image/jpeg',.93);c.width=c.height=1;return b;}finally{URL.revokeObjectURL(o.url);}}
async function saveNow(){
  if(S.sample||!store.ok)return; if(saving){saveSoon();return;} saving=true; setSaveState('저장 중…');
  try{
    for(const p of S.photos){if(p.err||savedFiles.has(p.id))continue;await store.put('f:'+p.id,await masterBlob(p));savedFiles.add(p.id);await yieldUI();}
    await store.put('state',{v:2,savedAt:Date.now(),book:S.book,pages:S.pages,exp:S.exp,photos:S.photos.filter(p=>!p.err).map(p=>({id:p.id,name:p.name,date:+p.date,dateSrc:p.dateSrc,adj:p.adj,excluded:p.excluded,forceIn:p.forceIn,boxes:p.boxes||null}))});
    const d=new Date(); setSaveState(`자동 저장 ${pad2(d.getHours())}:${pad2(d.getMinutes())}`);
  }catch(e){store.ok=false;setSaveState('');toast('이 브라우저의 저장 공간이 부족해 자동 저장을 멈췄어요. 완성되면 PDF로 저장해 두세요.','err');}
  saving=false;
}
async function checkResume(){
  if(!store.ok)return; let st=null; try{st=await store.get('state');}catch(e){return;}
  if(!st||!st.photos||!st.photos.length)return;
  const d=new Date(st.savedAt); $('#resumeText').textContent=`${d.getMonth()+1}월 ${d.getDate()}일에 만들던 책이 있어요 (사진 ${st.photos.length}장).`;
  $('#resumeNotice').hidden=false;
  $('#btnFresh').onclick=async()=>{$('#resumeNotice').hidden=true;try{await store.clear();}catch(e){}};
  $('#btnResume').onclick=()=>resumeProject(st);
}
async function resumeProject(st){
  $('#resumeNotice').hidden=true; busy.on('만들던 책을 여는 중'); const out=[];
  for(let i=0;i<st.photos.length;i++){if(busy.cancelled)break;const s=st.photos[i];busy.set(i/st.photos.length,`${i+1} / ${st.photos.length}장`);
    try{const blob=await store.get('f:'+s.id);if(!blob)continue;const p=await ingest(blob,{date:new Date(s.date),dateSrc:s.dateSrc,id:s.id,name:s.name,boxes:s.boxes,skipProc:true});p.adj=Object.assign(defAdj(true),s.adj);p.excluded=s.excluded;p.forceIn=s.forceIn;await refreshProc(p);out.push(p);savedFiles.add(p.id);}catch(e){}
    if(i%4===3)await yieldUI();}
  busy.off(); if(!out.length){toast('저장된 사진을 열지 못했어요.','err');return;}
  for(const p of S.photos){dropImage(p.base);dropImage(p.proc);} S.photos=out; reindex(); S.sample=false; $('#sampleNotice').hidden=true;
  S.book=Object.assign({...DEFAULT_BOOK},st.book); S.exp=Object.assign(S.exp,st.exp||{}); tileCache.clear();
  const ids=new Set(out.map(p=>p.id)); S.pages=(st.pages||[]).map(pg=>({...pg,photos:(pg.photos||[]).filter(id=>ids.has(id))})).filter(pg=>pg.kind!=='photos'||pg.photos.length);
  dedupe(); if(S.pages.length<3)rebuild(); else normalizePages(); S.spread=0; S.selPage=0; S.selPhoto=null; refreshAll(true); renderStrip(true); resetHistory(); setSaveState('자동 저장됨'); toast('만들던 책을 열었어요.');
}

/* ============================== stage ============================== */
let renderToken=0,renderPending=false;
function requestRender(){if(renderPending)return;renderPending=true;requestAnimationFrame(()=>{renderPending=false;renderSpread();});}
async function renderSpread(){
  if(!S.ready)return; const tok=++renderToken; const vs=views(); S.spread=clamp(S.spread,0,vs.length-1); const idxs=vs[S.spread];
  const wrapEl=$('#spreadWrap'),cs=getComputedStyle(wrapEl); const aw=wrapEl.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),ah=wrapEl.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  const sz=SIZES[S.book.size],r=sz.w/sz.h; const per=idxs.length===1?aw:aw/2; const ph=Math.max(80,Math.min(ah,per/r)),pw=ph*r;
  const dpr=Math.min(2,window.devicePixelRatio||1),W=Math.round(pw*dpr),H=Math.round(ph*dpr);
  const off=mkCanvas(W*idxs.length,H),ctx=off.getContext('2d');
  await ensureFonts(curTheme(),bookText()); if(tok!==renderToken)return;
  const hitMap=[];
  for(let k=0;k<idxs.length;k++){
    const i=idxs[k]; ctx.save(); ctx.translate(k*W,0); ctx.beginPath(); ctx.rect(0,0,W,H); ctx.clip();
    const hits=await renderPage(ctx,S.pages[i],W,H,{side:idxs.length===1?sideOf(i):(k===0?'left':'right'),pageNo:(i===0||i===S.pages.length-1)?null:i});
    ctx.restore(); if(tok!==renderToken)return; hitMap.push({pageIdx:i,x0:k*W,W,H,hits});
  }
  if(idxs.length===2){const g=ctx.createLinearGradient(W-W*.07,0,W+W*.07,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(0,0,0,.16)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(W-W*.07,0,W*.14,H);}
  if(S.base&&S.base!==off)S.base.width=S.base.height=1; S.base=off; S.hitMap=hitMap; S.view={dpr,W,H};
  const cv=$('#spread'); cv.width=off.width; cv.height=off.height; cv.style.width=(off.width/dpr)+'px'; cv.style.height=(H/dpr)+'px';
  $('#stageLoading').hidden=true; drawOverlay(); updateStageBar();
}
function drawOverlay(){
  const cv=$('#spread'); if(!S.base)return; const ctx=cv.getContext('2d'); ctx.clearRect(0,0,cv.width,cv.height); ctx.drawImage(S.base,0,0);
  const dpr=S.view.dpr,acc=getComputedStyle(document.documentElement).getPropertyValue('--cloth').trim()||'#2C4A80'; const sz=SIZES[S.book.size];
  for(const hm of S.hitMap){
    if(S.exp.guides){const mm=hm.W/sz.w,ins=4*mm;ctx.save();ctx.setLineDash([6*dpr,5*dpr]);ctx.strokeStyle='rgba(214,56,56,.8)';ctx.lineWidth=1.2*dpr;ctx.strokeRect(hm.x0+ins,ins,hm.W-2*ins,hm.H-2*ins);ctx.restore();}
    if(hm.pageIdx===S.selPage){ctx.save();ctx.fillStyle=acc;ctx.fillRect(hm.x0+hm.W*.3,hm.H-3*dpr,hm.W*.4,3*dpr);ctx.restore();
      for(const h of hm.hits)if(h.pid===S.selPhoto){ctx.save();ctx.setLineDash([5*dpr,4*dpr]);ctx.strokeStyle='#FFFFFF';ctx.lineWidth=3*dpr;ctx.strokeRect(hm.x0+h.x,h.y,h.w,h.h);ctx.strokeStyle=acc;ctx.lineWidth=1.6*dpr;ctx.strokeRect(hm.x0+h.x,h.y,h.w,h.h);ctx.restore();}}
  }
}
function updateStageBar(){
  const vs=views(),idxs=vs[S.spread]||[0]; const n=S.pages.length; let lab;
  if(idxs[0]===0)lab='앞표지'; else if(idxs[0]===n-1)lab='뒤표지'; else lab=idxs.length===2?`${idxs[0]}–${idxs[1]}쪽`:`${idxs[0]}쪽`;
  const si=$('#spreadInfo'); si.textContent=''; si.append(el('b',{text:lab}),` · ${S.spread+1} / ${vs.length}`);
  $('#prevSp').disabled=S.spread<=0; $('#nextSp').disabled=S.spread>=vs.length-1;
  $$('#strip .thumb').forEach((t,i)=>t.classList.toggle('on',i===S.spread));
  const on=$('#strip .thumb.on'); if(on){const st=$('#strip'),l=on.offsetLeft-st.clientWidth/2+on.clientWidth/2;st.scrollTo({left:Math.max(0,l),behavior:'smooth'});}
  $('#barMeta').textContent=`${bookTitle()} · ${n}쪽 · 사진 ${bookPhotos().length}장`;
}
function goSpread(i){const vs=views();S.spread=clamp(i,0,vs.length-1);const idxs=vs[S.spread];if(!idxs.includes(S.selPage)){S.selPage=idxs[0];if(S.tab==='page')renderPagePanel();}requestRender();}
function canvasPoint(e){const cv=$('#spread'),r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height];}
function hitAt(x,y){for(const hm of S.hitMap){if(x<hm.x0||x>=hm.x0+hm.W)continue;const lx=x-hm.x0;for(let k=hm.hits.length-1;k>=0;k--){const h=hm.hits[k];if(lx>=h.x&&lx<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)return{hm,h};}return{hm,h:null};}return null;}
/* tap = select; drag/pinch moves only the selected photo (a mouse can drag any photo); swipe elsewhere turns the page */
function setupStage(){
  const cv=$('#spread'); const pts=new Map(); let drag=null,pinch=null,tap=null;
  const dist=()=>{const a=[...pts.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);};
  const startDrag=(p,h,x,y)=>{const src=p.live||(p.proc&&p.proc.img)||p.base.img,sw=srcW(src),sh=srcH(src),s=Math.max(h.w/sw,h.h/sh)*p.adj.zoom;const[fx,fy]=focusOf(p,h.w,h.h,sw*s,sh*s);return{p,h,x,y,fx,fy,moved:false};};
  cv.addEventListener('pointerdown',e=>{
    if(!S.ready)return; pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); try{cv.setPointerCapture(e.pointerId);}catch(_){}
    if(pts.size===2){if(drag){pinch={d0:Math.max(10,dist()),z0:drag.p.adj.zoom};drag.moved=true;drag.p.adj.autoFocus=false;}tap=null;return;}
    const[x,y]=canvasPoint(e); const hit=hitAt(x,y); tap={cx:e.clientX,cy:e.clientY,hit};
    drag=null; if(hit&&hit.h&&(e.pointerType==='mouse'||hit.h.pid===S.selPhoto))drag=startDrag(S.byId.get(hit.h.pid),hit.h,x,y);
  });
  cv.addEventListener('pointermove',e=>{
    if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&pts.size>=2&&drag){drag.p.adj.zoom=clamp(pinch.z0*dist()/pinch.d0,1,3);requestRender();return;}
    const[x,y]=canvasPoint(e);
    if(!drag){if(e.pointerType==='mouse'&&!pts.size){const hit=hitAt(x,y);cv.style.cursor=hit&&hit.h?'grab':'default';}return;}
    const dx=x-drag.x,dy=y-drag.y; if(!drag.moved&&Math.hypot(dx,dy)<6*S.view.dpr)return;
    if(!drag.moved){drag.moved=true;S.selPhoto=drag.p.id;if(tap&&tap.hit)S.selPage=tap.hit.hm.pageIdx;drag.p.adj.autoFocus=false;}
    cv.style.cursor='grabbing'; const p=drag.p,src=p.live||(p.proc&&p.proc.img)||p.base.img,sw=srcW(src),sh=srcH(src),h=drag.h,s=Math.max(h.w/sw,h.h/sh)*p.adj.zoom,dw=sw*s,dh=sh*s;
    if(dw-h.w>1)p.adj.fx=clamp(drag.fx+dx/(h.w-dw),0,1); if(dh-h.h>1)p.adj.fy=clamp(drag.fy+dy/(h.h-dh),0,1); requestRender();
  });
  const finishMove=()=>{drag=null;thumbsSoon();commitSoon();if(S.tab==='adjust')renderAdjust();};
  cv.addEventListener('pointerup',e=>{
    pts.delete(e.pointerId);
    if(pinch){if(pts.size<2){pinch=null;if(drag)finishMove();}return;}
    if(pts.size>0)return;
    const t=tap; tap=null; cv.style.cursor='default';
    if(drag&&drag.moved){finishMove();return;}
    drag=null; if(!t)return;
    const dx=e.clientX-t.cx,dy=e.clientY-t.cy;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.3){goSpread(S.spread+(dx<0?1:-1));return;}
    if(Math.hypot(dx,dy)>12||!t.hit)return;
    const changed=S.selPage!==t.hit.hm.pageIdx; S.selPage=t.hit.hm.pageIdx;
    if(t.hit.h){const again=S.selPhoto===t.hit.h.pid;S.selPhoto=t.hit.h.pid;drawOverlay();if(S.tab==='adjust')renderAdjust();else if(again||!isPhone())setTab(S.tab==='page'&&!again?'page':'adjust');else{renderCurrentPanel();if(!S.tipShown){S.tipShown=true;toast('사진을 골랐어요. 끌면 위치, 두 손가락으로 크기가 바뀌어요. 한 번 더 누르면 보정으로 가요.');}}}
    else{S.selPhoto=null;drawOverlay();if(S.tab!=='page')setTab('page');else if(changed)renderPagePanel();}
  });
  cv.addEventListener('pointercancel',e=>{pts.delete(e.pointerId);pinch=null;if(drag&&drag.moved)finishMove();drag=null;tap=null;});
  $('#prevSp').onclick=()=>goSpread(S.spread-1); $('#nextSp').onclick=()=>goSpread(S.spread+1);
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.closest('input,textarea')){e.preventDefault();e.shiftKey?redo():undo();return;}
    if(e.target.closest('input,textarea,select')||!$('#viewer').hidden||!$('#busy').hidden||!$('#viewMake').offsetParent)return;
    if(e.key==='ArrowLeft')goSpread(S.spread-1); if(e.key==='ArrowRight')goSpread(S.spread+1);
  });
  $('#guides').onchange=e=>{S.exp.guides=e.target.checked;drawOverlay();};
  $('#btnUndo').onclick=undo; $('#btnRedo').onclick=redo;
  $('#btnStageSize').onclick=()=>{const small=$('#app').classList.toggle('stage-small');$('#btnStageSize').textContent=small?'미리보기 크게':'미리보기 작게';setTimeout(requestRender,60);};
  new ResizeObserver(debounce(()=>{const single=isNarrow();if(single!==S.single){const sel=S.selPage;S.single=single;S.spread=Math.max(0,viewOfPage(sel));renderStrip(true);}requestRender();},120)).observe($('#spreadWrap'));
}
let thumbToken=0; const thumbsSoon=debounce(()=>renderStrip(),450);
async function renderStrip(force){
  if(!S.ready)return; const tok=++thumbToken; const strip=$('#strip'); const vs=views(),n=S.pages.length;
  if(force||strip.children.length!==vs.length){strip.textContent='';vs.forEach((idxs,si)=>{const lab=idxs[0]===0?'앞표지':idxs[0]===n-1?'뒤표지':idxs.join('–');strip.append(el('button',{class:'thumb',type:'button','aria-label':`${lab} 보기`,onclick:()=>goSpread(si)},el('canvas'),el('span',{text:lab})));});updateStageBar();}
  const sz=SIZES[S.book.size],dpr=Math.min(2,window.devicePixelRatio||1),H=Math.round((isPhone()?38:54)*dpr),W=Math.round(H*sz.w/sz.h);
  await ensureFonts(curTheme(),bookText());
  for(let si=0;si<vs.length;si++){
    if(tok!==thumbToken)return; const idxs=vs[si],btn=strip.children[si]; if(!btn)return; const c=btn.querySelector('canvas');
    const off=mkCanvas(W*idxs.length,H),ctx=off.getContext('2d');
    for(let k=0;k<idxs.length;k++){ctx.save();ctx.translate(k*W,0);ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();await renderPage(ctx,S.pages[idxs[k]],W,H,{side:sideOf(idxs[k]),pageNo:null});ctx.restore();}
    if(tok!==thumbToken)return; c.width=off.width;c.height=off.height;c.style.width=(off.width/dpr)+'px';c.style.height=(H/dpr)+'px';c.getContext('2d').drawImage(off,0,0);off.width=off.height=1;
    await yieldUI();
  }
}
function refreshAll(noCommit){requestRender();thumbsSoon();renderCurrentPanel();if(!noCommit)commitSoon();}

/* ============================== panels ============================== */
function setTab(t){
  S.tab=t;$$('#tabs .tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));for(const n of['photos','book','theme','page','adjust','export'])$('#panel-'+n).hidden=n!==t;renderCurrentPanel();
  if(isPhone()){const r=$('#rail').getBoundingClientRect(),st=$('.stage').getBoundingClientRect(),d=r.top-st.bottom;if(d<0)window.scrollBy(0,d);}else $('#rail').scrollTop=0;
}
function renderCurrentPanel(){({photos:renderPhotosPanel,book:renderBookPanel,theme:renderThemePanel,page:renderPagePanel,adjust:renderAdjust,export:renderExportPanel})[S.tab]();}
const hasFace=p=>!!(p.boxes&&p.boxes.length);
function renderPhotosPanel(){
  const all=S.photos.filter(p=>!p.err),used=bookPhotos(),dups=all.filter(p=>p.dup&&S.book.dedupe&&!p.forceIn).length,faces=all.filter(hasFace).length,sp=dateSpan(all);
  const f=$('#photoFacts'); f.textContent='';
  f.append(el('div',{class:'fact'},el('b',{text:String(used.length)}),el('span',{text:`책에 들어간 사진 / ${all.length}장`})),
           el('div',{class:'fact'},el('b',{text:String(faces)}),el('span',{text:'인물 사진'})),
           el('div',{class:'fact'},el('b',{text:String(dups)}),el('span',{text:'비슷해서 뺀 사진'})),
           el('div',{class:'fact'},el('b',{text:sp?`${sp[0].getMonth()+1}.${sp[0].getDate()}–${sp[1].getMonth()+1}.${sp[1].getDate()}`:'–'}),el('span',{text:sp?`${sp[0].getFullYear()}년 촬영`:'촬영 기간'})));
  $('#optAuto').checked=S.book.autoEnhance; $('#optDedupe').checked=S.book.dedupe; $('#optFace').checked=S.book.faceAuto;
  const g=$('#photoGrid'); g.textContent='';
  for(const p of [...all].sort((a,b)=>a.date-b.date)){
    const out=!inBook(p);
    const tog=el('button',{class:'tog',type:'button',title:out?'책에 넣기':'책에서 빼기','aria-label':out?'책에 넣기':'책에서 빼기',html:out?ICON.plus:ICON.check,onclick:e=>{e.stopPropagation();if(inBook(p)){p.excluded=true;p.forceIn=false;}else{p.excluded=false;p.forceIn=true;}afterPhotoSetChange();}});
    const badge=p.dup&&S.book.dedupe&&!p.forceIn?el('span',{class:'badge',text:'비슷함'}):(!p.sample&&p.dateSrc==='file'?el('span',{class:'badge',text:'날짜 추정'}):null);
    g.append(el('div',{class:'ph'+(out?' out':'')+(S.selPhoto===p.id?' sel':''),role:'button',tabindex:'0','aria-label':`${fmtDot(p.date)} 사진 보정`,onclick:()=>{S.selPhoto=p.id;setTab('adjust');},onkeydown:e=>{if(e.key==='Enter'){S.selPhoto=p.id;setTab('adjust');}}},el('img',{src:p.base.url,alt:'',loading:'lazy'}),tog,hasFace(p)?el('span',{class:'face',html:ICON.face,title:'인물 사진'}):null,badge));
  }
}
function afterPhotoSetChange(){rebuild();refreshAll();toast('페이지를 새로 구성했어요.');}
function segSet(sel,v){$$(sel+' button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.v===String(v))));}
function renderBookPanel(){
  const b=S.book; $('#bTitle').value=b.title; $('#bTitle').placeholder=autoTitle(); $('#bSub').value=b.subtitle; $('#bSub').placeholder=autoSubtitle();
  $('#bFamily').value=b.family; $('#bIntro').value=b.intro; $('#bIntro').placeholder=introText(); $('#bBirth').value=b.birthday;
  segSet('#bMode',b.mode); segSet('#bDensity',b.density); segSet('#bCover',b.coverStyle); $('#bSize').value=b.size; $('#bDates').checked=b.showDates; $('#bPageNo').checked=b.showPageNo;
  const g=$('#conceptGrid'); if(!g.children.length){for(const C of CONCEPTS){const T=THEME_BY_ID[C.theme],a=accentOf(T,3);g.append(el('button',{class:'ccard',type:'button','data-id':C.id,onclick:()=>applyConcept(C.id)},el('span',{class:'sw',style:`background:${paperColor(T,3,0)}`},el('i',{style:`background:${isPale(a)?T.muted:a}`})),el('span',{},el('b',{text:C.name}),el('small',{text:C.desc}))));}}
  $$('.ccard',g).forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===b.concept)));
}
function applyConcept(id){
  const C=CONCEPT_BY_ID[id]; Object.assign(S.book,{concept:id,theme:C.theme,mode:C.mode,density:C.density,coverStyle:C.cover||'theme'});
  tileCache.clear(); rebuild(); S.spread=0; S.selPage=0; refreshAll(); renderStrip(true);
  toast(`‘${C.name}’ 컨셉으로 바꿨어요. ${S.pages.length}쪽이에요.`+(C.needBirthday&&!S.book.birthday?' 아이 생일을 넣으면 개월 수가 표시돼요.':''));
  if(C.needBirthday&&!S.book.birthday&&!isPhone())setTimeout(()=>$('#bBirth').focus(),300);
}
function setupBookPanel(){
  const sel=$('#bSize'); for(const[k,v]of Object.entries(SIZES))sel.append(el('option',{value:k,text:v.label}));
  const soft=debounce(()=>{requestRender();thumbsSoon();commitSoon();},200);
  $('#bTitle').oninput=e=>{S.book.title=e.target.value.trim();soft();updateStageBar();};
  $('#bSub').oninput=e=>{S.book.subtitle=e.target.value.trim();soft();};
  $('#bFamily').oninput=e=>{S.book.family=e.target.value.trim();soft();};
  $('#bIntro').oninput=e=>{S.book.intro=e.target.value.trim();soft();};
  $('#bBirth').onchange=e=>{S.book.birthday=e.target.value;soft();};
  $$('#bMode button').forEach(x=>x.onclick=()=>{if(S.book.mode===x.dataset.v)return;S.book.mode=x.dataset.v;rebuild();S.spread=0;refreshAll();toast(x.dataset.v==='year'?'달마다 챕터가 있는 연간 앨범으로 바꿨어요.':'날짜별로 넘겨 보는 월간 앨범으로 바꿨어요.');});
  $$('#bDensity button').forEach(x=>x.onclick=()=>{if(S.book.density===x.dataset.v)return;S.book.density=x.dataset.v;rebuild();S.spread=Math.min(S.spread,views().length-1);refreshAll();toast(`한 페이지에 사진을 ${x.querySelector('small').textContent}씩 넣었어요. ${S.pages.length}쪽이 됐어요.`);});
  $$('#bCover button').forEach(x=>x.onclick=()=>{S.book.coverStyle=x.dataset.v;segSet('#bCover',x.dataset.v);S.spread=0;refreshAll();});
  $('#bDates').onchange=e=>{S.book.showDates=e.target.checked;relayoutAll();refreshAll();};
  $('#bPageNo').onchange=e=>{S.book.showPageNo=e.target.checked;refreshAll();};
  sel.onchange=()=>{S.book.size=sel.value;tileCache.clear();relayoutAll();refreshAll();};
}
let themeTok=0;
async function renderThemePanel(){
  const cats=$('#themeCats'); if(!cats.children.length)for(const c of THEME_CATS)cats.append(el('button',{class:'cat',type:'button','data-c':c,text:c,onclick:()=>{S.themeCat=c;renderThemePanel();}}));
  $$('.cat',cats).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===S.themeCat)));
  const g=$('#themeGrid'); const tok=++themeTok;
  if(!g.children.length){for(const T of THEMES)g.append(el('button',{class:'tcard',type:'button','data-id':T.id,onclick:()=>chooseTheme(T.id)},el('canvas'),el('b',{text:T.name}),el('small',{text:T.desc}),el('div',{class:'tags'},T.tags.map(t=>el('span',{class:'tag',text:t})))));}
  const show=T=>S.themeCat==='전체'||T.tags.includes(S.themeCat);
  $$('.tcard',g).forEach(c=>{c.setAttribute('aria-pressed',String(c.dataset.id===S.book.theme));c.hidden=!show(THEME_BY_ID[c.dataset.id]);});
  const sz=SIZES[S.book.size],dpr=Math.min(2,window.devicePixelRatio||1),H=Math.round(84*dpr),W=Math.round(H*sz.w/sz.h);
  const cover=S.pages[0],first=S.pages.find(p=>p.kind==='photos'&&p.photos.length>=3)||S.pages.find(p=>p.kind==='photos')||S.pages[1];
  for(const T of THEMES){
    if(!show(T))continue; if(tok!==themeTok)return; await ensureFonts(T,bookText()); if(tok!==themeTok)return;
    const c=g.querySelector(`[data-id="${T.id}"] canvas`),off=mkCanvas(W*2,H),ctx=off.getContext('2d');
    for(const[k,pg]of[[0,cover],[1,first]]){ctx.save();ctx.translate(k*W,0);ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();await renderPage(ctx,pg,W,H,{theme:T,side:'right',pageNo:null});ctx.restore();}
    c.width=off.width;c.height=off.height;c.getContext('2d').drawImage(off,0,0); off.width=off.height=1; await yieldUI();
  }
}
function chooseTheme(id){
  if(S.book.theme===id)return; S.book.theme=id; relayoutAll(); $$('#themeGrid .tcard').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.id===id))); requestRender(); thumbsSoon(); commitSoon();
  const T=curTheme(); if(T.suggest)toast(`${T.name} 테마에는 ‘${FILTERS[T.suggest].name}’ 필터가 잘 어울려요.`,'',{label:'모든 사진에 적용',fn:()=>applyToAll({filter:T.suggest})});
}
/* photo picker sheet */
function whereIs(id){const i=S.pages.findIndex(pg=>pg.kind==='photos'&&pg.photos.includes(id));if(i>0)return{i,label:`${i}쪽`};const c=S.pages.findIndex(pg=>pg.kind==='chapter'&&pg.photos.includes(id));if(c>0)return{i:c,label:`${c}쪽 챕터`};if(S.pages[0]&&S.pages[0].photos.includes(id))return{i:0,label:'표지'};return{i:-1,label:'책에 없음'};}
function openPicker(title,hint,list,onPick){
  $('#pickTitle').textContent=title; $('#pickHint').textContent=hint; const g=$('#pickGrid'); g.textContent='';
  for(const p of list){const w=whereIs(p.id);g.append(el('button',{class:'ph',type:'button','aria-label':`${fmtDot(p.date)} 사진, ${w.label}`,onclick:()=>{$('#picker').hidden=true;onPick(p);}},el('img',{src:p.base.url,alt:'',loading:'lazy'}),el('span',{class:'where',text:w.label})));}
  if(!list.length)g.append(el('p',{class:'hint',text:'고를 수 있는 사진이 없어요.'}));
  $('#picker').hidden=false;
}
function pageTitle(pg,i){const map={cover:'앞표지',title:'첫 장',chapter:'챕터',photos:'사진 페이지',stats:'기록 페이지',notes:'메모 페이지',text:'글 페이지',back:'뒤표지'};return map[pg.kind]+(i>0&&i<S.pages.length-1?` · ${i}쪽`:'');}
function layoutIcon(L){const ar=SIZES[S.book.size].w/SIZES[S.book.size].h,vw=100,vh=100/ar;const rs=L.r(.05,.05);return `<svg viewBox="-6 -6 ${vw+12} ${vh+12}" aria-hidden="true"><rect x="-4" y="-4" width="${vw+8}" height="${vh+8}" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/>${rs.map(r=>`<rect x="${L.bleed?-4:r[0]*vw}" y="${L.bleed?-4:r[1]*vh}" width="${L.bleed?vw+8:r[2]*vw}" height="${L.bleed?vh+8:r[3]*vh}" fill="currentColor" fill-opacity=".45" rx="1.5"/>`).join('')}</svg>`;}
function slotDpi(p,pgIdx){
  const sz=SIZES[S.book.size]; let h=null;
  for(const hm of S.hitMap)if(hm.pageIdx===pgIdx)for(const x of hm.hits)if(x.pid===p.id)h={w:x.w/hm.W*sz.w,h:x.h/hm.H*sz.h};
  if(!h)return null; const rw=p.adj.rot%180?p.h:p.w,rh=p.adj.rot%180?p.w:p.h; const mmPerPx=Math.max(h.w/rw,h.h/rh)*p.adj.zoom; return Math.round(25.4/mmPerPx);
}
const dpiBadge=d=>d==null?null:el('span',{class:'dpi '+(d<150?'low':d<240?'mid':'ok'),title:'인쇄했을 때 이 사진의 해상도',text:`${d}dpi`});
function removeFromPage(id,except){for(const pg of S.pages){if(pg===except||pg.kind!=='photos')continue;if(pg.photos.includes(id)){pg.photos=pg.photos.filter(x=>x!==id);if(pg.photos.length)pickLayout(pg,null);}}S.pages=S.pages.filter(pg=>pg.kind!=='photos'||pg.photos.length);}
function renderPagePanel(){
  const box=$('#pageInspector'); box.textContent=''; const i=S.selPage,pg=S.pages[i]; const T=curTheme();
  if(!pg){box.append(el('p',{class:'hint',text:'미리보기에서 페이지를 눌러 고르세요.'}));return;}
  box.append(el('div',{class:'spread-row'},el('h3',{text:pageTitle(pg,i)}),el('span',{class:'hint',text:`전체 ${S.pages.length}쪽`})));
  const inner=i>0&&i<S.pages.length-1;
  if(pg.kind==='photos'){
    const n=pg.photos.length,list=layoutsFor(n,T);
    if(list.length>1){box.append(el('h4',{text:`배치 · 사진 ${n}장`}));const lw=el('div',{class:'layouts'});for(const L of list)lw.append(el('button',{class:'lay',type:'button','aria-pressed':String(L.k===pg.layout),'aria-label':`배치 ${L.k}`,html:layoutIcon(L),onclick:()=>{pickLayout(pg,null,L.k);pg.manual=true;refreshAll();}}));box.append(lw);}
    const photoPages=S.pages.map((p,k)=>[p,k]).filter(([p])=>p.kind==='photos'),pos=photoPages.findIndex(([,k])=>k===i),prevP=photoPages[pos-1],nextP=photoPages[pos+1];
    const addRow=el('div',{class:'row'},
      el('button',{class:'btn sm',type:'button',html:ICON.plus+'사진 더 넣기',disabled:n>=MAXP||null,onclick:()=>openPicker('이 페이지에 넣을 사진',`한 페이지에 ${MAXP}장까지 넣을 수 있어요. 지금 ${n}장이에요. 다른 페이지에 있던 사진은 이 페이지로 옮겨져요.`,bookPhotos().filter(p=>!pg.photos.includes(p.id)),p=>{removeFromPage(p.id,pg);pg.photos.push(p.id);pickLayout(pg,null);S.selPage=S.pages.indexOf(pg);afterStructure();toast(`사진을 넣었어요. 이제 ${pg.photos.length}장이에요.`);})}),
      n>=2?el('button',{class:'btn sm',type:'button',text:'두 페이지로 나누기',onclick:()=>{const half=Math.ceil(n/2),np=mkPage('photos',{photos:pg.photos.splice(half)});pickLayout(pg,null);pickLayout(np,pg.layout);S.pages.splice(i+1,0,np);afterStructure();}}):null,
      nextP&&nextP[1]===i+1&&n+nextP[0].photos.length<=MAXP?el('button',{class:'btn sm',type:'button',text:'다음 페이지와 합치기',onclick:()=>{pg.photos.push(...nextP[0].photos);S.pages.splice(i+1,1);pickLayout(pg,null);afterStructure();}}):null);
    box.append(addRow);
    box.append(el('label',{class:'field'},el('span',{text:'날짜 표시 (비우면 자동)'}),el('input',{class:'input',id:'pgLabel',maxlength:'40',value:pg.label||'',placeholder:autoLabel(pg),oninput:e=>{pg.label=e.target.value;requestRender();thumbsSoon();commitSoon();}})));
    const capIn=el('textarea',{class:'input',id:'pgCap',maxlength:'120',placeholder:'이 날의 이야기를 한두 줄로 적어 보세요.',oninput:e=>{const had=!!pg.caption;pg.caption=e.target.value;if(had!==!!pg.caption&&!pg.manual)pickLayout(pg,null);requestRender();thumbsSoon();commitSoon();}});capIn.value=pg.caption||'';
    box.append(el('label',{class:'field'},el('span',{text:'사진 설명'}),capIn));
    box.append(el('h4',{text:`사진 ${n}장`})); const sl=el('div',{class:'slots'});
    pg.photos.forEach((id,si)=>{const p=S.byId.get(id);if(!p)return;
      sl.append(el('div',{class:'slot'},el('img',{src:p.base.url,alt:''}),el('div',{class:'meta'},el('b',{text:fmtDot(p.date)}),dpiBadge(slotDpi(p,i)),hasFace(p)?el('span',{class:'dpi ok',text:'인물'}):null),
        el('div',{class:'acts'},iconBtn('left','앞 칸으로',()=>{swap(pg.photos,si,si-1);pg.manual=true;refreshAll();},si===0),iconBtn('right','뒤 칸으로',()=>{swap(pg.photos,si,si+1);pg.manual=true;refreshAll();},si===n-1),
          iconBtn('swap','다른 사진과 바꾸기',()=>openPicker('바꿔 넣을 사진','고른 사진과 자리를 맞바꿔요.',bookPhotos().filter(q=>q.id!==id),q=>swapPhotos(pg,id,q.id))),
          iconBtn('up','앞 페이지로 보내기',()=>movePhoto(pg,id,prevP&&prevP[0]),!prevP),iconBtn('down','뒤 페이지로 보내기',()=>movePhoto(pg,id,nextP&&nextP[0]),!nextP),
          iconBtn('star','표지 대표 사진으로',()=>{const c=S.pages[0];c.photos=[id,...c.photos.filter(x=>x!==id)].slice(0,6);refreshAll();toast('표지 사진을 바꿨어요.');}),iconBtn('x','이 페이지에서 빼기',()=>movePhoto(pg,id,null)))));});
    box.append(sl);
  }else if(pg.kind==='cover'){
    box.append(el('p',{class:'hint',text:'제목, 부제, 표지 모양(테마 기본·꽉 채우기·콜라주)은 ‘책’ 탭에서 바꿀 수 있어요. 첫 번째 사진이 대표 사진이에요.'}));
    box.append(el('div',{class:'row'},el('button',{class:'btn sm',type:'button',text:'대표 사진 바꾸기',onclick:()=>openPicker('표지 대표 사진','잘 나온 사진부터 보여드려요.',bookPhotos().sort((a,b)=>b.score-a.score),p=>{pg.photos=[p.id,...pg.photos.filter(x=>x!==p.id)].slice(0,6);refreshAll();})}),
      el('button',{class:'btn sm',type:'button',text:'콜라주 사진 더하기',disabled:pg.photos.length>=6||null,onclick:()=>openPicker('콜라주 표지에 넣을 사진','표지 콜라주는 6장까지 들어가요.',bookPhotos().filter(p=>!pg.photos.includes(p.id)).sort((a,b)=>b.score-a.score),p=>{pg.photos.push(p.id);refreshAll();})})));
    const sl=el('div',{class:'choose'}); pg.photos.forEach((id,k)=>{const p=S.byId.get(id);if(p)sl.append(el('button',{class:'ph'+(k===0?' sel':''),type:'button','aria-label':'이 사진을 대표 사진으로',onclick:()=>{pg.photos=[id,...pg.photos.filter(x=>x!==id)];refreshAll();}},el('img',{src:p.base.url,alt:''})));}); box.append(el('h4',{text:'표지에 쓰는 사진 (누르면 대표 사진)'}),sl);
  }else if(pg.kind==='chapter'){
    box.append(el('label',{class:'field'},el('span',{text:'챕터 제목'}),el('input',{class:'input',maxlength:'20',value:pg.title||'',placeholder:`${(pg.ym||[0,0])[1]+1}월`,oninput:e=>{pg.title=e.target.value.trim()||null;requestRender();thumbsSoon();commitSoon();}})));
    box.append(el('button',{class:'btn sm',type:'button',text:'챕터 사진 바꾸기',onclick:()=>openPicker('챕터 사진','이 달에 찍은 사진이에요.',bookPhotos().filter(p=>{if(!pg.ym)return false;const k=p.date.getFullYear()*12+p.date.getMonth(),a=pg.ym[0]*12+pg.ym[1],b=pg.ym2?pg.ym2[0]*12+pg.ym2[1]:a;return k>=a&&k<=b;}),p=>{const old=pg.photos[0];pg.photos=[p.id];if(old&&old!==p.id){const tgt=S.pages.find(x=>x.kind==='photos'&&x.photos.includes(p.id));if(tgt){tgt.photos[tgt.photos.indexOf(p.id)]=old;}}refreshAll();})}));
  }else if(pg.kind==='title'){
    const ta=el('textarea',{class:'input',maxlength:'300',placeholder:introText(),oninput:e=>{S.book.intro=e.target.value.trim();requestRender();thumbsSoon();commitSoon();}});ta.value=S.book.intro;
    box.append(el('label',{class:'field'},el('span',{text:'첫 장에 들어갈 글'}),ta));
  }else if(pg.kind==='text'){
    box.append(el('label',{class:'field'},el('span',{text:'제목'}),el('input',{class:'input',maxlength:'30',value:pg.title||'',oninput:e=>{pg.title=e.target.value;requestRender();thumbsSoon();commitSoon();}})));
    const ta=el('textarea',{class:'input',maxlength:'800',rows:'7',oninput:e=>{pg.text=e.target.value;requestRender();thumbsSoon();commitSoon();}});ta.value=pg.text||'';box.append(el('label',{class:'field'},el('span',{text:'본문'}),ta));
  }else{
    box.append(el('p',{class:'hint',text:{stats:'사진 날짜로 자동으로 채워지는 페이지예요.',notes:pg.pad?'쪽수를 짝수로 맞추려고 넣은 메모 페이지예요. 손글씨로 채우기 좋아요.':'손글씨로 채울 수 있는 메모 페이지예요.',back:'가족 이름과 책 제목이 들어가요.'}[pg.kind]||''}));
  }
  if(inner){
    const movable=k=>k>0&&k<S.pages.length-1;
    const row=el('div',{class:'row'},
      el('button',{class:'btn sm',type:'button',text:'앞으로',disabled:!movable(i-1)||null,onclick:()=>{swap(S.pages,i,i-1);S.selPage=i-1;afterStructure();}}),
      el('button',{class:'btn sm',type:'button',text:'뒤로',disabled:!movable(i+1)||S.pages[i+1].pad||null,onclick:()=>{swap(S.pages,i,i+1);S.selPage=i+1;afterStructure();}}),
      el('button',{class:'btn sm',type:'button',text:'뒤에 사진 페이지',onclick:()=>openPicker('새 페이지에 넣을 사진','고른 사진으로 새 페이지를 만들어요. 다른 페이지에 있던 사진은 옮겨져요.',bookPhotos(),p=>{removeFromPage(p.id,null);const k=Math.min(S.pages.indexOf(pg)+1,S.pages.length-1);const np=mkPage('photos',{photos:[p.id]});pickLayout(np,null);S.pages.splice(k,0,np);S.selPage=k;afterStructure();})}),
      el('button',{class:'btn sm',type:'button',text:'뒤에 글 페이지',onclick:()=>{S.pages.splice(i+1,0,mkPage('text',{title:'',text:''}));S.selPage=i+1;afterStructure();}}),
      ['photos','text','notes','chapter'].includes(pg.kind)?el('button',{class:'btn sm danger',type:'button',text:'페이지 삭제',onclick:async()=>{if(pg.kind==='photos'&&!await confirmBox('이 페이지를 지울까요?','사진은 사진 목록에 남아 있어요. 미리보기 아래 되돌리기로 다시 살릴 수 있어요.','지우기'))return;S.pages.splice(i,1);S.selPage=Math.min(i,S.pages.length-2);afterStructure();}}):null);
    box.append(el('div',{class:'sec'},el('h4',{text:'페이지'}),row));
  }
}
function swap(a,i,j){if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];}
function swapPhotos(pg,id,other){
  const k=pg.photos.indexOf(id);
  if(pg.photos.includes(other)){swap(pg.photos,k,pg.photos.indexOf(other));}
  else{const tgt=S.pages.find(p=>p!==pg&&(p.kind==='photos'||p.kind==='chapter')&&p.photos.includes(other));pg.photos[k]=other;if(tgt)tgt.photos[tgt.photos.indexOf(other)]=id;}
  pg.manual=true; refreshAll(); toast('사진을 바꿨어요.');
}
function movePhoto(pg,id,target){
  if(target&&target.photos.length>=MAXP){toast(`한 페이지에는 사진을 ${MAXP}장까지 넣을 수 있어요.`,'err');return;}
  pg.photos=pg.photos.filter(x=>x!==id); if(target){target.photos.push(id);pickLayout(target,null);}
  if(!pg.photos.length){const i=S.pages.indexOf(pg);S.pages.splice(i,1);S.selPage=Math.min(i,S.pages.length-2);}else pickLayout(pg,null);
  afterStructure();
}
function afterStructure(){normalizePages();S.selPage=clamp(S.selPage,0,S.pages.length-1);const si=viewOfPage(S.selPage);if(si>=0)S.spread=si;refreshAll();}

/* ============================== adjust panel ============================== */
const SLIDERS=[['bright','밝기',-100,100],['contrast','대비',-100,100],['sat','채도',-100,100],['warm','색온도',-100,100],['tint','색조',-100,100],['high','밝은 영역',-100,100],['shadow','어두운 영역',-100,100],['sharp','선명도',0,100],['vignette','비네팅',0,100]];
const SKIN_SLIDERS=[['skin','피부 결',0,100],['skinBright','피부 밝기',0,100],['skinRed','홍조 줄이기',0,100]];
function processedCanvas(p,scale=1){const cv=drawRotated(p.base.img,p.adj.rot,scale);const cx=cv.getContext('2d',{willReadFrequently:true});const id=cx.getImageData(0,0,cv.width,cv.height);applyAdjust(id,p.adj,p.stats,{boxes:rotBoxes(p),ox:0,oy:0,dw:cv.width,dh:cv.height});cx.putImageData(id,0,0);return cv;}
async function refreshProc(p){const cv=processedCanvas(p,1);const o=await blobToImage(await toBlob(cv,'image/jpeg',.9));cv.width=cv.height=1;dropImage(p.proc);p.proc=o;if(p.live)p.live.width=p.live.height=1;p.live=null;}
let liveRaf=0; const commitAdj=debounce(async p=>{await refreshProc(p);paintAdjView(p);requestRender();thumbsSoon();commitSoon();},260);
function liveUpdate(p){if(liveRaf)return;liveRaf=requestAnimationFrame(()=>{liveRaf=0;p.live=processedCanvas(p,.5);paintAdjView(p,p.live);requestRender();});}
function paintAdjView(p,src,orig){
  const c=$('#adjCanvas'); if(!c||S.selPhoto!==p.id)return; const s=orig?drawRotated(p.base.img,p.adj.rot,.6):(src||p.live||(p.proc&&p.proc.img)||p.base.img);
  const sw=srcW(s),sh=srcH(s),k=Math.min(1,720/Math.max(sw,sh)); c.width=Math.round(sw*k); c.height=Math.round(sh*k); const x=c.getContext('2d'); x.drawImage(s,0,0,c.width,c.height);
  if(S.showMask&&!orig){const M=skinMask(c,rotBoxes(p),{ox:0,oy:0,dw:c.width,dh:c.height});if(M){const mc=mkCanvas(M.mw,M.mh),mx=mc.getContext('2d'),md=mx.createImageData(M.mw,M.mh);for(let i=0;i<M.m.length;i++){md.data[i*4]=255;md.data[i*4+1]=60;md.data[i*4+2]=150;md.data[i*4+3]=Math.min(150,M.m[i]*170);}mx.putImageData(md,0,0);x.imageSmoothingEnabled=true;x.drawImage(mc,0,0,c.width,c.height);}}
  if(!orig&&hasFace(p)&&S.showMask){x.save();x.strokeStyle='rgba(255,255,255,.9)';x.setLineDash([6,4]);x.lineWidth=2;for(const b of rotBoxes(p))x.strokeRect(b.x0*c.width,b.y0*c.height,(b.x1-b.x0)*c.width,(b.y1-b.y0)*c.height);x.restore();}
}
function sliderRow(p,k,name,mn,mx){
  const out=el('output',{text:String(p.adj[k])}); const r=el('input',{type:'range',min:String(mn),max:String(mx),step:'1',value:String(p.adj[k]),'aria-label':name});
  r.addEventListener('input',()=>{p.adj[k]=+r.value;out.textContent=r.value;liveUpdate(p);}); r.addEventListener('change',()=>commitAdj(p));
  r.addEventListener('dblclick',()=>{r.value='0';p.adj[k]=0;out.textContent='0';liveUpdate(p);commitAdj(p);});
  return el('label',{class:'slider'},el('span',{text:name}),r,out);
}
function renderAdjust(){
  const box=$('#adjustPanel'); box.textContent=''; const p=S.selPhoto&&S.byId.get(S.selPhoto);
  if(!p){box.append(el('h3',{text:'사진 보정'}),el('p',{class:'hint',text:'미리보기에서 사진을 누르거나 ‘사진’ 탭에서 고르면 여기서 보정할 수 있어요. 고른 사진은 미리보기에서 끌어 위치를, 두 손가락으로 크기를 바꿀 수 있어요.'}));return;}
  const where=whereIs(p.id);
  box.append(el('div',{class:'spread-row'},el('h3',{text:`${fmtDot(p.date)} 사진`}),where.i>=0?el('button',{class:'btn sm ghost',type:'button',text:`${where.label} 보기`,onclick:()=>{S.selPage=where.i;goSpread(viewOfPage(where.i));}}):el('span',{class:'hint',text:where.label})));
  const hold=el('button',{class:'btn sm hold',type:'button',text:'누르고 있으면 원본'});
  const showO=e=>{e.preventDefault();paintAdjView(p,null,true);},showP=()=>paintAdjView(p);
  hold.addEventListener('pointerdown',showO);hold.addEventListener('pointerup',showP);hold.addEventListener('pointerleave',showP);hold.addEventListener('pointercancel',showP);hold.addEventListener('contextmenu',e=>e.preventDefault());
  box.append(el('div',{class:'adj-view'},el('canvas',{id:'adjCanvas'}),hold)); paintAdjView(p);
  const autoIn=el('input',{type:'checkbox',id:'adjAuto'}); autoIn.checked=p.adj.auto; autoIn.onchange=()=>{p.adj.auto=autoIn.checked;liveUpdate(p);commitAdj(p);};
  box.append(el('label',{class:'switch'},autoIn,el('span',{},el('b',{text:'자동 보정'}),el('small',{text:'노출, 화이트밸런스, 대비를 이 사진에 맞춰요.'}))));
  /* portrait */
  const face=el('details',{class:'sec',open:true}); face.append(el('summary',{text:'인물 보정'}));
  const nf=(p.boxes||[]).length;
  face.append(el('p',{class:'note',text:nf?`얼굴을 ${nf}개 찾았어요. 피부 결·밝기·홍조 보정은 얼굴 주변 피부에만 들어가요.`:'얼굴을 찾지 못했어요. 켜면 사진 속 피부색 부분에만 보정이 들어가요.'}));
  const pills=el('div',{class:'pills'}); const cur=Object.entries(RETOUCH).find(([,v])=>v.skin===p.adj.skin&&v.skinBright===p.adj.skinBright&&v.skinRed===p.adj.skinRed);
  for(const[k,v]of Object.entries(RETOUCH))pills.append(el('button',{class:'pill',type:'button','aria-pressed':String(!!cur&&cur[0]===k),text:v.name,onclick:()=>{p.adj.skin=v.skin;p.adj.skinBright=v.skinBright;p.adj.skinRed=v.skinRed;liveUpdate(p);commitAdj(p);setTimeout(renderAdjust,0);}}));
  face.append(pills); for(const[k,n,a,b]of SKIN_SLIDERS)face.append(sliderRow(p,k,n,a,b));
  const maskIn=el('input',{type:'checkbox'}); maskIn.checked=S.showMask; maskIn.onchange=()=>{S.showMask=maskIn.checked;paintAdjView(p);};
  face.append(el('label',{class:'switch'},maskIn,el('span',{},el('b',{text:'보정 영역 보기'}),el('small',{text:'인물 보정이 들어가는 곳을 분홍색으로, 찾은 얼굴을 점선으로 보여줘요.'}))));
  const afIn=el('input',{type:'checkbox'}); afIn.checked=!!p.adj.autoFocus; afIn.disabled=!nf; afIn.onchange=()=>{p.adj.autoFocus=afIn.checked;requestRender();thumbsSoon();commitSoon();};
  face.append(el('label',{class:'switch'},afIn,el('span',{},el('b',{text:'얼굴 기준으로 자리 잡기'}),el('small',{text:nf?'칸에 맞춰 자를 때 얼굴이 잘리지 않게 맞춰요. 직접 끌어 옮기면 꺼져요.':'얼굴을 찾은 사진에서 쓸 수 있어요.'}))));
  face.append(el('button',{class:'btn sm',type:'button',text:'이 인물 보정을 인물 사진 모두에',onclick:()=>applyToAll({skin:p.adj.skin,skinBright:p.adj.skinBright,skinRed:p.adj.skinRed},hasFace)}));
  box.append(face);
  /* filters */
  const fsec=el('details',{class:'sec',open:true}); fsec.append(el('summary',{text:'필터'})); const chips=el('div',{class:'chips'}); const tiny=drawRotated(p.base.img,p.adj.rot,Math.min(1,108/Math.max(srcW(p.base.img),srcH(p.base.img))));
  for(const[k,Fl]of Object.entries(FILTERS)){const c=mkCanvas(tiny.width,tiny.height),cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(tiny,0,0);const id=cx.getImageData(0,0,c.width,c.height);applyAdjust(id,{...p.adj,filter:k,sharp:0,skin:0,skinBright:0,skinRed:0},p.stats);cx.putImageData(id,0,0);
    chips.append(el('button',{class:'chip',type:'button','aria-pressed':String(p.adj.filter===k),onclick:ev=>{p.adj.filter=k;const me=ev.currentTarget;$$('.chip',chips).forEach(b=>b.setAttribute('aria-pressed',String(b===me)));liveUpdate(p);commitAdj(p);}},c,Fl.name));}
  fsec.append(chips); box.append(fsec);
  const msec=el('details',{class:'sec',open:!isPhone()}); msec.append(el('summary',{text:'직접 보정'}),el('p',{class:'hint',text:'슬라이더를 두 번 누르면 0으로 돌아가요.'}));
  for(const[k,n,a,b]of SLIDERS)msec.append(sliderRow(p,k,n,a,b)); box.append(msec);
  const csec=el('details',{class:'sec',open:true}); csec.append(el('summary',{text:'자르기와 방향'}));
  const zo=el('output',{text:Math.round(p.adj.zoom*100)+'%'}); const zr=el('input',{type:'range',min:'100',max:'300',step:'1',value:String(Math.round(p.adj.zoom*100)),'aria-label':'확대'});
  zr.addEventListener('input',()=>{p.adj.zoom=+zr.value/100;zo.textContent=zr.value+'%';requestRender();}); zr.addEventListener('change',()=>{thumbsSoon();commitSoon();});
  csec.append(el('label',{class:'slider'},el('span',{text:'확대'}),zr,zo),el('p',{class:'hint',text:'미리보기에서 이 사진을 끌면 위치를, 두 손가락으로 벌리면 크기를 바꿀 수 있어요.'}));
  const rot=d=>async()=>{p.adj.rot=((p.adj.rot+d)%360+360)%360;p.adj.fx=p.adj.fy=.5;await refreshProc(p);renderAdjust();requestRender();thumbsSoon();commitSoon();};
  csec.append(el('div',{class:'row'},el('button',{class:'btn sm',type:'button',html:ICON.rotl+'왼쪽 90°',onclick:rot(-90)}),el('button',{class:'btn sm',type:'button',html:ICON.rotr+'오른쪽 90°',onclick:rot(90)}),el('button',{class:'btn sm ghost',type:'button',text:nf?'얼굴 기준 위치로':'위치 가운데로',onclick:()=>{p.adj.fx=p.adj.fy=.5;p.adj.zoom=1;p.adj.autoFocus=!!nf;renderAdjust();requestRender();thumbsSoon();commitSoon();}})));
  box.append(csec);
  box.append(el('div',{class:'sec'},el('div',{class:'row'},
    el('button',{class:'btn sm',type:'button',text:'보정 초기화',onclick:async()=>{const keep={rot:p.adj.rot,zoom:p.adj.zoom,fx:p.adj.fx,fy:p.adj.fy,autoFocus:p.adj.autoFocus};const sk=nf&&S.book.faceAuto?RETOUCH.natural:RETOUCH.off;p.adj={...defAdj(S.book.autoEnhance),skin:sk.skin,skinBright:sk.skinBright,skinRed:sk.skinRed,...keep};await refreshProc(p);renderAdjust();requestRender();thumbsSoon();commitSoon();}}),
    el('button',{class:'btn sm',type:'button',text:'색감 보정을 모든 사진에',onclick:()=>{const v={};for(const k of TONE_KEYS)v[k]=p.adj[k];applyToAll(v);}})),
    el('p',{class:'hint',text:`원본 ${p.w}×${p.h}px · ${p.dateSrc==='exif'?'사진 정보의 촬영 날짜':p.dateSrc==='sample'?'예시 사진':'파일 날짜로 추정'}`})));
}
async function applyToAll(vals,filter){
  busy.on('사진에 적용하는 중'); const list=S.photos.filter(p=>!p.err&&(!filter||filter(p)));
  for(let i=0;i<list.length;i++){if(busy.cancelled)break;Object.assign(list[i].adj,vals);await refreshProc(list[i]);busy.set((i+1)/list.length,`${i+1} / ${list.length}장`);if(i%3===2)await yieldUI();}
  busy.off(); refreshAll(); toast(`${list.length}장에 적용했어요.`);
}

/* ============================== export panel ============================== */
function exportDims(){const sz=SIZES[S.book.size],bl=S.exp.bleed?3:0,pxmm=S.exp.dpi/25.4;return{sz,bl,W:Math.round(sz.w*pxmm),H:Math.round(sz.h*pxmm),b:Math.round(bl*pxmm)};}
function fileBase(){return(S.exp.name||bookTitle()).replace(/[\\/:*?"<>|]+/g,'').trim()||'우리북';}
function renderExportPanel(){
  segSet('#eDpi',S.exp.dpi); $('#eBleed').checked=S.exp.bleed; $('#eName').placeholder=bookTitle(); $('#eName').value=S.exp.name;
  const d=exportDims(),s=$('#eSpec'); s.textContent='';
  s.append(el('div',{},el('b',{text:`${d.sz.w/10}×${d.sz.h/10}cm · ${S.pages.length}쪽`}),` (표지 포함) · 사진 ${bookPhotos().length}장`),
    el('div',{text:`작업 크기 ${d.sz.w+2*d.bl}×${d.sz.h+2*d.bl}mm · 페이지당 ${d.W+2*d.b}×${d.H+2*d.b}px`}),
    el('div',{text:`예상 PDF 크기 약 ${Math.max(1,Math.round(S.pages.length*(d.W+2*d.b)*(d.H+2*d.b)*.00000032))}MB`}));
  const low=bookPhotos().filter(p=>{const w=whereIs(p.id);const v=w.i>0?slotDpi(p,w.i):null;return v!=null&&v<150;}).length;
  if(low)s.append(el('div',{class:'status err',text:`지금 보이는 페이지 중 ${low}장은 크게 인쇄하면 흐릴 수 있어요 (150dpi 미만).`}));
}
function setupExportPanel(){
  $$('#eDpi button').forEach(b=>b.onclick=()=>{S.exp.dpi=+b.dataset.v;renderExportPanel();});
  $('#eBleed').onchange=e=>{S.exp.bleed=e.target.checked;renderExportPanel();};
  $('#eName').oninput=e=>{S.exp.name=e.target.value.trim();};
  $('#btnPdf').onclick=exportPDF; $('#btnZip').onclick=exportZip; $('#btnShelf').onclick=saveToShelf;
}

/* ============================== export ============================== */
/* the file is made first, then a tap on "공유" opens the iPhone share sheet (Safari only allows sharing right after a tap) */
let readyFile=null;
function offerFile(name,blob,note){
  readyFile=new File([blob],name,{type:blob.type||'application/octet-stream'});
  let canShare=false; try{canShare=!!(navigator.canShare&&navigator.canShare({files:[readyFile]}));}catch(e){}
  $('#readyTitle').textContent=name; $('#readyBody').textContent=`${(blob.size/1048576).toFixed(1)}MB`+(note?` · ${note}`:'');
  $('#readyShare').textContent=canShare?'공유 · 파일에 저장':'내려받기';
  $('#readyHint').textContent=canShare?'공유 창에서 ‘파일에 저장’, 카카오톡, AirDrop, 프린트를 고를 수 있어요.':'다운로드 폴더에 저장돼요.';
  $('#ready').hidden=false; $('#readyShare').focus();
}
async function shareReady(){
  const f=readyFile; if(!f)return;
  let canShare=false; try{canShare=!!(navigator.canShare&&navigator.canShare({files:[f]}));}catch(e){}
  if(canShare){
    try{await navigator.share({files:[f],title:f.name});$('#ready').hidden=true;toast('보냈어요.');return;}
    catch(e){if(e&&e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(f),a=el('a',{href:url,download:f.name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  $('#ready').hidden=true; toast(`내려받았어요: ${f.name}`);
}
let pdfLibP=null;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=()=>res();s.onerror=()=>rej(new Error('script'));document.head.appendChild(s);});}
function loadPdfLib(){if(window.PDFLib)return Promise.resolve(window.PDFLib);if(!pdfLibP)pdfLibP=loadScript('vendor/pdf-lib.min.js').then(()=>{if(!window.PDFLib)throw new Error('pdf-lib');return window.PDFLib;}).catch(e=>{pdfLibP=null;throw e;});return pdfLibP;}
async function renderExportPage(i,d,withBleed){
  const b=withBleed?d.b:0,cv=mkCanvas(d.W+2*b,d.H+2*b),ctx=cv.getContext('2d'); ctx.translate(b,b);
  await renderPage(ctx,S.pages[i],d.W,d.H,{export:true,bleed:b,side:sideOf(i),pageNo:(i===0||i===S.pages.length-1)?null:i});
  const blob=await toBlob(cv,'image/jpeg',.92); cv.width=cv.height=1; return blob;
}
async function exportPDF(){
  const st=$('#eStatus'); st.className='status'; st.textContent='';
  let PDFLib; try{PDFLib=await loadPdfLib();}catch(e){st.className='status err';st.textContent='PDF 도구를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.';return;}
  const d=exportDims(),pt=72/25.4; await ensureFonts(curTheme(),bookText());
  busy.on('인쇄용 PDF 만드는 중');
  try{
    const doc=await PDFLib.PDFDocument.create(); doc.setTitle(bookTitle()); doc.setCreator('우리북'); doc.setProducer('우리북');
    const pw=(d.sz.w+2*d.bl)*pt,ph=(d.sz.h+2*d.bl)*pt;
    for(let i=0;i<S.pages.length;i++){
      if(busy.cancelled)break; busy.set(i/S.pages.length,`${i+1} / ${S.pages.length}쪽 그리는 중`);
      const bytes=new Uint8Array(await(await renderExportPage(i,d,true)).arrayBuffer());
      const img=await doc.embedJpg(bytes); const page=doc.addPage([pw,ph]); page.drawImage(img,{x:0,y:0,width:pw,height:ph});
      if(d.bl){page.setBleedBox(0,0,pw,ph);page.setTrimBox(d.bl*pt,d.bl*pt,d.sz.w*pt,d.sz.h*pt);}
      await yieldUI();
    }
    if(busy.cancelled){busy.off();toast('PDF 만들기를 취소했어요.');return;}
    busy.set(1,'파일로 묶는 중'); const out=await doc.save(); busy.off();
    st.className='status ok';st.textContent=`${S.pages.length}쪽 PDF가 준비됐어요 (${(out.byteLength/1048576).toFixed(1)}MB).`;
    offerFile(`${fileBase()}.pdf`,new Blob([out],{type:'application/pdf'}),`${S.pages.length}쪽 · ${S.exp.dpi}dpi`);
  }catch(e){busy.off();st.className='status err';st.textContent='PDF를 만들다 멈췄어요. 화질을 ‘고화질 200dpi’로 낮춰 다시 해 보세요.';console.error(e);}
}
const CRC_T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC_T[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function zipBlob(files){
  const parts=[],central=[];let off=0;const enc=new TextEncoder();const now=new Date();
  const dt=((now.getHours()<<11)|(now.getMinutes()<<5)|(now.getSeconds()>>1))&0xFFFF,dd=(((now.getFullYear()-1980)<<9)|((now.getMonth()+1)<<5)|now.getDate())&0xFFFF;
  for(const f of files){const name=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length;
    const lh=new DataView(new ArrayBuffer(30));lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(10,dt,true);lh.setUint16(12,dd,true);lh.setUint32(14,crc,true);lh.setUint32(18,sz,true);lh.setUint32(22,sz,true);lh.setUint16(26,name.length,true);
    parts.push(lh.buffer,name,f.data);
    const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(12,dt,true);ch.setUint16(14,dd,true);ch.setUint32(16,crc,true);ch.setUint32(20,sz,true);ch.setUint32(24,sz,true);ch.setUint16(28,name.length,true);ch.setUint32(42,off,true);
    central.push(ch.buffer,name); off+=30+name.length+sz;}
  const cdSize=central.reduce((s,x)=>s+(x.byteLength||x.length),0);
  const end=new DataView(new ArrayBuffer(22));end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cdSize,true);end.setUint32(16,off,true);
  return new Blob([...parts,...central,end.buffer],{type:'application/zip'});
}
async function exportZip(){
  const st=$('#eStatus'); st.className='status'; st.textContent=''; const d=exportDims(); await ensureFonts(curTheme(),bookText());
  busy.on('페이지 이미지 만드는 중'); const files=[];
  try{
    for(let i=0;i<S.pages.length;i++){if(busy.cancelled)break;busy.set(i/S.pages.length,`${i+1} / ${S.pages.length}쪽`);
      const name=i===0?'000_앞표지.jpg':i===S.pages.length-1?`${String(i).padStart(3,'0')}_뒤표지.jpg`:`${String(i).padStart(3,'0')}.jpg`;
      files.push({name,data:new Uint8Array(await(await renderExportPage(i,d,true)).arrayBuffer())}); await yieldUI();}
    if(busy.cancelled){busy.off();toast('취소했어요.');return;}
    busy.set(1,'ZIP으로 묶는 중'); const z=zipBlob(files); busy.off();
    st.className='status ok';st.textContent=`${files.length}장의 페이지 이미지가 준비됐어요.`; offerFile(`${fileBase()}_페이지.zip`,z,`페이지 이미지 ${files.length}장`);
  }catch(e){busy.off();st.className='status err';st.textContent='이미지를 만들다 멈췄어요. 화질을 낮춰 다시 해 보세요.';console.error(e);}
}

/* ============================== my bookshelf (kept on this phone) ============================== */
const shelfDB=mkStore('uribook-shelf');
const shelfURLs=new Map();
function blobURL(key,blob){if(shelfURLs.has(key))return shelfURLs.get(key);const u=URL.createObjectURL(blob);shelfURLs.set(key,u);return u;}
function dropURLs(prefix){for(const[k,u]of shelfURLs)if(k.startsWith(prefix)){URL.revokeObjectURL(u);shelfURLs.delete(k);}}
async function loadShelf(){
  if(!shelfDB.ok){S.shelfState='none';renderShelf();return;}
  try{S.shelf=(await shelfDB.get('index'))||[];S.shelfState='ready';}catch(e){S.shelf=[];S.shelfState=shelfDB.ok?'error':'none';}
  renderShelf();
}
function renderShelf(){
  const body=$('#shelfBody'); body.textContent=''; $('#shelfCount').textContent=S.shelf.length?String(S.shelf.length):'';
  const msg={none:'이 브라우저에서는 책장을 쓸 수 없어요. 완성한 책은 PDF로 저장해 두세요.',loading:'책장을 여는 중이에요.',error:'책장을 열지 못했어요. 앱을 다시 열어 주세요.'}[S.shelfState];
  if(msg){body.append(el('div',{class:'empty',text:msg}));return;}
  if(!S.shelf.length){body.append(el('div',{class:'empty',text:'아직 보관한 책이 없어요. ‘책 만들기 → 완성’에서 ‘내 책장에 보관’을 누르면 여기에 꽂혀요.'}));return;}
  const g=el('div',{class:'books'});
  for(const bk of S.shelf){
    const img=el('img',{alt:''}); shelfDB.get('cover:'+bk.id).then(b=>{if(b)img.src=blobURL('cover:'+bk.id,b);}).catch(()=>{});
    g.append(el('button',{class:'book',type:'button',onclick:()=>openViewer(bk)},el('div',{class:'cv',style:`aspect-ratio:${(bk.w||200)/(bk.h||200)}`},img),
      el('b',{text:bk.title||'제목 없는 책'}),el('small',{text:`${bk.period||''} · ${bk.pages}쪽`})));
  }
  body.append(g);
}
async function saveToShelf(){
  const s=$('#sStatus'); s.className='status';
  if(!shelfDB.ok){s.className='status err';s.textContent='이 브라우저에서는 책장에 보관할 수 없어요. PDF로 저장해 두세요.';return;}
  await ensureFonts(curTheme(),bookText()); const sz=SIZES[S.book.size],k=1600/Math.max(sz.w,sz.h),W=Math.round(sz.w*k),H=Math.round(sz.h*k);
  const id=uid('b'),n=S.pages.length; busy.on('내 책장에 보관하는 중'); let done=0;
  try{
    for(let i=0;i<n;i++){
      if(busy.cancelled)throw{code:'cancelled'}; busy.set(i/n,`${i+1} / ${n}쪽`);
      const cv=mkCanvas(W,H),ctx=cv.getContext('2d'); await renderPage(ctx,S.pages[i],W,H,{export:true,side:sideOf(i),pageNo:(i===0||i===n-1)?null:i});
      const blob=await toBlob(cv,'image/jpeg',.86); await shelfDB.put(`page:${id}:${i}`,blob); done=i+1;
      if(i===0){const c2=shrinkTo(cv,Math.round(W*.4),Math.round(H*.4));await shelfDB.put('cover:'+id,await toBlob(c2,'image/jpeg',.85));c2.width=c2.height=1;}
      cv.width=cv.height=1; await yieldUI();
    }
    const sp=dateSpan(bookPhotos());
    const meta={id,title:bookTitle(),subtitle:bookSubtitle(),period:sp?`${fmtDot(sp[0])} – ${fmtDot(sp[1])}`:'',w:sz.w,h:sz.h,theme:curTheme().name,pages:n,photoCount:bookPhotos().length,createdAt:new Date().toISOString()};
    S.shelf=[meta,...S.shelf]; await shelfDB.put('index',S.shelf); busy.off(); renderShelf();
    s.className='status ok'; s.textContent=`‘${meta.title}’을 내 책장에 보관했어요.`; toast('내 책장에 보관했어요.','',{label:'책장 보기',fn:()=>showView('shelf')});
  }catch(e){
    busy.off(); for(let i=0;i<done;i++)try{await shelfDB.del(`page:${id}:${i}`);}catch(_){} try{await shelfDB.del('cover:'+id);}catch(_){}
    s.className='status err'; s.textContent=e&&e.code==='cancelled'?'보관을 취소했어요.':'휴대폰 저장 공간이 부족해 보관하지 못했어요. 오래된 책을 지우거나 PDF로 저장해 두세요.';
  }
}
let viewerState=null;
function viewerSpreads(n){if(isNarrow())return[...Array(n).keys()].map(i=>[i]);const sp=[[0]];for(let i=1;i<n-1;i+=2)sp.push(i+1<n-1?[i,i+1]:[i]);if(n>1)sp.push([n-1]);return sp;}
function openViewer(bk){viewerState={bk,sp:viewerSpreads(bk.pages),i:0};$('#vTitle').textContent=bk.title||'';$('#viewer').hidden=false;paintViewer();}
async function paintViewer(){
  const st=viewerState; if(!st)return; const{bk,sp,i}=st,box=$('#vPages'),n=bk.pages; box.textContent=''; box.className='viewer-pages'+(sp[i].length===1?' single':'');
  dropURLs('vpage:');
  for(const k of sp[i]){const img=el('img',{alt:`${k}쪽`});box.append(img);shelfDB.get(`page:${bk.id}:${k}`).then(b=>{if(b&&viewerState===st)img.src=blobURL(`vpage:${k}`,b);}).catch(()=>{});}
  $('#vFoot').textContent=`${sp[i][0]===0?'앞표지':sp[i][0]===n-1?'뒤표지':sp[i].join('–')+'쪽'} · ${i+1} / ${sp.length}`; $('#vPrev').disabled=i<=0; $('#vNext').disabled=i>=sp.length-1;
}
function closeViewer(){$('#viewer').hidden=true;viewerState=null;dropURLs('vpage:');}
function setupViewer(){
  const go=d=>{if(!viewerState)return;const n=viewerState.i+d;if(n>=0&&n<viewerState.sp.length){viewerState.i=n;paintViewer();}};
  $('#vPrev').onclick=()=>go(-1); $('#vNext').onclick=()=>go(1); $('#vClose').onclick=closeViewer;
  let sx=null; $('#vStage').addEventListener('pointerdown',e=>{sx={x:e.clientX,y:e.clientY};}); $('#vStage').addEventListener('pointerup',e=>{if(!sx)return;const dx=e.clientX-sx.x,dy=e.clientY-sx.y;sx=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)go(dx<0?1:-1);});
  document.addEventListener('keydown',e=>{if($('#viewer').hidden||!viewerState)return;if(e.key==='Escape')closeViewer();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);});
  $('#vPdf').onclick=async()=>{const bk=viewerState.bk;let PDFLib;try{PDFLib=await loadPdfLib();}catch(e){toast('PDF 도구를 불러오지 못했어요.','err');return;}
    busy.on('PDF로 묶는 중');try{const doc=await PDFLib.PDFDocument.create();doc.setTitle(bk.title||'');doc.setCreator('우리북');const pt=72/25.4,pw=(bk.w||200)*pt,ph=(bk.h||200)*pt;
      for(let i=0;i<bk.pages;i++){if(busy.cancelled)break;busy.set(i/bk.pages,`${i+1} / ${bk.pages}쪽`);const b=await shelfDB.get(`page:${bk.id}:${i}`);if(!b)throw new Error('missing');const img=await doc.embedJpg(new Uint8Array(await b.arrayBuffer()));doc.addPage([pw,ph]).drawImage(img,{x:0,y:0,width:pw,height:ph});}
      if(busy.cancelled){busy.off();return;}const out=await doc.save();busy.off();offerFile(`${(bk.title||'우리북').replace(/[\\/:*?"<>|]+/g,'')}.pdf`,new Blob([out],{type:'application/pdf'}),`${bk.pages}쪽 · 보기용 화질`);}
    catch(e){busy.off();toast('PDF를 만들지 못했어요. 잠시 뒤 다시 해 보세요.','err');}};
  $('#vDel').onclick=async()=>{const bk=viewerState.bk;if(!await confirmBox('책장에서 지울까요?',`‘${bk.title}’을 이 휴대폰의 책장에서 지워요. 되돌릴 수 없어요.`,'지우기'))return;
    try{for(let i=0;i<bk.pages;i++)await shelfDB.del(`page:${bk.id}:${i}`);await shelfDB.del('cover:'+bk.id);dropURLs('cover:'+bk.id);S.shelf=S.shelf.filter(b=>b.id!==bk.id);await shelfDB.put('index',S.shelf);closeViewer();renderShelf();toast('책장에서 지웠어요.');}catch(e){toast('지우지 못했어요.','err');}};
}
function showView(v){const shelf=v==='shelf';$('#viewMake').hidden=shelf;$('#viewShelf').hidden=!shelf;$('#vMake').setAttribute('aria-selected',String(!shelf));$('#vShelf').setAttribute('aria-selected',String(shelf));$('#notices').hidden=shelf;try{if(location.hash!=='#'+v)history.replaceState(null,'','#'+v);}catch(_){}if(!shelf)requestRender();}

/* ============================== busy / dialog / toast ============================== */
const busy={cancelled:false,on(t){this.cancelled=false;$('#busyTitle').textContent=t;$('#busyFill').style.width='0%';$('#busyText').textContent='';$('#busyCancel').disabled=false;$('#busy').hidden=false;},set(p,t){$('#busyFill').style.width=Math.round(p*100)+'%';if(t!=null)$('#busyText').textContent=t;},off(){$('#busy').hidden=true;}};
function confirmBox(title,body,yes){return new Promise(res=>{$('#dlgTitle').textContent=title;$('#dlgBody').textContent=body;$('#dlgYes').textContent=yes||'확인';$('#dialog').hidden=false;const done=v=>{$('#dialog').hidden=true;$('#dlgYes').onclick=$('#dlgNo').onclick=null;res(v);};$('#dlgYes').onclick=()=>done(true);$('#dlgNo').onclick=()=>done(false);$('#dlgYes').focus();});}
function toast(msg,kind,action){const t=el('div',{class:'toast'+(kind==='err'?' err':''),role:'status'},el('span',{text:msg}));if(action)t.append(el('button',{type:'button',text:action.label,onclick:()=>{action.fn();t.remove();}}));const box=$('#toasts');box.append(t);while(box.children.length>3)box.firstChild.remove();setTimeout(()=>t.remove(),action?8000:4200);}

/* ============================== photos in ============================== */
async function ingest(file,opt={}){
  let date=opt.date||null,dateSrc=opt.dateSrc||(opt.date?'sample':'file');
  if(!date){const d=await readExifDate(file);if(d){date=d;dateSrc='exif';}}
  if(!date)date=new Date(file.lastModified||Date.now());
  const o=await blobToImage(file); const sc=Math.min(1,PREV/Math.max(o.w,o.h));
  const cv=mkCanvas(o.w*sc,o.h*sc),cx=cv.getContext('2d',{willReadFrequently:true}); cx.imageSmoothingQuality='high'; cx.drawImage(o.img,0,0,cv.width,cv.height); URL.revokeObjectURL(o.url);
  const id=cx.getImageData(0,0,cv.width,cv.height); const stats=analyze(id),hash=dhash(cv);
  const boxes=opt.boxes!==undefined?(opt.boxes||[]):await detectFaces(cv,id);
  const base=await blobToImage(await toBlob(cv,'image/jpeg',.92)); cv.width=cv.height=1;
  const adj=defAdj(S.book.autoEnhance); if(boxes.length){adj.autoFocus=true;if(S.book.faceAuto)Object.assign(adj,{skin:RETOUCH.natural.skin,skinBright:RETOUCH.natural.skinBright,skinRed:RETOUCH.natural.skinRed});}
  const p={id:opt.id||uid('p'),name:opt.name||file.name||'사진',file,sample:!!opt.sample,date,dateSrc,w:o.w,h:o.h,base,proc:null,live:null,stats,score:stats.score+(boxes.length?.25:0),hash,boxes,adj,excluded:false,forceIn:false,dup:false};
  if(!opt.skipProc)await refreshProc(p); return p;
}
async function addFiles(fileList){
  const files=[...fileList].filter(f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp|gif|heic|heif|avif)$/i.test(f.name)).slice(0,600);
  if(!files.length){toast('사진 파일을 찾지 못했어요.','err');return;}
  const replacing=S.sample; busy.on('사진 읽는 중'); const added=[],failed=[];
  for(let i=0;i<files.length;i++){if(busy.cancelled)break;busy.set(i/files.length,`${i+1} / ${files.length}장 · 날짜 읽고, 얼굴 찾고, 보정하는 중`);
    try{added.push(await ingest(files[i]));}catch(e){failed.push(files[i].name);} if(i%3===2)await yieldUI();}
  busy.off();
  if(!added.length){toast(failed.some(n=>/\.hei[cf]$/i.test(n))?'HEIC 사진은 이 브라우저에서 열 수 없어요. 아이폰 설정 > 카메라 > 포맷에서 ‘높은 호환성’을 고르거나 JPG로 바꿔 넣어 주세요.':'사진을 읽지 못했어요.','err');return;}
  if(replacing){for(const p of S.photos){dropImage(p.base);dropImage(p.proc);}S.photos=[];S.sample=false;$('#sampleNotice').hidden=true;$('#resumeNotice').hidden=true;S.book.title='';S.book.subtitle='';savedFiles.clear();try{await store.clear();}catch(e){}}
  S.photos.push(...added); reindex();
  if(replacing){const sp=dateSpan(added),month=sp&&(sp[1]-sp[0])<45*864e5;S.book.mode=month?'month':'year';if(S.book.concept==='family-year'&&month){S.book.concept='month';S.book.theme='polaroid';}else if(S.book.concept==='month'&&!month){S.book.concept='family-year';S.book.theme='linen';}}
  dedupe(); rebuild(); S.spread=0; S.selPage=0; S.selPhoto=null; refreshAll(true); renderStrip(true); resetHistory();
  const nf=added.filter(hasFace).length;
  toast(`사진 ${added.length}장으로 ${S.pages.length}쪽짜리 책을 만들었어요.`+(nf&&S.book.faceAuto?` 인물 사진 ${nf}장은 피부를 다듬었어요.`:'')+(failed.length?` ${failed.length}장은 열 수 없어 뺐어요.`:''));
}
function setupPhotosPanel(){
  $('#fileIn').onchange=e=>{const f=e.target.files;if(f&&f.length)addFiles(f);e.target.value='';};
  const drop=$('#drop');['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over');}));
  ['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over');}));
  drop.addEventListener('drop',e=>{if(e.dataTransfer&&e.dataTransfer.files.length)addFiles(e.dataTransfer.files);});
  $('#spreadWrap').addEventListener('dragover',e=>e.preventDefault()); $('#spreadWrap').addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer&&e.dataTransfer.files.length)addFiles(e.dataTransfer.files);});
  const reprocessAll=async(title,fn,filter)=>{busy.on(title);const list=S.photos.filter(p=>!p.err&&(!filter||filter(p)));for(let i=0;i<list.length;i++){fn(list[i]);await refreshProc(list[i]);busy.set((i+1)/list.length,`${i+1} / ${list.length}장`);if(i%3===2)await yieldUI();}busy.off();refreshAll();};
  $('#optAuto').onchange=e=>{S.book.autoEnhance=e.target.checked;reprocessAll(e.target.checked?'자동 보정 켜는 중':'자동 보정 끄는 중',p=>{p.adj.auto=S.book.autoEnhance;});};
  $('#optFace').onchange=e=>{S.book.faceAuto=e.target.checked;const v=e.target.checked?RETOUCH.natural:RETOUCH.off;reprocessAll(e.target.checked?'인물 보정 켜는 중':'인물 보정 끄는 중',p=>{p.adj.skin=v.skin;p.adj.skinBright=v.skinBright;p.adj.skinRed=v.skinRed;p.adj.autoFocus=e.target.checked;},hasFace);};
  $('#optDedupe').onchange=e=>{S.book.dedupe=e.target.checked;afterPhotoSetChange();};
  $('#btnRebuild').onclick=async()=>{if(!await confirmBox('페이지를 처음부터 다시 짤까요?','직접 바꾼 배치와 페이지 순서가 새로 짜여요. 사진 보정값과 설명은 남고, 되돌리기로 이전 상태로 돌아갈 수 있어요.','다시 짜기'))return;const caps=new Map(S.pages.filter(p=>p.caption).map(p=>[p.photos[0],p.caption]));rebuild();for(const pg of S.pages)if(pg.kind==='photos'){const c=pg.photos.map(id=>caps.get(id)).find(Boolean);if(c)pg.caption=c;}refreshAll();renderStrip(true);};
}

/* ============================== sample photos (drawn, clearly marked as examples) ============================== */
function drawScene(kind,w,h,rng){
  const c=mkCanvas(w,h),x=c.getContext('2d');
  const sky=(a,b,f)=>{const g=x.createLinearGradient(0,0,0,h*f);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,w,h*f+2);};
  const hills=(y0,amp,col,s)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,h);x.lineTo(0,y0);for(let i=0;i<=10;i++){x.lineTo(i/10*w,y0-amp*(.45+.55*Math.sin(i*1.7+s)*Math.cos(i*.6+s*2)));}x.lineTo(w,h);x.closePath();x.fill();};
  const person=(px,py,s,col)=>{x.fillStyle=col;x.beginPath();x.arc(px,py-s*1.6,s*.33,0,7);x.fill();roundRectPath(x,px-s*.4,py-s*1.22,s*.8,s*1.22,s*.3);x.fill();};
  const disc=(px,py,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,7);x.fill();};
  const glow=(px,py,r,col)=>{const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);};
  const face=(cx,cy,fr,hair,shirt)=>{
    x.fillStyle=shirt;roundRectPath(x,cx-fr*1.9,cy+fr*1.15,fr*3.8,fr*3,fr*1.2);x.fill();x.fillStyle='#D9A17F';x.fillRect(cx-fr*.35,cy+fr*.7,fr*.7,fr*.6);
    x.fillStyle=hair;x.beginPath();x.ellipse(cx,cy-fr*.18,fr*1.12,fr*1.18,0,0,7);x.fill();
    x.fillStyle='#E6B494';x.beginPath();x.ellipse(cx,cy+fr*.08,fr*.86,fr*1.02,0,0,7);x.fill();
    for(let i=0;i<300;i++){const a=rng()*6.3,rr=Math.sqrt(rng())*fr*.8;x.fillStyle=rng()<.6?'rgba(170,95,70,.22)':'rgba(255,225,205,.25)';x.beginPath();x.arc(cx+Math.cos(a)*rr,cy+fr*.1+Math.sin(a)*rr*1.15,fr*(.012+rng()*.03),0,7);x.fill();}
    x.fillStyle='rgba(225,110,100,.3)';x.beginPath();x.ellipse(cx-fr*.45,cy+fr*.35,fr*.2,fr*.13,0,0,7);x.fill();x.beginPath();x.ellipse(cx+fr*.45,cy+fr*.35,fr*.2,fr*.13,0,0,7);x.fill();
    x.fillStyle=hair;x.beginPath();x.ellipse(cx,cy-fr*.72,fr*.95,fr*.42,0,Math.PI,2*Math.PI);x.fill();
    x.fillStyle='#2A1E1A';x.beginPath();x.ellipse(cx-fr*.32,cy-fr*.02,fr*.08,fr*.11,0,0,7);x.fill();x.beginPath();x.ellipse(cx+fr*.32,cy-fr*.02,fr*.08,fr*.11,0,0,7);x.fill();
    x.strokeStyle='#A8524A';x.lineWidth=fr*.06;x.lineCap='round';x.beginPath();x.arc(cx,cy+fr*.38,fr*.24,.2*Math.PI,.8*Math.PI);x.stroke();
  };
  if(kind==='portrait'){const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#9EC3D9');g.addColorStop(1,'#E4EEF2');x.fillStyle=g;x.fillRect(0,0,w,h);for(let i=0;i<10;i++)disc(rng()*w,rng()*h*.5,h*(.04+rng()*.06),'rgba(255,255,255,.25)');face(w*.5,h*.4,Math.min(w,h)*.2,'#3A2A22','#F2B84B');}
  else if(kind==='family'){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#BFD6E4');g.addColorStop(1,'#93B3C8');x.fillStyle=g;x.fillRect(0,0,w,h);for(let i=0;i<14;i++)glow(rng()*w,rng()*h*.6,h*.08,'rgba(255,255,255,.45)');const fr=Math.min(w,h)*.12;face(w*.3,h*.42,fr*1.05,'#2B201C','#5B7DB1');face(w*.7,h*.4,fr*1.1,'#1E1715','#C9584A');face(w*.5,h*.6,fr*.8,'#3B2A20','#7FB685');}
  else if(kind==='beach'){sky('#7FB6E6','#F7D9B4',.56);glow(w*.7,h*.5,h*.3,'rgba(255,236,190,.9)');disc(w*.7,h*.5,h*.06,'#FFF1C9');const g=x.createLinearGradient(0,h*.55,0,h*.8);g.addColorStop(0,'#2E7FA6');g.addColorStop(1,'#6CB6D2');x.fillStyle=g;x.fillRect(0,h*.55,w,h*.26);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=h*.004;for(let i=0;i<9;i++){const yy=h*(.6+i*.024);x.beginPath();x.moveTo(rng()*w*.3,yy);x.lineTo(w*.4+rng()*w*.6,yy);x.stroke();}x.fillStyle='#E9D3A8';x.fillRect(0,h*.8,w,h*.2);person(w*.36,h*.92,h*.11,'#2A3440');person(w*.45,h*.94,h*.075,'#C0503A');}
  else if(kind==='snow'){sky('#A9C4DD','#E8EEF4',.62);hills(h*.56,h*.26,'#F4F7FA',1.3);hills(h*.68,h*.12,'#DCE6EF',2.2);x.fillStyle='#F7F9FB';x.fillRect(0,h*.78,w,h*.22);for(let i=0;i<6;i++){const tx=w*(.08+i*.17+rng()*.04),ty=h*.8;x.fillStyle='#2F5240';x.beginPath();x.moveTo(tx,ty-h*.2);x.lineTo(tx-h*.06,ty);x.lineTo(tx+h*.06,ty);x.closePath();x.fill();}person(w*.55,h*.92,h*.1,'#E07A3C');for(let i=0;i<140;i++)disc(rng()*w,rng()*h,h*(.002+rng()*.004),'rgba(255,255,255,.85)');}
  else if(kind==='blossom'){sky('#BFD9F0','#F3E6EE',.74);x.fillStyle='#9CC48A';x.fillRect(0,h*.74,w,h*.26);x.fillStyle='#6B4A3A';x.fillRect(w*.47,h*.42,w*.05,h*.34);for(let i=0;i<70;i++)disc(w*(.5+(rng()-.5)*.62),h*(.32+(rng()-.5)*.36),h*(.03+rng()*.05),['#F4B6C9','#F9CFDC','#EFA1BA'][i%3]);for(let i=0;i<30;i++)disc(rng()*w,h*(.6+rng()*.4),h*.006,'#F7C3CF');person(w*.3,h*.95,h*.11,'#3C4A6B');}
  else if(kind==='balloon'){sky('#5EA8E8','#CDE6F7',1);for(let i=0;i<5;i++){const cx=w*(.15+rng()*.7),cy=h*(.1+rng()*.25);for(let k=0;k<5;k++)disc(cx+(k-2)*h*.04,cy+Math.sin(k)*h*.015,h*.05,'rgba(255,255,255,.85)');}const cols=['#E8505B','#F9D56E','#14B1AB','#8C7AE6','#F38181','#3F72AF','#FF9A3C'];for(let i=0;i<7;i++){const bx=w*(.2+rng()*.6),by=h*(.3+rng()*.35),r=h*(.05+rng()*.03);x.strokeStyle='rgba(60,60,60,.5)';x.lineWidth=h*.002;x.beginPath();x.moveTo(bx,by+r*1.2);x.quadraticCurveTo(bx+r*.5,by+r*2.5,bx,h*.95);x.stroke();x.fillStyle=cols[i];x.beginPath();x.ellipse(bx,by,r,r*1.2,0,0,7);x.fill();disc(bx-r*.35,by-r*.4,r*.18,'rgba(255,255,255,.5)');}}
  else if(kind==='autumn'){sky('#F2C998','#F7E5C8',.6);hills(h*.62,h*.1,'#C9A36B',.7);x.fillStyle='#B8925A';x.fillRect(0,h*.68,w,h*.32);x.fillStyle='#9E8466';x.beginPath();x.moveTo(w*.45,h*.68);x.lineTo(w*.55,h*.68);x.lineTo(w*.8,h);x.lineTo(w*.2,h);x.closePath();x.fill();for(let t=0;t<6;t++){const tx=w*(.06+t*.18),ty=h*.7;x.fillStyle='#5A3B26';x.fillRect(tx-h*.012,ty-h*.22,h*.024,h*.22);for(let i=0;i<14;i++)disc(tx+(rng()-.5)*h*.2,ty-h*(.25+rng()*.15),h*(.03+rng()*.04),['#D9822B','#C8553D','#E3B23C','#B8442F'][i%4]);}person(w*.5,h*.93,h*.1,'#304A5E');}
  else if(kind==='night'){sky('#0E1A3A','#2A3B6B',1);for(let i=0;i<80;i++)disc(rng()*w,rng()*h*.5,h*.002,'rgba(255,255,255,.8)');glow(w*.8,h*.18,h*.12,'rgba(255,250,220,.5)');disc(w*.8,h*.18,h*.045,'#FFF8DC');for(let i=0;i<14;i++){const bw=w*(.05+rng()*.06),bh=h*(.2+rng()*.4),bx=i/14*w,by=h-bh;x.fillStyle='#141C30';x.fillRect(bx,by,bw,bh);for(let k=0;k<26;k++){if(rng()<.55){x.fillStyle='#F7D27A';x.fillRect(bx+rng()*(bw-h*.012),by+rng()*(bh-h*.02),h*.01,h*.014);}}}}
  else if(kind==='cake'){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#4A2C1E');g.addColorStop(1,'#8C5A36');x.fillStyle=g;x.fillRect(0,0,w,h);for(let i=0;i<24;i++)disc(rng()*w,rng()*h*.6,h*(.02+rng()*.04),'rgba(255,205,140,.18)');x.fillStyle='#6B3E26';x.fillRect(0,h*.7,w,h*.3);x.fillStyle='#F4F1EC';x.beginPath();x.ellipse(w*.5,h*.72,w*.26,h*.05,0,0,7);x.fill();x.fillStyle='#F6E6D3';x.fillRect(w*.32,h*.5,w*.36,h*.21);x.fillStyle='#E9A6B2';x.fillRect(w*.32,h*.47,w*.36,h*.05);for(let i=0;i<5;i++){const cx=w*(.38+i*.06);x.fillStyle=['#5DA9E9','#F7B32B','#E8505B','#6CC57C','#A78BFA'][i];x.fillRect(cx-h*.006,h*.38,h*.012,h*.09);glow(cx,h*.36,h*.05,'rgba(255,210,120,.9)');x.fillStyle='#FFD36E';x.beginPath();x.ellipse(cx,h*.365,h*.008,h*.018,0,0,7);x.fill();}}
  else{sky('#7EC0EE','#DFF1FB',.62);const g=x.createLinearGradient(0,h*.6,0,h);g.addColorStop(0,'#7DBA5C');g.addColorStop(1,'#5E9C45');x.fillStyle=g;x.fillRect(0,h*.6,w,h*.4);disc(w*.15,h*.15,h*.06,'#FFE9A0');x.fillStyle='#4E3B2B';x.fillRect(w*.82,h*.38,h*.03,h*.25);for(let i=0;i<18;i++)disc(w*.82+(rng()-.5)*h*.24,h*(.33+rng()*.12),h*(.04+rng()*.03),'#3F7F3A');const kx=w*.55,ky=h*.25,ks=h*.07;x.fillStyle='#E8505B';x.beginPath();x.moveTo(kx,ky-ks);x.lineTo(kx+ks*.7,ky);x.lineTo(kx,ky+ks*1.2);x.lineTo(kx-ks*.7,ky);x.closePath();x.fill();x.strokeStyle='rgba(60,60,60,.6)';x.lineWidth=h*.002;x.beginPath();x.moveTo(kx,ky+ks*1.2);x.quadraticCurveTo(w*.5,h*.6,w*.42,h*.86);x.stroke();person(w*.42,h*.92,h*.1,'#E07A3C');person(w*.3,h*.93,h*.13,'#2A3440');}
  return c;
}
function degrade(c,kind){if(!kind)return;const x=c.getContext('2d',{willReadFrequently:true}),id=x.getImageData(0,0,c.width,c.height),d=id.data;for(let i=0;i<d.length;i+=4){let r=d[i],g=d[i+1],b=d[i+2];if(kind==='dark'){r*=.6;g*=.6;b*=.64;}else if(kind==='cool'){r*=.84;b=b*1.06+14;}else if(kind==='flat'){r=r*.6+72;g=g*.6+72;b=b*.6+72;}else if(kind==='warmdark'){r*=.82;g*=.66;b*=.52;}d[i]=r;d[i+1]=g;d[i+2]=b;}x.putImageData(id,0,0);}
async function loadSamples(){
  const Y=new Date().getFullYear(); const list=[
    ['snow',0,3,10,'l','dark'],['snow',0,3,11,'p'],['portrait',0,20,14,'p'],['night',1,14,20,'l'],['blossom',3,6,14,'l'],['blossom',3,6,15,'p','flat'],['family',3,6,16,'l'],['park',4,5,13,'l'],['balloon',4,5,15,'p'],
    ['beach',6,28,18,'l','cool'],['beach',6,29,10,'l'],['beach',6,29,12,'p'],['portrait',6,30,11,'p'],['park',7,15,16,'p','dark'],['autumn',9,12,11,'l'],['autumn',9,12,13,'p','flat'],['family',9,13,18,'l','dark'],['cake',10,2,19,'l','warmdark']];
  const out=[];
  for(let i=0;i<list.length;i++){const[k,m,d,hh,o,dg]=list[i];const rng=mulberry32(1000+i);const c=o==='l'?drawScene(k,1400,1050,rng):drawScene(k,1050,1400,rng);degrade(c,dg);
    const date=new Date(Y,m,d,hh,(i*7)%60); const blob=await toBlob(c,'image/jpeg',.9); c.width=c.height=1; const file=new File([blob],`예시-${i+1}.jpg`,{type:'image/jpeg',lastModified:+date});
    out.push(await ingest(file,{sample:true,date})); if(i%3===2)await yieldUI();}
  return out;
}

/* ============================== app shell ============================== */
function setupAppShell(){
  $('#readyShare').onclick=shareReady; $('#readyClose').onclick=()=>{$('#ready').hidden=true;};
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});}catch(e){}
  const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=window.navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches;
  let dismissed=false; try{dismissed=localStorage.getItem('uribook-install-hint')==='1';}catch(e){}
  if(ios&&!standalone&&!dismissed)$('#installNotice').hidden=false;
  $('#installClose').onclick=()=>{$('#installNotice').hidden=true;try{localStorage.setItem('uribook-install-hint','1');}catch(e){}requestRender();};
  if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
    const hadController=!!navigator.serviceWorker.controller; let reloading=false;
    navigator.serviceWorker.register('sw.js').then(reg=>{
      reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)toast('새 버전이 준비됐어요.','',{label:'업데이트',fn:()=>nw.postMessage('skip')});});});
    }).catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hadController||reloading)return;reloading=true;saveNow().finally(()=>location.reload());});
  }
}

/* ============================== init ============================== */
async function init(){
  S.single=isNarrow();
  $$('#tabs .tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
  $('#vMake').onclick=()=>showView('make'); $('#vShelf').onclick=()=>showView('shelf');
  window.addEventListener('hashchange',()=>showView(location.hash==='#shelf'?'shelf':'make'));
  $('#busyCancel').onclick=()=>{busy.cancelled=true;$('#busyCancel').disabled=true;$('#busyText').textContent='멈추는 중이에요';};
  $('#pickClose').onclick=()=>{$('#picker').hidden=true;}; $('#picker').addEventListener('click',e=>{if(e.target.id==='picker')$('#picker').hidden=true;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#picker').hidden)$('#picker').hidden=true;});
  setupStage(); setupBookPanel(); setupExportPanel(); setupPhotosPanel(); setupViewer();
  if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',debounce(()=>{requestRender();thumbsSoon();if(S.tab==='theme')renderThemePanel();},300));
  if(location.hash==='#shelf')showView('shelf');
  setupAppShell(); loadShelf();
  try{S.photos=await loadSamples();}catch(e){console.error(e);S.photos=[];}
  reindex(); dedupe(); rebuild(); S.selPage=0; S.ready=true; $('#sampleNotice').hidden=false;
  setTab('photos'); requestRender(); renderStrip(true); resetHistory(); checkResume();
}
init();
