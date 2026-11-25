
(function(){
 const NAV=[{sec:'MENU'},{e:'🏆',t:'KPI',p:7},{e:'🏬',t:'Visit Jabar',p:3},{e:'⏱️',t:'Waiting Time',p:4},
  {e:'📊',t:'tNPS',k:'tn',ch:[{e:'📱',t:'tNPS Mobile',p:1},{e:'🏠',t:'tNPS Fixed',p:11},{e:'📞',t:'FU tNPS Mobile',p:12},{e:'📞',t:'FU tNPS Fixed',p:16}]},
  {e:'🎫',t:'Tiket',k:'tk',ch:[{e:'📱',t:'Tiket Mobile',p:2},{e:'📡',t:'Tiket Fixed',p:6}]},
  {e:'🛡️',t:'CAPS',p:5},
  {e:'🧾',t:'Order',k:'or',ch:()=>[{t:'Semua Order',p:13,ot:'all',c:ORD.rows.length},...ORD.ty.map((x,i)=>({t:x,p:13,ot:i,c:ORD.rows.filter(r=>r[0]==i).length}))]},
  {e:'🧑‍💻',t:'Kawalan Admin CC',k:'ac',ch:()=>Object.keys(ACT).map(k=>({t:ACT[k][0].replace(/^create tiket$/,'Create Tiket'),p:14,as:k}))},
  {e:'🎬',t:'Roleplay',p:15}];
 const OPEN={};const nv=$('snav');
 const isOn=c=>st.p==c.p&&(c.ot===undefined||String(st.ot)==String(c.ot))&&(c.as===undefined||st.as==c.as);
 const go=c=>{showTab(c.p);if(c.ot!==undefined){st.ot=c.ot;renderOR()}if(c.as!==undefined){st.as=c.as;renderAC()}document.body.classList.remove('sno');window.scrollTo(0,0)};
 let ITEMS=[];
 function draw(){ITEMS=[];let h='<div class="lg"><span style="font-size:24px">📈</span><div><b class="mq">MONIQ</b><small>Monitoring by SQ Jabar</small></div></div>';
  NAV.forEach((n,i)=>{if(n.sec){h+=`<div class="sec">${n.sec}</div>`;return}
   if(!n.ch){ITEMS.push(n);h+=`<button class="it${isOn(n)?' on':''}" data-i="${ITEMS.length-1}"><span class="e">${n.e}</span>${n.t}</button>`;return}
   const ch=typeof n.ch=='function'?n.ch():n.ch,act=ch.some(isOn);if(act&&OPEN[n.k]===undefined)OPEN[n.k]=true;
   h+=`<div class="g${OPEN[n.k]?' op':''}${act?' act':''}"><button class="gh" data-k="${n.k}"><span class="e">${n.e}</span>${n.t}<span class="ar">▼</span></button><div class="sub">`+
    ch.map(c=>{ITEMS.push(c);return`<button class="it${isOn(c)?' on':''}" data-i="${ITEMS.length-1}">${c.e?`<span class="e">${c.e}</span>`:''}${c.t}${c.c!=null?`<span class="c">${c.c.toLocaleString('id-ID')}</span>`:''}</button>`}).join('')+'</div></div>'});
  const sc=nv.scrollTop;nv.innerHTML=h;nv.scrollTop=sc;
  nv.querySelectorAll('.it').forEach(b=>b.onclick=()=>go(ITEMS[+b.dataset.i]));
  nv.querySelectorAll('.gh').forEach(b=>b.onclick=()=>{const k=b.dataset.k;OPEN[k]=!b.parentElement.classList.contains('op');b.parentElement.classList.toggle('op',OPEN[k])});}
 window.navSync=draw;
 const s0=showTab;showTab=function(p){s0(p);try{draw()}catch(e){console.error(e)}};
 const r1=renderOR;renderOR=function(){r1.apply(this,arguments);try{draw()}catch(e){}};
 const r2=renderAC;renderAC=function(){r2.apply(this,arguments);try{draw()}catch(e){}};
 $('snb').onclick=()=>document.body.classList.toggle('sno');
 draw();
})();
