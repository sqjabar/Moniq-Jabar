
// rows: [branch,unit,nik,score,catClass,catIdx,month] month:0=bulan lalu,1=bulan ini
const R=D.rows,S=D.siad,CATS=D.cats,MN=D.mn;const ML=[31,30,31,30],DCUT=MN.map((m,i)=>{const d=Math.max(0,...R.filter(r=>r[6]==i).map(r=>r[9]));return d<ML[i]?d:99});
const EX={};
const st={m:2,b:'ALL',u:'ALL',s:'cs',sort:{t2:['n',-1],t3:['n',-1],t1:['n',-1],t4:['n',-1]}};
const $=i=>document.getElementById(i);
const cls=s=>s>=9?0:s>=7?1:2;
function ag(rs){let p=0,a=0,d=0;for(const r of rs){const c=cls(r[3]);c==0?p++:c==1?a++:d++}const n=rs.length;return{n,p,a,d,nps:n?(p-d)/n*100:null}}
const f1=v=>v==null?'–':v.toFixed(1);
const dv=(a,b)=>a==null||b==null?null:a-b;
const dl=v=>v==null?'–':`<span class="dl ${v>=0?'pos':'neg'}">${v>=0?'▲ +':'▼ '}${v.toFixed(1)}</span>`;
const isCur=r=>st.m=='all'||r[6]==st.m,isPrv=r=>st.m!='all'&&st.m>0&&r[6]==st.m-1&&r[9]<=DCUT[st.m];const pml=()=>{const c=DCUT[st.m],b=MN[st.m-1].replace(/\s*\(.*\)/,'');return c<ML[st.m-1]?b+' (1–'+c+')':MN[st.m-1]};
const lbl=()=>st.m=='all'?MN.join(' + '):MN[st.m];const mhp=()=>st.m!='all'&&st.m>0;
const inCS=r=>st.s=='all'||r[4]==0;
const CSL=()=>st.s=='all'?'All Respon':'Customer Service';
const base=()=>R.filter(r=>(st.b=='ALL'||r[0]==st.b)&&(st.u=='ALL'||r[1]==st.u));
function nb(v){if(v==null)return'';const c=v>=0?'var(--g)':'var(--r)';return`<span class="nb"><i style="background:${c};${v>=0?'left:50%':'right:50%'};width:${Math.abs(v)/2}%"></i></span>`}
function group(rs,keyf){const m=new Map();for(const r of rs){const k=keyf(r);if(!m.has(k))m.set(k,[]);m.get(k).push(r)}return m}
// metrik satu grup: bulan ini (a), bulan lalu (o), CS bulan ini (c), CS bulan lalu (co)
function met(rs){const cur=rs.filter(isCur),prv=rs.filter(isPrv);
 const a=ag(cur),o=ag(prv),c=ag(cur.filter(inCS)),co=ag(prv.filter(inCS));
 return{...a,ps:o.nps,po:o.n,mom:dv(a.nps,o.nps),cn:c.n,cnps:c.nps,cps:co.nps,cmom:dv(c.nps,co.nps),tot:rs.length,
 html:`<td>${a.n}</td><td>${a.p}</td><td>${a.a}</td><td>${a.d}</td><td>${nb(a.nps)}<b class="${a.nps>=0?'pos':'neg'}">${f1(a.nps)}</b></td><td>${f1(o.nps)}</td><td>${dl(dv(a.nps,o.nps))}</td><td>${c.n}</td><td>${f1(c.nps)}</td><td>${f1(co.nps)}</td><td>${dl(dv(c.nps,co.nps))}</td>`}}
const HC=[['Total','n'],['Promotor','p'],['Passive','a'],['Detractor','d'],['tNPS','nps'],['tNPS bln lalu','ps'],['MoM','mom'],['Resp CS','cn'],['tNPS CS','cnps'],['CS bln lalu','cps'],['MoM CS','cmom']];
function table(id,rows,cols,onclick,selKey){
  EX[id]={rows,cols};addXb(id);
  const [sk,sd]=st.sort[id]||['n',-1];
  rows.sort((x,y)=>{const a=x[sk],b=y[sk];if(typeof a=='string')return sd*a.localeCompare(b);return sd*((a??-1e9)-(b??-1e9))});
  let h='<table><thead><tr>'+cols.map(c=>`<th data-k="${c[1]}"${sk==c[1]?' data-s="1"':''} title="Klik untuk urutkan tertinggi ↔ terendah">${c[0]}${sk==c[1]?(sd>0?' ▲':' ▼'):''}</th>`).join('')+'</tr></thead><tbody>';
  for(const r of rows)h+=`<tr class="${onclick?'cl ':''}${selKey&&r.key==selKey?'sel':''}" data-key="${String(r.key).replace(/"/g,'&quot;')}">${r.html}</tr>`;
  $(id).innerHTML=h+'</tbody></table>';
  $(id).querySelectorAll('th').forEach(th=>th.onclick=e=>{e.stopPropagation();const k=th.dataset.k;const cur=st.sort[id]||['n',-1];st.sort[id]=[k,cur[0]==k?-cur[1]:(k=='name'||k=='br'?1:-1)];table(id,rows,cols,onclick,selKey)});
  if(onclick)$(id).querySelectorAll('tr.cl').forEach(tr=>tr.onclick=()=>onclick(tr.dataset.key));
}
function kpi(el,title,a,o,sub){
 const pc=x=>a.n?x/a.n*100:0,m=dv(a.nps,o.nps);
 $(el).innerHTML=`<div class="t">${title} · ${lbl()}</div><div class="v ${a.nps>=0?'pos':'neg'}">${f1(a.nps)} <span style="font-size:15px">${dl(m)} MoM</span></div>
 <div class="stack"><i style="width:${pc(a.p)}%;background:var(--g)"></i><i style="width:${pc(a.a)}%;background:var(--y)"></i><i style="width:${pc(a.d)}%;background:var(--r)"></i></div>
 <div class="lg"><span><span class="dot" style="background:var(--g)"></span>Promotor <b>${a.p}</b></span><span><span class="dot" style="background:var(--y)"></span>Passive <b>${a.a}</b></span><span><span class="dot" style="background:var(--r)"></span>Detractor <b>${a.d}</b></span><span>Total <b>${a.n}</b></span></div>
 <div class="note">${mhp()?`<b>${pml()}:</b> tNPS ${f1(o.nps)}`:(st.m==0?`MoM tidak tersedia (tidak ada data sebelum ${MN[0]})`:'MoM tidak berlaku untuk gabungan')}</div>`}
function render(){
 const b=base(),b1=b.filter(isCur),b0=b.filter(isPrv),bs=b.filter(r=>isCur(r)||isPrv(r));
 const pl=mhp()?pml():'bln lalu';HC[5][0]='tNPS '+pl;HC[9][0]=(st.s=='all'?'All':'CS')+' '+pl;HC[7][0]='Resp '+(st.s=='all'?'All':'CS');HC[8][0]='tNPS '+(st.s=='all'?'All':'CS');HC[10][0]='MoM '+(st.s=='all'?'All':'CS');
 kpi('k1','📊 tNPS Mobile – Jabar',ag(b1),ag(b0),'(P − D) ÷ total × 100');
 kpi('k2','🎧 tNPS '+CSL(),ag(b1.filter(inCS)),ag(b0.filter(inCS)),'');
 const ub=R.filter(r=>(isCur(r)||isPrv(r))&&(st.u=='ALL'||r[1]==st.u));
 let rows=[...group(ub,r=>r[0])].map(([k,rs])=>({key:k,name:k,...met(rs),html:`<td>${k}</td>`+(met(rs).html.match(/<td[^>]*>.*?<\/td>/gs)||[]).slice(0,7).join('')}));
 table('t1',rows,[['Jabar (branch)','name'],...HC.slice(0,7)],k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 const bb=R.filter(r=>(isCur(r)||isPrv(r))&&(st.b=='ALL'||r[0]==st.b));
 rows=[...group(bb,r=>r[1])].map(([k,rs])=>{const m=met(rs);return{key:k,name:k,br:rs[0][0],...m,html:`<td>${k}</td><td style="text-align:left">${rs[0][0]}</td>`+(m.html.match(/<td[^>]*>.*?<\/td>/gs)||[]).slice(0,7).join('')}});
 table('t2',rows,[['unit_name','name'],['Branch','br'],...HC.slice(0,7)],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 {const bc=b1;renderCat(bc);narr('nw',bc,'p');narr('nx',bc,'d');tanal('nw','p',b);tanal('nx','d',b)}
 $('t4h').textContent=st.s=='all'?'CSR All Respon':'CSR Respon Customer Service';
 const cmode=(arr=>{const c=new Map();arr.forEach(v=>c.set(v,(c.get(v)||0)+1));return[...c].sort((a,b)=>b[1]-a[1])[0][0]});
 const cg=[...group(bs.filter(inCS),r=>r[2])].map(([k,rs])=>{const m=met(rs),x=S[k],cr=rs.filter(isCur),un=cmode(rs.map(r=>r[1])),br=cmode(rs.map(r=>r[0]));return{key:k,name:(x?x[0]:(k=='NA'?'(tanpa NIK)':k)),unit:un,br,...m,html:`<td>${(x?x[0]:(k=='NA'?'(tanpa NIK)':k))}</td><td style="text-align:left">${un}</td><td style="text-align:left">${br}</td>`+(m.html.match(/<td>.*?<\/td>/g)||[]).slice(0,7).join('')}}).filter(r=>r.n>0&&S[r.key]&&!/^T0/i.test(r.key)&&!/^T0/i.test(r.name));
 table('t4',cg,[['Nama CSR','name'],['GraPARI','unit'],['Branch','br'],...HC.slice(0,7)]);
  renderT();if(st.p==3)renderV();if(st.p==4)renderW();if(st.p==5)renderCP();if(st.p==6)renderF();if(st.p==7)renderK();if(st.p==8)renderH();if(st.p==9)renderI();if(st.p==10)renderO();if(st.p==11)renderTF();
 $('meta').textContent=`Sumber: tNPS_Mobile_4.xlsx (${D.period}) · hanya baris dengan kolom Jabar terisi · ${b1.length} respon pada periode ${lbl()}${mhp()?' (dibanding '+pml()+')':''}`;
}
async function saveFile(name,blob){
 let dl=null;try{if(window.claude&&claude.use)dl=await claude.use('downloads')}catch(e){}
 if(dl){try{await dl.save({filename:name,data:blob})}catch(e){if(e&&e.code!='declined')alert('Unduhan gagal: '+(e.message||e.code))}return}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
async function exportXlsx(){
 if(typeof XLSX=='undefined'){alert('Library Excel belum termuat. Pastikan terhubung ke internet lalu muat ulang halaman.');return}
 const rd=v=>v==null?'':typeof v=='number'?Math.round(v*100)/100:v;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const b=base(),b1=b.filter(isCur),b0=b.filter(isPrv),sc=b.filter(r=>isCur(r)||isPrv(r));
 const k=(n,rs)=>{const a=ag(rs);return[n,a.n,a.p,a.a,a.d,rd(a.nps)]};
 const sum=[['Laporan tNPS Mobile Jabar'],['Periode',lbl()],['Branch Jabar',st.b=='ALL'?'Semua':st.b],['unit_name',st.u=='ALL'?'Semua':st.u],['Respon Kategori',CSL()],['Rumus','(Promotor - Detractor) / total respon x 100'],[],['Metrik','Respon','Promotor','Passive','Detractor','tNPS'],k('tNPS Mobile Jabar - '+lbl(),b1),k('tNPS Customer Service - '+lbl(),b1.filter(inCS))];
 if(mhp()){sum.push(k('tNPS Mobile Jabar - '+pml(),b0),k('tNPS '+CSL()+' - '+pml(),b0.filter(inCS)),['MoM tNPS Mobile','','','','',rd(dv(ag(b1).nps,ag(b0).nps))],['MoM tNPS Customer Service','','','','',rd(dv(ag(b1.filter(inCS)).nps,ag(b0.filter(inCS)).nps))])}
 add('Ringkasan',sum);
 [['t1','Per Jabar'],['t2','Per unit_name'],['cc0','%Category All'],['cc1','%Category Promotor'],['cc2','%Category Detractor'],['cc3','%Category Passive'],['nw','What Went Well'],['nx','What Went Wrong'],['t4','Per CSR respon CS']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,[e.cols.map(c=>c[0]),...e.rows.map(r=>e.cols.map(c=>rd(r[c[1]])))])});
 if(!D._x&&D.x){D.rows.forEach((r,i)=>r.x=D.x[i]);D._x=1}
 add('Data respon',[['Bulan','Tanggal survey','MSISDN','id_trx','Jabar (branch)','unit_name','NIK','Nama CSR','Job Function','Skor q5','Kategori tNPS','Respon Customer Service','q6_part1','Komentar pelanggan'],...sc.map(r=>{const s=S[r[2]],x=r.x||['','','',''];return[MN[r[6]],x[2],x[0],x[1],r[0],r[1],r[2],s?s[0]:'',s?s[1]:'',r[3],['Promotor','Passive','Detractor'][cls(r[3])],r[4]==0?'Ya':'Tidak',CATS[r[5]],x[3]]})]);
 const tag=st.m=='all'?'Agu-Okt':MN[st.m].split(' ')[0];
 const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
 await saveFile('tNPS_Jabar_'+tag+'.xlsx',new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
}
Object.assign(st.sort,{tt1:['n',-1],tt2:['n',-1],tt3:['n',-1],tt4:['n',-1]});st.tm=2;st.tl=6;
const TCUT=T.m.map((m,i)=>{const d=Math.max(0,...T.rows.filter(r=>r[2]==i).map(r=>r[9]));return d<ML[i]?d:99});const tpl=m=>{const c=TCUT[m+1],b=T.m[m];return c<ML[m]?b+' (1–'+c+')':b};
const isTC=r=>st.tm=='all'||r[2]==st.tm,isTP=r=>st.tm!='all'&&st.tm>0&&r[2]==st.tm-1&&r[9]<=TCUT[st.tm];
const tbase=()=>T.rows.filter(r=>(st.b=='ALL'||T.br[r[0]]==st.b)&&(st.u=='ALL'||T.un[r[1]]==st.u));
function tg(rs){const n=rs.length;let cl=0,isl=0,osl=0;for(const r of rs){if(r[3])cl++;if(r[4]==0)isl++;else if(r[4]==1)osl++}return{n,cl,op:n-cl,isl,osl,pc:n?cl/n*100:null,sla:isl+osl?isl/(isl+osl)*100:null}}
const f0=v=>v==null?'–':v.toFixed(1)+'%';
function tops(rs,k){const L=st.tl,m=new Map();for(const r of rs)m.set(r[L],(m.get(r[L])||0)+1);return[...m].sort((a,b)=>b[1]-a[1]).slice(0,k).map(([x,c])=>`${T.l[L-5][x]} (${c})`)}
function tmet(rs){const cur=rs.filter(isTC),prv=rs.filter(isTP),a=tg(cur),o=tg(prv);
 const t1=tops(cur,3),t2=tops(cur.filter(r=>r[4]==1),3);
 return{...a,ps:o.sla,mom:dv(a.sla,o.sla),top1:t1.join('; '),top2:t2.join('; '),
 html:`<td>${a.n}</td><td>${a.cl}</td><td>${f0(a.pc)}</td><td>${a.isl}</td><td>${a.osl}</td><td><b>${f0(a.sla)}</b></td><td>${f0(o.sla)}</td><td>${dl(dv(a.sla,o.sla))}</td>`,
 topH:`<td style="white-space:normal;text-align:left;min-width:220px">${t1.join('<br>')||'–'}</td><td style="white-space:normal;text-align:left;min-width:220px">${t2.join('<br>')||'–'}</td>`}}
const TC=[['Tiket','n'],['Closing','cl'],['% Closing','pc'],['ISL','isl'],['OSL','osl'],['% in SLA','sla'],['% in SLA bln lalu','ps'],['MoM','mom']];

function renderLP(){
 const mi=(st.tm=='all'||st.tm<1)?2:st.tm,mm=T.m[mi],all=T.rows.filter(r=>r[2]==mi),L=all.filter(r=>r[8]==1);
 const pv=mi>0?T.rows.filter(r=>r[2]==mi-1&&r[9]<=TCUT[mi]):[],pm=mi>0?tpl(mi-1):'';
 const mk=(k,a)=>{const g=a.filter(r=>r[8]==1),t=tg(g),pa=pv.filter(r=>r[0]==(k=='Jabar'?r[0]:T.br.indexOf(k))),pg=pa.filter(r=>r[8]==1);return{key:k,name:k,n:a.length,lp:g.length,pl:a.length?g.length/a.length*100:null,sh:L.length?g.length/L.length*100:null,cl:t.cl,osl:t.osl,sla:t.sla,plp:pg.length,ppl:pa.length?pg.length/pa.length*100:null,mom:pg.length?(g.length-pg.length)/pg.length*100:null}};
 const rw=x=>`<td>${x.name}</td><td>${fi(x.n)}</td><td><b>${fi(x.lp)}</b></td><td><b>${f0(x.pl)}</b></td><td>${f0(x.sh)}</td><td>${fi(x.plp)}</td><td>${f0(x.ppl)}</td><td>${x.mom==null?'–':fp(x.mom)}</td><td>${x.cl}</td><td>${x.osl}</td><td>${f0(x.sla)}</td>`;
 const rows=T.br.map((b,i)=>mk(b,all.filter(r=>r[0]==i))).filter(x=>x.n>0).map(x=>({...x,html:rw(x)}));
 const tot=mk('Jabar',all);
 const cols=[['Jabar (branch)','name'],['Total tiket '+mm,'n'],['Tiket LAPUL','lp'],['% LAPUL dari total tiket','pl'],['% dari LAPUL Jabar','sh'],['LAPUL '+pm,'plp'],['% LAPUL '+pm,'ppl'],['MoM LAPUL','mom'],['LAPUL Closing','cl'],['LAPUL OSL','osl'],['LAPUL % in SLA','sla']];
 st.sort.tlp=st.sort.tlp||['lp',-1];
 table('tlp',rows,cols,null,null);
 EX.tlp.rows=[...EX.tlp.rows,{...tot,html:rw(tot)}];
 const tb=$('tlp').querySelector('tbody');tb.insertAdjacentHTML('beforeend',`<tr style="font-weight:700;background:var(--soft,#f1f5f9)">${rw(tot)}</tr>`);
 const ug=[...group(all,r=>T.un[r[1]])].map(([k,a])=>{const x=mk(T.br[a[0][0]],a),pa=pv.filter(r=>T.un[r[1]]==k),pg=pa.filter(r=>r[8]==1).length,mo=pg?(x.lp-pg)/pg*100:null;return{...x,key:k,name:k,br:T.br[a[0][0]],plp:pg,mom:mo}}).filter(x=>x.lp>0||x.plp>0)
  .map(x=>({...x,html:`<td style="text-align:left">${x.name}</td><td style="text-align:left">${x.br}</td><td>${fi(x.n)}</td><td><b>${fi(x.lp)}</b></td><td><b>${f0(x.pl)}</b></td><td>${f0(x.sh)}</td><td>${fi(x.plp)}</td><td>${x.mom==null?'–':fp(x.mom)}</td><td>${x.osl}</td><td>${f0(x.sla)}</td>`}));
 st.sort.tlpu=st.sort.tlpu||['lp',-1];
 table('tlpu',ug,[['Unit Creator (GraPARI)','name'],['Branch','br'],['Total tiket '+mm,'n'],['Tiket LAPUL','lp'],['% LAPUL dari tiket unit','pl'],['% dari LAPUL Jabar','sh'],['LAPUL '+pm,'plp'],['MoM LAPUL','mom'],['LAPUL OSL','osl'],['LAPUL % in SLA','sla']],null,null);
 $('tlpn').textContent=`Data kolom LAPUL tersedia untuk ${pm} dan ${mm} (Agu tidak lengkap, tidak ditampilkan). LAPUL = tiket closing yang bertanda LAPUL pada kolom LAPUL atau menyebut LAPUL di Notes (${L.length} dari ${all.length} tiket ${mm}). % LAPUL = tiket LAPUL ÷ total tiket branch pada ${mm}. Mengikuti pilihan Bulan tiket (default Okt vs Sep); tidak terpengaruh filter branch/unit.`;
}
function tdaily(id,base,mi,mn){
 const el=$(id),hd=$(id+'h');if(hd)hd.textContent=(st.u!='ALL'?st.u:st.b!='ALL'?'Branch '+st.b:'Jabar');
 if(mi=='all'){el.innerHTML='<p class="note">Pilih satu bulan untuk melihat trend harian.</p>';return}
 const ML=[31,30,31,30],cnt=(m,f)=>{const a=new Array(ML[m]+1).fill(0);base.forEach(r=>{if(r[2]==m&&f(r))a[r[9]]++});return a};
 const c=cnt(mi,r=>true),p=mi>0?cnt(mi-1,r=>true):null,last=Math.max(0,...base.filter(r=>r[2]==mi).map(r=>r[9])),nd=ML[mi];
 const W=1120,H=270,L=44,R=12,T=26,B=40,cw=(W-L-R)/nd,mx=Math.max(1,...c,...(p||[0]))*1.15,Y=v=>T+(H-T-B)*(1-v/mx);
 const dow=d=>new Date(2026,7+mi,d).getDay(),dn=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
 let g=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;font-family:inherit">`;
 for(let k=0;k<=4;k++){const v=mx/1.15*k/4,y=Y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#E6E7EF"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="#8A8DA3">${Math.round(v)}</text>`}
 for(let d=1;d<=nd;d++){const x=L+(d-1)*cw,su=dow(d)==0;
  if(d<=last){const y=Y(c[d]);g+=`<rect x="${x+cw*0.15}" y="${y}" width="${cw*0.7}" height="${H-B-y}" rx="3" fill="${su?'#B9BDD6':'#6C63D9'}"><title>${d} ${mn[mi]} (${dn[dow(d)]}): ${c[d]} tiket${p?` · ${mn[mi-1]} tgl ${d}: ${p[d]??'–'}`:''}</title></rect>`;
   if(nd<=31)g+=`<text x="${x+cw/2}" y="${y-4}" text-anchor="middle" font-size="10" font-weight="700" fill="#2B2D42">${c[d]}</text>`}
  g+=`<text x="${x+cw/2}" y="${H-B+15}" text-anchor="middle" font-size="10.5" fill="${su?'#D7263D':'#6B7089'}">${d}</text>`}
 if(p){const pts=[];for(let d=1;d<=Math.min(nd,ML[mi-1]);d++)pts.push(`${(L+(d-1)*cw+cw/2).toFixed(1)},${Y(p[d]).toFixed(1)}`);g+=`<polyline fill="none" stroke="#E8912D" stroke-width="2" stroke-dasharray="5 4" points="${pts.join(' ')}"/>`}
 g+=`<text x="${L}" y="${H-6}" font-size="11" fill="#6B7089">Tanggal (merah = hari Minggu)</text></svg>`;
 const sc=c.slice(1,last+1).reduce((a,b)=>a+b,0),pl=p?Math.min(last,p.length-1):0,sp=p?p.slice(1,pl+1).reduce((a,b)=>a+b,0):0,av=last?sc/last:0,pk=c.indexOf(Math.max(...c.slice(1)));
 const lg=`<div class="note" style="display:flex;gap:18px;flex-wrap:wrap;margin:0 0 4px"><span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:#6C63D9;vertical-align:-1px"></span> ${mn[mi]} (tiket per tanggal dibuat)</span>${p?`<span><span style="display:inline-block;width:18px;border-top:2px dashed #E8912D;vertical-align:3px"></span> ${mn[mi-1]} (tanggal yang sama)</span>`:''}<span>Rata-rata <b>${av.toFixed(1)}</b> tiket/hari${p?` · ${mn[mi-1]} 1–${pl}: ${(sp/(pl||1)).toFixed(1)}/hari`:''}</span><span>Puncak: <b>${pk} ${mn[mi]}</b> (${c[pk]} tiket)</span></div>`;
 el.innerHTML=lg+g}
function renderT(){
 const b=tbase(),cur=b.filter(isTC),prv=b.filter(isTP),a=tg(cur),o=tg(prv),hp=st.tm!='all'&&st.tm>0,pm=hp?tpl(st.tm-1):'';
 const per=st.tm=='all'?T.m[0]+'–'+T.m[T.m.length-1]:T.m[st.tm];
 const kc=(t,v,s)=>`<div class="card kpi"><div class="t">${t} · ${per}</div><div class="v">${v}</div><div class="note">${s}</div></div>`;
 const pc=(x,y)=>hp&&y?`<span class="dl ${x>=y?'pos':'neg'}">${x>=y?'▲ +':'▼ '}${((x-y)/y*100).toFixed(1)}%</span>`:'';
 tdaily('tdl',b,st.tm,['Agu','Sep','Okt','Nov']);
 $('tkpi').innerHTML=kc('🎫 Total tiket',a.n,hp?`${pm}: ${o.n} · MoM ${pc(a.n,o.n)}`:'Semua bulan digabung')
  +kc('✅ Closing',`${a.cl} <span style="font-size:15px">${f0(a.pc)}</span>`,`Open: ${a.op}`+(hp?` · ${pm}: ${o.cl} (${f0(o.pc)})`:''))
  +kc('⏱️ % in SLA',f0(a.sla),`ISL ${a.isl} · OSL ${a.osl}`+(hp?` · ${pm}: ${f0(o.sla)} · MoM ${dl(dv(a.sla,o.sla))}`:''))
  +kc('🚨 Tiket OSL',a.osl,`${a.cl?(a.osl/a.cl*100).toFixed(1):0}% dari tiket closing`+(hp?` · ${pm}: ${o.osl}`:''));
 const sc=r=>isTC(r)||isTP(r);
 const ub=T.rows.filter(r=>sc(r)&&(st.u=='ALL'||T.un[r[1]]==st.u));
 let rows=[...group(ub,r=>T.br[r[0]])].map(([k,rs])=>{const m=tmet(rs);return{key:k,name:k,...m,html:`<td>${k}</td>`+m.html}});
 table('tt1',rows,[['Jabar (branch)','name'],...TC],k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 const bb=T.rows.filter(r=>sc(r)&&(st.b=='ALL'||T.br[r[0]]==st.b));
 rows=[...group(bb,r=>T.un[r[1]])].map(([k,rs])=>{const m=tmet(rs),br=T.br[rs[0][0]];return{key:k,name:k,br,...m,html:`<td>${k}</td><td style="text-align:left">${br}</td>`+m.html+m.topH}});
 table('tt2',rows,[['unit_name','name'],['Branch','br'],...TC,['Top tiket','top1'],['Top tiket OSL','top2']],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 const L=st.tl,nm=r=>T.l[L-5][r[L]],cell='style="text-align:left;white-space:normal;min-width:220px"';
 const osl=cur.filter(r=>r[4]==1);
 rows=[...group(cur,nm)].map(([k,rs])=>{const g=tg(rs);return{key:k,name:k,n:g.n,sh:g.n/cur.length*100,cl:g.cl,osl:g.osl,sla:g.sla,html:`<td ${cell}>${k}</td><td>${g.n}</td><td>${f0(g.n/cur.length*100)}</td><td>${g.cl}</td><td>${g.osl}</td><td>${f0(g.sla)}</td>`}}).sort((x,y)=>y.n-x.n).slice(0,10);
 tbars('tt3',rows,'Tiket',0);
 rows=[...group(osl,nm)].map(([k,rs])=>({key:k,name:k,n:rs.length,sh:rs.length/osl.length*100,html:`<td ${cell}>${k}</td><td>${rs.length}</td><td>${f0(rs.length/osl.length*100)}</td>`})).sort((x,y)=>y.n-x.n).slice(0,10);
 tbars('tt4',rows,'Tiket OSL',1);
 renderM();renderLP();
 $('tmeta').textContent=`Sumber: Tiket_Mobile.xlsx (dibuat 1 Agu – ${TCUT[3]} Nov 2026; Okt s.d. 31 Okt, Nov s.d. ${TCUT[3]} Nov) · kolom JABAR terisi · ${cur.length} tiket pada periode ${per} · ikut filter branch dan unit_name di atas`;
}
$('tm').innerHTML=['Agustus','September','Oktober','November (1–'+TCUT[3]+' Nov, parsial)'].map((m,i)=>`<option value="${i}">${m}</option>`).join('')+'<option value="all">All Month</option>';$('tm').value='2';
$('tm').onchange=e=>{st.tm=e.target.value=='all'?'all':+e.target.value;renderT()};$('tl').onchange=e=>{st.tl=+e.target.value;renderT()};
Object.assign(st.sort,{tmx1:['ord',1],tmx2:['n',-1],tmx3:['n',-1],tmx4:['n',-1]});
const pct=(x,y)=>y?(x-y)/y*100:null;
const dcl=(v,m)=>m=='osl'?(v>0?'neg':v<0?'pos':''):'';
const fp=(v,m)=>v==null?'–':Math.abs(v)<0.05?'0.0%':`<span class="dl ${dcl(v,m)}">${v>=0?'▲ +':'▼ '}${v.toFixed(1)}%</span>`;
const fn=(v,m)=>v==null?'–':v==0?'0':`<span class="dl ${dcl(v,m)}">${v>=0?'▲ +':'▼ '}${v}</span>`;
const MC=[['Tiket','n'],['MoM Tiket','mn'],['Closing','cl'],['OSL','osl'],['MoM OSL','mosl'],['% in SLA','sla'],['MoM % in SLA','msla']];
function mrow(rs){const c=tg(rs.filter(r=>r[2]==st.tm)),p=tg(rs.filter(r=>r[2]!=st.tm));
 return{n:c.n,pn:p.n,mn:pct(c.n,p.n),cl:c.cl,pcl:p.cl,osl:c.osl,posl:p.osl,mosl:c.osl-p.osl,sla:c.sla,psla:p.sla,msla:dv(c.sla,p.sla),
 html:`<td>${c.n}</td><td>${fp(pct(c.n,p.n))}</td><td>${c.cl}</td><td>${c.osl}</td><td>${fn(c.osl-p.osl,'osl')}</td><td>${f0(c.sla)}</td><td>${dl(dv(c.sla,p.sla))}</td>`}}


const CCAN={'Customer Service':'Pelayanan Pelanggan','Network Quality':'Kualitas Jaringan','Product':'Produk','Promo Program':'Program Promo','Payment/Top Up':'Pembayaran/Isi Ulang','(kosong)':'Tidak diisi'};
const CCOL={'Pelayanan Pelanggan':['#8DB8EA','#CBE0F6'],'Kualitas Jaringan':['#A38BE0','#D3C9F2'],'Produk':['#F2A58A','#F9D5C7'],'Program Promo':['#F0C27B','#F8E2BB'],'Pembayaran/Isi Ulang':['#8FCDB0','#CDEADB'],'Tidak diisi':['#9FB7C6','#D2DEE6']};
const PTH=[['Petugas ramah & sopan','Sikap petugas yang ramah, sopan, sabar dan murah senyum menjadi alasan utama pelanggan memberi nilai tinggi.','"Cs nya sangat baik dan ramah"; "Petugas ramah sudah membantu aktivasi nomor saya yang sudah hangus"','Pertahankan standar sapaan, senyum dan etika layanan; jadikan contoh coaching antar-CSR.'],
['Pelayanan cepat & responsif','Proses dilayani cepat tanpa antre lama, terutama untuk penggantian kartu dan aktivasi ulang nomor.','"Proses ganti kartu cepat ditangani dengan mudah"; "Cepat sekali pelayanannya"','Jaga waktu tunggu dan kecepatan proses di jam sibuk.'],
['Membantu & solutif','Pelanggan merasa terbantu: nomor hangus/hilang aktif kembali, kartu rusak diganti, nomor cantik didapat, kebutuhan selesai tuntas.','"Sangat membantu"; "Makasih sudah bantu aktifkan kembali nomor saya yang hilang"','Pertahankan penyelesaian di kunjungan pertama (first-visit resolution).'],
['Informatif & jelas','Penjelasan produk dan prosedur detail serta mudah dimengerti, termasuk penawaran yang sesuai kebutuhan.','"Penjelasannya jelas dapat dipahami"; "Cs baik menjelaskan dengan sangat jelas"','Pertahankan product knowledge dan komunikasi yang sederhana.'],
['Profesional','Petugas dinilai profesional, berempati dan memberi pengalaman menyenangkan.','"Dilayani dengan baik dan profesional"; "Pelayanannya luar biasa profesional dan menyenangkan"','Pertahankan SOP dan kualitas pelayanan.'],
['Produk, jaringan & harga','Sebagian pelanggan juga puas dengan paket yang terjangkau, kuota banyak dan jaringan stabil.','"Harga lebih terjangkau dan kuota banyak"; "Jaringannya bagus, jarang sekali gangguan"','Pastikan penawaran paket yang relevan terus disampaikan di GraPARI.'],
['Puas secara umum','Pelanggan menyampaikan kepuasan dan terima kasih atas pelayanan GraPARI secara umum.','"Pelayanannya sangat memuaskan"; "Pelayanan bagus, nomor lama bisa aktif lagi"','Pertahankan konsistensi pelayanan.']];
const DTH=[['Kualitas jaringan & sinyal','Sinyal/internet lemah atau lambat, terutama di pedesaan, pegunungan dan di rumah/tempat kerja; ada yang berniat pindah.','"Sinyal internet di pedesaan kurang bagus apalagi di pegunungan"; "Jelek lelet"','Eskalasi keluhan area ke tim Network (data lokasi), beri informasi tindak lanjut ke pelanggan.'],
['Harga & produk','Harga paket dinilai mahal dibanding kompetitor dan bundling kurang menarik; pelanggan lama merasa tidak mendapat benefit.','"Terlalu mahal jika dibandingkan dengan yang lain"; "Produk standar dengan harga cukup mahal dibanding kompetitor"','Teruskan masukan harga/benefit ke pusat; tawarkan paket alternatif dan loyalty benefit untuk pelanggan lama.'],
['Layanan GraPARI','Antrean lama (30+ menit), sikap petugas/satpam kurang ramah, informasi keliru dan prosedur dirasa rumit.','"1 pelanggan lebih dari 30 menit"; "Satpam GraPARI tidak ramah terhadap customer"; "Petugas memberikan informasi yang sangat keliru"','Coaching sikap & etika (termasuk satpam), perkuat product knowledge dan akurasi informasi, kelola antrean saat ramai.'],
['Promo & informasi tidak sesuai','Informasi program di aplikasi/chatbot berbeda dengan di GraPARI (mis. kartu gratis ternyata berbayar; hadiah poin tidak tersedia).','"Program penggantian kartu gratis ternyata di GraPARI harus bayar"','Selaraskan informasi program di aplikasi dan GraPARI, pastikan ketersediaan hadiah/stok sebelum dipromosikan.'],
['Aplikasi, kartu & isi ulang','Kendala registrasi, input nomor di MyTelkomsel, penggantian kartu gagal dan isi ulang via dompet digital gagal.','"Sulit registrasi"; "Gagal saat isi ulang data di Dana"; "Ketika masukan no di MyTelkomsel selalu ada kendala"','Bantu penyelesaian langsung di GraPARI dan laporkan kendala sistem ke tim terkait.']];
function cbars(id,rows,tag){
 EX[id]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Kategori (kolom P)','name'],['Jumlah','n'],['% of total','sh']]};addXb(id);
 if(!rows.length){$(id).innerHTML='<p class="note">Tidak ada data.</p>';return}
 const mx=Math.max(1,...rows.map(r=>r.sh));
 $(id).innerHTML=rows.map((r,i)=>{const c=CCOL[r.name]||TBC[i%TBC.length];return`<div class="cr"><div class="cl" style="cursor:default"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${c[1]},${c[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join('')}
function renderCat(b1){
 const ids=['cc0','cc1','cc2','cc3'];
 [null,0,2,1].forEach((cl,k)=>{const g=b1.filter(r=>cl==null||cls(r[3])==cl);const m=new Map();g.forEach(r=>{const c=CATS[r[5]],n=CCAN[c]||c;m.set(n,(m.get(n)||0)+1)});
  const rows=[...m].map(([name,n])=>({name,n,sh:n/g.length*100})).sort((a,b)=>b.n-a.n);
  cbars(ids[k],rows);const h=$(ids[k]).previousElementSibling;});
}

function tanal(id,kind,b){
 const b1=b.filter(isCur),b0=b.filter(isPrv),hp=mhp(),pl=hp?pml():'',A=ag(b1),O=ag(b0),per=lbl();
 if(!A.n){return}
 const pp=(x,n)=>n?x/n*100:0,sg=v=>(v>=0?'naik ':'turun ')+Math.abs(v).toFixed(1)+'%',mm=v=>v==null?'':` (${v>=0?'▲ +':'▼ '}${Math.abs(v).toFixed(1)}%)`;
 const gm=(kf,min)=>[...group(b,kf)].map(([k,rs])=>{const a=ag(rs.filter(isCur)),o=ag(rs.filter(isPrv));return{k,...a,po:o.nps,pn:o.n,mom:(hp&&o.n>=min&&a.n>=min)?a.nps-o.nps:null}}).filter(x=>x.n>=min);
 const br=gm(r=>r[0],1),un=gm(r=>r[1],30),un2=gm(r=>r[1],20).filter(x=>x.mom!=null);
 const cs=[...group(b1.filter(r=>r[4]==0&&S[r[2]]&&!/^T0/i.test(r[2])),r=>r[2])].map(([k,rs])=>({k,name:S[k][0],...ag(rs)}));
 const nm=x=>`<b>${x.k}</b>`,L=[];
 const C=ag(b1.filter(r=>r[4]==0)),CO=ag(b0.filter(r=>r[4]==0));
 if(kind=='p'){
  L.push(`tNPS Jabar <b>${f1(A.nps)}</b>${hp?` (${sg(A.nps-O.nps)} dari ${pl}: ${f1(O.nps)})`:''} dari ${fi(A.n)} respon; Promotor <b>${f1(pp(A.p,A.n))}%</b> (${fi(A.p)} respon)${hp?`, ${pl}: ${f1(pp(O.p,O.n))}%`:''}.`);
  if(C.n)L.push(`Respon Customer Service: tNPS <b>${f1(C.nps)}</b>${hp&&CO.n?` (${sg(C.nps-CO.nps)} dari ${f1(CO.nps)})`:''}, Detractor hanya ${fi(C.d)} dari ${fi(C.n)} respon.`);
  const bs=[...br].sort((a,b)=>b.nps-a.nps);
  if(bs.length>1){const up=hp?bs.filter(x=>x.mom!=null&&x.mom>0):[];L.push(`Branch tertinggi: ${nm(bs[0])} tNPS ${f1(bs[0].nps)}${mm(bs[0].mom)}`+(up.length?`. Branch yang naik: ${up.map(x=>`${x.k} ${mm(x.mom).trim()}`).join(', ')}.`:'.'))}
  const ut=[...un].sort((a,b)=>b.nps-a.nps).slice(0,3);
  if(ut.length)L.push(`GraPARI dengan tNPS tertinggi (min. 30 respon): ${ut.map(x=>`${nm(x)} ${f1(x.nps)} (${x.n})`).join('; ')}.`);
  const ui=[...un2].filter(x=>x.mom>0).sort((a,b)=>b.mom-a.mom).slice(0,3);
  if(ui.length)L.push(`GraPARI dengan kenaikan tNPS terbesar vs ${pl} (min. 20 respon): ${ui.map(x=>`${nm(x)} ${f1(x.po)} → ${f1(x.nps)} (+${x.mom.toFixed(1)}%)`).join('; ')}.`);
  const p100=cs.filter(x=>x.nps===100&&x.n>=15).sort((a,b)=>b.n-a.n);
  if(p100.length)L.push(`<b>${p100.length}</b> CSR (Customer Service) meraih tNPS 100 dengan minimal 15 respon, antara lain ${p100.slice(0,4).map(x=>`${x.name} (${x.n})`).join(', ')}.`);
 }else{
  L.push(`Detractor <b>${fi(A.d)}</b> (${f1(pp(A.d,A.n))}% dari ${fi(A.n)} respon)${hp?`, ${pl}: ${fi(O.d)} (${f1(pp(O.d,O.n))}%)`:''}; Passive <b>${fi(A.a)}</b> (${f1(pp(A.a,A.n))}%)${hp?`, ${pl}: ${f1(pp(O.a,O.n))}%`:''}. ${A.a>A.d?'Passive lebih banyak dari Detractor, sehingga ruang perbaikan tNPS terbesar ada di menggeser Passive (skor 7–8) menjadi Promotor.':''}`);
  const bs=[...br].sort((a,b)=>a.nps-b.nps);
  if(bs.length>1){const dn=hp?bs.filter(x=>x.mom!=null&&x.mom<0):[];L.push(`Branch terendah: ${nm(bs[0])} tNPS ${f1(bs[0].nps)}${mm(bs[0].mom)} dengan ${fi(bs[0].d)} Detractor dan ${fi(bs[0].a)} Passive`+(dn.length?`. Branch yang turun: ${dn.map(x=>`${x.k} ${mm(x.mom).trim()}`).join(', ')}.`:'.'))}
  const ul=[...un].sort((a,b)=>a.nps-b.nps).slice(0,3);
  if(ul.length)L.push(`GraPARI dengan tNPS terendah (min. 30 respon): ${ul.map(x=>`${nm(x)} ${f1(x.nps)} (${fi(x.d)} Detractor, ${fi(x.a)} Passive)`).join('; ')}.`);
  const ud=[...un2].filter(x=>x.mom<0).sort((a,b)=>a.mom-b.mom).slice(0,3);
  if(ud.length)L.push(`GraPARI dengan penurunan tNPS terbesar vs ${pl} (min. 20 respon): ${ud.map(x=>`${nm(x)} ${f1(x.po)} → ${f1(x.nps)} (${x.mom.toFixed(1)}%)`).join('; ')}.`);
  const md=[...gm(r=>r[1],1)].filter(x=>x.d>0).sort((a,b)=>b.d-a.d).slice(0,3);
  if(md.length)L.push(`Detractor terbanyak ada di: ${md.map(x=>`${nm(x)} (${fi(x.d)} dari ${fi(x.n)} respon = ${f1(pp(x.d,x.n))}%)`).join('; ')}.`);
  const cd=cs.filter(x=>x.d>0).sort((a,b)=>b.d-a.d||a.nps-b.nps).slice(0,4);
  if(cd.length)L.push(`CSR (Customer Service) dengan Detractor terbanyak: ${cd.map(x=>`${x.name} (${fi(x.d)} dari ${fi(x.n)} respon, tNPS ${f1(x.nps)})`).join('; ')}. Perlu coaching dan review komentar pelanggan terkait.`);
 }
 const box=`<div class="anl" style="margin:0 0 12px;padding:10px 14px;border-left:4px solid ${kind=='p'?'var(--g)':'var(--r)'};background:var(--soft,rgba(127,127,127,.08));border-radius:8px"><div style="font-weight:700;margin-bottom:4px">Analisa tNPS · ${per}${hp?' vs '+pl:''}</div><ul style="margin:0;padding-left:18px;line-height:1.55">${L.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
 $(id).insertAdjacentHTML('afterbegin',box);
}
const nq=(g,i,st0)=>{const seen=new Set(),o=[];g.filter(r=>r[7]==i&&r[8]).sort((a,b)=>b[8].length-a[8].length).forEach(r=>{const k=r[8].slice(0,30).toLowerCase();if(!seen.has(k)&&o.length<2){seen.add(k);o.push(r)}});
 return o.length?o.map(r=>`<div class="nrq">"${r[8].replace(/</g,'&lt;')}" <b style="font-style:normal;color:var(--tx)">— ${r[1]}</b></div>`).join(''):`<div class="nrq">${st0}</div>`};
function narr(id,b1,kind){
 const T=kind=='p'?PTH:DTH,cl=kind=='p'?0:2,g=b1.filter(r=>cls(r[3])==cl),n=g.length;
 const c=new Array(T.length).fill(0);let nc=0;g.forEach(r=>{if(r[7]>=0)c[r[7]]++;else nc++});
 const tot=c.reduce((a,b)=>a+b,0),idx=c.map((v,i)=>i).filter(i=>c[i]>0).sort((a,b)=>c[b]-c[a]);
 const nm=kind=='p'?'Promotor':'Detractor';
 let sum;
 if(!n)sum='Tidak ada respon '+nm+' pada filter ini.';
 else if(kind=='p')sum=`Dari <b>${fi(n)}</b> respon Promotor, <b>${fi(tot)}</b> (${f1(tot/n*100)}%) menuliskan komentar yang bermakna; ${fi(nc)} tanpa komentar atau hanya label. Tema yang paling banyak disebut: <b>${idx.slice(0,3).map(i=>T[i][0]).join(', ')||'–'}</b>. Pelanggan terutama menghargai petugas yang ramah dan membantu, termasuk saat aktivasi ulang nomor hangus/hilang dan penggantian kartu.`;
 else sum=`Dari <b>${fi(n)}</b> respon Detractor, <b>${fi(c.reduce((a,b)=>a+b,0))}</b> dikelompokkan ke tema berikut (komentar bebas atau, bila kosong, kategori kolom P). Tema yang paling banyak: <b>${idx.slice(0,3).map(i=>T[i][0]).join(', ')||'–'}</b>.`;
 const rows=idx.map(i=>`<tr><td><b>${T[i][0]}</b></td><td class="c">${fi(c[i])}</td><td class="c">${f1(c[i]/(kind=='p'?tot:n)*100)}%</td><td>${T[i][1]}${nq(g,i,T[i][2])}</td><td>${T[i][3]}</td></tr>`).join('');
 const tt=kind=='p'?['Yang sudah baik','Pertahankan']:['Temuan','Yang perlu diperbaiki'];
 const cn=kind=='p'?'% dari promotor berkomentar':'% dari detractor';
 $(id).innerHTML=(idx.length?`<div class="tw" style="max-height:none"><table class="nr ${kind=='p'?'gd':'rd'}"><thead><tr><th style="text-align:left">Tema</th><th>Jumlah</th><th>${cn}</th><th style="text-align:left">${tt[0]} &amp; contoh suara pelanggan</th><th style="text-align:left">${tt[1]}</th></tr></thead><tbody>${rows}</tbody></table></div>`:'')+`<p class="note">Sumber: komentar bebas pelanggan (kolom S, q6) pada respon ${nm}; tema dikelompokkan otomatis berdasarkan kata kunci dan mengikuti filter bulan, branch dan unit (semua respon, tidak dibatasi pilihan Respon Kategori).</p>`;
 EX[id]={rows:idx.map(i=>({t:T[i][0],n:c[i],sh:c[i]/(kind=='p'?tot:n)*100,i:T[i][1],a:T[i][3]})),cols:[['Tema','t'],['Jumlah','n'],[cn,'sh'],[tt[0],'i'],[tt[1],'a']]};
}
const TBC=[['#8DB8EA','#CBE0F6'],['#A38BE0','#D3C9F2'],['#F2A58A','#F9D5C7'],['#B5A5EE','#DDD7F8'],['#9FB7C6','#D2DEE6'],['#7FB6D9','#C5DFEE'],['#D7A3D2','#EFD6EC'],['#8FCDB0','#CDEADB'],['#F0C27B','#F8E2BB'],['#6A55C8','#B9AEE8']];
function tbars(id,rows,lab,osl){
 EX[id]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],[lab,'name'],['Jumlah','n'],['% of total','sh']]};addXb(id);
 if(!rows.length){$(id).innerHTML='<p class="note">Tidak ada data.</p>';return}
 const mx=Math.max(1,...rows.map(r=>r.sh));
 $(id).innerHTML=rows.map((r,i)=>{const c=osl?TBC[4-(i%2)*0+0]:TBC[i%TBC.length];const cc=osl?['#EC6B6B','#F7C0C0']:c;
  return`<div class="cr"><div class="cl" style="cursor:default"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${cc[1]},${cc[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join('')}
function tsvg(rows,val,mom,fv,col,line,pid,sm=st.tm){
 const W=460,H=260,pl=46,pr=16,pt=38,pb=62,n=rows.length,sw=(W-pl-pr)/n,vals=rows.map(val);
 let lo,hi;const mxv=Math.max(...vals),mnv=Math.min(...vals);
 if(!line){lo=0;const raw=(mxv*1.1||1)/4,mg=Math.pow(10,Math.floor(Math.log10(raw))),nz=[1,2,2.5,5,10].find(x=>x*mg>=raw)*mg;hi=nz*4}else{const sp=Math.max(mxv-mnv,0.3);lo=mnv-sp*1.2;hi=Math.min(100,mxv+sp*0.4);if(hi<=lo)hi=lo+0.5}
 const Y=v=>pt+(H-pt-pb)*(1-(v-lo)/(hi-lo)),X=i=>pl+sw*(i+.5);
 let g='';for(let k=0;k<=4;k++){const v=lo+(hi-lo)*k/4,y=Y(v);g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" style="stroke:var(--bd)"/><text x="${pl-6}" y="${y+4}" text-anchor="end" font-size="11" style="fill:var(--mu)">${fv(v,1)}</text>`}
 const sel=i=>sm=='all'||sm==i;let body='';
 if(line){const pts=vals.map((v,i)=>X(i)+','+Y(v)).join(' ');body+=`<polygon points="${X(0)},${H-pb} ${pts} ${X(n-1)},${H-pb}" fill="url(#${pid})" opacity=".55"/><polyline points="${pts}" fill="none" stroke="${col[0]}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`}
 vals.forEach((v,i)=>{const x=X(i),y=Y(v),op=sel(i)?1:.55;
  if(!line){const bw=Math.min(52,sw*.62);body+=`<rect x="${x-bw/2}" y="${y}" width="${bw}" height="${Math.max(2,H-pb-y)}" rx="9" fill="url(#${pid})" opacity="${op}"/>`}
  else body+=`<circle cx="${x}" cy="${y}" r="6" style="fill:var(--card)" stroke="${col[0]}" stroke-width="3" opacity="${op}"/>`;
  const m=mom(i);
  body+=`<text x="${x}" y="${y-11}" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--tx)">${fv(v)}</text><text x="${x}" y="${H-pb+20}" text-anchor="middle" font-size="12.5" font-weight="${sel(i)&&sm!='all'?700:400}" style="fill:var(--tx)">${rows[i].name}</text><text x="${x}" y="${H-pb+38}" text-anchor="middle" font-size="12" style="fill:var(--mu)">${m}</text>`});
 return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:560px;display:block;margin:0 auto"><defs><linearGradient id="${pid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></linearGradient></defs>${g}${body}</svg>`}
const mt=(v,d)=>v==null?'MoM –':Math.abs(v)<0.05?'MoM 0.0'+d:`MoM ${v>=0?'▲ +':'▼ '}${v.toFixed(1)}${d}`;
function renderM(){
 const b=tbase();
 let rows=T.m.map((m,i)=>{const a=tg(b.filter(r=>r[2]==i)),p=i>0?tg(b.filter(r=>r[2]==i-1&&r[9]<=TCUT[i])):null;
  const mn=p?pct(a.n,p.n):null,mcl=p?pct(a.cl,p.cl):null,mpc=p?dv(a.pc,p.pc):null,mosl=p?a.osl-p.osl:null,msla=p?dv(a.sla,p.sla):null;
  const lb=i==2?m+' (1–31)':i==3?m+' (1–4)':m;return{key:m,name:lb,ord:i,n:a.n,mn,cl:a.cl,mcl,pc:a.pc,mpc,osl:a.osl,mosl,sla:a.sla,msla,
  html:`<td>${lb}</td><td>${a.n}</td><td>${fp(mn)}</td><td>${a.cl}</td><td>${fp(mcl)}</td><td>${f0(a.pc)}</td><td>${dl(mpc)}</td><td>${a.osl}</td><td>${fn(mosl,'osl')}</td><td>${f0(a.sla)}</td><td>${dl(msla)}</td>`}});
 table('tmx1',rows,[['Bulan','name'],['Tiket','n'],['MoM Tiket','mn'],['Closing','cl'],['MoM Closing','mcl'],['% Closing','pc'],['MoM % Closing','mpc'],['OSL','osl'],['MoM OSL','mosl'],['% in SLA','sla'],['MoM % in SLA','msla']]);
 $('tmx1a').innerHTML=tsvg(rows,r=>r.n,i=>mt(rows[i].mn,'%'),(v,a)=>a?Math.round(v):fi(Math.round(v)),['#8DB8EA','#CBE0F6'],false,'gtA');
 $('tmx1b').innerHTML=tsvg(rows,r=>r.pc,i=>mt(rows[i].mpc,''),(v,a)=>v.toFixed(1)+'%',['#A38BE0','#D3C9F2'],true,'gtB');
 const ok=st.tm!='all'&&st.tm>0;
 $('tmxn').textContent=ok?`MoM per Jabar, unit_name dan top tiket: ${T.m[st.tm]} dibanding ${tpl(st.tm-1)} (periode tanggal yang sama; mengikuti pilihan Bulan tiket).`:'MoM per Jabar, unit_name dan top tiket tersedia untuk bulan Agu, Sep, Okt dan Nov. Pilih salah satunya di Bulan tiket.';
 if(!ok){['tmx2','tmx3','tmx4'].forEach(i=>{$(i).innerHTML='';delete EX[i]});return}
 const sc=r=>r[2]==st.tm||r[2]==st.tm-1;
 const ub=T.rows.filter(r=>sc(r)&&(st.u=='ALL'||T.un[r[1]]==st.u));
 rows=[...group(ub,r=>T.br[r[0]])].map(([k,rs])=>{const m=mrow(rs);return{key:k,name:k,...m,html:`<td>${k}</td>`+m.html}});
 table('tmx2',rows,[['Jabar (branch)','name'],...MC],k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 const bb=T.rows.filter(r=>sc(r)&&(st.b=='ALL'||T.br[r[0]]==st.b));
 rows=[...group(bb,r=>T.un[r[1]])].map(([k,rs])=>{const m=mrow(rs),br=T.br[rs[0][0]];return{key:k,name:k,br,...m,html:`<td>${k}</td><td style="text-align:left">${br}</td>`+m.html}});
 table('tmx3',rows,[['unit_name','name'],['Branch','br'],...MC],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 const L=st.tl,tb=T.rows.filter(r=>sc(r)&&(st.b=='ALL'||T.br[r[0]]==st.b)&&(st.u=='ALL'||T.un[r[1]]==st.u));
 rows=[...group(tb,r=>T.l[L-5][r[L]])].map(([k,rs])=>{const n=rs.filter(r=>r[2]==st.tm).length,pn=rs.length-n;return{key:k,name:k,n,pn,mn:pct(n,pn)}}).filter(r=>r.n>0).sort((x,y)=>y.n-x.n).slice(0,50);
 EX.tmx4={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,mn:r.mn})),cols:[['No','no'],['Tiket','name'],['Jumlah Tiket','n'],['MoM Tiket %','mn']]};addXb('tmx4');
 const mx4=Math.max(1,...rows.map(r=>r.n));
 $('tmx4').innerHTML=rows.length?rows.map((r,i)=>{const c=TBC[i%TBC.length];return`<div class="cr"><div class="cl" style="cursor:default"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.n/mx4*100).toFixed(1)}%;background:linear-gradient(90deg,${c[1]},${c[0]})"></div></div><div class="cv"><b>${fi(r.n)}</b> ${fp(r.mn)}</div></div>`}).join(''):'<p class="note">Tidak ada data.</p>';
}
async function exportTiket(){
 if(typeof XLSX=='undefined'){alert('Library Excel belum termuat. Pastikan terhubung ke internet lalu muat ulang halaman.');return}
 const rd=v=>v==null?'':typeof v=='number'?Math.round(v*100)/100:v;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const b=tbase(),cur=b.filter(isTC),prv=b.filter(isTP),hp=st.tm!='all'&&st.tm>0,per=st.tm=='all'?T.m[0]+'–'+T.m[T.m.length-1]:T.m[st.tm];
 const k=(n,rs)=>{const a=tg(rs);return[n,a.n,a.cl,rd(a.pc),a.isl,a.osl,rd(a.sla)]};
 const sum=[['Laporan Tiket Mobile Jabar'],['Periode',per],['Branch Jabar',st.b=='ALL'?'Semua':st.b],['unit_name',st.u=='ALL'?'Semua':st.u],['Level top tiket',['CASE_TYPE_1','CASE_TYPE_2','CASE_TYPE_3'][st.tl-5]],['% in SLA','ISL / (ISL + OSL) dari tiket closed'],[],['Metrik','Tiket','Closing','% Closing','ISL','OSL','% in SLA'],k('Tiket Jabar - '+per,cur)];
 if(hp)sum.push(k('Tiket Jabar - '+tpl(st.tm-1),prv),['MoM % in SLA','','','','','',rd(dv(tg(cur).sla,tg(prv).sla))]);
 add('Ringkasan',sum);
 [['tt1','Tiket per Jabar'],['tt2','Tiket per unit_name'],['tt3','Top tiket'],['tt4','Top tiket OSL'],['tmx1','MoM tren bulanan'],['tmx3','MoM per unit_name'],['tmx4','MoM top tiket']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,[e.cols.map(c=>c[0]),...e.rows.map(r=>e.cols.map(c=>rd(r[c[1]])))])});
 add('Data tiket',[['Bulan','Jabar (branch)','unit_name','Status','SLA','CASE_TYPE_1','CASE_TYPE_2','CASE_TYPE_3'],...b.filter(r=>isTC(r)||isTP(r)).map(r=>[T.m[r[2]],T.br[r[0]],T.un[r[1]],r[3]?'Closed':'Open',['ISL','OSL','OPEN'][r[4]],T.l[0][r[5]],T.l[1][r[6]],T.l[2][r[7]]])]);
 const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
 await saveFile('Tiket_Jabar_'+per+'.xlsx',new Blob([out],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
}
st.ff=2;Object.assign(st.sort,{ft2:['n',-1],ft3:['n',-1],ft4:['n',-1]});
const FC=r=>st.ff=='all'||r[2]==st.ff,FCUT=F.m.map((m,i)=>{const d=Math.max(0,...F.rows.filter(r=>r[2]==i).map(r=>r[9]));return d<ML[i]?d:99}),FP=r=>st.ff!='all'&&st.ff>0&&r[2]==st.ff-1&&r[9]<=FCUT[st.ff],fpl=k=>{const c=FCUT[k+1];return c<ML[k]?F.m[k]+' (1–'+c+')':F.m[k]},fhp=()=>st.ff!='all'&&st.ff>0;
const flab=i=>F.m[i]+(i==2?' (1–31)':i==3?' (1–'+FCUT[3]+')':'');
function fg(rs){const n=rs.length;let cl=0,o=0;for(const r of rs){if(r[3])cl++;if(r[4])o++}return{n,cl,osl:o,pc:n?cl/n*100:null,sla:n?(n-o)/n*100:null}}
function fbranch(){
 const rs=F.rows.filter(r=>st.u=='ALL'||F.un[r[1]]==st.u);
 const data=F.br.map((b,i)=>{const c=F.m.map((m,k)=>rs.filter(r=>r[0]==i&&r[2]==k).length),L=F.m.length-1,pc=rs.filter(r=>r[0]==i&&r[2]==L-1&&r[9]<=FCUT[L]).length;return{name:b,c,mom:c.length>1?pct(c[L],pc):null}}).filter(d=>st.u=='ALL'||d.c.some(v=>v>0));
 EX.ftb={rows:data.map(d=>({name:d.name,a:d.c[0],b:d.c[1],c:d.c[2],d:d.c[3],mom:d.mom})),cols:[['Branch','name'],...F.m.map((m,k)=>[flab(k),'abcd'[k]]),['MoM Tiket % ('+flab(F.m.length-1)+' vs '+fpl(F.m.length-2)+')','mom']]};addXb('ftb');
 const W=560,H=290,pl=46,pr=12,pt=44,pb=66,n=data.length,gw=(W-pl-pr)/n,mxv=Math.max(1,...data.flatMap(d=>d.c));
 const raw=(mxv*1.1)/4,mg=Math.pow(10,Math.floor(Math.log10(raw))),hi=[1,2,2.5,5,10].find(x=>x*mg>=raw)*mg*4,Y=v=>pt+(H-pt-pb)*(1-v/hi);
 const cols=[['#9FD3B8','#D2EDE0'],['#8DB8EA','#CBE0F6'],['#A38BE0','#D3C9F2'],['#E8A27C','#F6D3BF']];
 let g='';for(let k=0;k<=4;k++){const v=hi*k/4,y=Y(v);g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" style="stroke:var(--bd)"/><text x="${pl-6}" y="${y+4}" text-anchor="end" font-size="11" style="fill:var(--mu)">${Math.round(v)}</text>`}
 let defs='<defs>'+cols.map((c,k)=>`<linearGradient id="fbg${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`).join('')+'</defs>';
 let body=F.m.map((m,k)=>`<rect x="${pl+k*125}" y="10" width="14" height="14" rx="4" fill="url(#fbg${k})"/><text x="${pl+k*125+20}" y="22" font-size="12.5" style="fill:var(--tx)">${flab(k)}</text>`).join('');
 const bw=Math.min(30,gw*.2),gap=4;
 data.forEach((d,i)=>{const cx=pl+gw*(i+.5),tot=d.c.length*bw+(d.c.length-1)*gap;
  d.c.forEach((v,k)=>{const x=cx-tot/2+k*(bw+gap),y=Y(v);body+=`<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(2,H-pb-y)}" rx="8" fill="url(#fbg${k})"/><text x="${x+bw/2}" y="${y-6}" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--tx)">${fi(v)}</text>`});
  body+=`<text x="${cx}" y="${H-pb+20}" text-anchor="middle" font-size="12.5" font-weight="700" style="fill:var(--tx)">${d.name}</text><text x="${cx}" y="${H-pb+38}" text-anchor="middle" font-size="12" style="fill:var(--mu)">${mt(d.mom,'%')}</text>`});
 $('ftb').innerHTML=(st.u!='ALL'?`<div class="note" style="margin:0 0 6px;padding:6px 10px;border-radius:8px;background:#FDF0E3;color:#7A4A12">Filter GraPARI aktif: <b>${st.u}</b> – grafik hanya menampilkan tiket GraPARI ini. <a href="#" onclick="st.u='ALL';sync();render();return false" style="color:#B5541C;font-weight:700">Tampilkan semua GraPARI</a></div>`:'')+`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:720px;display:block;margin:0 auto">${defs}${g}${body}</svg>`}
function ftab(id,rs,onlyKey){
 const g=[...group(rs,r=>F.un[r[1]])].map(([k,x])=>{const a=fg(x),br=F.br[x[0][0]];return{key:k,name:k,br,n:a.n,pc:a.pc,sla:a.sla,html:`<td>${k}</td><td style="text-align:left">${br}</td><td>${a.n}</td><td>${f0(a.pc)}</td><td>${f0(a.sla)}</td>`}});
 table(id,g,[['GraPARI','name'],['Branch','br'],['Jumlah Tiket','n'],['% Closing','pc'],['% in SLA','sla']],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u)}
function lgtab(id,rs){
 const g=[...group(rs,r=>F.un[r[1]])].map(([k,x])=>{const a=fg(x),br=F.br[x[0][0]],lp=x.filter(r=>r[11]&1).length,ga=x.filter(r=>r[11]&2).length;return{key:k,name:k,br,lp,ga,n:a.n,pc:a.pc,sla:a.sla,html:`<td>${k}</td><td style="text-align:left">${br}</td><td><b>${lp}</b></td><td><b>${ga}</b></td><td>${a.n}</td><td>${f0(a.pc)}</td><td>${f0(a.sla)}</td>`}});
 st.sort[id]=st.sort[id]||['n',-1];
 table(id,g,[['Unit Creator (GraPARI)','name'],['Branch','br'],['LAPUL','lp'],['GAUL','ga'],['Total LAPUL/GAUL','n'],['% Closing','pc'],['% in SLA','sla']],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 if(!g.length)$(id).innerHTML='<p class="note">Tidak ada tiket LAPUL/GAUL pada periode dan filter ini.</p>'}
function renderF(){
 const fb=F.rows.filter(r=>(st.b=='ALL'||F.br[r[0]]==st.b)&&(st.u=='ALL'||F.un[r[1]]==st.u)),cur=fb.filter(FC),prv=fb.filter(FP),a=fg(cur),o=fg(prv),hp=fhp(),pm=hp?fpl(st.ff-1):'';
 const per=st.ff=='all'?F.m[0]+'–'+F.m[F.m.length-1]:F.m[st.ff];tdaily('fdl',fb,st.ff,['Agu','Sep','Okt','Nov']);
 const KC=['var(--k1)','var(--k2)','var(--k3)','var(--k4)','#7FB6D9','#D7A3D2','#E8912D','#C0392B'];let kn=0;
 const kc=(t,v,s)=>{const c=KC[kn++];return`<div class="card kpi" style="border-left-color:${c}"><div class="t">${t} · ${per}</div><div class="v">${v}</div><div class="note" style="--kc:${c}">${s}</div></div>`};
 const ar=(v,t)=>`<b style="color:var(--kc);white-space:nowrap">${v>=0?'▲':'▼'} ${t}</b>`;
 const pcx=(x,y)=>hp&&y?ar(x-y,(x>=y?'+':'')+((x-y)/y*100).toFixed(1)+'%'):'';
 const pdx=(x,y)=>hp&&x!=null&&y!=null?ar(x-y,(x>=y?'+':'')+(x-y).toFixed(1)):'';
 const ia=fg(cur.filter(r=>r[5]==1)),io=fg(prv.filter(r=>r[5]==1)),ga=fg(cur.filter(r=>r[6]==1)),go=fg(prv.filter(r=>r[6]==1)),nk=cur.filter(r=>r[8]==1).length,kp=prv.filter(r=>r[8]==1).length,NA=`Data Insera/GAMAS tidak tersedia di file terbaru untuk periode ini`;
 $('fkpi').style.gridTemplateColumns='repeat(auto-fit,minmax(170px,1fr))';
 $('fkpi').innerHTML=kc('🎫 Total tiket',fi(a.n),hp?`${pm}: ${fi(o.n)} · MoM ${pcx(a.n,o.n)}`:'Semua bulan digabung')
  +kc('✅ Closing',`${fi(a.cl)} <span style="font-size:15px">${f0(a.pc)}</span>`,`Open: ${fi(a.n-a.cl)}`+(hp?` · ${pm}: ${f0(o.pc)} · MoM ${pdx(a.pc,o.pc)}`:''))
  +kc('⏱️ % in SLA',f0(a.sla),`In SLA ${fi(a.n-a.osl)} · OSL ${fi(a.osl)}`+(hp?` · ${pm}: ${f0(o.sla)} · MoM ${pdx(a.sla,o.sla)}`:''))
  +kc('🚨 Tiket OSL',fi(a.osl),`${a.n?(a.osl/a.n*100).toFixed(1):0}% dari total tiket`+(hp?` · ${pm}: ${fi(o.osl)} · MoM ${pcx(a.osl,o.osl)}`:''))
  +(nk?kc('🛰️ Tiket Insera',fi(ia.n),`${(ia.n/nk*100).toFixed(1)}% dari ${nk<a.n?fi(nk)+' tiket ber-data':'total tiket'}`+(hp&&kp?` · ${pm}: ${fi(io.n)} · MoM ${pcx(ia.n,io.n)}`:'')):'')
  +kc('🌐 Tiket GAMAS',fi(ga.n),`${a.n?(ga.n/a.n*100).toFixed(1):0}% dari total tiket · hashtag #GAMAS: ${fi(cur.filter(r=>r[10]==1).length)}`+(hp?` · ${pm}: ${fi(go.n)} · MoM ${pcx(ga.n,go.n)}`:''))
  +(()=>{const one=(bit,t,d)=>{const c=cur.filter(r=>r[11]&bit).length,p=prv.filter(r=>r[11]&bit).length;return kc(t,fi(c),`${d} · ${a.n?(c/a.n*100).toFixed(1):0}% dari total tiket`+(hp?` · ${pm}: ${fi(p)} · MoM ${pcx(c,p)}`:''))};return one(1,'🔁 Tiket LAPUL','Lapor ulang')+one(2,'⚡ Tiket GAUL','Gangguan ulang')})();
 $('fi3').style.display=nk?'':'none';
 fbranch();
 const bb=F.rows.filter(r=>FC(r)&&(st.b=='ALL'||F.br[r[0]]==st.b));
 ftab('ft2',bb);ftab('ft3',bb.filter(r=>r[5]==1));ftab('ft4',bb.filter(r=>r[6]==1));lgtab('ft7',bb.filter(r=>r[11]>0));
 const mk=(rs,tot)=>[...group(rs,r=>F.l3[r[7]])].map(([k,x])=>({name:k,n:x.length,sh:tot?x.length/tot*100:0})).sort((x,y)=>y.n-x.n).slice(0,10);
 tbars('ft5',mk(cur,cur.length),'Tiket',0);
 const os=cur.filter(r=>r[4]==1);tbars('ft6',mk(os,os.length),'Tiket OSL',1)}
$('ff').innerHTML=F.m.map((m,i)=>`<option value="${i}">${['Agustus','September','Oktober','November (1–'+FCUT[3]+' Nov, parsial)'][i]||m}</option>`).join('')+'<option value="all">All Month</option>';$('ff').value='2';
$('ff').onchange=e=>{st.ff=e.target.value=='all'?'all':+e.target.value;renderF()};
async function exportFixed(){
 if(noXl())return;
 const rd=v=>v==null?'':typeof v=='number'?Math.round(v*100)/100:v;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const fb=F.rows.filter(r=>(st.b=='ALL'||F.br[r[0]]==st.b)&&(st.u=='ALL'||F.un[r[1]]==st.u)),cur=fb.filter(FC),per=st.ff=='all'?F.m[0]+'–'+F.m[F.m.length-1]:F.m[st.ff],a=fg(cur);
 add('Ringkasan',[['Laporan Tiket Fixed Jabar'],['Periode',per],...finfo().slice(1),['Definisi','Closing = status CLOSE; % in SLA = tiket In SLA / total tiket; OSL = Out SLA'],[],['Metrik','Tiket','Closing','% Closing','OSL','% in SLA'],['Tiket Fixed Jabar - '+per,a.n,a.cl,rd(a.pc),a.osl,rd(a.sla)]]);
 [['ftb','Tiket by Branch'],['ft2','Tiket by GraPARI'],['ft3','GraPARI Tiket Insera'],['ft4','GraPARI Tiket GAMAS'],['ft7','GraPARI LAPUL GAUL'],['ft5','Top 10 Tiket'],['ft6','Top 10 OSL']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,[e.cols.map(c=>c[0]),...e.rows.map(r=>e.cols.map(c=>rd(r[c[1]])))])});
 add('Data tiket',[['Bulan','Branch','GraPARI','case_type_3','Closing','SLA','Insera','GAMAS'],...cur.map(r=>[F.m[r[2]],F.br[r[0]],F.un[r[1]],F.l3[r[7]],r[3]?'Closed':'Open',r[4]?'OSL':'ISL',r[5]?'Ya':'',r[6]?'Ya':''])]);
 await saveFile('Tiket_Fixed_Jabar_'+per+'.xlsx',new Blob([XLSX.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
}

st.km=1;
const KGC=['#5B47C0','#3F86D4','#8A6FDB','#E0654F','#4DA58C','#C7557F'];
const kpct=v=>v==null||v===''?'–':(v*100).toFixed(2)+'%';
function kcell(c,v,tv){
 if(v==null||v==='')return'<td>–</td>';
 const t=c[2];
 if(typeof v=='string'&&'hTAtotp'.includes(t))return`<td style="color:var(--mu)">${v}</td>`;
 if(t=='s')return`<td style="text-align:left">${v}</td>`;
 if(t=='i')return`<td>${fi(v)}</td>`;
 if(t=='cat')return`<td><span class="pill ${v=='>105%'?'pg':v=='<90%'?'pr':'py'}">${v}</span></td>`;
 if(t=='tot')return`<td><b>${kpct(v)}</b></td>`;
 if(t=='h'){const cl=tv!=null&&tv!==''&&typeof v=='number'?(v>=tv?'kok':'kno'):'';return`<td class="${cl}"><b>${kpct(v)}</b></td>`}
 return`<td>${kpct(v)}</td>`}
function ktable(id,md){
 const blk=K.find(b=>b.md==md&&b.mo==st.km),rows=blk.rows.filter(r=>(st.b=='ALL'||UBR.get(r[0])==st.b)&&(st.u=='ALL'||r[0]==st.u));
 const cols=blk.cols;
 let g1='',g2='',i=0,gi=0;
 while(i<cols.length){const g=cols[i][0];let j=i;while(j<cols.length&&cols[j][0]==g&&(g!=''||j==i))j++;
  const c=KGC[gi%KGC.length];
  if(g==''){for(let k=i;k<j;k++){g1+=`<th rowspan="2" class="g1${k==0?' s1':''}" style="--gc:#2B2150;--gt:#fff">${cols[k][1]}</th>`}}
  else{g1+=`<th colspan="${j-i}" class="g1" style="--gc:${c};--gt:#fff">${g}</th>`;for(let k=i;k<j;k++)g2+=`<th class="g2" style="--gc:${c}22;--gt:var(--tx)">${cols[k][1]}</th>`;gi++}
  i=j}
 const body=rows.map(r=>'<tr>'+cols.map((c,k)=>{const v=r[k+1],tv=c[2]=='h'?r[k+2]:null,h=kcell(c,v,tv);return k==0?h.replace('<td','<td class="s1"'):h}).join('')+'</tr>').join('');
 $(id).innerHTML=rows.length?`<table><thead><tr>${g1}</tr><tr>${g2}</tr></thead><tbody>${body}</tbody></table>`:'<p class="note">Tidak ada data untuk filter ini.</p>';
 EX[id]={rows:rows.map(r=>{const o={};cols.forEach((c,k)=>o['c'+k]=r[k+1]);return o}),cols:cols.map((c,k)=>[(c[0]?c[0]+' - ':'')+c[1],'c'+k])};addXb(id)}
function renderK(){ktable('kt1','MOMO');ktable('kt2','TOMO')}
$('km').innerHTML=['Juli','Agustus'].map((m,i)=>`<option value="${i}">${m}</option>`).join('');$('km').value='1';
$('km').onchange=e=>{st.km=+e.target.value;renderK()};
async function exportKPI(){
 if(noXl())return;renderK();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 add('Filter',[['KPI GraPARI Jabar'],...finfo().slice(1)]);
 [['kt1','MOMO'],['kt2','TOMO']].forEach(([id,n])=>{const e=EX[id];if(e)add(n+' '+['Juli','Agustus'][st.km],aoaOf(e))});
 await saveFile('KPI_MOMO_TOMO_'+['Juli','Agustus'][st.km]+'.xlsx',xlsxBlob(wb));
}

// ===== VISIT JABAR =====
V.mo=[];for(let d=0;d<=V.last;d++)V.mo.push(V.ms.filter(x=>d>=x).length-1);const VLM=V.m.length-1,VML=[31,31,30,31,30,31],VCUT=V.last-V.ms[VLM],VPART=VCUT<VML[VLM]-1;const vcutok=d=>!(VPART&&st.vm==VLM)||d-V.ms[VLM-1]<=VCUT;
const UBR=new Map();R.forEach(r=>UBR.set(r[1],r[0]));T.rows.forEach(r=>{if(!UBR.has(T.un[r[1]]))UBR.set(T.un[r[1]],T.br[r[0]])});V.u.forEach((u,i)=>UBR.set(u,V.br[V.ub[i]]));
const dd=d=>new Date(Date.UTC(2026,6,1+d)),dw=d=>dd(d).getUTCDay(),dnum=d=>dd(d).getUTCDate(),dmon=d=>dd(d).getUTCMonth()+1;
const dlab=d=>String(dnum(d)).padStart(2,'0')+'/'+String(dmon(d)).padStart(2,'0');
Object.assign(st,{vm:3,vs:'all',vk:'aktif',vd:'br',vc:'all',vsel:new Set()});
Object.assign(st.sort,{vt1:['n',-1],vt2:['n',-1],vt3:['n',-1],vtr:['n',-1]});
const SVN={all:'Semua',0:'Telkomsel (Mobile)',1:'IndiHome'};
const VCN={all:'Sheet Jumlah CSR (SIAD Update)',csr:'Sheet Jumlah CSR (SIAD Update)'};
const VCS={"GraPARI Bandung Elektronik Center": 12, "GraPARI Banjar": 3, "GraPARI Bantarkalong": 1, "GraPARI Bojongsoang": 2, "GraPARI Ciamis": 4, "GraPARI Cianjur": 4, "GraPARI Ciledug Cirebon": 2, "GraPARI Cimahi": 5, "GraPARI Ekstensi Cipanas": 1, "GraPARI Cirebon": 3, "GraPARI Cirebon Super Blok": 9, "GraPARI Dago": 9, "GraPARI Garut": 6, "GraPARI Indramayu": 4, "GraPARI Jatibarang": 2, "GraPARI Kuningan": 5, "GraPARI Lembang": 2, "GraPARI Lembong": 7, "GraPARI Majalaya": 3, "GraPARI Majalengka": 4, "GraPARI Metro Trade Center Bandung": 5, "GraPARI Miko Mall Bandung": 6, "GraPARI Padalarang": 4, "GraPARI Pamanukan": 2, "GraPARI Pamengpeuk": 1, "GraPARI Pangandaran": 3, "GraPARI Rancaekek": 4, "GraPARI Singaparna": 3, "GraPARI Soreang": 4, "GraPARI Subang": 4, "GraPARI Sukanagara": 1, "GraPARI Sumber": 4, "GraPARI Sumedang": 4, "GraPARI Supratman": 5, "GraPARI Tasikmalaya": 10, "GraPARI Trans Studio Mall Bandung": 8, "GraPARI Ujung Berung": 3};const VCSN=V.u.map(u=>VCS[u]||0);
const VKN={aktif:'Hari aktif (ada visit)',mf:'Senin–Jumat',ms:'Senin–Sabtu'};
const fT=s=>{if(s==null)return'–';const t=Math.round(Math.abs(s)),m=Math.floor(t/60);return(s<0&&t>0?'-':'')+m+':'+String(t%60).padStart(2,'0')};
const fTd=v=>v==null?'–':Math.abs(v)<0.5?'0:00':`<span class="dl ${v>0?'neg':'pos'}">${v>0?'▲ +':'▼ '}${fT(Math.abs(v))}</span>`;
const vp=(x,y)=>x==null||!y?null:(x-y)/y*100;
const fpg=v=>v==null?'–':Math.abs(v)<0.05?'0.0%':`<span class="dl ${v>=0?'pos':'neg'}">${v>=0?'▲ +':'▼ '}${v.toFixed(1)}%</span>`;
const fx1=v=>v==null?'–':v.toFixed(2);
const vcur=r=>st.vm=='all'||V.mo[r[0]]==st.vm,vprv=r=>st.vm!='all'&&st.vm>0&&V.mo[r[0]]==st.vm-1&&vcutok(r[0]),vhp=()=>st.vm!='all'&&st.vm>0,vsc=r=>vcur(r)||vprv(r);
const vlast=()=>dnum(V.last);
const vlbl=()=>st.vm=='all'?V.m[0]+'–'+V.m[VLM]+' (gabungan)':V.m[st.vm]+(st.vm==VLM&&VPART?` (1–${vlast()})`:'');const vpl=()=>V.m[st.vm-1]+(st.vm==VLM&&VPART?` (1–${vlast()})`:'');
const vbrn=r=>V.br[V.ub[r[1]]];
const vf=(r,b,u)=>(b=='ALL'||vbrn(r)==b)&&(u=='ALL'||V.u[r[1]]==u);
const vbase=()=>V.rows.filter(r=>vsc(r)&&vf(r,st.b,st.u));
const wk=d=>{const w=dw(d);return st.vk=='mf'?w>=1&&w<=5:st.vk=='ms'?w>=1&&w<=6:true};
const calHK=p=>{let c=0;for(let d=0;d<=V.last;d++)if(p(d)&&wk(d))c++;return c};
const vK=()=>({c:calHK(d=>st.vm=='all'||V.mo[d]==st.vm),p:vhp()?calHK(d=>V.mo[d]==st.vm-1&&vcutok(d)):0});
function va(rs){let m0=0,m1=0,n=0,w=0,s=0,iv=0;const ds=new Set(),ks=new Set();
 for(const r of rs){if(r[3]==0)m0+=r[4];else m1+=r[4];
  if(st.vs=='all'||r[3]==st.vs){n+=r[4];w+=r[5];s+=r[6];if(wk(r[0])){iv+=r[4];ds.add(r[0]);ks.add(r[1])}}}
 return{m0,m1,n,w,s,iv,days:ds.size,csr:[...ks].reduce((x,u)=>x+VCSN[u],0)}}
function vmet(rs,K,div=true){const hp=vhp(),a=va(rs.filter(vcur)),o=hp?va(rs.filter(vprv)):null;
 const ha=st.vk=='aktif'?a.days:K.c,hb=o?(st.vk=='aktif'?o.days:K.p):0,dn=x=>div?x.csr:1;
 const idx=ha&&dn(a)?a.iv/dn(a)/ha:null,pidx=o&&hb&&dn(o)?o.iv/dn(o)/hb:null;
 const as=a.n?a.s/a.n:null,aw=a.n?a.w/a.n:null,pas=o&&o.n?o.s/o.n:null,paw=o&&o.n?o.w/o.n:null;
 const tv=a.m0+a.m1,M={m0:a.m0,m1:a.m1,p0:tv?a.m0/tv*100:null,p1:tv?a.m1/tv*100:null,n:a.n,pn:o?o.n:null,mn:o?vp(a.n,o.n):null,as,pas,mas:dv(as,pas),aw,paw,maw:dv(aw,paw),hk:ha,cs:a.csr,idx,pidx,midx:o?vp(idx,pidx):null};
 M.html=`<td>${a.m0}</td><td>${a.m1}</td><td>${M.p0==null?'–':f1(M.p0)+'%'}</td><td>${M.p1==null?'–':f1(M.p1)+'%'}</td><td><b>${a.n}</b></td><td>${fp(M.mn)}</td><td>${fT(as)}</td><td>${fTd(M.mas)}</td><td>${fT(aw)}</td><td>${fTd(M.maw)}</td><td>${ha}</td>${div?`<td>${a.csr}</td>`:''}<td><b>${fx1(idx)}</b></td><td>${fpg(M.midx)}</td>`;
 return M}
const vcols=div=>{const sn=st.vs=='all'?'Total':SVN[st.vs];return[['Visit Telkomsel','m0'],['Visit IndiHome','m1'],['% Telkomsel','p0'],['% IndiHome','p1'],['Visit '+sn,'n'],['MoM Visit (%)','mn'],['Avg Serving (m:ss)','as','t'],['MoM Serving','mas','td'],['Avg Waiting (m:ss)','aw','t'],['MoM Waiting','maw','td'],['Hari Kerja','hk'],...(div?[['Jumlah CSR','cs']]:[]),[div?'Index Visit/CSR/Hari':'Index Visit/Hari','idx'],['MoM Index (%)','midx']]};
function vbuild(kind){const K=vK(),cols=vcols(true);let rows;
 if(kind=='vt1'){const rs=V.rows.filter(r=>vsc(r)&&vf(r,'ALL',st.u));rows=[...group(rs,vbrn)].map(([k,g])=>{const m=vmet(g,K);return{key:k,name:k,...m,html:`<td>${k}</td>`+m.html}});const tm=vmet(rs,K);return{rows,total:{key:'__tot',name:'Total Jabar',...tm,html:`<td>Total Jabar</td>`+tm.html},cols:[['Branch','name'],...cols]}}
 if(kind=='vt2'){const rs=V.rows.filter(r=>vsc(r)&&vf(r,st.b,'ALL'));rows=[...group(rs,r=>r[1])].map(([k,g])=>{const m=vmet(g,K),b=vbrn(g[0]);return{key:V.u[k],name:V.u[k],br:b,...m,html:`<td>${V.u[k]}</td><td style="text-align:left">${b}</td>`+m.html}});return{rows,cols:[['GraPARI','name'],['Branch','br'],...cols]}}
 const q=($('vq').value||'').trim().toLowerCase(),mn=+$('vmin').value||1,cf=$('vcf').value;
 rows=[...group(vbase(),r=>r[2])].map(([k,g])=>{const nik=V.k[k],s=S[nik],m=vmet(g,K,false);
  const uc=new Map();for(const r of g.filter(vcur))uc.set(r[1],(uc.get(r[1])||0)+r[4]);const mu=[...uc].sort((x,y)=>y[1]-x[1])[0],un=mu?V.u[mu[0]]:'–';
  const nm=s?s[0]:'(tidak ada di SIAD)';
  return{key:nik,name:nm,nik,role:s?s[1]:'–',grp:s?s[2]:'–',unit:un,br:mu?V.br[V.ub[mu[0]]]:'–',...m,html:`<td>${s?s[0]:'<i>(tidak ada di SIAD)</i>'}</td><td style="text-align:left">${s?s[1]:'–'}</td><td style="text-align:left">${un}</td>`+m.html}})
  .filter(r=>(r.m0+r.m1)>=mn&&r.role!='–'&&(cf=='ALL'||r.grp=='CSR')&&(!q||(r.name+r.nik).toLowerCase().includes(q)));
 return{rows,cols:[['Nama CSR','name'],['Role (Job Function)','role'],['GraPARI utama','unit'],...vcols(false)]}}
function vtrend(dim){
 const days=[];if(st.vm=='all'){for(let d=0;d<=V.last;d++)days.push(d)}else{const VME=V.ms.map((x,i)=>i<VLM?V.ms[i+1]-1:x+VML[i]-1);for(let d=V.ms[st.vm];d<=VME[st.vm];d++)days.push(d)}
 const kf=dim=='br'?vbrn:dim=='un'?(r=>V.u[r[1]]):(r=>V.k[r[2]]);
 const rs=V.rows.filter(r=>vcur(r)&&(st.vs=='all'||r[3]==st.vs)&&vf(r,st.b,st.u));
 const rows=[...group(rs,kf)].map(([k,g])=>{const o={key:k,name:dim=='csr'?((S[k]?S[k][0]:'(tidak ada di SIAD)')+' · '+k):k,n:0};for(const d of days)o['d'+d]=0;for(const r of g){o['d'+r[0]]+=r[4];o.n+=r[4]}return o}).filter(o=>dim!='csr'||S[o.key]);
 let max=1;for(const o of rows)for(const d of days)if(o['d'+d]>max)max=o['d'+d];
 const cols=[[{br:'Branch',un:'GraPARI',csr:'CSR · NIK'}[dim],'name'],['Total','n'],...days.map(d=>[st.vm=='all'?dlab(d):String(dnum(d)),'d'+d])];
 rows.forEach(o=>{o.html=`<td>${o.name}</td><td><b>${o.n}</b></td>`+days.map(d=>{const v=o['d'+d];return`<td style="${v?`background:rgba(77,84,70,${(v/max*.4).toFixed(2)})`:'color:var(--mu)'}">${v||'·'}</td>`}).join('')});
 return{rows,cols,days}}
const VCOL=['#EC0000','#6A55C8','#3FA7D6','#F2A58A','#A38BE0','#33A67F','#D7A3D2','#2B2150'];
const vnice=m=>{const p=Math.pow(10,Math.floor(Math.log10(m))),f=m/p;return(f<=1?1:f<=2?2:f<=5?5:10)*p};
function vchart(tr){
 let rows=tr.rows.slice().sort((a,b)=>b.n-a.n);const sel=rows.filter(o=>st.vsel.has(o.key));
 rows=(sel.length?sel:rows.slice(0,5)).slice(0,8);const days=tr.days;
 if(!rows.length||!days.length)return'<p class="note">Tidak ada data visit untuk filter ini.</p>';
 const W=900,H=280,L=46,RR=14,T0=14,B=30,pw=W-L-RR,ph=H-T0-B,n=days.length;
 let ym=1;for(const o of rows)for(const d of days)ym=Math.max(ym,o['d'+d]);
 const ys=vnice(ym),X=i=>L+(n>1?pw*i/(n-1):pw/2),Y=v=>T0+ph-ph*v/ys,bw=n>1?pw/(n-1):20,step=n<=16?1:n<=31?2:7;
 let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:640px;color:var(--tx);display:block" role="img" aria-label="Tren visit harian">`;
 days.forEach((d,i)=>{if(dw(d)==0)s+=`<rect x="${(X(i)-bw/2).toFixed(1)}" y="${T0}" width="${bw.toFixed(1)}" height="${ph}" fill="currentColor" opacity=".07"/>`});
 for(let t=0;t<=4;t++){const v=ys*t/4,y=Y(v);s+=`<line x1="${L}" x2="${W-RR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="currentColor" opacity=".12"/><text x="${L-6}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="currentColor" opacity=".65">${Math.round(v)}</text>`}
 days.forEach((d,i)=>{if(i%step==0)s+=`<text x="${X(i).toFixed(1)}" y="${H-10}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".65">${st.vm=='all'?dlab(d):dnum(d)}</text>`});
 rows.forEach((o,j)=>{const c=VCOL[j%VCOL.length];s+=`<polyline fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" points="${days.map((d,i)=>d<=V.last?X(i).toFixed(1)+','+Y(o['d'+d]).toFixed(1):'').filter(x=>x).join(' ')}"/>`;
  if(n<=40)days.forEach((d,i)=>{if(d>V.last)return;s+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(o['d'+d]).toFixed(1)}" r="3" fill="${c}"><title>${o.name} · ${dlab(d)}: ${o['d'+d]} visit</title></circle>`})});
 s+='</svg>';
 return s+`<div class="lg" style="margin:6px 0 4px">${rows.map((o,j)=>`<span><span class="dot" style="background:${VCOL[j%VCOL.length]}"></span><b>${o.name}</b> (${o.n})</span>`).join('')}</div>`}
function vcmp(){
 const b=V.rows.filter(r=>vf(r,st.b,st.u)),ms=V.m.map((m,i)=>{let t=0,h=0,pt=0,ph_=0;const cut=i==VLM&&VPART;for(const r of b){const mo=V.mo[r[0]];if(mo==i){if(r[3]==0)t+=r[4];else h+=r[4]}else if(i>0&&mo==i-1&&(!cut||r[0]-V.ms[i-1]<=VCUT)){if(r[3]==0)pt+=r[4];else ph_+=r[4]}}return{m:i==VLM&&VPART?`${m} (1–${vlast()})`:m,i,t,h,pt,ph:ph_,pl:cut?`${V.m[i-1]} 1–${vlast()}`:V.m[i-1]}});
 const W=900,H=292,L=54,RR=14,T0=22,B=76,pw=W-L-RR,ph=H-T0-B,gw=pw/ms.length,bw=gw*.27,ys=vnice(Math.max(1,...ms.map(x=>Math.max(x.t,x.h)))),Y=v=>T0+ph-ph*v/ys,C0='#F2A58A',C1='#7FB6D9',nf=v=>v.toLocaleString('id-ID');
 let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:560px;color:var(--tx);display:block" role="img" aria-label="Perbandingan visit Telkomsel dan IndiHome per bulan">`;
 for(let k=0;k<=4;k++){const v=ys*k/4,y=Y(v);s+=`<line x1="${L}" x2="${W-RR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="currentColor" opacity=".12"/><text x="${L-6}" y="${(y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="currentColor" opacity=".65">${nf(Math.round(v))}</text>`}
 ms.forEach((x,i)=>{const cx=L+gw*i+gw/2,tot=x.t+x.h;
  if(st.vm==x.i)s+=`<rect x="${(cx-gw/2+4).toFixed(1)}" y="${T0-8}" width="${(gw-8).toFixed(1)}" height="${ph+8}" rx="6" fill="currentColor" opacity=".06"/>`;
  [[x.t,cx-bw-2,C0,'Telkomsel (Mobile)'],[x.h,cx+2,C1,'IndiHome']].forEach(([v,bx,c,nm])=>{const y=Y(v);s+=`<rect x="${bx.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${(T0+ph-y).toFixed(1)}" rx="3" fill="${c}"><title>${x.m} · ${nm}: ${nf(v)} visit</title></rect><text x="${(bx+bw/2).toFixed(1)}" y="${(y-5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="currentColor">${nf(v)}</text>${(T0+ph-y)>22&&tot?`<text x="${(bx+bw/2).toFixed(1)}" y="${(y+17).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#1F2340">${(v/tot*100).toFixed(1)}%</text>`:''}`});
  const mm=(c,p)=>p?((c-p)/p*100):null,mt=(v,big)=>v==null?'<tspan opacity=".55">–</tspan>':`<tspan fill="${v>=0?'#2E7D32':'#C0392B'}" font-weight="700">${v>=0?'▲ +':'▼ '}${v.toFixed(1)}%</tspan>`,mT=mm(tot,x.pt+x.ph);
  s+=`<text x="${cx.toFixed(1)}" y="${T0+ph+18}" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">${x.m}</text><text x="${cx.toFixed(1)}" y="${T0+ph+35}" text-anchor="middle" font-size="11.5" fill="currentColor">${nf(tot)} · MoM ${mt(mT)}<title>${x.i?`vs ${x.pl}: ${nf(x.pt+x.ph)} visit`:'Tidak ada bulan pembanding'}</title></text><text x="${cx.toFixed(1)}" y="${T0+ph+51}" text-anchor="middle" font-size="10.5" fill="currentColor" opacity=".85">Tsel ${mt(mm(x.t,x.pt))} · IH ${mt(mm(x.h,x.ph))}</text>${x.i&&i==ms.length-1&&VPART?`<text x="${cx.toFixed(1)}" y="${T0+ph+66}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".6">vs ${x.pl}</text>`:''}`});
 return`<div class="card" style="grid-column:1/-1"><h2><span class="ic">📱</span>Perbandingan Visit Telkomsel (Mobile) vs IndiHome per bulan &amp; MoM</h2><div class="tw">${s}</svg></div><div class="lg" style="margin-top:6px"><span><span class="dot" style="background:${C0}"></span>Telkomsel (Mobile)</span><span><span class="dot" style="background:${C1}"></span>IndiHome</span></div></div>`}
function vtot(t){if(!t.total)return;EX.vt1.rows.push(t.total);const tb=$('vt1').querySelector('tbody');if(tb)tb.insertAdjacentHTML('beforeend',`<tr style="font-weight:700;border-top:2px solid var(--bd)">${t.total.html}</tr>`)}
function renderV(){
 const K=vK(),hp=vhp(),b=vbase(),a=va(b.filter(vcur)),o=hp?va(b.filter(vprv)):null;
 const ha=st.vk=='aktif'?a.days:K.c,hb=o?(st.vk=='aktif'?o.days:K.p):0;
 const idx=ha&&a.csr?a.iv/a.csr/ha:null,pidx=o&&hb&&o.csr?o.iv/o.csr/hb:null,as=a.n?a.s/a.n:null,aw=a.n?a.w/a.n:null,pas=o&&o.n?o.s/o.n:null,paw=o&&o.n?o.w/o.n:null;
 const per=vlbl(),pm=hp?vpl():'';
 const nt=(pv,mo)=>hp?`${pm}: ${pv} · MoM ${mo}`:(st.vm=='all'?'Gabungan semua bulan, tanpa pembanding':'Bulan pertama data, tanpa pembanding');
 const mb=m=>m==null||isNaN(m)?'':`<span style="display:inline-block;vertical-align:middle;margin-left:10px;padding:3px 10px;border-radius:999px;font-size:15px;font-weight:800;background:${m>=0?'#E3F4E8':'#FDE7E7'};color:${m>=0?'#1E7B3C':'#C0392B'}">${m>=0?'▲ +':'▼ '}${Math.abs(m)<0.05?'0.0':m.toFixed(1)}% <span style="font-size:11px;font-weight:700;opacity:.8">MoM</span></span>`;
 const kc=(t,v,s,m)=>`<div class="card kpi"><div class="t">${t} · ${per}</div><div class="v">${v}${mb(m)}</div><div class="note">${s}</div></div>`;
 const sn=st.vs=='all'?'Total':SVN[st.vs];
 $('vkpi').innerHTML=kc('👥 Visit '+sn,a.n.toLocaleString('id-ID'),nt(o?o.n.toLocaleString('id-ID'):'',fp(o?vp(a.n,o.n):null)),o?vp(a.n,o.n):null)
  +kc('📱 Visit Telkomsel (Mobile)',a.m0.toLocaleString('id-ID'),nt(o?o.m0.toLocaleString('id-ID'):'',fp(o?vp(a.m0,o.m0):null)),o?vp(a.m0,o.m0):null)
  +kc('🏠 Visit IndiHome',a.m1.toLocaleString('id-ID'),nt(o?o.m1.toLocaleString('id-ID'):'',fp(o?vp(a.m1,o.m1):null)),o?vp(a.m1,o.m1):null)
  +kc('📈 Index Visit / CSR / Hari Kerja',fx1(idx),nt(fx1(pidx),fpg(o?vp(idx,pidx):null)),o?vp(idx,pidx):null)
  +vcmp();
 const t1=vbuild('vt1'),t2=vbuild('vt2'),t3=vbuild('vt3'),tr=vtrend(st.vd);
 table('vt1',t1.rows,t1.cols,k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);vtot(t1);
 table('vt2',t2.rows,t2.cols,k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 table('vt3',t3.rows,t3.cols);
 table('vtr',tr.rows,tr.cols,k=>{st.vsel.has(k)?st.vsel.delete(k):st.vsel.add(k);renderV()});
 $('vtr').querySelectorAll('tr.cl').forEach(x=>{if(st.vsel.has(x.dataset.key))x.classList.add('sel')});
 $('vch').innerHTML=vchart(tr);
 $('vtn').textContent=`Tren harian ${per} · tipe service: ${SVN[st.vs]}. Area abu-abu pada grafik = hari Minggu. Klik baris tabel untuk memilih entitas pada grafik (maks. 8); tanpa pilihan, grafik menampilkan 5 teratas.`;
 $('vnote').textContent='';
}
$('vm').innerHTML=[['0','Juli'],['1','Agustus'],['2','September'],['3','Oktober'],['4','November'+(VPART?` (1–${vlast()} Nov, parsial)`:'')],['all','All Month']].map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('');
$('vm').onchange=e=>{const v=e.target.value;st.vm=v=='all'?'all':+v;renderV();if(window.dmSync)dmSync()};
$('vs').onchange=e=>{st.vs=e.target.value=='all'?'all':+e.target.value;renderV()};
$('vk').onchange=e=>{st.vk=e.target.value;renderV()};

$('vd').onchange=e=>{st.vd=e.target.value;st.vsel.clear();renderV()};
['vq','vmin','vcf'].forEach(i=>$(i).oninput=renderV);
// ===== EXPORT EXCEL =====
const rdx=(v,c)=>v==null?'':(c&&c[2]=='t')?fT(v):(c&&c[2]=='td')?(v>0?'+':'')+fT(v):typeof v=='number'?Math.round(v*100)/100:v;
const aoaOf=e=>[e.cols.map(c=>c[0]),...e.rows.map(r=>e.cols.map(c=>rdx(r[c[1]],c)))];
function finfo(){const p=st.p||1,L=[['Tab',['','tNPS Mobile','Tiket Mobile','Visit Jabar','Waiting Time','CAPS','Tiket Fixed','KPI'][p]],['Branch Jabar',st.b=='ALL'?'Semua':st.b],['unit_name / GraPARI',st.u=='ALL'?'Semua':st.u]];
 if(p==1)L.push(['Bulan',lbl()],['Respon Kategori',CSL()]);
 else if(p==2)L.push(['Bulan tiket',st.tm=='all'?T.m[0]+'–'+T.m[T.m.length-1]:T.m[st.tm]],['Level top tiket',['CASE_TYPE_1','CASE_TYPE_2','CASE_TYPE_3'][st.tl-5]]);
 else if(p==7)L.push(['Bulan KPI',['Juli','Agustus'][st.km]]);
 else if(p==6)L.push(['Bulan tiket fixed',st.ff=='all'?F.m[0]+'–'+F.m[F.m.length-1]:F.m[st.ff]]);
 else if(p==5)L.push(['Bulan load CAPS',cpl()],['Pembanding MoM',cphp()?CP.ms[st.cm-1]:'-']);else if(p==4)L.push(['Bulan waiting time',wlbl()],['Pembanding MoM',whp()?W.ms[st.wm-1]:'-']);else L.push(['Bulan visit',vlbl()],['Pembanding MoM',vhp()?vpl():'-'],['Tipe service',SVN[st.vs]],['Basis hari kerja',VKN[st.vk]],['Jumlah CSR (pembagi Index)',VCN.all]);
 return L}
function addXb(id){const el=$(id);if(!el||el.dataset.xb)return;el.dataset.xb='1';let h=el.previousElementSibling;while(h&&h.tagName!='H2')h=h.previousElementSibling;
 if(!h){const c=el.closest('.card');h=c&&c.querySelector('h2')}if(!h)return;
 const ttl=(h.textContent||id).trim().replace(/^[^\p{L}\p{N}%]+/u,''),b=document.createElement('button');b.className='chip xb';b.textContent='⬇ Excel';b.onclick=ev=>{ev.stopPropagation();exportTable(id,ttl)};h.appendChild(b)}
const noXl=()=>{if(typeof XLSX=='undefined'){alert('Library Excel belum termuat. Pastikan terhubung ke internet lalu muat ulang halaman.');return true}return false};
const xlsxBlob=wb=>new Blob([XLSX.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
const shName=s=>String(s).replace(/[\\\/\?\*\[\]:]/g,' ').slice(0,31)||'Data';
async function exportTable(id,title){
 if(noXl())return;const e=EX[id];if(!e)return;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 add(shName(title||id),aoaOf(e));add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile((String(title||id).replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'_').slice(0,40)||id)+'.xlsx',xlsxBlob(wb));
}
async function exportVisit(){
 if(noXl())return;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const K=vK(),hp=vhp(),b=vbase(),a=va(b.filter(vcur)),o=hp?va(b.filter(vprv)):null,rd=v=>v==null?'':Math.round(v*100)/100;
 const ha=st.vk=='aktif'?a.days:K.c,hb=o?(st.vk=='aktif'?o.days:K.p):0,idx=ha&&a.csr?a.iv/a.csr/ha:null,pidx=o&&hb&&o.csr?o.iv/o.csr/hb:null;
 const as=a.n?a.s/a.n:null,aw=a.n?a.w/a.n:null,pas=o&&o.n?o.s/o.n:null,paw=o&&o.n?o.w/o.n:null,sn=st.vs=='all'?'Total':SVN[st.vs];
 add('Ringkasan',[['Laporan Visit GraPARI Jabar'],...finfo().slice(1),['Rumus Index','Branch, GraPARI & All = total visit / jumlah CSR / hari kerja; CSR = total visit / hari kerja'],[],['Metrik','Periode ini','Bulan lalu','MoM','Satuan MoM'],
  ['Visit '+sn,a.n,o?o.n:'',rd(o?vp(a.n,o.n):null),'%'],['Visit Telkomsel (Mobile)',a.m0,o?o.m0:'',rd(o?vp(a.m0,o.m0):null),'%'],['Visit IndiHome',a.m1,o?o.m1:'',rd(o?vp(a.m1,o.m1):null),'%'],
  ['Avg Serving Time (m:ss)',fT(as),o?fT(pas):'',rdx(dv(as,pas),['','','td']),'m:ss'],['Avg Waiting Time (m:ss)',fT(aw),o?fT(paw):'',rdx(dv(aw,paw),['','','td']),'m:ss'],
  ['Hari Kerja',ha,o?hb:'','',''],['Jumlah CSR (pembagi Index)',a.csr,o?o.csr:'','',''],['Index Visit / Hari Kerja',rd(idx),rd(pidx),rd(o?vp(idx,pidx):null),'%']]);
 [['vt1','Per Branch'],['vt2','Per GraPARI'],['vt3','Per CSR']].forEach(([k,n])=>{const t=vbuild(k);t.rows.sort((x,y)=>y.n-x.n);if(t.total)t.rows.push(t.total);add(n,aoaOf(t))});
 [['br','Tren Branch'],['un','Tren GraPARI'],['csr','Tren CSR']].forEach(([k,n])=>{const t=vtrend(k);t.rows.sort((x,y)=>y.n-x.n);t.cols=t.cols.map((c,i)=>i<2?c:[dlab(t.days[i-2]),c[1]]);add(n,aoaOf(t))});
 add('Data visit',[['Tanggal','Bulan','Branch','GraPARI','NIK','Nama CSR','Role','Service','Visit','Avg Waiting (m:ss)','Avg Serving (m:ss)'],...b.map(r=>{const nik=V.k[r[2]],s=S[nik];return[dd(r[0]).toISOString().slice(0,10),V.m[V.mo[r[0]]],vbrn(r),V.u[r[1]],nik,s?s[0]:'',s?s[1]:'',r[3]?'IndiHome':'Telkomsel',r[4],fT(r[5]/r[4]),fT(r[6]/r[4])]})]);
 await saveFile('Visit_Jabar_'+(st.vm=='all'?V.m[0]+'-'+V.m[VLM]:V.m[st.vm])+'.xlsx',xlsxBlob(wb));
}
/* ===== Waiting Time module ===== */
const WBR=['Bandung','Cirebon','Soreang','Tasikmalaya'],WMD=['MOMO','TOMO'],WTP=['Lite','Small','Medium'],WSTD=['≤ 5 menit','≤ 10 menit','≤ 20 menit'],WCOL=['#4FB08C','#9AD07A','#F0C75E','#F2A05E','#EC5A4F','#B3262B'];
W.u.forEach(x=>{if(!UBR.has(x[0]))UBR.set(x[0],WBR[x[1]])});
st.wm=3;Object.assign(st.sort,{ww1:['name',1],ww2:['kpi',-1],ww3:['name',1],ww4:['kpi',1],ww5:['ord',1]});
const isWC=r=>st.wm=='all'||r[1]==st.wm,isWP=r=>st.wm!='all'&&st.wm>0&&r[1]==st.wm-1;
const wlbl=()=>st.wm=='all'?W.ms[0]+'–'+W.ms[W.ms.length-1]:W.ms[st.wm]+(st.wm==W.ms.length-1&&VPART?` (1–${vlast()})`:'');
const whp=()=>st.wm!='all'&&st.wm>0;
const fi=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const wu=r=>W.u[r[0]];
function wagg(rs){const a={n:0,ok:0,b:[0,0,0,0,0,0]};for(const r of rs){const k=W.kt[wu(r)[3]];a.n+=r[8];for(let i=0;i<6;i++){a.b[i]+=r[2+i];if(i<k)a.ok+=r[2+i]}}a.kpi=a.n?a.ok/a.n*100:null;return a}
const wbOnlyU=()=>W.r.filter(r=>st.u=='ALL'||wu(r)[0]==st.u);
const wbOnlyB=()=>W.r.filter(r=>st.b=='ALL'||WBR[wu(r)[1]]==st.b);
const wbase=()=>W.r.filter(r=>(st.b=='ALL'||WBR[wu(r)[1]]==st.b)&&(st.u=='ALL'||wu(r)[0]==st.u));
const WCOLS=[['Total antrian','n'],['Dalam KPI','ok'],['%KPI','kpi'],['%KPI bln lalu','pk'],['MoM','mom']];
function wm_(rs){const a=wagg(rs.filter(isWC)),o=wagg(rs.filter(isWP)),hp=whp(),mom=hp?dv(a.kpi,o.kpi):null;
 const sh=a.b.map(x=>a.n?x/a.n*100:null);
 return{n:a.n,ok:a.ok,kpi:a.kpi,pk:hp?o.kpi:null,mom,sh,a,
 html:`<td>${fi(a.n)}</td><td>${fi(a.ok)}</td><td><b>${a.kpi==null?'–':f1(a.kpi)+'%'}</b></td><td>${hp&&o.kpi!=null?f1(o.kpi)+'%':'–'}</td><td>${dl(mom)}</td>`}}
function wrows(rs,keyf,namef,extra){return [...group(rs,keyf)].map(([k,g])=>{const m=wm_(g);return{key:String(k),name:namef(k),...m,...(extra?extra(k,g):{}),html:null,_m:m}})}
function wbars(id,rows,lab,onclick,selKey){
 EX[id]={rows:rows.map(r=>({name:r.name,n:r.n,kpi:r.kpi,mom:r.mom})),cols:[[lab,'name'],['Total antrian','n'],['%KPI','kpi'],['MoM','mom']]};addXb(id);
 if(!rows.length){$(id).innerHTML='<p class="note">Tidak ada data.</p>';return}
 const pal=[['#8DB8EA','#CBE0F6'],['#A38BE0','#D3C9F2'],['#F2A58A','#F9D5C7'],['#B5A5EE','#DDD7F8'],['#9FB7C6','#D2DEE6'],['#7FB6D9','#C5DFEE']];
 $(id).innerHTML=rows.map((r,i)=>{const c=pal[i%pal.length],mo=whp()?` ${dl(r.mom)}`:'';
  return`<div class="cr${onclick?' wcl':''}" data-key="${String(r.key).replace(/"/g,'&quot;')}" style="${selKey&&r.key==selKey?'background:var(--hl);':''}${onclick?'cursor:pointer':''}"><div class="cl" style="cursor:inherit;font-weight:700">${r.name}</div><div class="ct"><div class="cb" style="width:${Math.max(0,Math.min(100,r.kpi||0)).toFixed(1)}%;background:linear-gradient(90deg,${c[1]},${c[0]})"></div></div><div class="cv"><b>${r.kpi==null?'–':f1(r.kpi)+'%'}</b>${mo} <span class="cj">${fi(r.n)} antrian</span></div></div>`}).join('');
 if(onclick)$(id).querySelectorAll('.wcl').forEach(d=>d.onclick=()=>onclick(d.dataset.key))}
function wfill(rows,pre){rows.forEach(r=>{r.html=pre(r)+r._m.html});return rows}
function renderW(){
 const b=wbase(),a=wagg(b.filter(isWC)),o=wagg(b.filter(isWP)),hp=whp();
 const card=(el,t,A,O)=>{$(el).innerHTML=`<div class="t">⏱️ %KPI ${t} · ${wlbl()}</div><div class="v ${A.kpi!=null&&A.kpi>=95?'pos':''}">${A.kpi==null?'–':f1(A.kpi)+'%'} <span style="font-size:15px">${hp?dl(dv(A.kpi,O.kpi))+' MoM':''}</span></div>`};
 card('wk1','Total Jabar',a,o);
 [['wk2',0],['wk3',1]].forEach(([el,mi])=>{const f=r=>W.u[r[0]][2]==mi;card(el,WMD[mi],wagg(b.filter(isWC).filter(f)),wagg(b.filter(isWP).filter(f)))});
 // distribusi
 const dist=[['Total Jabar',b],...WMD.map((m,i)=>[m,b.filter(r=>wu(r)[2]==i)])].map(([n,rs])=>[n,wagg(rs.filter(isWC))]);
 $('wdist').innerHTML=dist.map(([n,A])=>`<div style="margin:8px 0"><div style="font-size:12px;margin-bottom:3px"><b>${n}</b> · ${fi(A.n)} antrian</div><div class="stack">${A.b.map((x,i)=>`<i style="width:${A.n?x/A.n*100:0}%;background:${WCOL[i]}"></i>`).join('')}</div></div>`).join('')+`<div class="lg">${W.bk.map((l,i)=>`<span><span class="dot" style="background:${WCOL[i]}"></span>${l} mnt</span>`).join('')}</div>`;
 // MOMO vs TOMO
 let rows;
 // Branch (filter unit saja)
 rows=wrows(wbOnlyU(),r=>WBR[wu(r)[1]],k=>k).sort((x,y)=>(y.kpi??-1)-(x.kpi??-1));
 wbars('ww2',rows,'Branch',k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 // Tipe
 // per GraPARI (filter branch saja)
 rows=wfill(wrows(wbOnlyB(),r=>wu(r)[0],k=>k,(k,g)=>{const u=wu(g[0]);return{br:WBR[u[1]],md:WMD[u[2]],tp:WTP[u[3]],std:WSTD[u[3]]}}).map(r=>{W.bk.forEach((_,i)=>r['b'+i]=r.sh[i]);return r}),
  r=>`<td>${r.name}</td><td style="text-align:left">${r.br}</td><td style="text-align:left">${r.md}</td><td style="text-align:left">${r.tp} (${r.std})</td>`);rows.forEach(r=>{r.html=r.html.replace(/(<td><b>[^<]*<\/b><\/td>)<td>[^<]*<\/td>/,'$1')});
 table('ww4',rows,[['GraPARI','name'],['Branch','br'],['Model','md'],['Tipe (standar)','tp'],...WCOLS.filter(c=>c[1]!='pk')],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 $('wnote').textContent='';
}
async function exportWait(){
 if(noXl())return;renderW();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const b=wbase(),a=wagg(b.filter(isWC)),o=wagg(b.filter(isWP)),hp=whp(),rd=v=>v==null?'':Math.round(v*100)/100;
 add('Ringkasan',[['Laporan Waiting Time GraPARI Jabar'],...finfo().slice(1),['Rumus %KPI','Antrian dalam standar ÷ total antrian. Standar: Lite ≤5 menit, Small ≤10 menit, Medium ≤20 menit'],[],['Metrik','Periode ini','Bulan lalu','MoM'],
  ['Total antrian',a.n,hp?o.n:'',''],['Dalam KPI',a.ok,hp?o.ok:'',''],['%KPI Total Jabar',rd(a.kpi),hp?rd(o.kpi):'',hp?rd(dv(a.kpi,o.kpi)):''],
  ...WMD.map((m,i)=>{const f=r=>wu(r)[2]==i,A=wagg(b.filter(isWC).filter(f)),O=wagg(b.filter(isWP).filter(f));return['%KPI '+m,rd(A.kpi),hp?rd(O.kpi):'',hp?rd(dv(A.kpi,O.kpi)):'']})]);
 [['ww2','Per Branch'],['ww4','Per GraPARI']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,aoaOf(e))});
 add('Data waiting time',[['Bulan','GraPARI','Branch','Model','Tipe GraPARI','Standar',...W.bk.map(x=>x+' menit'),'Total','Dalam KPI','%KPI'],...b.filter(r=>isWC(r)||isWP(r)).map(r=>{const u=wu(r),k=W.kt[u[3]],ok=r.slice(2,2+k).reduce((x,y)=>x+y,0);return[W.ms[r[1]],u[0],WBR[u[1]],WMD[u[2]],WTP[u[3]],WSTD[u[3]],...r.slice(2,8),r[8],ok,r[8]?Math.round(ok/r[8]*10000)/100:'']})]);
 add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile('Waiting_Time_Jabar_'+wlbl().replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));
}


/* ===== Sales Halo module ===== */
H.uc=H.u.map(u=>VCS[u]||0);
H.u.forEach((u,i)=>{if(!UBR.has(u))UBR.set(u,H.br[H.ub[i]])});
st.hm=3;Object.assign(st.sort,{ht0:['sales',-1],ht1:['sales',-1],ht2:['sales',-1]});
const isHC=r=>st.hm=='all'||r[0]==st.hm,isHP=r=>st.hm!='all'&&st.hm>0&&r[0]==st.hm-1;
const hlbl=()=>st.hm=='all'?H.ms[0]+'–'+H.ms[H.ms.length-1]:H.ms[st.hm];
const hhp=()=>st.hm!='all'&&st.hm>0;
const hms=m=>m=='all'?H.ms.map((_,i)=>i):[m];
const hHK=m=>hms(m).reduce((a,i)=>a+H.hk[i],0);
const hUOK=i=>(st.b=='ALL'||H.br[H.ub[i]]==st.b)&&(st.u=='ALL'||H.u[i]==st.u);
const hBr=b=>st.b=='ALL'||H.br[H.ub[b]]==st.b;
function hagg(m,unitF){ // m: month idx or 'all'
 const us=H.u.map((_,i)=>i).filter(i=>(unitF||hUOK)(i)),sel=new Set(us);let n=0;const per=new Map();
 for(const r of H.r){if(!(m=='all'||r[0]==m)||!sel.has(r[1]))continue;n+=r[3];per.set(r[1],(per.get(r[1])||0)+r[3])}
 let tg=0,csr=0;for(const i of us){csr+=H.uc[i];for(const mm of hms(m))tg+=H.tg[mm][i]*H.hk[mm]/24}
 const hk=hHK(m);return{n,tg,csr,hk,acv:tg?n/tg*100:null,idx:csr&&hk?n/csr/hk:null,tidx:csr&&hk?tg/csr/hk:null,gap:n-tg,per,us}}
const hcol=(v,t)=>`<span class="dl ${v>=t?'pos':'neg'}">${v==null?'–':f1(v)+'%'}</span>`;
const hgap=g=>`<span class="dl ${g>=0?'pos':'neg'}">${g>=0?'+':'−'}${fi(Math.abs(Math.round(g)))}</span>`;
function renderH(){
 const m=st.hm,a=hagg(m),hp=hhp(),o=hp?hagg(m-1):null,pm=hp?H.ms[m-1]:'';
 const kc=(el,t,v,sub)=>$(el).innerHTML=`<div class="t">${t} · ${hlbl()}</div><div class="v">${v}</div><div class="note">${sub}</div>`;
 const mom=(x,y)=>{if(!hp||!y||x==null)return'';const d=(x-y)/y*100;return` · MoM <span class="dl ${d>=0?'pos':'neg'}">${d>=0?'▲ +':'▼ '}${d.toFixed(1)}%</span>`};
 kc('hk1','💼 Sales Halo',fi(a.n),`Target ${fi(Math.round(a.tg))}`+(hp?mom(a.n/a.hk,o.n/o.hk):''));
 kc('hk2','🎯 ACV to target',`<span class="${a.acv>=100?'pos':'neg'}">${a.acv==null?'–':f1(a.acv)+'%'}</span>`,`Gap ${hgap(a.gap)}`+(hp&&o.acv!=null?` · MoM ${dl(dv(a.acv,o.acv))}`:''));
 kc('hk3','📈 Index Halo / CSR / hari kerja',a.idx==null?'–':a.idx.toFixed(2),`Target index ${a.tidx==null?'–':a.tidx.toFixed(2)} · ${fi(a.csr)} CSR · ${a.hk} hari`+(hp?mom(a.idx,o.idx):''));
 kc('hk4','👥 Jumlah CSR (SIAD)',fi(a.csr),`Sales ÷ CSR ÷ ${a.hk} hari kerja`);
 // per Branch (filter unit saja)
 const br=H.br.map((b,bi)=>{const x=hagg(m,i=>H.ub[i]==bi&&(st.u=='ALL'||H.u[i]==st.u));
  return{key:b,name:b,csr:x.csr,sales:x.n,tg:Math.round(x.tg),acv:x.acv,idx:x.idx,tidx:x.tidx,gap:x.gap,
   html:`<td>${b}</td><td>${x.csr}</td><td><b>${fi(x.n)}</b></td><td>${fi(Math.round(x.tg))}</td><td>${x.tg?hcol(x.acv,100):'–'}</td><td><b>${x.idx==null?'–':x.idx.toFixed(2)}</b></td><td>${x.tidx==null||!x.tg?'–':x.tidx.toFixed(2)}</td><td>${hgap(x.gap)}</td>`}}).filter(r=>r.csr||r.sales);
 table('ht0',br,[['Branch','name'],['Jml CSR','csr'],['Sales Halo','sales'],['Target','tg'],['ACV to target','acv'],['Index','idx'],['Target index','tidx'],['Gap to target','gap']],k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 // per GraPARI (filter branch+unit)
 const rows=a.us.map(i=>{const n=a.per.get(i)||0,tg=hms(m).reduce((x,mm)=>x+H.tg[mm][i]*H.hk[mm]/24,0),csr=H.uc[i],hk=a.hk,acv=tg?n/tg*100:null,idx=csr?n/csr/hk:null,tidx=csr?tg/csr/hk:null;
  return{key:H.u[i],name:H.u[i],br:H.br[H.ub[i]],csr,sales:n,tg:Math.round(tg),acv,idx,tidx,gap:n-tg,
   html:`<td>${H.u[i]}</td><td style="text-align:left">${H.br[H.ub[i]]}</td><td>${csr}</td><td><b>${fi(n)}</b></td><td>${fi(Math.round(tg))}</td><td>${tg?hcol(acv,100):'–'}</td><td><b>${idx==null?'–':idx.toFixed(2)}</b></td><td>${tidx==null||!tg?'–':tidx.toFixed(2)}</td><td>${hgap(n-tg)}</td>`}});
 table('ht1',rows,[['GraPARI','name'],['Branch','br'],['Jml CSR','csr'],['Sales Halo','sales'],['Target','tg'],['ACV to target','acv'],['Index','idx'],['Target index','tidx'],['Gap to target','gap']],k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 // per CSR
 const c=new Map(),sel=new Set(a.us);
 for(const r of H.r){if(!(m=='all'||r[0]==m)||!sel.has(r[1])||r[2]<0)continue;const k=H.k[r[2]],e=c.get(k)||{n:0,u:new Map()};e.n+=r[3];e.u.set(r[1],(e.u.get(r[1])||0)+r[3]);c.set(k,e)}
 const cr=[...c].map(([k,e])=>{const x=S[k]||['','','','',''],u=[...e.u].sort((p,q)=>q[1]-p[1])[0][0],idx=e.n/a.hk;
  return{key:k,name:x[0],nik:k,jf:x[1],unit:H.u[u],br:H.br[H.ub[u]],sales:e.n,idx,
   html:`<td>${x[0]}</td><td style="text-align:left">${k}</td><td style="text-align:left">${x[1]}</td><td style="text-align:left">${H.u[u]}</td><td style="text-align:left">${H.br[H.ub[u]]}</td><td><b>${fi(e.n)}</b></td><td><b>${idx.toFixed(2)}</b></td>`}});
 table('ht2',cr,[['Nama CSR','name'],['NIK','nik'],['Job Function','jf'],['GraPARI','unit'],['Branch','br'],['Sales Halo','sales'],['Index / hari kerja','idx']]);
 // top 5 paket per branch
 {const ms_=hms(m);
 H.br.forEach((b,bi)=>{const cm=new Map();let tot=0;for(const r of H.p){if(!ms_.includes(r[0])||H.ub[r[1]]!=bi||!(st.u=='ALL'||H.u[r[1]]==st.u))continue;cm.set(r[2],(cm.get(r[2])||0)+r[3]);tot+=r[3]}
  const rows=[...cm].sort((x,y)=>y[1]-x[1]).slice(0,5).map(([d,n])=>({name:H.pk[d],n,sh:tot?n/tot*100:0}));
  $('hph'+bi).innerHTML=`<span class="ic">📍</span>${b} <span class="cj" style="font-weight:400">· ${fi(tot)} sales</span>`;
  EX['hp'+bi]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Paket (new_offer)','name'],['Jumlah','n'],['% of total','sh']]};addXb('hp'+bi);
  const mx=Math.max(1,...rows.map(r=>r.sh));
  $('hp'+bi).innerHTML=rows.length?rows.map((r,i)=>{const cc=TBC[i%TBC.length];return`<div class="cr" style="grid-template-columns:minmax(140px,44%) 1fr 100px"><div class="cl" style="cursor:default;font-size:12.5px"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${cc[1]},${cc[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join(''):'<p class="note">Tidak ada data.</p>'})}
 const un=a.n-cr.reduce((x,r)=>x+r.sales,0);
 $('hnote').textContent=`Klik baris Branch atau GraPARI untuk memfilter. Target dari sheet Target 2026 (New Sales); untuk bulan berjalan target dihitung pro-rata sesuai hari kerja berjalan (target × hari kerja ÷ 24). Index = Sales ÷ jumlah CSR GraPARI (SIAD Update, Frontliner) ÷ hari kerja (${a.hk}; bulan closing = 24 hari, bulan berjalan = Senin–Sabtu berjalan, Okt 1–20 = 17 hari). Index CSR = sales CSR ÷ hari kerja. ${un>0?fi(un)+' sales atas nama yang tidak terdaftar di SIAD dihitung di total tetapi tidak ditampilkan di tabel CSR. ':''}`;
}
async function exportHalo(){
 if(noXl())return;renderH();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const m=st.hm,a=hagg(m),hp=hhp(),o=hp?hagg(m-1):null,rd=v=>v==null?'':Math.round(v*100)/100;
 add('Ringkasan',[['Laporan Sales Halo GraPARI Jabar'],...finfo().slice(1),['Rumus Index','Sales ÷ jumlah CSR GraPARI (SIAD Update) ÷ hari kerja; hari kerja bulan closing = 24'],[],['Metrik','Periode ini','Bulan lalu'],
  ['Sales Halo',a.n,hp?o.n:''],['Target',Math.round(a.tg),hp?Math.round(o.tg):''],['ACV to target (%)',rd(a.acv),hp?rd(o.acv):''],['Gap to target',Math.round(a.gap),hp?Math.round(o.gap):''],['Jumlah CSR',a.csr,hp?o.csr:''],['Hari kerja',a.hk,hp?o.hk:''],['Index',rd(a.idx),hp?rd(o.idx):''],['Target index',rd(a.tidx),hp?rd(o.tidx):'']]);
 [['ht0','Per Branch'],['ht1','Per GraPARI'],['ht2','Per CSR'],['hp0','Top paket Bandung'],['hp1','Top paket Cirebon'],['hp2','Top paket Soreang'],['hp3','Top paket Tasikmalaya']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,aoaOf(e))});
 add('Data sales Halo',[['Bulan','GraPARI','Branch','NIK','Nama CSR','Sales Halo'],...H.r.filter(r=>(m=='all'||r[0]==m)&&hUOK(r[1])).map(r=>{const k=r[2]<0?'':H.k[r[2]];return[H.ms[r[0]],H.u[r[1]],H.br[H.ub[r[1]]],k,k&&S[k]?S[k][0]:'(tidak ada di SIAD)',r[3]]})]);
 add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile('Sales_Halo_Jabar_'+hlbl().replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));
}


/* ===== Sales IndiHome module ===== */
IH.uc=IH.u.map(u=>VCS[u]||0);
IH.u.forEach((u,i)=>{if(!UBR.has(u))UBR.set(u,IH.br[IH.ub[i]])});
st.im=3;Object.assign(st.sort,{it0:['sales',-1],it1:['sales',-1],it2:['sales',-1]});
const ilbl=()=>st.im=='all'?IH.ms[0]+'–'+IH.ms[IH.ms.length-1]:IH.ms[st.im];
const ihp=()=>st.im!='all'&&st.im>0;
const ims=m=>m=='all'?IH.ms.map((_,i)=>i):[m];
const iHK=m=>ims(m).reduce((a,i)=>a+IH.hk[i],0);
const IUOK=i=>(st.b=='ALL'||IH.br[IH.ub[i]]==st.b)&&(st.u=='ALL'||IH.u[i]==st.u);
function iagg(m,unitF){
 const us=IH.u.map((_,i)=>i).filter(i=>(unitF||IUOK)(i)),sel=new Set(us);let n=0,c=0;const per=new Map();
 for(const r of IH.r){if(!(m=='all'||r[0]==m)||!sel.has(r[1]))continue;n+=r[3];c+=r[4]?r[3]:0;per.set(r[1],(per.get(r[1])||0)+r[3])}
 let tg=0,csr=0;for(const i of us){csr+=IH.uc[i];for(const mm of ims(m))tg+=IH.tg[mm][i]*IH.hk[mm]/24}
 const hk=iHK(m);return{n,c,pc:n?c/n*100:null,tg,csr,hk,acv:tg?c/tg*100:null,idx:csr&&hk?c/csr/hk:null,tidx:csr&&hk?tg/csr/hk:null,gap:c-tg,per,us}}
const ipct=(x,y)=>{if(x==null||!y)return null;return(x-y)/y*100};
const imom=(d)=>d==null?'–':`<span class="dl ${d>=0?'pos':'neg'}">${d>=0?'▲ +':'▼ -'}${Math.abs(d).toFixed(1)}%</span>`;
const icol=v=>`<span class="dl ${v>=100?'pos':'neg'}">${v==null?'–':f1(v)+'%'}</span>`;
const igap=g=>`<span class="dl ${g>=0?'pos':'neg'}">${g>=0?'+':'−'}${fi(Math.abs(Math.round(g)))}</span>`;
const ICOL=['#8DB8EA','#A38BE0','#F2A58A','#8FCDB0'];
const ISC={'Fallout':'#F2A58A','Unpaid':'#F0C27B','In Progress PC':'#8DB8EA','In Progress PI':'#7FB6D9','Provision Issued':'#8FCDB0','Pending Contract Approval':'#A38BE0','Demand':'#D7A3D2','Tidak diketahui':'#9FB7C6','Unblock':'#B5A5EE'};
function icomplete(){
 const groups=[['Jabar',null],...IH.br.map((b,i)=>[b,i])];
 const data=groups.map(([g,bi])=>IH.ms.map((_,m)=>iagg(m,i=>(bi==null||IH.ub[i]==bi)&&(st.u=='ALL'||IH.u[i]==st.u)).pc));
 EX.ic1={rows:groups.map(([g],gi)=>{const o={name:g};IH.ms.forEach((mm,m)=>o['m'+m]=data[gi][m]);return o}),cols:[['Level','name'],...IH.ms.map((mm,m)=>['%Complete '+mm,'m'+m])]};addXb('ic1');
 const W=900,H2=300,pl=40,pr=10,pt=30,pb=44,gw=(W-pl-pr)/groups.length,bw=Math.min(40,gw/(IH.ms.length+1.2)),Y=v=>pt+(H2-pt-pb)*(1-v/100);
 let g='';for(let k=0;k<=4;k++){const v=k*25,y=Y(v);g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" style="stroke:var(--bd)"/><text x="${pl-6}" y="${y+4}" text-anchor="end" font-size="11" style="fill:var(--mu)">${v}%</text>`}
 data.forEach((row,gi)=>{const cx=pl+gw*(gi+.5),x0=cx-bw*IH.ms.length/2;row.forEach((v,m)=>{if(v==null)return;const x=x0+m*bw,y=Y(v);g+=`<rect x="${x+2}" y="${y}" width="${bw-4}" height="${Math.max(2,H2-pb-y)}" rx="7" fill="${ICOL[m]}" opacity="${st.im=='all'||st.im==m?1:.5}"/><text x="${x+bw/2}" y="${y-6}" text-anchor="middle" font-size="11.5" font-weight="700" style="fill:var(--tx)">${v.toFixed(0)}%</text>`});
  g+=`<text x="${cx}" y="${H2-pb+22}" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--tx)">${groups[gi][0]}</text>`});
 $('ic1').innerHTML=`<svg viewBox="0 0 ${W} ${H2}" width="100%" style="display:block">${g}</svg><div class="lgd">${IH.ms.map((mm,m)=>`<span><span class="dot" style="background:${ICOL[m]}"></span>${mm}</span>`).join('')}<span>Angka = % order berstatus COMPLETED dari total order bulan tsb</span></div>`;
}
function ikendala(){
 const m=st.im,ms=ims(m);
 const cnt=(bf)=>{const c=new Map();for(const r of IH.a){if(!ms.includes(r[0])||!bf(r[1]))continue;const s=IH.st[r[2]];c.set(s,(c.get(s)||0)+r[3])}return c};
 const uok=i=>st.u=='ALL'||IH.u[i]==st.u;
 const cj=cnt(uok),tot=[...cj.values()].reduce((a,b)=>a+b,0);
 const rows=[...cj].sort((a,b)=>b[1]-a[1]).map(([n,v])=>({name:n,n:v,sh:v/tot*100}));
 EX.ic2={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Funneling aktif','name'],['Jumlah','n'],['% of total','sh']]};addXb('ic2');
 const mx=Math.max(1,...rows.map(r=>r.sh));
 $('ic2').innerHTML=rows.length?rows.map((r,i)=>{const c=ISC[r.name]||'#9FB7C6';return`<div class="cr"><div class="cl" style="cursor:default"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${c}66,${c})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join('')+`<p class="note">Order aktif = funneling selain COMPLETED dan CANCELLED. Total ${fi(tot)} order.</p>`:'<p class="note">Tidak ada kendala aktif.</p>';
 const sts=IH.st.filter(s=>[...IH.a].some(r=>IH.st[r[2]]==s&&ms.includes(r[0])));
 const brs=IH.br.map((b,bi)=>{const c=cnt(i=>IH.ub[i]==bi&&uok(i));return{name:b,c,t:[...c.values()].reduce((a,x)=>a+x,0)}});
 EX.ic3={rows:brs.map(b=>{const o={name:b.name,t:b.t};sts.forEach(s=>o[s]=b.c.get(s)||0);return o}),cols:[['Branch','name'],['Total aktif','t'],...sts.map(s=>[s,s])]};addXb('ic3');
 const mxt=Math.max(1,...brs.map(b=>b.t));
 $('ic3').innerHTML=brs.map(b=>`<div class="cr" style="grid-template-columns:minmax(110px,22%) 1fr 90px"><div class="cl" style="font-weight:700">${b.name}</div><div class="sk" style="width:${b.t/mxt*100}%">${sts.map(s=>{const v=b.c.get(s)||0;return v?`<i title="${s}: ${v}" style="width:${v/b.t*100}%;background:${ISC[s]||'#9FB7C6'}"></i>`:''}).join('')}</div><div class="cv"><b>${fi(b.t)}</b> <span class="cj">aktif</span></div></div>`).join('')+`<div class="lgd">${sts.map(s=>`<span><span class="dot" style="background:${ISC[s]||'#9FB7C6'}"></span>${s} ${fi(brs.reduce((a,b)=>a+(b.c.get(s)||0),0))}</span>`).join('')}</div>`;
}
function renderI(){
 const m=st.im,a=iagg(m),hp=ihp(),o=hp?iagg(m-1):null,pm=hp?IH.ms[m-1]:'';
 const kc=(el,t,v,sub)=>$(el).innerHTML=`<div class="t">${t} · ${ilbl()}</div><div class="v">${v}</div><div class="note">${sub}</div>`;
 const mom=(x,y)=>hp&&x!=null&&y?` · MoM ${imom(ipct(x,y))}`:'';
 kc('ik1','🌐 RE / PS IndiHome',`${fi(a.n)} / ${fi(a.c)}`,`Target ${fi(Math.round(a.tg))} (ACV dari PS)`+mom(a.idx,o&&o.idx));
 kc('ik2','🎯 ACV to target',`<span class="${a.acv>=100?'pos':'neg'}">${a.acv==null?'–':f1(a.acv)+'%'}</span>`,`Gap ${igap(a.gap)}`+(hp&&o.acv!=null&&a.acv!=null?` · MoM ${dl(dv(a.acv,o.acv))}`:''));
 kc('ik3','📈 Sales index / CSR / hari kerja',a.idx==null?'–':a.idx.toFixed(2),`Target index ${a.tidx==null?'–':a.tidx.toFixed(2)} · ${fi(a.csr)} CSR · ${a.hk} hari`+mom(a.idx,o&&o.idx));
 kc('ik4','✅ %Complete',a.pc==null?'–':f1(a.pc)+'%',`${fi(a.c)} dari ${fi(a.n)} order`+(hp&&o.pc!=null&&a.pc!=null?` · MoM ${dl(dv(a.pc,o.pc))}`:''));
 icomplete();ikendala();
 const mk=(x,hk,key,name,extra)=>{const prev=hp?iagg(m-1,x.unitF):null;return null};
 const row=(key,name,x,xp,pre)=>{const mm=hp&&xp&&xp.idx?ipct(x.idx,xp.idx):null;
  return{key,name,csr:x.csr,sales:x.n,ps:x.c,tg:Math.round(x.tg),acv:x.acv,idx:x.idx,tidx:x.tidx,gap:x.gap,mom:mm,pc:x.pc,
   html:pre+`<td>${x.csr}</td><td>${fi(Math.round(x.tg))}</td><td><b>${fi(x.n)}</b></td><td><b>${fi(x.c)}</b></td><td>${x.tg?icol(x.acv):'–'}</td><td><b>${x.idx==null?'–':x.idx.toFixed(2)}</b></td><td>${igap(x.gap)}</td><td>${hp?imom(mm):'–'}</td><td>${x.pc==null?'–':f1(x.pc)+'%'}</td>`}};
 const cols=pre=>[...pre,['Jml CSR','csr'],['Target','tg'],['RE','sales'],['PS','ps'],['ACV to target','acv'],['Index','idx'],['Gap to target','gap'],['MoM','mom'],['%Complete','pc']];
 const br=IH.br.map((b,bi)=>{const f=i=>IH.ub[i]==bi&&(st.u=='ALL'||IH.u[i]==st.u);return row(b,b,iagg(m,f),hp?iagg(m-1,f):null,`<td>${b}</td>`)}).filter(r=>r.csr||r.sales);
 table('it0',br,cols([['Branch','name']]),k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 const gr=a.us.map(i=>{const f=j=>j==i;return row(IH.u[i],IH.u[i],iagg(m,f),hp?iagg(m-1,f):null,`<td>${IH.u[i]}</td><td style="text-align:left">${IH.br[IH.ub[i]]}</td>`)});
 gr.forEach((r,j)=>r.br=IH.br[IH.ub[a.us[j]]]);
 table('it1',gr,cols([['GraPARI','name'],['Branch','br']]),k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 const sel=new Set(a.us),c=new Map(),cp=new Map();
 for(const r of IH.r){if(!sel.has(r[1])||r[2]<0)continue;const k=IH.k[r[2]];
  if(m=='all'||r[0]==m){const e=c.get(k)||{n:0,c:0,u:new Map()};e.n+=r[3];if(r[4])e.c+=r[3];e.u.set(r[1],(e.u.get(r[1])||0)+r[3]);c.set(k,e)}
  if(hp&&r[0]==m-1&&r[4])cp.set(k,(cp.get(k)||0)+r[3])}
 const cr=[...c].map(([k,e])=>{const x=S[k]||['','','','',''],u=[...e.u].sort((p,q)=>q[1]-p[1])[0][0],idx=e.c/a.hk,pv=cp.get(k),mm=hp&&pv?ipct(idx,pv/o.hk):null;
  return{key:k,name:x[0],nik:k,jf:x[1],unit:IH.u[u],br:IH.br[IH.ub[u]],sales:e.n,ps:e.c,idx,mom:mm,
   html:`<td>${x[0]}</td><td style="text-align:left">${k}</td><td style="text-align:left">${x[1]}</td><td style="text-align:left">${IH.u[u]}</td><td style="text-align:left">${IH.br[IH.ub[u]]}</td><td><b>${fi(e.n)}</b></td><td><b>${fi(e.c)}</b></td><td><b>${idx.toFixed(2)}</b></td><td>${hp?imom(mm):'–'}</td>`}});
 table('it2',cr,[['Nama CSR','name'],['NIK','nik'],['Job Function','jf'],['GraPARI','unit'],['Branch','br'],['RE','sales'],['PS','ps'],['Index / hari kerja','idx'],['MoM','mom']]);
 // top 5 paket per branch
 {const ms_=ims(m);
 IH.br.forEach((b,bi)=>{const cm=new Map();let tot=0;for(const r of IH.p){if(!ms_.includes(r[0])||IH.ub[r[1]]!=bi||!(st.u=='ALL'||IH.u[r[1]]==st.u))continue;cm.set(r[2],(cm.get(r[2])||0)+r[3]);tot+=r[3]}
  const rows=[...cm].sort((x,y)=>y[1]-x[1]).slice(0,5).map(([d,n])=>({name:IH.pk[d],n,sh:tot?n/tot*100:0}));
  $('iph'+bi).innerHTML=`<span class="ic">📍</span>${b} <span class="cj" style="font-weight:400">· ${fi(tot)} PS (complete)</span>`;
  EX['ip'+bi]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Paket (product)','name'],['Jumlah','n'],['% of total','sh']]};addXb('ip'+bi);
  const mx=Math.max(1,...rows.map(r=>r.sh));
  $('ip'+bi).innerHTML=rows.length?rows.map((r,i)=>{const cc=TBC[i%TBC.length];return`<div class="cr" style="grid-template-columns:minmax(140px,44%) 1fr 100px"><div class="cl" style="cursor:default;font-size:12.5px"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${cc[1]},${cc[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join(''):'<p class="note">Tidak ada data.</p>'})}
 const un=a.n-cr.reduce((x,r)=>x+r.sales,0);
 $('inote').textContent=`RE = jumlah order IndiHome NEW SALES per GraPARI (kolom Cek GraPARI); PS = jumlah order berstatus Completed (kolom funneling); Top 5 Paket hanya menghitung PS (Completed). Target dari sheet target; bulan berjalan pro-rata (target × hari kerja ÷ 24). ACV, Index, Gap, dan MoM dihitung dari PS (Completed). Index = PS ÷ jumlah CSR GraPARI (SIAD Update, Frontliner) ÷ hari kerja (${a.hk}; closing = 24 hari, Okt 1–22 = 19 hari Senin–Sabtu). MoM = perubahan PS per hari kerja (index) dibanding bulan sebelumnya. Nama CSR diambil dari SIAD Update berdasarkan NIK.${un>0?' '+fi(un)+' order atas NIK yang tidak terdaftar di SIAD dihitung di total, tidak ditampilkan di tabel CSR.':''}`;
}
async function exportIndi(){
 if(noXl())return;renderI();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const m=st.im,a=iagg(m),hp=ihp(),o=hp?iagg(m-1):null,rd=v=>v==null?'':Math.round(v*100)/100;
 add('Ringkasan',[['Laporan Sales IndiHome GraPARI Jabar'],...finfo().slice(1),['Rumus Index','Sales ÷ jumlah CSR GraPARI (SIAD Update) ÷ hari kerja; closing = 24 hari'],[],['Metrik','Periode ini','MoM'],
  ['Sales IndiHome',a.n,hp?rd(ipct(a.idx,o.idx)):''],['Target',Math.round(a.tg),''],['ACV to target (%)',rd(a.acv),hp?rd(dv(a.acv,o.acv)):''],['Gap to target',Math.round(a.gap),''],['Jumlah CSR',a.csr,''],['Hari kerja',a.hk,''],['Index',rd(a.idx),hp?rd(ipct(a.idx,o.idx)):''],['Target index',rd(a.tidx),''],['%Complete',rd(a.pc),hp?rd(dv(a.pc,o.pc)):'']]);
 [['ic1','%Complete per bulan'],['ic2','Kendala aktif Jabar'],['ic3','Kendala aktif Branch'],['it0','Per Branch'],['it1','Per GraPARI'],['it2','Per CSR'],['ip0','Top paket Bandung'],['ip1','Top paket Cirebon'],['ip2','Top paket Soreang'],['ip3','Top paket Tasikmalaya']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,aoaOf(e))});
 add('Data sales IndiHome',[['Bulan','GraPARI','Branch','NIK','Nama CSR','Jumlah order','Complete'],...IH.r.filter(r=>(m=='all'||r[0]==m)&&IUOK(r[1])).map(r=>{const k=r[2]<0?'':IH.k[r[2]];return[IH.ms[r[0]],IH.u[r[1]],IH.br[IH.ub[r[1]]],k,k&&S[k]?S[k][0]:'(tidak ada di SIAD)',r[3],r[4]?r[3]:0]})]);
 add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile('Sales_IndiHome_Jabar_'+ilbl().replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));
}


/* ===== Sales ORBIT module ===== */
OH.uc=OH.u.map(u=>VCS[u]||0);
OH.u.forEach((u,i)=>{if(!UBR.has(u))UBR.set(u,OH.br[OH.ub[i]])});
st.om=3;Object.assign(st.sort,{ot0:['sales',-1],ot1:['sales',-1],ot2:['sales',-1]});
const olbl=()=>st.om=='all'?OH.ms[0]+'–'+OH.ms[OH.ms.length-1]:OH.ms[st.om];
const ohp=()=>st.om!='all'&&st.om>0;
const oms=m=>m=='all'?OH.ms.map((_,i)=>i):[m];
const oHK=m=>oms(m).reduce((a,i)=>a+OH.hk[i],0);
const OUOK=i=>(st.b=='ALL'||OH.br[OH.ub[i]]==st.b)&&(st.u=='ALL'||OH.u[i]==st.u);
function oagg(m,unitF){
 const us=OH.u.map((_,i)=>i).filter(i=>(unitF||OUOK)(i)),sel=new Set(us);let n=0;const per=new Map();
 for(const r of OH.r){if(!(m=='all'||r[0]==m)||!sel.has(r[1]))continue;n+=r[3];per.set(r[1],(per.get(r[1])||0)+r[3])}
 let tg=0,csr=0;for(const i of us){csr+=OH.uc[i];for(const mm of oms(m))tg+=OH.tg[mm][i]*OH.hk[mm]/24}
 const hk=oHK(m);return{n,tg,csr,hk,acv:tg?n/tg*100:null,idx:csr&&hk?n/csr/hk:null,gap:n-tg,per,us}}
function renderO(){
 const m=st.om,a=oagg(m),hp=ohp(),o=hp?oagg(m-1):null;
 const kc=(el,t,v,sub)=>$(el).innerHTML=`<div class="t">${t} · ${olbl()}</div><div class="v">${v}</div><div class="note">${sub}</div>`;
 const mom=(x,y)=>hp&&x!=null&&y?` · MoM ${imom(ipct(x,y))}`:'';
 kc('ok1','📶 Sales ORBIT',fi(a.n),`Target ${fi(Math.round(a.tg))}`+mom(a.idx,o&&o.idx));
 kc('ok2','🎯 ACV to target',`<span class="${a.acv>=100?'pos':'neg'}">${a.acv==null?'–':f1(a.acv)+'%'}</span>`,`Gap ${igap(a.gap)}`+mom(a.acv,o&&o.acv));
 kc('ok3','📈 Sales index / CSR / hari kerja',a.idx==null?'–':a.idx.toFixed(2),`${fi(a.csr)} CSR · ${a.hk} hari`+mom(a.idx,o&&o.idx));
 kc('ok4','👥 Jumlah CSR (SIAD)',fi(a.csr),`Sales ÷ CSR ÷ ${a.hk} hari kerja`);
 const row=(key,name,x,xp,pre)=>{const mm=hp&&xp&&xp.idx?ipct(x.idx,xp.idx):null;
  return{key,name,csr:x.csr,sales:x.n,tg:Math.round(x.tg),acv:x.acv,idx:x.idx,gap:x.gap,mom:mm,
   html:pre+`<td>${x.csr}</td><td><b>${fi(x.n)}</b></td><td>${fi(Math.round(x.tg))}</td><td>${x.tg?icol(x.acv):'–'}</td><td><b>${x.idx==null?'–':x.idx.toFixed(2)}</b></td><td>${igap(x.gap)}</td><td>${hp?imom(mm):'–'}</td>`}};
 const cols=pre=>[...pre,['Jml CSR','csr'],['Sales','sales'],['Target','tg'],['ACV to target','acv'],['Sales index','idx'],['Gap to target','gap'],['MoM','mom']];
 const br=OH.br.map((b,bi)=>{const f=i=>OH.ub[i]==bi&&(st.u=='ALL'||OH.u[i]==st.u);return row(b,b,oagg(m,f),hp?oagg(m-1,f):null,`<td>${b}</td>`)}).filter(r=>r.csr||r.sales);
 table('ot0',br,cols([['Branch','name']]),k=>{st.b=st.b==k?'ALL':k;sync();render()},st.b);
 const gr=a.us.map(i=>{const f=j=>j==i,r=row(OH.u[i],OH.u[i],oagg(m,f),hp?oagg(m-1,f):null,`<td>${OH.u[i]}</td><td style="text-align:left">${OH.br[OH.ub[i]]}</td>`);r.br=OH.br[OH.ub[i]];return r});
 table('ot1',gr,cols([['GraPARI','name'],['Branch','br']]),k=>{st.u=st.u==k?'ALL':k;sync();render()},st.u);
 const sel=new Set(a.us),c=new Map(),cp=new Map();
 for(const r of OH.r){if(!sel.has(r[1])||r[2]<0)continue;const k=OH.k[r[2]];
  if(m=='all'||r[0]==m){const e=c.get(k)||{n:0,u:new Map()};e.n+=r[3];e.u.set(r[1],(e.u.get(r[1])||0)+r[3]);c.set(k,e)}
  if(hp&&r[0]==m-1)cp.set(k,(cp.get(k)||0)+r[3])}
 const cr=[...c].map(([k,e])=>{const x=S[k]||['','','','',''],u=[...e.u].sort((p,q)=>q[1]-p[1])[0][0],idx=e.n/a.hk,pv=cp.get(k),mm=hp&&pv?ipct(idx,pv/o.hk):null;
  return{key:k,name:x[0],nik:k,jf:x[1],unit:OH.u[u],br:OH.br[OH.ub[u]],sales:e.n,idx,mom:mm,
   html:`<td>${x[0]}</td><td style="text-align:left">${k}</td><td style="text-align:left">${x[1]}</td><td style="text-align:left">${OH.u[u]}</td><td style="text-align:left">${OH.br[OH.ub[u]]}</td><td><b>${fi(e.n)}</b></td><td><b>${idx.toFixed(2)}</b></td><td>${hp?imom(mm):'–'}</td>`}});
 table('ot2',cr,[['Nama CSR','name'],['NIK','nik'],['Job Function','jf'],['GraPARI','unit'],['Branch','br'],['Sales','sales'],['Sales index / hari kerja','idx'],['MoM','mom']]);
 // top device per branch
 const ms=oms(m);
 OH.br.forEach((b,bi)=>{const cm=new Map();let tot=0;for(const r of OH.d){if(!ms.includes(r[0])||OH.ub[r[1]]!=bi||!(st.u=='ALL'||OH.u[r[1]]==st.u))continue;cm.set(r[2],(cm.get(r[2])||0)+r[3]);tot+=r[3]}
  const rows=[...cm].sort((x,y)=>y[1]-x[1]).map(([d,n])=>({name:OH.dv[d],n,sh:tot?n/tot*100:0}));
  $('odh'+bi).innerHTML=`<span class="ic">📍</span>${b} <span class="cj" style="font-weight:400">· ${fi(tot)} unit</span>`;
  EX['od'+bi]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Device name','name'],['Jumlah','n'],['% of total','sh']]};addXb('od'+bi);
  const mx=Math.max(1,...rows.map(r=>r.sh));
  $('od'+bi).innerHTML=rows.length?rows.map((r,i)=>{const cc=TBC[i%TBC.length];return`<div class="cr" style="grid-template-columns:minmax(140px,44%) 1fr 100px"><div class="cl" style="cursor:default;font-size:12.5px"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${cc[1]},${cc[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join(''):'<p class="note">Tidak ada data.</p>'});
 const un=a.n-cr.reduce((x,r)=>x+r.sales,0);
 $('onote').textContent=`Sales = jumlah unit perangkat ORBIT terjual per GraPARI (kolom CTP). Target dari sheet target; bulan berjalan pro-rata (target × hari kerja ÷ 24). Sales index = Sales ÷ jumlah CSR GraPARI (SIAD Update, Frontliner) ÷ hari kerja (${a.hk}; closing = 24 hari, Okt 1–22 = 19 hari Senin–Sabtu). MoM = perubahan sales per hari kerja dibanding bulan sebelumnya. Nama CSR dari SIAD Update berdasarkan NIK.${un>0?' '+fi(un)+' unit atas NIK yang tidak terdaftar di SIAD dihitung di total, tidak ditampilkan di tabel CSR.':''}`;
}
async function exportOrbit(){
 if(noXl())return;renderO();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const m=st.om,a=oagg(m),hp=ohp(),o=hp?oagg(m-1):null,rd=v=>v==null?'':Math.round(v*100)/100;
 add('Ringkasan',[['Laporan Sales ORBIT GraPARI Jabar'],...finfo().slice(1),['Rumus Index','Sales ÷ jumlah CSR GraPARI (SIAD Update) ÷ hari kerja; closing = 24 hari'],[],['Metrik','Periode ini','MoM (%)'],
  ['Sales ORBIT',a.n,hp?rd(ipct(a.idx,o.idx)):''],['Target',Math.round(a.tg),''],['ACV to target (%)',rd(a.acv),hp?rd(ipct(a.acv,o.acv)):''],['Gap to target',Math.round(a.gap),''],['Jumlah CSR',a.csr,''],['Hari kerja',a.hk,''],['Sales index',rd(a.idx),hp?rd(ipct(a.idx,o.idx)):'']]);
 [['ot0','Per Branch'],['ot1','Per GraPARI'],['ot2','Per CSR'],['od0','Top device Bandung'],['od1','Top device Cirebon'],['od2','Top device Soreang'],['od3','Top device Tasikmalaya']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,aoaOf(e))});
 add('Data sales ORBIT',[['Bulan','GraPARI','Branch','NIK','Nama CSR','Jumlah unit'],...OH.r.filter(r=>(m=='all'||r[0]==m)&&OUOK(r[1])).map(r=>{const k=r[2]<0?'':OH.k[r[2]];return[OH.ms[r[0]],OH.u[r[1]],OH.br[OH.ub[r[1]]],k,k&&S[k]?S[k][0]:'(tidak ada di SIAD)',r[3]]})]);
 add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile('Sales_ORBIT_Jabar_'+olbl().replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));
}

/* ===== CAPS module ===== */
CP.u.forEach(u=>{if(!UBR.has(u)&&CP.r.some(r=>CP.u[r[4]]==u&&r[3]>=0))UBR.set(u,CP.br[(CP.r.find(r=>CP.u[r[4]]==u&&r[3]>=0))[3]])});
CP.t={"GraPARI Bandung Elektronik Center":17.837134,"GraPARI Banjar":18.69813,"GraPARI Bantarkalong":0.849915,"GraPARI Ciamis":2.549745,"GraPARI Cianjur":6.795099,"GraPARI Ciledug Cirebon":4.250025,"GraPARI Cimahi":60.306502,"GraPARI Cirebon":49.300286,"GraPARI Cirebon Super Blok":43.350251,"GraPARI Dago":5.945711,"GraPARI Bojongsoang":3.480799,"GraPARI Ekstensi Cipanas":1.698775,"GraPARI Garut":32.29677,"GraPARI Indramayu":7.650044,"GraPARI Jatibarang":1.0,"GraPARI Kuningan":5.10003,"GraPARI Lembang":1.0,"GraPARI Lembong":49.264467,"GraPARI Majalaya":4.350999,"GraPARI Majalengka":8.701999,"GraPARI Metro Trade Center Bandung":5.096324,"GraPARI Miko Mall Bandung":35.674269,"GraPARI Padalarang":34.824882,"GraPARI Pamanukan":4.250025,"GraPARI Pangandaran":8.49915,"GraPARI Rancaekek":26.976196,"GraPARI Singaparna":1.0,"GraPARI Soreang":6.091399,"GraPARI Subang":0.850005,"GraPARI Sumber":3.40002,"GraPARI Sumedang":3.480799,"GraPARI Supratman":43.318755,"GraPARI Tasikmalaya":53.544646,"GraPARI Trans Studio Mall Bandung":17.837134,"GraPARI Ujung Berung":43.318755,"GraPARI Sukanagara":1.0,"GraPARI Pamengpeuk":1.0};CP.tb={"Bandung": 323.917808, "Cirebon": 119.150685, "Soreang": 53.082192, "Tasikmalaya": 118.438356};
const cpT=v=>st.cm==1&&v!=null?v:null;
st.cm=1;Object.assign(st.sort,{cp1:['n',-1],cp2:['n',-1],cp3:['n',-1],cp4:['n',-1],cp5:['n',-1],cp6:['n',-1],cp7:['n',-1],cp8:['n',-1],cp9:['n',-1]});
const cpC=r=>st.cm=='all'||r[0]==st.cm,cpP=r=>st.cm!='all'&&st.cm>0&&r[0]==st.cm-1,cphp=()=>st.cm!='all'&&st.cm>0;
const cpl=()=>st.cm=='all'?CP.ms[0]+' + '+CP.ms[1]:CP.ms[st.cm];
const cpUF=r=>st.u=='ALL'||CP.u[r[4]]==st.u;
const cpBT=r=>st.b=='ALL'||CP.br[r[2]]==st.b,cpBG=r=>st.b=='ALL'||CP.br[r[3]]==st.b;
const cpNon=r=>r[3]<0,cpGra=r=>r[3]>=0;
function cpagg(rs){let d=0,m=0;for(const r of rs){if(r[1])m++;else d++}const n=d+m;return{d,m,n,rr:n?m/n*100:null}}
const cptm=v=>v==null?'–':`<span class="${v>=0?'':''}">${v>=0?'+':''}${v.toFixed(1)}%</span>`;
function cpm(rs,tg){const hasT=arguments.length>1;const cur=rs.filter(cpC),prv=rs.filter(cpP),a=cpagg(cur),o=cpagg(prv),hp=cphp();
 const mom=hp?dv(a.rr,o.rr):null,tm=hp&&o.n?(a.n-o.n)/o.n*100:null,tv=hasT?cpT(tg):null,gap=tv!=null?a.d-tv:null;
 const tc=hasT?`<td>${tv==null?'–':f1(tv)}</td><td>${gap==null?'–':`<span class="dl ${gap>0?'neg':'pos'}">${gap>0?'+':''}${gap.toFixed(1)}</span>`}</td>`:'';
 return{do:a.d,mo:a.m,n:a.n,rr:a.rr,prr:hp?o.rr:null,mom,tmom:tm,t:tv,gap,
 html:`<td>${fi(a.n)}</td><td>${fi(a.m)}</td><td>${fi(a.d)}</td>${tc}<td><b>${a.rr==null?'–':f1(a.rr)+'%'}</b></td><td>${hp&&o.rr!=null?f1(o.rr)+'%':'–'}</td><td>${dl(mom)}</td><td>${cptm(tm)}</td>`}}
const CPTCOLS=[['Target','t'],['Gap to Target','gap']];
const CPCOLS=[['Total WO','n'],['Total MO','mo'],['Total CAPS','do'],['%RR','rr'],['%RR bln lalu','prr'],['MoM %RR','mom'],['MoM Total WO (%)','tmom']];
function cpmode(a){const m=new Map();a.forEach(x=>m.set(x,(m.get(x)||0)+1));let b=null,c=-1;m.forEach((v,k)=>{if(v>c){c=v;b=k}});return b}
function cptab(id,rs,keyf,namef,o){o=o||{};
 const rows=[...group(rs,keyf)].map(([k,g])=>{const m=o.tgt?cpm(g,o.tgt(k)):cpm(g);const br=o.br?o.br(g):null;return{key:String(k),name:namef(k),br,...m,html:`<td>${namef(k)}</td>`+(o.br?`<td style="text-align:left">${br}</td>`:'')+m.html}}).filter(r=>r.do+r.mo>0||(o.keep));
 table(id,rows,[[o.lab,'name'],...(o.br?[['Branch','br']]:[]),...(o.tgt?[...CPCOLS.slice(0,3),...CPTCOLS,...CPCOLS.slice(3)]:CPCOLS)],o.click,o.sel);
 if(o.tot!==false){const tt=o.tgt?rows.reduce((x,r)=>x+(r.t||0),0):0,m=o.tgt?cpm(rs,rows.some(r=>r.t!=null)?tt:null):cpm(rs),t={key:'Total',name:'Total',br:'',...m};EX[id].rows.push(t);const tb=$(id).querySelector('tbody');if(tb)tb.insertAdjacentHTML('beforeend',`<tr style="font-weight:700;border-top:2px solid var(--bd)"><td>Total</td>${o.br?'<td></td>':''}${m.html}</tr>`)}
 return rows}

const CPBC=[['#8DB8EA','#CBE0F6'],['#A38BE0','#D3C9F2'],['#F2A58A','#F9D5C7'],['#B5A5EE','#DDD7F8'],['#9FB7C6','#D2DEE6'],['#7FB6D9','#C5DFEE'],['#D7A3D2','#EFD6EC'],['#8FCDB0','#CDEADB'],['#F0C27B','#F8E2BB'],['#6A55C8','#B9AEE8']];
function cpbars(id,rs,fi_,lab,labs,pal){
 const cur=rs.filter(cpC),prv=rs.filter(cpP),hp=cphp(),ct=cur.length,pt=prv.length;
 const gc=group(cur,r=>r[fi_]),gp=group(prv,r=>r[fi_]);
 let rows=[...gc.keys()].map(k=>{const n=gc.get(k).length,pn=(gp.get(k)||[]).length,pc=ct?n/ct*100:0,pp=hp&&pt?pn/pt*100:null,mom=hp&&pp!=null?pc-pp:null;
  const nm=k<0?'(tidak tercatat)':labs[k];return{key:String(k),name:nm,n,pc,pn:hp?pn:null,pp,mom,dn:hp?n-pn:null}}).sort((a,b)=>b.n-a.n).slice(0,10);
 EX[id]={rows:rows.map((r,i)=>({...r,no:i+1})),cols:[['No','no'],[lab,'name'],['Jumlah','n'],['% of total','pc'],['Jumlah bln lalu','pn'],['% bln lalu','pp'],['MoM %','mom'],['MoM jumlah','dn']]};addXb(id);
 if(!rows.length){$(id).innerHTML='<p class="note">Tidak ada data.</p>';return}
 const mx=Math.max(1,...rows.map(r=>Math.max(r.pc,r.pp||0)));
 $(id).innerHTML=`<div class="lg" style="margin:0 0 6px"><span><span class="dot" style="background:#8DB8EA"></span>Bulan terpilih (${cpl()})</span>${hp?'<span><span class="cmk"></span>Posisi bulan lalu ('+CP.ms[st.cm-1]+')</span>':''}<span>% of total dari ${fi(ct)} ${pal?'DO':'MO'}</span></div>`+
 rows.map((r,i)=>{const c=CPBC[i%CPBC.length];return`<div class="cr"><div class="cl"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.pc/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${c[1]},${c[0]})"></div>${r.pp!=null?`<i class="cm" style="left:${(r.pp/mx*100).toFixed(1)}%" title="${CP.ms[st.cm-1]}: ${f1(r.pp)}%"></i>`:''}</div><div class="cv"><b>${f1(r.pc)}%</b> <span class="cj">${fi(r.n)}</span>${r.mom!=null?` ${dl(r.mom)}<span class="cj"> ${r.dn>=0?'+':''}${r.dn}</span>`:''}</div></div>`}).join('')}
function cptop(id,rs,fi_,lab,labs,ttl){
 const cur=rs.filter(cpC),prv=rs.filter(cpP),hp=cphp(),ct=cur.length,pt=prv.length;
 const gc=group(cur,r=>r[fi_]),gp=group(prv,r=>r[fi_]);
 const keys=new Set([...gc.keys(),...(hp?gp.keys():[])]);
 const rows=[...keys].map(k=>{const n=(gc.get(k)||[]).length,pn=(gp.get(k)||[]).length,pc=ct?n/ct*100:null,pp=hp&&pt?pn/pt*100:null,mom=hp?dv(pc,pp):null,dn=hp?n-pn:null;
  const nm=k<0?'(tidak tercatat)':labs[k];
  return{key:String(k),name:nm,n,pc,pn:hp?pn:null,pp,mom,dn,html:`<td style="text-align:left;white-space:normal">${nm}</td><td>${fi(n)}</td><td><b>${pc==null?'–':f1(pc)+'%'}</b></td><td>${hp?fi(pn):'–'}</td><td>${pp==null?'–':f1(pp)+'%'}</td><td>${dl(mom)}</td><td>${dn==null?'–':(dn>=0?'+':'')+dn}</td>`}}).filter(r=>r.n>0||r.pn>0);
 table(id,rows,[[lab,'name'],['Jumlah','n'],['% of total','pc'],['Jumlah bln lalu','pn'],['% bln lalu','pp'],['MoM %','mom'],['MoM jumlah','dn']]);
 const m={key:'Total',name:'Total',n:ct,pc:ct?100:null,pn:hp?pt:null,pp:hp&&pt?100:null,mom:null,dn:hp?ct-pt:null};EX[id].rows.push(m);
 const tb=$(id).querySelector('tbody');if(tb)tb.insertAdjacentHTML('beforeend',`<tr style="font-weight:700;border-top:2px solid var(--bd)"><td>Total</td><td>${fi(ct)}</td><td>100%</td><td>${hp?fi(pt):'–'}</td><td>${hp?'100%':'–'}</td><td>–</td><td>${hp?(ct-pt>=0?'+':'')+(ct-pt):'–'}</td></tr>`)}
function cpkpi(el,t,v,pv,isRR){const hp=cphp();let m='';if(hp&&v!=null&&pv!=null){m=isRR?dl(v-pv):cptm(pv?(v-pv)/pv*100:null)}
 $(el).innerHTML=`<div class="t">${t} · ${cpl()}</div><div class="v">${v==null?'–':isRR?f1(v)+'%':fi(v)} <span style="font-size:15px">${m?m+' MoM':''}</span></div>${hp&&pv!=null?`<div class="note">${CP.ms[st.cm-1]}: ${isRR?f1(pv)+'%':fi(pv)}</div>`:''}`}
function cpscope(){return CP.r.filter(r=>cpGra(r)&&cpUF(r)&&cpBG(r))}

function cptrend(){
 const M=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt'],WO=[5599,4414,3689,5682,4382,4957,4944,4496,4758,5896],RR=[85.7117,86.0897,84.0878,88.1,85.9,85.4,84.6076,82.8061,84.6,86.1092];
 function ch(id,title,sub,V,c1,c2,fmt,unit,pad){
  const W=560,H=250,L=44,R=18,T=34,B=34,mn=Math.min(...V),mx=Math.max(...V),lo=mn-(mx-mn)*pad,hi=mx+(mx-mn)*pad*.9;
  const X=i=>L+i*(W-L-R)/(V.length-1),Y=v=>T+(hi-v)/(hi-lo)*(H-T-B);
  const pts=V.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)),line='M'+pts.join(' L'),area=line+' L'+X(V.length-1).toFixed(1)+','+(H-B)+' L'+X(0).toFixed(1)+','+(H-B)+' Z';
  let g='';for(let k=0;k<4;k++){const v=lo+(hi-lo)*k/3,y=Y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#e8e4ee" stroke-dasharray="3 4"/><text x="${L-6}" y="${y+3}" text-anchor="end" font-size="10" fill="#9a93a8">${fmt(v,1)}</text>`}
  const li=V.length-1,mi=V.indexOf(Math.max(...V)),ni=V.indexOf(mn);
  let d='';V.forEach((v,i)=>{const x=X(i),y=Y(v),last=i==li,ex=(i==mi||i==ni);
   d+=`<circle cx="${x}" cy="${y}" r="${last?6:4}" fill="#fff" stroke="${last?c2:c1}" stroke-width="${last?3:2}"/>`;
   d+=`<text x="${x}" y="${y-(last?12:10)}" text-anchor="middle" font-size="${last?12:10}" font-weight="${last||ex?700:500}" fill="${last?c2:'#5b5470'}">${fmt(v)}</text>`;
   d+=`<text x="${x}" y="${H-12}" text-anchor="middle" font-size="10.5" fill="${last?c2:'#9a93a8'}" font-weight="${last?700:400}">${M[i]}</text>`});
  const dl=V[li]-V[li-1],pc=unit=='%'?dl:dl/V[li-1]*100,up=dl>=0;
  const chip=`<span style="background:${up?'#e3f6ec':'#fde8ea'};color:${up?'#1d8a55':'#c0392b'};padding:2px 9px;border-radius:12px;font-size:12px;font-weight:700">${up?'▲':'▼'} ${unit=='%'?Math.abs(dl).toFixed(2)+' pt':Math.abs(pc).toFixed(1)+'%'} MoM</span>`;
  return `<div style="flex:1 1 380px;min-width:300px;background:linear-gradient(160deg,${c1}14,#fff 60%);border:1px solid ${c1}33;border-radius:14px;padding:12px 14px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><div style="font-weight:700;font-size:15px;color:#3b3550">${title}</div><div style="font-size:11.5px;color:#9a93a8">${sub}</div></div>${chip}</div><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity=".35"/><stop offset="1" stop-color="${c1}" stop-opacity="0"/></linearGradient><linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>${g}<path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="url(#${id}l)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${d}</svg></div>`}
 const fw=(v,k)=>Math.round(v).toLocaleString('id-ID'),fr=(v,k)=>v.toFixed(k?0:1)+'%';
 $('cptr').innerHTML='<h2 style="margin:0 0 4px">📈 Trend Jabar 2026</h2><div style="font-size:12px;color:#9a93a8;margin-bottom:10px">Jan–Okt 2026 · level Jabar (sumber: sheet Performansi JABAR) · Okt = data s.d. 31 Okt</div><div style="display:flex;gap:14px;flex-wrap:wrap">'+ch('tw','Trend WO Jabar','Jumlah WO per bulan',WO,'#8b7cf6','#5b4bd6',fw,'',.25)+ch('tr','Trend %RR Jabar','Retention rate per bulan',RR,'#2bb5a0','#12806f',fr,'%',.3)+'</div>';
}
function renderCP(){cptrend();
 const g=cpscope(),m=cpm(g),hp=cphp(),o=cpagg(g.filter(cpP)),a=cpagg(g.filter(cpC));
 cpkpi('ck1','📋 Total WO',a.n,o.n);cpkpi('ck2','🔁 Total MO',a.m,o.m);cpkpi('ck3','📉 Total CAPS',a.d,o.d);cpkpi('ck4','🎯 %RR',a.rr,o.rr,true);
 cptab('cp6',CP.r.filter(r=>cpGra(r)&&cpUF(r)),r=>r[3],k=>CP.br[k],{lab:'Branch',tgt:k=>st.u=='ALL'?CP.tb[CP.br[k]]:null,click:k=>{const b=CP.br[+k];st.b=st.b==b?'ALL':b;sync();render()},sel:st.b=='ALL'?null:String(CP.br.indexOf(st.b))});
 const bk=f=>g=>CP.br[cpmode(g.map(f))];
 cptab('cp5',g,r=>r[4],k=>CP.u[k],{lab:'GraPARI',tgt:k=>CP.t[CP.u[k]],br:bk(r=>r[3]),click:k=>{const u=CP.u[+k];st.u=st.u==u?'ALL':u;sync();render()},sel:st.u=='ALL'?null:String(CP.u.indexOf(st.u))});
 cpbars('cp7',g.filter(r=>r[1]==1),6,'Paket Retensi',CP.pk,0);
 cpbars('cp8',g.filter(r=>r[1]==0),7,'Reason CAPS',CP.rs,1);
 const q=$('cq').value.trim().toLowerCase(),mn=+$('cmin').value||1;
 const rows=[...group(g.filter(r=>r[5]>=0),r=>r[5])].map(([k,x])=>{const mm=cpm(x),c=CP.cs[k];return{key:String(k),name:c[0],nik:c[2],unit:c[1],...mm,html:`<td>${c[0]}</td><td style="text-align:left">${c[2]}</td><td style="text-align:left">${c[1]}</td>`+mm.html}}).filter(r=>S[r.nik]&&!/^T0/i.test(r.nik)&&(r.do+r.mo)>=mn&&(!q||(r.name+r.nik+r.unit).toLowerCase().includes(q)));
 table('cp9',rows,[['Nama CSR','name'],['NIK','nik'],['GraPARI','unit'],...CPCOLS]);
}
async function exportCaps(){
 if(noXl())return;renderCP();
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 const g=cpscope(),rd=v=>v==null?'':Math.round(v*100)/100,m=cpm(g);
 add('Ringkasan',[['CAPS GraPARI Jabar'],...finfo().slice(1),['Rumus','%RR = Total MO / Total WO; Total WO = MO + CAPS (DO)'],[],['Metrik','Periode ini','Bulan lalu'],['Total WO',m.n,''],['Total MO',m.mo,''],['Total CAPS',m.do,''],['%RR',rd(m.rr),rd(m.prr)],['MoM %RR',rd(m.mom),''],['MoM Total WO (%)',rd(m.tmom),'']]);
 [['cp6','Per Branch'],['cp5','Per GraPARI'],['cp7','Top Paket MO'],['cp8','Top Reason CAPS'],['cp9','Per CSR']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,aoaOf(e))});
 const dat=g.filter(r=>cpC(r)||cpP(r));
 add('Data WO',[['Bulan Load','Kategori','Branch (CA)','GraPARI','NIK','Nama CSR','Paket MO','Reason DO'],...dat.map(r=>[CP.ms[r[0]],r[1]?'MO RETENSI':'CAPS (DO)',CP.br[r[3]],CP.u[r[4]],r[5]<0?'':CP.cs[r[5]][2],r[5]<0?'':CP.cs[r[5]][0],r[6]<0?'':CP.pk[r[6]],r[7]<0?'':CP.rs[r[7]]])]);
 add('Filter',[['Filter aktif'],...finfo()]);
 await saveFile('CAPS_GraPARI_Jabar_'+cpl().replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));
}

function sync(){$('vm').value=String(st.vm);$('vs').value=String(st.vs);$('vk').value=st.vk;$('vd').value=st.vd;$('fm').value=String(st.m);$('wm').value=String(st.wm);$('om').value=String(st.om);$('im').value=String(st.im);$('hm').value=String(st.hm);$('cm').value=String(st.cm);document.querySelectorAll('#fb .chip').forEach(c=>c.classList.toggle('on',c.dataset.v==st.b));$('fu').value=st.u}
const brs=['ALL',...[...new Set(R.map(r=>r[0]))].sort()];
$('fb').innerHTML=brs.map(x=>`<button class="chip" data-v="${x}">${x=='ALL'?'Semua':x}</button>`).join('');
document.querySelectorAll('#fb .chip').forEach(c=>c.onclick=()=>{st.b=c.dataset.v;if(st.u!='ALL'&&!(st.b=='ALL'||UBR.get(st.u)==st.b))st.u='ALL';sync();render()});
F.rows.forEach(r=>{if(!UBR.has(F.un[r[1]]))UBR.set(F.un[r[1]],F.br[r[0]])});
$('fu').innerHTML='<option value="ALL">Semua unit</option>'+[...UBR.keys()].sort().map(u=>`<option>${u}</option>`).join('');
$('fu').onchange=e=>{st.u=e.target.value;render()};$('fs').onchange=e=>{st.s=e.target.value;$('fs').dataset.v=st.s;render()};$('fs').dataset.v=st.s;
$('rs').onclick=()=>{st.vm=3;st.vs='all';st.vk='aktif';st.vd='br';st.vsel.clear();$('vq').value='';$('vmin').value=1;$('vcf').value='ALL';st.m=2;st.wm=3;st.hm=3;st.im=3;st.om=3;st.cm=1;st.ff=1;st.km=1;st.b='ALL';st.u='ALL';st.s='cs';$('fs').value='cs';$('fs').dataset.v='cs';sync();render()};
$('fm').innerHTML=[['0','Agustus'],['1','September'],['2','Oktober'],['3','November (1–'+(D.mn[3].match(/–(\d+)/)||[,'?'])[1]+' Nov, parsial)'],['all','All Month']].map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('');
$('fm').onchange=e=>{const v=e.target.value;st.m=v=='all'?v:+v;render()};
$('wm').innerHTML=['Juli','Agustus','September','Oktober','November'+(VPART?` (1–${vlast()} Nov, parsial)`:'')].map((m,i)=>`<option value="${i}">${m}</option>`).join('')+'<option value="all">All Month</option>';$('cm').innerHTML=[['0','September'],['1','Oktober'],['all','All Month']].map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('');$('cm').onchange=e=>{const v=e.target.value;st.cm=v=='all'?v:+v;renderCP()};['cq','cmin'].forEach(i=>$(i).oninput=renderCP);
$('hm').innerHTML=['Juli','Agustus','September','Oktober','All Month'].map((m,i)=>`<option value="${i==4?'all':i}">${m}</option>`).join('');$('hm').onchange=e=>{const v=e.target.value;st.hm=v=='all'?v:+v;renderH()};
$('im').innerHTML=['Juli','Agustus','September','Oktober','All Month'].map((m,i)=>`<option value="${i==4?'all':i}">${m}</option>`).join('');$('im').onchange=e=>{const v=e.target.value;st.im=v=='all'?v:+v;renderI()};
$('om').innerHTML=['Juli','Agustus','September','Oktober','All Month'].map((m,i)=>`<option value="${i==4?'all':i}">${m}</option>`).join('');$('om').onchange=e=>{const v=e.target.value;st.om=v=='all'?v:+v;renderO()};
$('wm').onchange=e=>{const v=e.target.value;st.wm=v=='all'?v:+v;renderW()};
function setGroup(g){document.querySelectorAll('#grp .gb').forEach(b=>b.classList.toggle('on',b.dataset.g==g));document.querySelectorAll('#tabs .tab').forEach(b=>b.style.display=b.dataset.g=='sales'?'none':'');$('tabs').style.display='';st.g=g}
const LASTT={sales:8,svc:3};
function showTab(p){st.p=+p;{const tb=document.querySelector('#tabs .tab[data-p="'+p+'"]'),g=tb?tb.dataset.g:'svc';if(g!='kpi')LASTT[g]=+p;setGroup(g)}$('xl').textContent=p==1?'⬇ Unduh Excel tNPS':p==2?'⬇ Unduh Excel Tiket':p==4?'⬇ Unduh Excel Waiting Time':p==5?'⬇ Unduh Excel CAPS':p==6?'⬇ Unduh Excel Tiket Fixed':p==7?'⬇ Unduh Excel KPI':p==8?'⬇ Unduh Excel Sales Halo':p==9?'⬇ Unduh Excel Sales IndiHome':p==11?'⬇ Unduh Excel tNPS Fixed':p==10?'⬇ Unduh Excel Sales ORBIT':'⬇ Unduh Excel Visit';$('pg1').style.display=p==1?'':'none';$('pg2').style.display=p==2?'':'none';$('pg3').style.display=p==3?'':'none';$('pg4').style.display=p==4?'':'none';$('pg5').style.display=p==5?'':'none';$('pg6').style.display=p==6?'':'none';$('pg7').style.display=p==7?'':'none';$('pg8').style.display=p==8?'':'none';$('pg9').style.display=p==9?'':'none';$('pg10').style.display=p==10?'':'none';$('pg11').style.display=p==11?'':'none';document.querySelector('.bar').style.display=p==11?'none':'';$('omw').style.display=p==10?'':'none';$('imw').style.display=p==9?'':'none';$('hmw').style.display=p==8?'':'none';$('kmw').style.display=p==7?'':'none';$('ffw').style.display=p==6?'':'none';document.querySelectorAll('#tabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.p==p));$('fm').parentElement.style.display=p==1?'':'none';$('tmw').style.display=p==2?'':'none';$('vmw').style.display=p==3?'':'none';$('wmw').style.display=p==4?'':'none';$('cmw').style.display=p==5?'':'none';$('fs').parentElement.style.display=p==1?'':'none';if(p==3)renderV();if(p==4)renderW();if(p==5)renderCP();if(p==6)renderF();if(p==7)renderK();if(p==8)renderH();if(p==9)renderI();if(p==10)renderO();if(p==11)renderTF()}
document.querySelectorAll('#tabs .tab').forEach(b=>b.onclick=()=>showTab(b.dataset.p));document.querySelectorAll('#grp .gb').forEach(b=>b.onclick=()=>showTab(b.dataset.g=='kpi'?7:LASTT[b.dataset.g]));
$('xl').onclick=()=>st.p==11?exportTF():st.p==10?exportOrbit():st.p==9?exportIndi():st.p==8?exportHalo():st.p==7?exportKPI():st.p==6?exportFixed():st.p==5?exportCaps():st.p==4?exportWait():st.p==3?exportVisit():st.p==2?exportTiket():exportXlsx();
/* ===== tNPS Fixed module ===== */
st.fm=2;st.fb='ALL';st.fu='ALL';st.fn='ALL';st.fj='ALL';
Object.assign(st.sort,{tf6:['nps',-1],tf1:['ord',1],tf2:['n',-1],tf3:['n',-1],tf4:['n',-1],tf5:['n',-1]});
const TFCUT=TF.m.map((x,i)=>{const d=Math.max(0,...TF.rows.filter(r=>r[4]==i).map(r=>r[10]));return i==TF.m.length-1&&d<ML[i]?d:99});
const tfC=r=>r[4]==st.fm,tfP=r=>st.fm>0&&r[4]==st.fm-1&&r[10]<=TFCUT[st.fm];
const TFIG=TF.ut.indexOf('GraPARI');
function tfBase(skip){return TF.rows.filter(r=>(skip=='br'||st.fb=='ALL'||TF.br[r[0]]==st.fb)&&(skip=='ut'||st.fu=='ALL'||TF.ut[r[1]]==st.fu)&&(skip=='un'||st.fn=='ALL'||TF.un[r[2]]==st.fn)&&(skip=='jr'||st.fj=='ALL'||TF.jr[r[5]]==st.fj))}
function tfmet(rs){const a=ag(rs.filter(tfC)),o=ag(rs.filter(tfP));
 return{...a,ps:o.nps,po:o.n,mom:dv(a.nps,o.nps),html:`<td>${a.n}</td><td>${a.p}</td><td>${a.a}</td><td>${a.d}</td><td>${nb(a.nps)}<b class="${a.nps>=0?'pos':'neg'}">${f1(a.nps)}</b></td><td>${f1(o.nps)}</td><td>${dl(dv(a.nps,o.nps))}</td>`}}
const TFC=[['Total','n'],['Promotor','p'],['Passive','a'],['Detractor','d'],['tNPS','nps'],['tNPS bln lalu','ps'],['MoM','mom']];
const tfpm=()=>{if(st.fm<=0)return'';const c=TFCUT[st.fm],b=TF.m[st.fm-1].replace(/\s*\(.*\)/,'');return c<ML[st.fm-1]?b+' (1–'+c+')':TF.m[st.fm-1]};
function tfTbl(id,skip,keyf,label,sel,onc,extra){
 const rs=tfBase(skip).filter(r=>keyf(r)!=null);
 const big=label=='Unit Type';const rows=[...group(rs,keyf)].map(([k,g])=>{const m=tfmet(g);return{key:k,name:k,...m,br:extra?extra(g):'',html:(big&&k=='GraPARI'?`<td style="font-size:1.3em;font-weight:800;color:#EC0000">${k}</td>`:`<td>${k}</td>`)+(extra?`<td style="text-align:left">${extra(g)}</td>`:'')+m.html}}).filter(x=>x.n>0);
 table(id,rows,[[label,'name'],...(extra?[['Branch','br']]:[]),...TFC],onc,sel);
}
const tfCap=(id,n)=>{const e=$(id);e.style.maxHeight='none';e.style.overflowY='auto';const rs=e.querySelectorAll('tbody tr');if(rs.length>n)e.style.maxHeight=Math.ceil(rs[n-1].getBoundingClientRect().bottom-e.getBoundingClientRect().top+2)+'px'};
const tfSet=(k,v)=>{st[k]=st[k]==v?'ALL':v;renderTF()};
/* tema freetext GraPARI */
const TFPT=[['Registrasi / pemasangan cepat & mudah','Proses daftar, pasang dan persyaratan dinilai cepat, mudah dan tidak berbelit.','Pertahankan alur registrasi dan pemasangan yang ringkas serta persyaratan yang sederhana.'],
['Penanganan gangguan cepat & responsif','Laporan gangguan/keluhan ditangani cepat, teknisi datang tepat waktu dan masalah selesai.','Jaga kecepatan respon dan ketepatan jadwal teknisi; jadikan praktik terbaik antar-GraPARI.'],
['Petugas / CS ramah & baik','Petugas GraPARI dinilai ramah, sopan, sabar dan membantu.','Pertahankan standar sapaan, etika dan empati pelayanan.'],
['Informasi & prosedur jelas','Penjelasan produk, prosedur dan harga disampaikan jelas dan mudah dipahami.','Pertahankan product knowledge dan komunikasi yang sederhana.'],
['Harga, paket & promo menarik','Harga dinilai terjangkau/bersaing dan promo menarik.','Pastikan promo dan paket relevan terus disampaikan di GraPARI.'],
['Jaringan stabil & cepat','Koneksi internet stabil, cepat dan jarang gangguan.','Jaga kualitas jaringan; teruskan keluhan area ke tim terkait.'],
['Puas secara umum','Pelanggan menyampaikan kepuasan dan terima kasih atas layanan secara umum.','Pertahankan konsistensi pelayanan.']];
const TFDT=[['Gangguan lama / belum ditindaklanjuti','Gangguan sudah dilaporkan berulang namun belum selesai, teknisi belum datang atau tidak ada kejelasan tindak lanjut.','Eskalasi tiket gangguan lama (dari GraPARI ke tim lapangan), beri kepastian jadwal dan tindak lanjut kepada pelanggan.'],
['Harga mahal & biaya tambahan','Harga paket dinilai mahal dibanding kompetitor, kenaikan tarif/biaya administrasi/pro rata tidak dipahami pelanggan.','Jelaskan komponen tagihan dan pro rata dengan transparan; teruskan masukan harga ke pusat; tawarkan paket alternatif.'],
['Kualitas jaringan & kecepatan','Koneksi lambat, tidak stabil atau putus-putus, tidak sesuai paket yang dibayar.','Lakukan pengecekan teknis saat pelanggan datang; eskalasi area bermasalah ke tim Network/Access.'],
['Registrasi, pemasangan & prosedur','Proses pasang baru/berhenti/pindah dianggap lambat, berbelit atau persyaratan menyulitkan.','Sederhanakan alur, beri estimasi waktu jelas dan kabari progres kepada pelanggan.'],
['Informasi tidak jelas / tidak sesuai','Informasi paket, promo dan ketentuan tidak lengkap, berubah tanpa pemberitahuan atau keliru.','Selaraskan informasi di semua kanal, perkuat product knowledge dan konfirmasi perubahan ke pelanggan.'],
['Layanan petugas / CS','Respon petugas/CS kurang cepat, sulit dihubungi, antre atau kurang empati.','Coaching sikap dan kecepatan respon; sediakan kontak/jalur pengaduan yang jelas.'],
['Lainnya','Masukan lain yang tidak masuk tema di atas.','Review komentar secara manual untuk tindak lanjut.']];
function tfTop(rs,kf,n){const m=new Map();rs.forEach(r=>{const k=kf(r);m.set(k,(m.get(k)||0)+1)});return[...m].sort((a,b)=>b[1]-a[1]).slice(0,n)}
function tfUn(rs,min){return[...group(rs.filter(r=>r[2]>=0),r=>TF.un[r[2]])].map(([k,g])=>{const a=ag(g.filter(tfC)),o=ag(g.filter(tfP));return{k,...a,po:o.nps,pn:o.n,mom:(o.n>=Math.min(min,10)&&a.n>=Math.min(min,10)&&st.fm>0)?a.nps-o.nps:null}}).filter(x=>x.n>=min)}
function tfww(id,kind){
 const G=TF.rows.filter(r=>r[1]==TFIG&&(st.fb=='ALL'||TF.br[r[0]]==st.fb)&&(st.fn=='ALL'||TF.un[r[2]]==st.fn));
 const c=G.filter(tfC),hp=st.fm>0,A=ag(c),O=ag(G.filter(tfP)),pl=tfpm(),per=TF.m[st.fm],cl=kind=='p'?0:2,sel=c.filter(r=>cls(r[3])==cl),ns=sel.length;
 const nm=kind=='p'?'Promotor':'Detractor',L=[],pp=(x,n)=>n?x/n*100:0,B=x=>`<b>${x}</b>`;
 const sg=v=>(v>=0?'naik ':'turun ')+Math.abs(v).toFixed(1)+'%';
 if(!A.n){$(id).innerHTML='<p class="note">Tidak ada respon GraPARI pada filter ini.</p>';return}
 const rsn=tfTop(sel,r=>TF.rs[r[6]],4).map(([k,v])=>`${B(k)} (${v}, ${f1(pp(v,ns))}%)`).join('; ');
 const jr=tfTop(sel,r=>TF.jr[r[5]],3).map(([k,v])=>`${B(k)} (${v}, ${f1(pp(v,ns))}%)`).join('; ');
 const brs=[...group(c,r=>TF.br[r[0]])].map(([k,g])=>({k,...ag(g),mom:hp?(ag(g).nps-ag(G.filter(tfP).filter(r=>TF.br[r[0]]==k)).nps):null}));
 const u=tfUn(G,15),u2=tfUn(G,10).filter(x=>x.mom!=null);
 if(kind=='p'){
  L.push(`tNPS GraPARI ${B(f1(A.nps))}${hp?` (${sg(A.nps-O.nps)} dari ${pl}: ${f1(O.nps)})`:''} dari ${fi(A.n)} respon; Promotor ${B(fi(A.p))} (${f1(pp(A.p,A.n))}%)${hp?`, ${pl}: ${f1(pp(O.p,O.n))}%`:''}.`);
  if(ns)L.push(`Alasan utama Promotor (kolom Q6): ${rsn}.`);
  if(ns)L.push(`Journey dengan Promotor terbanyak: ${jr}.`);
  const bb=[...brs].sort((a,b)=>b.nps-a.nps);if(bb.length>1)L.push(`Branch tertinggi: ${B(bb[0].k)} tNPS ${f1(bb[0].nps)}${bb[0].mom!=null?` (${bb[0].mom>=0?'▲ +':'▼ '}${Math.abs(bb[0].mom).toFixed(1)}%)`:''}, disusul ${bb.slice(1,3).map(x=>`${x.k} ${f1(x.nps)}`).join(', ')}.`);
  const ut=[...u].sort((a,b)=>b.nps-a.nps).slice(0,3);if(ut.length)L.push(`GraPARI dengan tNPS tertinggi (min. 15 respon): ${ut.map(x=>`${B(x.k)} ${f1(x.nps)} (${x.n})`).join('; ')}.`);
  const ui=u2.filter(x=>x.mom>0).sort((a,b)=>b.mom-a.mom).slice(0,3);if(ui.length)L.push(`Kenaikan tNPS terbesar vs ${pl} (min. 10 respon): ${ui.map(x=>`${B(x.k)} ${f1(x.po)} → ${f1(x.nps)} (+${x.mom.toFixed(1)}%)`).join('; ')}.`);
 }else{
  L.push(`Detractor ${B(fi(A.d))} (${f1(pp(A.d,A.n))}% dari ${fi(A.n)} respon GraPARI)${hp?`, ${pl}: ${fi(O.d)} (${f1(pp(O.d,O.n))}%)`:''}; Passive ${B(fi(A.a))} (${f1(pp(A.a,A.n))}%). tNPS GraPARI ${B(f1(A.nps))}${hp?` (${sg(A.nps-O.nps)} dari ${f1(O.nps)})`:''}.`);
  if(ns)L.push(`Penyebab utama Detractor (kolom Q6): ${rsn}.`);
  if(ns)L.push(`Journey dengan Detractor terbanyak: ${jr}.`);
  const bb=[...brs].sort((a,b)=>a.nps-b.nps);if(bb.length>1)L.push(`Branch terendah: ${B(bb[0].k)} tNPS ${f1(bb[0].nps)} dengan ${bb[0].d} Detractor dari ${bb[0].n} respon${bb[0].mom!=null?` (${bb[0].mom>=0?'▲ +':'▼ '}${Math.abs(bb[0].mom).toFixed(1)}%)`:''}.`);
  const ul=[...u].sort((a,b)=>a.nps-b.nps).slice(0,3);if(ul.length)L.push(`GraPARI dengan tNPS terendah (min. 15 respon): ${ul.map(x=>`${B(x.k)} ${f1(x.nps)} (${x.d} Detractor dari ${x.n})`).join('; ')}.`);
  const md=[...u].filter(x=>x.d>0).sort((a,b)=>b.d-a.d).slice(0,3);if(md.length)L.push(`Detractor terbanyak di: ${md.map(x=>`${B(x.k)} (${x.d} dari ${x.n} respon = ${f1(pp(x.d,x.n))}%)`).join('; ')}.`);
  const ud=u2.filter(x=>x.mom<0).sort((a,b)=>a.mom-b.mom).slice(0,3);if(ud.length)L.push(`Penurunan tNPS terbesar vs ${pl} (min. 10 respon): ${ud.map(x=>`${B(x.k)} ${f1(x.po)} → ${f1(x.nps)} (${x.mom.toFixed(1)}%)`).join('; ')}.`);
 }
 const TH=kind=='p'?TFPT:TFDT,cm=sel.filter(r=>r[7]>=0),cnt=new Array(TH.length).fill(0);cm.forEach(r=>cnt[r[7]]++);
 const idx=cnt.map((v,i)=>i).filter(i=>cnt[i]>0).sort((a,b)=>cnt[b]-cnt[a]);
 const qt=i=>{const seen=new Set(),o=[];cm.filter(r=>r[7]==i&&r[8].length>=30&&r[8].length<=200&&!/\d{5,}|@/.test(r[8])).sort((a,b)=>b[8].length-a[8].length).forEach(r=>{const k=r[8].slice(0,30).toLowerCase();if(!seen.has(k)&&o.length<2){seen.add(k);o.push([r[8],TF.un[r[2]]||''])}});return o};
 const rows=idx.map(i=>`<tr><td><b>${TH[i][0]}</b></td><td class="c">${fi(cnt[i])}</td><td class="c">${f1(pp(cnt[i],cm.length))}%</td><td>${TH[i][1]}${qt(i).map(q=>`<div class="nrq">"${q[0].replace(/^[>\s*]+|[*\s]+$/g,'').replace(/</g,'&lt;')}"${q[1]?` <b style="font-style:normal;color:var(--tx)">— ${q[1]}</b>`:''}</div>`).join('')}</td><td>${TH[i][2]}</td></tr>`).join('');
 const cn=kind=='p'?'% dari promotor berkomentar':'% dari detractor berkomentar';
 const box=`<div class="anl" style="margin:0 0 12px;padding:10px 14px;border-left:4px solid ${kind=='p'?'var(--g)':'var(--r)'};background:var(--soft,rgba(127,127,127,.08));border-radius:8px"><div style="font-weight:700;margin-bottom:4px">Analisa tNPS Fixed · unit GraPARI · ${per}${hp?' vs '+pl:''}${st.fb!='ALL'?' · '+st.fb:''}</div><ul style="margin:0;padding-left:18px;line-height:1.55">${L.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
 const head=ns?`<p class="nrs">Dari ${B(fi(ns))} respon ${nm} di unit GraPARI, ${B(fi(cm.length))} (${f1(pp(cm.length,ns))}%) menuliskan komentar bebas yang dibedah di bawah; ${fi(ns-cm.length)} tanpa komentar.</p>`:'';
 $(id).innerHTML=box+head+(idx.length?`<div class="tw" style="max-height:none"><table class="nr ${kind=='p'?'gd':'rd'}"><thead><tr><th style="text-align:left">Tema</th><th>Jumlah</th><th>${cn}</th><th style="text-align:left">${kind=='p'?'Yang sudah baik':'Temuan'} &amp; contoh suara pelanggan</th><th style="text-align:left">${kind=='p'?'Pertahankan':'Yang perlu diperbaiki'}</th></tr></thead><tbody>${rows}</tbody></table></div>`:'')+`<p class="note">Sumber: kolom Q6 ans (alasan) dan komentar bebas pelanggan IndiHome pada respon ${nm} dengan unit type 2 = GraPARI; tema dikelompokkan otomatis berdasarkan kata kunci. Mengikuti filter bulan, branch dan unit.</p>`;
 EX[id]={rows:idx.map(i=>({t:TH[i][0],n:cnt[i],sh:pp(cnt[i],cm.length)})),cols:[['Tema','t'],['Jumlah','n'],[cn,'sh']]};
}
function tfBars(id,rs,cl){
 const g0=rs.filter(r=>cl==null||cls(r[3])==cl),k0=TF.rs.indexOf('(tanpa alasan)'),g=g0.filter(r=>r[6]!=k0),m=new Map();g.forEach(r=>{const k=TF.rs[r[6]];m.set(k,(m.get(k)||0)+1)});
 const rows=[...m].map(([name,n])=>({name,n,sh:n/g.length*100})).sort((a,b)=>b.n-a.n).slice(0,10);
 EX[id]={rows:rows.map((r,i)=>({no:i+1,name:r.name,n:r.n,sh:r.sh})),cols:[['No','no'],['Kategori (Q6 ans)','name'],['Jumlah','n'],['% of total','sh']]};addXb(id);
 if(!rows.length){$(id).innerHTML='<p class="note">Tidak ada data.</p>';return}
 const mx=Math.max(1,...rows.map(r=>r.sh));
 $(id).innerHTML=rows.map((r,i)=>{const c=TBC[i%TBC.length];return`<div class="cr"><div class="cl" style="cursor:default"><span class="cn">${i+1}</span>${r.name}</div><div class="ct"><div class="cb" style="width:${(r.sh/mx*100).toFixed(1)}%;background:linear-gradient(90deg,${c[1]},${c[0]})"></div></div><div class="cv"><b>${f1(r.sh)}%</b> <span class="cj">${fi(r.n)}</span></div></div>`}).join('')+`<p class="note" style="margin-top:6px">% dari ${fi(g.length)} respon yang mengisi alasan; ${fi(g0.length-g.length)} respon tanpa alasan tidak dihitung.</p>`}

/* Top tNPS per CSR (GraPARI) */
const TFCSN=nik=>{const x=(D.siad||{})[nik];return x?x[0]:nik};
function tfCSR(){
 const rs=tfBase().filter(r=>r[1]==TFIG&&r[9]>=0),MN=3;
 const mode=a=>{const c=new Map();a.forEach(v=>c.set(v,(c.get(v)||0)+1));return[...c].sort((x,y)=>y[1]-x[1])[0][0]};
 const rows=[...group(rs,r=>r[9])].map(([k,g])=>{const m=tfmet(g),nm=TFCSN(TF.cs[k]),un=TF.un[mode(g.map(r=>r[2]))]||'',br=TF.br[mode(g.map(r=>r[0]))];
  return{key:k,name:nm,unit:un,br,...m,html:`<td style="font-weight:600">${nm}</td><td style="text-align:left">${un}</td><td style="text-align:left">${br}</td>`+m.html}}).filter(x=>x.n>=MN).sort((a,b)=>b.nps-a.nps||b.n-a.n);
 rows.forEach((r,i)=>{r.rank=i+1});
 table('tf6',rows,[['Nama CSR','name'],['GraPARI','unit'],['Branch','br'],...TFC],()=>{});
 tfCap('tf6',5);
 $('tf6n').textContent=`Hanya CSR dengan minimal ${MN} respon di bulan ${TF.m[st.fm]}; ${rows.length} CSR. Tampil 5 teratas, scroll ke bawah untuk selebihnya. Klik judul kolom untuk mengurutkan.`}
function tfDV(){
 if(!TF._x&&TF.x){TF.rows.forEach((r,i)=>r.x=TF.x[i]);TF._x=1}
 const esc=t=>String(t||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
 const rs=tfBase().filter(r=>r[4]==st.fm&&r[1]==TFIG&&r[3]<=6).map(r=>{const t=(r.x&&r.x[3])||r[8]||'';return{r,t:t.trim()}}).filter(o=>o.t.length>=3&&!/^(nan|-|\.)$/i.test(o.t)).sort((a,b)=>a.r[3]-b.r[3]||((b.r.x||[])[2]||'').localeCompare((a.r.x||[])[2]||''));
 const all=tfBase().filter(r=>r[4]==st.fm&&r[1]==TFIG&&r[3]<=6).length,wc=rs.filter(o=>o.r[9]>=0).length;
 $('tfdvn').innerHTML=`${rs.length} dari ${all} detractor unit GraPARI (skor 0–6) pada ${TF.m[st.fm]} menuliskan komentar · ${wc} di antaranya tercatat nama CSR-nya. Diurutkan dari skor terendah.`;
 if(!rs.length){$('tfdv').innerHTML='<p class="note">Tidak ada detractor GraPARI dengan freetext pada pilihan ini.</p>';return}
 $('tfdv').innerHTML='<table><tr><th>Tgl survey</th><th>GraPARI</th><th>Branch</th><th>Nama CSR</th><th>Journey</th><th>Skor</th><th>Kategori Q6</th><th style="min-width:340px">Freetext pelanggan</th></tr>'+rs.map(({r,t})=>{const nk=r[9]>=0?TF.cs[r[9]]:'',sv=nk&&D.siad[nk],d=(r.x&&r.x[2])||'';
  return`<tr><td style="white-space:nowrap">${d?d.slice(8,10)+'/'+d.slice(5,7):r[10]+' '+TF.m[r[4]].slice(0,3)}</td><td style="text-align:left;font-weight:700">${r[2]>=0?TF.un[r[2]]:'(unit tidak terpetakan)'}</td><td>${TF.br[r[0]]}</td><td style="text-align:left">${sv?esc(sv[0]):nk?nk:'<span style="color:var(--mu)">–</span>'}</td><td style="text-align:left">${esc(TF.jr[r[5]])}</td><td><b style="color:#C0392B">${r[3]}</b></td><td style="text-align:left">${esc(TF.rs[r[6]])}</td><td style="text-align:left;white-space:normal">${esc(t)}</td></tr>`}).join('')+'</table>';}
function renderTF(){
 const hp=st.fm>0,pl=tfpm(),per=TF.m[st.fm],b=tfBase(),cur=b.filter(tfC),A=ag(cur),O=ag(b.filter(tfP));
 const gb=b.filter(r=>r[1]==TFIG),GA=ag(gb.filter(tfC)),GO=ag(gb.filter(tfP));
 const kc=(el,t,a,o,sub)=>$(el).innerHTML=`<div class="t">${t} · ${per}</div><div class="v ${a.nps>=0?'pos':'neg'}">${f1(a.nps)} <span style="font-size:15px">${hp?dl(dv(a.nps,o.nps))+' MoM':''}</span></div><div class="stack"><i style="width:${a.n?a.p/a.n*100:0}%;background:var(--g)"></i><i style="width:${a.n?a.a/a.n*100:0}%;background:var(--y)"></i><i style="width:${a.n?a.d/a.n*100:0}%;background:var(--r)"></i></div><div class="lg"><span><span class="dot" style="background:var(--g)"></span>Promotor <b>${a.p}</b></span><span><span class="dot" style="background:var(--y)"></span>Passive <b>${a.a}</b></span><span><span class="dot" style="background:var(--r)"></span>Detractor <b>${a.d}</b></span><span>Total <b>${a.n}</b></span></div><div class="note">${hp?`<b>${pl}:</b> tNPS ${f1(o.nps)} (${o.n} respon)`:'MoM tidak tersedia untuk bulan pertama'}${sub||''}</div>`;
 kc('tfk1','📞 tNPS Fixed – Jabar',A,O,'');kc('tfk2','🏬 tNPS Fixed – unit GraPARI',GA,GO,` · ${f1(A.n?GA.n/A.n*100:0)}% dari total respon`);
 $('tfm').value=String(st.fm);$('tfmeta').style.display='none';
 /* 1 total Jabar per bulan */
 const mrows=TF.m.map((m,i)=>{const a=ag(b.filter(r=>r[4]==i)),o=i>0?ag(b.filter(r=>r[4]==i-1&&r[10]<=TFCUT[i])):null,pp=a.n?a.p/a.n*100:null,dd=a.n?a.d/a.n*100:null;
  return{key:m,name:m,ord:i,n:a.n,p:a.p,a:a.a,d:a.d,pp,dd,nps:a.nps,mom:o?dv(a.nps,o.nps):null,html:`<td>${m}</td><td>${a.n}</td><td>${a.p}</td><td>${a.a}</td><td>${a.d}</td><td>${f1(pp)}%</td><td>${f1(dd)}%</td><td>${nb(a.nps)}<b class="${a.nps>=0?'pos':'neg'}">${f1(a.nps)}</b></td><td>${o?dl(dv(a.nps,o.nps)):'–'}</td>`}}).filter(x=>x.n>0);
 table('tf1',mrows,[['Bulan','name'],['Total','n'],['Promotor','p'],['Passive','a'],['Detractor','d'],['% Promotor','pp'],['% Detractor','dd'],['%tNPS','nps'],['MoM','mom']],k=>{st.fm=TF.m.indexOf(k);renderTF()},per);
 tfTbl('tf2','ut',r=>TF.ut[r[1]],'Unit Type',st.fu,k=>tfSet('fu',k));
 tfTbl('tf3','br',r=>TF.br[r[0]],'Branch',st.fb,k=>tfSet('fb',k));
 tfTbl('tf4','un',r=>r[2]>=0?TF.un[r[2]]:null,'unit_name (GraPARI)',st.fn,k=>tfSet('fn',k),g=>TF.br[g[0][0]]);tfCap('tf4',10);
 tfTbl('tf5','jr',r=>TF.jr[r[5]],'Journey',st.fj,k=>tfSet('fj',k));
 tfBars('tfc1',cur,0);tfBars('tfc2',cur,2);tfCSR(cur);
 tfww('tfnw','p');tfww('tfnx','d');tfDV();
}
$('tfm').innerHTML=TF.m.map((m,i)=>`<option value="${i}">${['Agustus','September','Oktober','November'][i]}${/\(/.test(m)?' ('+m.replace(/.*\((.*)\)/,'$1')+' '+m.slice(0,3)+', parsial)':''}</option>`).join('');
$('tfm').onchange=e=>{st.fm=+e.target.value;renderTF()};
$('tfr').onclick=()=>{st.fb='ALL';st.fu='ALL';st.fn='ALL';st.fj='ALL';renderTF()};
async function exportTF(){
 if(noXl())return;renderTF();
 const rd=v=>v==null?'':typeof v=='number'?Math.round(v*100)/100:v;
 const wb=XLSX.utils.book_new(),add=(n,aoa)=>XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),n);
 add('Ringkasan',[['Laporan tNPS Fixed Jabar'],['Bulan',TF.m[st.fm]],['Branch',st.fb],['Unit type 2',st.fu],['unit_name',st.fn],['Journey',st.fj],['Rumus','%tNPS = (Promotor 9–10 − Detractor 0–6) ÷ total respon × 100']]);
 [['tf1','Total Jabar per bulan'],['tf2','Unit Type'],['tf3','Branch'],['tf4','unit_name'],['tf5','Journey'],['tfc1','Top Kategori Promotor'],['tfc2','Top Kategori Detractor'],['tf6','Top tNPS per CSR'],['tfnw','Tema Promotor GraPARI'],['tfnx','Tema Detractor GraPARI']].forEach(([id,n])=>{const e=EX[id];if(e)add(n,[e.cols.map(c=>c[0]),...e.rows.map(r=>e.cols.map(c=>rd(r[c[1]])))])});
 const kom=TF.rows.filter(r=>r[1]==TFIG&&r[4]==st.fm&&r[8]).map(r=>[TF.m[r[4]],TF.br[r[0]],TF.un[r[2]],TF.jr[r[5]],r[3],cls(r[3])==0?'Promotor':'Detractor',TF.rs[r[6]],(cls(r[3])==0?TFPT:TFDT)[r[7]]?.[0]||'',r[8]]);
 add('Komentar GraPARI',[['Bulan','Branch','GraPARI','Journey','Skor','Kelas','Kategori Q6','Tema','Komentar'],...kom]);
 if(!TF._x&&TF.x){TF.rows.forEach((r,i)=>r.x=TF.x[i]);TF._x=1}
 add('Data respon',[['Bulan','Tanggal survey','MSISDN / No. Internet','id_trx','Branch','Unit Type','unit_name','Journey','Skor','Kelas','Kategori Q6','Komentar pelanggan','NIK CSR','Nama CSR'],...tfBase().filter(r=>r[4]==st.fm).map(r=>{const x=r.x||['','','',''],nk=r[9]>=0?TF.cs[r[9]]:'',sv=nk&&D.siad[nk];return[TF.m[r[4]],x[2],x[0],x[1],TF.br[r[0]],TF.ut[r[1]],r[2]>=0?TF.un[r[2]]:'',TF.jr[r[5]],r[3],['Promotor','Passive','Detractor'][cls(r[3])],TF.rs[r[6]],x[3],nk,sv?sv[0]:'']})]);
 await saveFile('tNPS_Fixed_Jabar_'+TF.m[st.fm].replace(/[^\w]+/g,'_')+'.xlsx',xlsxBlob(wb));
}


/* ===== FU tNPS module ===== */
st.fum=0;st.fub='ALL';
function fua(rs){const n=rs.length,sb=rs.filter(r=>r.fus=='Submitted').length,ap=rs.filter(r=>r.aps=='Closed').length,nr=rs.filter(r=>r.aps=='Need Review').length,bl=rs.filter(r=>r.aps=='Belum diproses').length,
 i=rs.filter(r=>r.sla=='In SLA').length,o=rs.filter(r=>r.sla=='Out SLA').length,av=k=>{const v=rs.map(r=>r[k]).filter(x=>x!=null);return v.length?v.reduce((a,b)=>a+b,0)/v.length:null},sc=n?rs.reduce((a,r)=>a+r.sc,0)/n:null;
 return{n,sb,dr:n-sb,ap,nr,bl,pa:n?ap/n*100:null,i,o,ps:i+o?i/(i+o)*100:null,hs:av('hs'),ha:av('ha'),ht:av('ht'),sc}}
const fuh=h=>h==null?'–':h<48?h.toFixed(1)+' jam':(h/24).toFixed(1)+' hari';
const fup=v=>v==null?'–':v.toFixed(1)+'%';
const fuesc=t=>String(t||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function fubase(){return FU.rows.filter(r=>st.fub=='ALL'||r.br==st.fub)}
function fucur(){return fubase().filter(r=>st.fum=='all'||r.m==st.fum)}
function renderFU(){
 const cur=fucur(),prv=st.fum!='all'&&st.fum>0?fubase().filter(r=>r.m==st.fum-1):null,a=fua(cur),o=prv?fua(prv):null,per=st.fum=='all'?'Okt–'+FU.m[FU.m.length-1]:FU.m[st.fum],pm=o?FU.m[st.fum-1]:'';
 $('fumeta').textContent=`Sumber: tNPS_Approval.xlsx · survey s.d. ${FU.upd} · ${cur.length} FU pada ${per}`+(st.fub!='ALL'?` · Branch ${st.fub}`:'');
 const kc=(t,v,sub,c)=>`<div class="card kpi" style="border-left-color:${c}"><div class="t">${t} · ${per}</div><div class="v">${v}</div><div class="note">${sub}</div></div>`;
 $('fuk').innerHTML=kc('📞 Jumlah FU',a.n,`Submitted ${a.sb} · Draft ${a.dr}`+(o?` · ${pm}: ${o.n}`:''),'var(--k1)')
  +kc('✅ %Approval',fup(a.pa),`Approved (Closed) ${a.ap} · Need Review ${a.nr} · Belum diproses ${a.bl}`+(o?` · ${pm}: ${fup(o.pa)}`:''),'var(--k2)')
  +kc('⏱️ SLA Approval',fup(a.ps),`In SLA ${a.i} · Out SLA ${a.o} · belum dinilai ${a.n-a.i-a.o}`+(o?` · ${pm}: ${fup(o.ps)}`:''),'var(--k3)')
  +kc('⏳ Lead time rata-rata',fuh(a.ht),`Survey → submit FU ${fuh(a.hs)} · submit → approval ${fuh(a.ha)}`,'var(--k4)');
 // per GraPARI
 const g=[...group(cur,r=>r.u)].map(([k,rs])=>{const x=fua(rs);return{key:k,name:k,br:rs[0].br,...x,html:`<td>${k}</td><td style="text-align:left">${rs[0].br}</td><td><b>${x.n}</b></td><td>${x.sb}</td><td>${x.ap}</td><td><b>${fup(x.pa)}</b></td><td>${x.i}</td><td>${x.o}</td><td>${fup(x.ps)}</td><td>${x.sc.toFixed(1)}</td><td>${fuh(x.ht)}</td>`}});
 st.sort.fu1=st.sort.fu1||['n',-1];
 table('fu1',g,[['GraPARI','name'],['Branch','br'],['Jumlah FU','n'],['Submitted','sb'],['Approved','ap'],['%Approval','pa'],['In SLA','i'],['Out SLA','o'],['%SLA','ps'],['Rata-rata skor','sc'],['Lead time','ht']],null,null);
 // SLA per branch
 const bb=[...group(cur,r=>r.br)].map(([k,rs])=>{const x=fua(rs);return{key:k,name:k,...x}});bb.push({key:'Jabar',name:'Jabar',...a,tot:1});
 $('fu2').innerHTML='<table><tr><th>Branch</th><th>Jumlah FU</th><th>Approved</th><th>%Approval</th><th>In SLA</th><th>Out SLA</th><th>Belum dinilai</th><th>%SLA</th><th>Survey → submit</th><th>Submit → approval</th><th>Survey → approval</th></tr>'+
  bb.map(x=>`<tr${x.tot?' style="font-weight:700;background:var(--sf)"':''}><td>${x.name}</td><td>${x.n}</td><td>${x.ap}</td><td>${fup(x.pa)}</td><td>${x.i}</td><td style="color:${x.o?'#C0392B':'inherit'}">${x.o}</td><td>${x.n-x.i-x.o}</td><td><b>${fup(x.ps)}</b></td><td>${fuh(x.hs)}</td><td>${fuh(x.ha)}</td><td>${fuh(x.ht)}</td></tr>`).join('')+'</table>';
 // Kategori 2 x branch
 const k2=[...group(cur,r=>r.k2)].sort((x,y)=>y[1].length-x[1].length),mx2=k2.length?k2[0][1].length/cur.length*100:1,PAL=['#6C63D9'];
 $('fu3').innerHTML=!cur.length?'<p class="note">Tidak ada FU pada periode ini.</p>':`<div style="display:flex;flex-direction:column;gap:8px;max-width:980px">`+k2.map(([k,rs],i)=>{const pc=rs.length/cur.length*100;return`<div style="display:grid;grid-template-columns:230px 1fr 120px;align-items:center;gap:12px" title="${k}: ${rs.length} dari ${cur.length} FU">
  <div style="font-size:13.5px;text-align:right;color:var(--tx,#1F2340)">${k}</div>
  <div style="background:#F0F0F7;border-radius:7px;height:24px;overflow:hidden"><div style="width:${(pc/mx2*100).toFixed(1)}%;height:100%;background:${PAL[Math.min(i,PAL.length-1)]};border-radius:7px"></div></div>
  <div style="font-size:13.5px"><b>${pc.toFixed(1)}%</b> <span style="color:var(--mu)">(${rs.length} FU)</span></div></div>`}).join('')+`<div class="note" style="margin-top:2px">Total ${cur.length} FU${st.fub!='ALL'?' · Branch '+st.fub:' Jabar'}</div></div>`;
 // themes
 const th=(k,title)=>{const t=[...group(cur,r=>r[k])].sort((x,y)=>y[1].length-x[1].length);return`<table><tr><th>${title}</th><th>Jumlah</th><th>%</th><th>GraPARI</th></tr>`+t.map(([n,rs])=>`<tr><td>${n}</td><td><b>${rs.length}</b></td><td>${fup(rs.length/cur.length*100)}</td><td style="text-align:left;font-size:12px">${[...new Set(rs.map(r=>r.u.replace('GraPARI ','')))].join(', ')}</td></tr>`).join('')+'</table>'};
 $('fu4').innerHTML=th('tf','Tema Customer Feedback');$('fu5').innerHTML=th('tc','Hasil Callback / Follow Up');
 const d=cur.slice().sort((x,y)=>x.sd<y.sd?1:-1);
 $('fu6').innerHTML='<table><tr><th>Tgl survey</th><th>GraPARI</th><th>Skor</th><th>Kategori 2</th><th style="min-width:220px">Customer Feedback</th><th style="min-width:260px">Callback Notes / Follow Up Notes</th><th>Approval</th><th>SLA</th></tr>'+
  d.map(r=>`<tr><td style="white-space:nowrap">${r.sd.slice(8,10)}/${r.sd.slice(5,7)}</td><td style="text-align:left">${r.u.replace('GraPARI ','')}</td><td>${r.sc}</td><td style="text-align:left">${r.k2}</td><td style="text-align:left;white-space:normal">${fuesc(r.fb)||'<span style="color:var(--mu)">–</span>'}</td><td style="text-align:left;white-space:normal">${fuesc(r.cb)}${r.fun&&r.fun!=r.cb?`<div style="color:var(--mu);font-size:12px;margin-top:3px">FU: ${fuesc(r.fun)}</div>`:''}${!r.cb&&!r.fun?'<span style="color:var(--mu)">Belum ada callback</span>':''}</td><td>${r.aps}</td><td style="color:${r.sla=='Out SLA'?'#C0392B':'inherit'}">${r.sla}</td></tr>`).join('')+'</table>';
}
$('fum').innerHTML=FU.m.map((m,i)=>`<option value="${i}">${m.replace(/^Okt$/,'Oktober').replace(/^Nov \((1–\d+)\)$/,'November ($1 Nov, parsial)')}</option>`).join('')+'<option value="all">All Month</option>';$('fum').value='0';
$('fum').onchange=e=>{const v=e.target.value;st.fum=v=='all'?'all':+v;renderFU()};
$('fub').innerHTML=['ALL','Bandung','Cirebon','Soreang','Tasikmalaya'].map(b=>`<option value="${b}">${b=='ALL'?'Semua branch':b}</option>`).join('');
$('fub').onchange=e=>{st.fub=e.target.value;renderFU()};
async function exportFU(){const wb=XLSX.utils.book_new(),cur=fucur();
 XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['Tgl survey','Bulan','Branch','GraPARI','NIK CSR','Skor','Kategori 1','Kategori 2','Service','KIP','Customer Feedback','Callback Notes','Follow Up Notes','Follow Up Status','Approval Status','Approval Notes','SLA','Survey→Submit (jam)','Submit→Approval (jam)','Tema Feedback','Tema Callback'],
  ...cur.map(r=>[r.sd,FU.m[r.m],r.br,r.u,r.nik,r.sc,r.k1,r.k2,r.svc,r.kip,r.fb,r.cb,r.fun,r.fus,r.aps,r.apn,r.sla,r.hs,r.ha,r.tf,r.tc])]),'Detail FU');
 await saveFile('FU_tNPS_Jabar_'+(st.fum=='all'?'All':FU.m[st.fum]).replace(/[^\w]+/g,'-')+'.xlsx',xlsxBlob(wb));}


/* ===== ORDER module ===== */
st.ot='all';st.ob='ALL';st.ou='ALL';
const OGN=['Completed (PS)','Fallout','Cancel','In progress'],OGC=['#6C63D9','#E8912D','#C0392B','#7FB6D9'];
function oa(rs){const n=rs.length,g=[0,0,0,0];let i=0,o=0,h=0,hn=0,ov=0,op=0,fo=0,pv3=0,fv3=0;
 for(const r of rs){g[r[5]]++;if(r[8]==1)i++;else if(r[8]==0)o++;else if(r[8]==3){ov++;if(r[5]==3)pv3++;else fv3++}else if(r[8]==2&&r[5]==3)op++;if(r[9]!=null){h+=r[9];hn++}if(r[6]>=0)fo++}
 return{n,pv3,fv3,c:g[0],f:g[1],x:g[2],p:g[3],rp:n?g[0]/n*100:null,i,o,sl:i+o?i/(i+o)*100:null,ov,op,ah:hn?h/hn:null,fo}}
const ofh=h=>h==null?'–':h<1?Math.round(h*60)+' mnt':h<48?h.toFixed(1)+' jam':(h/24).toFixed(1)+' hari';
const ofp=v=>v==null?'–':v.toFixed(1)+'%';
function obase(skipU){const ui=st.ou=='ALL'?-1:ORD.u.indexOf(st.ou);return ORD.rows.filter(r=>(st.ob=='ALL'||ORD.br[r[1]]==st.ob)&&(skipU||st.ou=='ALL'||r[2]==ui))}
function ocur(skipU){return obase(skipU).filter(r=>st.ot=='all'||r[0]==st.ot)}
function orSub(){const el=$('osub'),cnt=ORD.ty.map((_,i)=>ORD.rows.filter(r=>r[0]==i).length);
 el.innerHTML='<span class="sl">Order Type ·</span>'+[['all','Semua',ORD.rows.length],...ORD.ty.map((t,i)=>[i,t,cnt[i]])].map(([k,l,n])=>`<button class="tab sb${String(st.ot)==String(k)?' on':''}" data-o="${k}">${l} <span style="font-weight:500;opacity:.7">(${n})</span></button>`).join('');
 el.querySelectorAll('.sb').forEach(b=>b.onclick=()=>{const v=b.dataset.o;st.ot=v=='all'?'all':+v;renderOR()})}

function orAO(cur){
 const el=$('orao'),ao=ORD.ty.indexOf('AO');if(st.ot!==ao||!ORD.tg){el.innerHTML='';return ''}
 const pr=ORD.d1/30,units=Object.keys(ORD.tg).filter(u=>(st.ob=='ALL'||ORD.tgb[u]==st.ob)&&(st.ou=='ALL'||u==st.ou));
 const rows=units.map(u=>{const ui=ORD.u.indexOf(u),rs=ui<0?[]:cur.filter(r=>r[2]==ui),ps=rs.filter(r=>r[5]==0).length,t=ORD.tg[u],tm=t*pr;
  return{key:u,name:u,br:ORD.tgb[u],t,tm,n:rs.length,ps,a:t?ps/t*100:null,am:tm?ps/tm*100:null,gap:ps-Math.round(tm),html:''}});
 rows.forEach(x=>x.html=`<td>${x.name}</td><td style="text-align:left">${x.br}</td><td>${fi(x.t)}</td><td>${x.tm.toFixed(1)}</td><td>${fi(x.n)}</td><td><b>${fi(x.ps)}</b></td><td><b style="color:${x.a>=x.tm/x.t*100?'#2E7D32':'#C0392B'}">${ofp(x.a)}</b></td><td><b style="color:${x.am>=100?'#2E7D32':'#C0392B'}">${ofp(x.am)}</b></td><td style="color:${x.gap>=0?'#2E7D32':'#C0392B'}">${x.gap>=0?'+':''}${x.gap}</td>`);
 const T=rows.reduce((a,x)=>a+x.t,0),P=rows.reduce((a,x)=>a+x.ps,0),N=rows.reduce((a,x)=>a+x.n,0),TM=T*pr;
 // CSR
 const sd=D.siad||{},cs=[...group(cur,r=>r[14])].map(([k,rs])=>{const nik=ORD.nik[k],sv=sd[nik],x=oa(rs),uu=[...group(rs,r=>r[2])].sort((p,q)=>q[1].length-p[1].length)[0][0];
  return{key:nik||'-',name:sv?sv[0]:'(tidak ada di SIAD)',nik:nik||'-',job:sv?sv[1]:'',gp:sv&&sv[4]?sv[4]:ORD.u[uu],...x,html:`<td>${nik||'–'}</td><td style="text-align:left;font-weight:700">${sv?sv[0]:'<span style="color:var(--mu)">(tidak ada di SIAD)</span>'}</td><td style="text-align:left">${sv?sv[1].replace(/_/g,' '):''}</td><td style="text-align:left">${sv&&sv[4]?sv[4]:ORD.u[uu]}</td><td><b>${x.n}</b></td><td>${x.c}</td><td><b>${ofp(x.rp)}</b></td><td>${ofh(x.ah)}</td>`}});
 const sdc=cs.filter(x=>x.job).length;
 el.innerHTML=`<h2 style="margin-top:16px"><span class="ic">🧑‍💼</span>Performansi/CSR</h2><p class="note" style="margin:0 0 8px">Order AO per CSR berdasarkan NIK pembuat order, nama &amp; GraPARI dari data SIAD · ${cs.length} CSR (${sdc} tercocokkan SIAD) · ditampilkan 10 teratas, gulir untuk melihat lainnya.</p><div class="tw" style="max-height:432px" id="orao2"></div>`;
 st.sort.orao2=st.sort.orao2||['n',-1];table('orao2',cs,[['NIK','nik'],['Nama CSR','name'],['Job Function','job'],['GraPARI','gp'],['Total AO','n'],['PS','c'],['%RE to PS','rp'],['Rata-rata Provi Time','ah']],null,null);
 return{T,P,TM};
}
function renderOR(){
 orSub();const cur=ocur(),a=oa(cur),tl=st.ot=='all'?'Semua Order Type':'Order Type '+ORD.ty[st.ot];
 $('orttl').textContent=tl+(st.ou!='ALL'?' · '+st.ou:st.ob!='ALL'?' · '+st.ob:'');
 $('orfl').innerHTML=st.ou!='ALL'?`<div class="note" style="margin:0 0 10px;padding:8px 12px;border-radius:8px;background:#FDF0E3;color:#7A4A12">Filter GraPARI aktif: <b>${st.ou}</b> – semua angka, chart dan tabel di bawah hanya untuk GraPARI ini. <a href="#" onclick="st.ou='ALL';renderOR();return false" style="color:#B5541C;font-weight:700">Tampilkan semua GraPARI</a></div>`:'';
 $('ormeta').textContent=`Sumber: Order.xlsx · order ${ORD.d0}–${ORD.d1} Nov 2026 · data per ${ORD.cut} · ${a.n} order`;
 const per=`Nov (${ORD.d0}–${ORD.d1})`,kc=(t,v,sub,c)=>`<div class="card kpi" style="border-left-color:${c}"><div class="t">${t} · ${per}</div><div class="v">${v}</div><div class="note">${sub}</div></div>`;
 $('ork').innerHTML=kc('🧾 Total Order',fi(a.n),`MOMO ${fi(cur.filter(r=>r[10]==0).length)} · TOMO ${fi(cur.filter(r=>r[10]==1).length)}`,'var(--k1)')
  +kc('✅ RE to PS',ofp(a.rp),`Completed ${fi(a.c)} dari ${fi(a.n)} order`,'var(--k2)')
  +kc('⏱️ %SLA (RE → Provi)',ofp(a.sl),`In SLA ${fi(a.i)} · Out SLA ${a.o} · rata-rata ${ofh(a.ah)}`,'var(--k3)')
  +kc('⚠️ Fallout',fi(a.f),`Masih fallout saat ini (${a.fv3} sudah lewat SLA) · pernah fallout ${fi(a.fo)} order`,'#E8912D')
  +kc('🚫 Cancel',fi(a.x),`${ofp(a.n?a.x/a.n*100:null)} dari total order`,'#C0392B')
  +kc('🔄 In progress',fi(a.p),`Sudah lewat SLA ${a.pv3} · masih dalam SLA ${a.op}`,'#7FB6D9');
 const isAO=st.ot===ORD.ty.indexOf('AO')&&!!ORD.tg,tgB=b=>Object.keys(ORD.tg||{}).filter(u=>ORD.tgb[u]==b&&(st.ou=='ALL'||u==st.ou)).reduce((a,u)=>a+ORD.tg[u],0),tgAll=()=>ORD.br.filter(b=>st.ob=='ALL'||b==st.ob).reduce((a,b)=>a+tgB(b),0);
 const mkRow=(k,rs,t,extra)=>{const x=oa(rs),ac=isAO&&t?x.c/t*100:null;return{key:k,name:k,...x,t:isAO?t:null,ac,...(extra||{}),html:(extra&&extra.brh||'')+`<td>${isAO?fi(t):'–'}</td><td><b>${fi(x.n)}</b></td><td>${fi(x.c)}</td><td><b>${ofp(x.rp)}</b></td><td><b style="color:${ac==null?'inherit':ac>=ORD.d1/30*100?'#2E7D32':'#C0392B'}">${ofp(ac)}</b></td><td>${ofh(x.ah)}</td>`}};
 const CO=[['Target','t'],['Total Order','n'],['PS','c'],['%RE to PS','rp'],['%Acv','ac'],['Rata-rata Provi Time','ah']];
 const br=ORD.br.filter(b=>st.ob=='ALL'||b==st.ob).map(b=>mkRow(b,cur.filter(r=>ORD.br[r[1]]==b),tgB(b),{brh:`<td>${b}</td>`})).filter(x=>x.n||x.t);
 {const g=orAO(cur);if(g){$('ork').innerHTML+=kc('🎯 Acv to target',ofp(g.T?g.P/g.T*100:null),`AO COMPLETED (PS) ${fi(g.P)} ÷ target Nov ${fi(g.T)}`,'#2E9E6B')}}
 $('or1n').innerHTML=isAO?`Target = target AO November per GraPARI (dijumlahkan per branch). %Acv = PS ÷ target bulan; warna hijau = sudah sesuai laju target s.d. ${ORD.d1} Nov (${(ORD.d1/30*100).toFixed(1)}% dari target). Rata-rata Provi Time = RE Ts → Provi Ts order COMPLETED.`:'Target hanya tersedia untuk Order Type AO. Rata-rata Provi Time = RE Ts → Provi Ts order COMPLETED. Fallout, cancel dan in progress dapat dilihat di Detail Process State.';
 $('or1').innerHTML='<table><tr><th>Branch</th>'+CO.map(c=>`<th>${c[0]}</th>`).join('')+'</tr>'+br.map(x=>`<tr>${x.html}</tr>`).join('')+`<tr style="font-weight:700;background:var(--sf)">${mkRow('Jabar',cur,tgAll(),{brh:`<td>${st.ob=='ALL'&&st.ou=='ALL'?'Jabar':'Total'}</td>`}).html}</tr></table>`;
 const curA=ocur(true),gmap=new Map([...group(curA,r=>ORD.u[r[2]])]);if(isAO)Object.keys(ORD.tg).filter(u=>st.ob=='ALL'||ORD.tgb[u]==st.ob).forEach(u=>{if(!gmap.has(u))gmap.set(u,[])});
 const gu=[...gmap].map(([u,rs])=>{const b=rs.length?ORD.br[rs[0][1]]:ORD.tgb[u]||'';return mkRow(u,rs,isAO?(ORD.tg[u]||0):null,{br:b,brh:`<td>${u}</td><td style="text-align:left">${b}</td>`})});
 st.sort.or2=st.sort.or2||['n',-1];table('or2',gu,[['GraPARI','name'],['Branch','br'],...CO],k=>{st.ou=st.ou==k?'ALL':k;renderOR();$('pg13').scrollIntoView({behavior:'smooth'})},st.ou);
 // daily
 const D0=1,D1=30,W=1120,H=280,L=44,R=12,T=26,B=40,cw=(W-L-R)/(D1-D0+1),dd={};cur.forEach(r=>{(dd[r[3]]=dd[r[3]]||[0,0,0,0])[r[5]]++});
 const mx=Math.max(1,...Object.values(dd).map(v=>v[0]+v[1]+v[2]+v[3]))*1.15,Y=v=>T+(H-T-B)*(1-v/mx),dow=d=>new Date(2026,10,d).getDay();
 let g=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;
 for(let k=0;k<=4;k++){const v=mx/1.15*k/4,y=Y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#E6E7EF"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="#8A8DA3">${Math.round(v)}</text>`}
 for(let d=D0;d<=D1;d++){const x=L+(d-D0)*cw,v=dd[d];if(v){let acc=0;v.forEach((c,j)=>{if(!c)return;const y0=Y(acc),y1=Y(acc+c);g+=`<rect x="${x+cw*0.15}" y="${y1}" width="${cw*0.7}" height="${y0-y1}" fill="${OGC[j]}"><title>${d} Nov · ${OGN[j]}: ${c}</title></rect>`;acc+=c});g+=`<text x="${x+cw/2}" y="${Y(acc)-4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#2B2D42">${acc}</text>`}
  g+=`<text x="${x+cw/2}" y="${H-B+15}" text-anchor="middle" font-size="10.5" fill="${dow(d)==0?'#D7263D':'#6B7089'}">${d}</text>`}
 g+=`<text x="${L}" y="${H-6}" font-size="11" fill="#6B7089">Tanggal order (Order Ts) · merah = hari Minggu</text></svg>`;
 const nd=Object.keys(dd).length,tot=cur.length;
 $('or3').innerHTML=`<div class="note" style="display:flex;gap:16px;flex-wrap:wrap;margin:0 0 4px">${OGN.map((n,j)=>`<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${OGC[j]};vertical-align:-1px"></span> ${n}</span>`).join('')}<span>Rata-rata <b>${nd?(tot/nd).toFixed(1):0}</b> order/hari (${nd} hari ada order)</span></div>`+g;
 // per order type
 const tb=obase(),ty=ORD.ty.map((t,i)=>({t,i,...oa(tb.filter(r=>r[0]==i))})),ta=oa(tb);
 const trow=(x,lab,bold)=>`<tr${bold?' style="font-weight:700;background:var(--sf)"':st.ot===x.i?' style="background:#EEEDFC"':''}><td>${lab}</td><td>${fi(x.n)}</td><td>${fi(x.c)}</td><td><b>${ofp(x.rp)}</b></td><td>${x.f}</td><td>${x.x}</td><td>${x.p}</td><td>${x.i}</td><td style="color:${x.o?'#C0392B':'inherit'}">${x.o}</td><td><b>${ofp(x.sl)}</b></td><td>${ofh(x.ah)}</td><td style="color:${x.ov?'#C0392B':'inherit'}">${x.ov}</td></tr>`;
 $('or4').innerHTML='<table><tr><th>Order Type</th><th>Total order</th><th>Completed</th><th>%RE to PS</th><th>Fallout</th><th>Cancel</th><th>In progress</th><th>In SLA</th><th>Out SLA</th><th>%SLA</th><th>Rata-rata RE→Provi</th><th>Fallout + in progress lewat SLA</th></tr>'+ty.filter(x=>x.n).map(x=>trow(x,x.t)).join('')+trow(ta,'Total',1)+'</table>';
 const ps=[...group(cur,r=>r[4])].sort((x,y)=>y[1].length-x[1].length);
 $('or5').innerHTML='<table><tr><th>Process State</th><th>Kelompok</th><th>Jumlah</th><th>%</th></tr>'+ps.map(([k,rs])=>`<tr><td style="text-align:left">${ORD.ps[k]}</td><td style="text-align:left"><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${OGC[rs[0][5]]}"></span> ${OGN[rs[0][5]]}</td><td><b>${rs.length}</b></td><td>${ofp(rs.length/cur.length*100)}</td></tr>`).join('')+'</table>';
 const cp=cur.filter(r=>r[9]!=null),bk=[['< 1 jam',0,1],['1 – 6 jam',1,6],['6 – 24 jam',6,24],['1 – 3 hari',24,72],['3 – 7 hari',72,168],['> 7 hari',168,1e9]];
 $('or6').innerHTML='<table><tr><th>Durasi RE → Provi</th><th>Jumlah</th><th>%</th></tr>'+bk.map(([l,a0,a1])=>{const n=cp.filter(r=>r[9]>=a0&&r[9]<a1).length;return`<tr><td style="text-align:left">${l}</td><td><b>${n}</b></td><td>${ofp(cp.length?n/cp.length*100:null)}</td></tr>`}).join('')+`<tr style="font-weight:700;background:var(--sf)"><td>Total COMPLETED</td><td>${cp.length}</td><td>100%</td></tr></table>`;
 // fallout
 const fr=cur.filter(r=>r[6]>=0),fcg=[...group(fr,r=>r[6])].sort((x,y)=>y[1].length-x[1].length);
 $('or7').innerHTML=!fr.length?'<p class="note">Tidak ada order dengan Fallout Category pada pilihan ini.</p>':'<table><tr><th>Fallout Category</th><th>Order pernah fallout</th><th>% dari order fallout</th><th>% dari total order</th><th>Masih fallout</th><th>Akhirnya Completed</th><th>Cancel</th><th>In progress</th><th style="min-width:280px">Reason teratas</th></tr>'+
  fcg.map(([k,rs])=>{const g=[0,0,0,0];rs.forEach(r=>g[r[5]]++);const top=[...group(rs.filter(r=>r[7]>=0),r=>r[7])].sort((x,y)=>y[1].length-x[1].length).slice(0,3).map(([q,z])=>`${ORD.fr[q]} (${z.length})`).join('; ');
   return`<tr><td style="text-align:left"><b>${ORD.fc[k]}</b></td><td><b>${rs.length}</b></td><td>${ofp(rs.length/fr.length*100)}</td><td>${ofp(rs.length/cur.length*100)}</td><td style="color:${g[1]?'#C0392B':'inherit'}">${g[1]}</td><td>${g[0]}</td><td>${g[2]}</td><td>${g[3]}</td><td style="text-align:left;white-space:normal;font-size:12.5px">${top||'–'}</td></tr>`}).join('')+
  `<tr style="font-weight:700;background:var(--sf)"><td>Total</td><td>${fr.length}</td><td>100%</td><td>${ofp(fr.length/cur.length*100)}</td><td>${fr.filter(r=>r[5]==1).length}</td><td>${fr.filter(r=>r[5]==0).length}</td><td>${fr.filter(r=>r[5]==2).length}</td><td>${fr.filter(r=>r[5]==3).length}</td><td></td></tr></table>`;
 const rr=[...group(fr.filter(r=>r[7]>=0),r=>r[7]+'|'+r[6])].map(([k,rs])=>({k,rs})).sort((x,y)=>y.rs.length-x.rs.length).slice(0,25);
 $('or8').innerHTML=!rr.length?'<p class="note">Tidak ada fallout reason.</p>':'<table><tr><th>#</th><th style="min-width:300px">Fallout Reason (diringkas)</th><th>Fallout Category</th><th>Order</th><th>Masih fallout</th><th>Order Type</th></tr>'+rr.map(({rs},i)=>`<tr><td>${i+1}</td><td style="text-align:left;white-space:normal">${ORD.fr[rs[0][7]]}</td><td style="text-align:left">${ORD.fc[rs[0][6]]}</td><td><b>${rs.length}</b></td><td>${rs.filter(r=>r[5]==1).length}</td><td style="text-align:left">${[...new Set(rs.map(r=>ORD.ty[r[0]]))].join(', ')}</td></tr>`).join('')+'</table>';
}
$('orm').innerHTML=`<option value="0">November (${ORD.d0}–${ORD.d1} Nov, parsial)</option>`;
$('orb').innerHTML=['ALL',...ORD.br].map(b=>`<option value="${b}">${b=='ALL'?'Semua branch':b}</option>`).join('');
$('orb').onchange=e=>{st.ob=e.target.value;st.ou='ALL';renderOR()};
async function exportOrder(){const wb=XLSX.utils.book_new(),cur=ocur();
 XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet([['Tgl order','Order Type','Branch','GraPARI','Unit Type','Bisnis Model','Process State','Kelompok','Target SLA (hari)','RE→Provi (jam)','Status SLA','Fallout Category','Fallout Reason (diringkas)'],
  ...cur.map(r=>[r[3]+' Nov 2026',ORD.ty[r[0]],ORD.br[r[1]],ORD.u[r[2]],ORD.ut[r[11]],r[10]?'TOMO':'MOMO',ORD.ps[r[4]],OGN[r[5]],r[13],r[9],['Out SLA','In SLA','Open (dalam SLA)','Open (lewat SLA)'][r[8]]||'-',r[6]>=0?ORD.fc[r[6]]:'-',r[7]>=0?ORD.fr[r[7]]:'-'])]),'Order');
 await saveFile('Order_Jabar_'+(st.ot=='all'?'Semua':ORD.ty[st.ot])+'.xlsx',xlsxBlob(wb));}


/* ===== Kawalan Admin CC module ===== */
st.as='ao';st.am=2;st.ab='ALL';
const ACM=['Agustus','September','Oktober','November'],ACS=['Agu','Sep','Okt','Nov'],ACL=[31,30,31,30];
const ACT={ao:['AO','ao'],mo:['Modoroso','mo'],tk:['create tiket','tk'],nm:['Order Non Modoroso','nm'],on:['ONTRUST','on']};
const acp=v=>v==null||isNaN(v)?'–':v.toFixed(1)+'%',acx=(c,p)=>p?((c-p)/p*100):null,acmom=v=>v==null?'–':`<span style="color:${v>=0?'#2E7D32':'#C0392B'}">${v>=0?'▲ +':'▼ '}${v.toFixed(1)}%</span>`;
const acBrIdx=(o)=>{const b=o.br||[];return st.ab=='ALL'?null:b.indexOf(st.ab)};
function acBase(k){const o=ACC[k],bi=o.br?o.br.indexOf(st.ab):-1,col={ao:7,mo:6,tk:3,nm:5,on:2}[k];return o.rows.filter(r=>st.ab=='ALL'||r[col]==bi)}
function acCur(k){return acBase(k).filter(r=>st.am=='all'||r[0]==st.am)}
function acPrv(k){if(st.am=='all'||st.am==0)return null;const cut=st.am==3?ACC[k].nmax:99;return acBase(k).filter(r=>r[0]==st.am-1&&r[1]<=cut)}
const acPer=k=>st.am=='all'?'Agu–Nov':ACS[st.am]+(st.am==3?` (1–${ACC[k].nmax})`:''),acPm=k=>st.am=='all'||st.am==0?'':ACS[st.am-1]+(st.am==3?` (1–${ACC[k].nmax})`:'');
function acKpi(k,t,v,sub,c){return`<div class="card kpi" style="border-left-color:${c}"><div class="t">${t} · ${acPer(k)}</div><div class="v">${v}</div><div class="note">${sub}</div></div>`}
function acTrend(k,rows,gfn,names,colors){
 if(st.am=='all'){const W=1120,H=260,L=48,R=12,T=26,B=40,cw=(W-L-R)/4,c=[0,1,2,3].map(m=>{const a=names.map(()=>0);rows.filter(r=>r[0]==m).forEach(r=>a[gfn(r)]++);return a}),mx=Math.max(1,...c.map(a=>a.reduce((x,y)=>x+y,0)))*1.15,Y=v=>T+(H-T-B)*(1-v/mx);
  let g=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;for(let m=0;m<4;m++){let acc=0;const x=L+m*cw;c[m].forEach((v,j)=>{if(!v)return;g+=`<rect x="${x+cw*.25}" y="${Y(acc+v)}" width="${cw*.5}" height="${Y(acc)-Y(acc+v)}" fill="${colors[j]}"><title>${ACM[m]} · ${names[j]}: ${v}</title></rect>`;acc+=v});g+=`<text x="${x+cw/2}" y="${Y(acc)-5}" text-anchor="middle" font-size="12" font-weight="700" fill="#2B2D42">${fi(acc)}</text><text x="${x+cw/2}" y="${H-B+16}" text-anchor="middle" font-size="12" fill="#6B7089">${ACM[m]}${m==3?' (1–'+ACC[k].nmax+')':''}</text>`}
  return acLeg(names,colors,'Per bulan (pilih satu bulan untuk trend harian)')+g+'</svg>'}
 const m=st.am,nd=ACL[m],last=m==3?ACC[k].nmax:nd,W=1120,H=270,L=44,R=12,T=26,B=40,cw=(W-L-R)/nd,dd={};rows.forEach(r=>{(dd[r[1]]=dd[r[1]]||names.map(()=>0))[gfn(r)]++});
 const pv=acPrv(k),pd={};if(pv)pv.forEach(r=>pd[r[1]]=(pd[r[1]]||0)+1);
 const mx=Math.max(1,...Object.values(dd).map(a=>a.reduce((x,y)=>x+y,0)),...Object.values(pd))*1.15,Y=v=>T+(H-T-B)*(1-v/mx),dow=d=>new Date(2026,7+m,d).getDay();
 let g=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">`;
 for(let q=0;q<=4;q++){const v=mx/1.15*q/4,y=Y(v);g+=`<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#E6E7EF"/><text x="${L-6}" y="${y+4}" text-anchor="end" font-size="11" fill="#8A8DA3">${Math.round(v)}</text>`}
 for(let d=1;d<=nd;d++){const x=L+(d-1)*cw,a=dd[d];if(a){let acc=0;a.forEach((v,j)=>{if(!v)return;g+=`<rect x="${x+cw*.15}" y="${Y(acc+v)}" width="${cw*.7}" height="${Y(acc)-Y(acc+v)}" fill="${colors[j]}"><title>${d} ${ACS[m]} · ${names[j]}: ${v}${pv?` · ${ACS[m-1]} tgl ${d}: ${pd[d]||0}`:''}</title></rect>`;acc+=v});g+=`<text x="${x+cw/2}" y="${Y(acc)-4}" text-anchor="middle" font-size="10" font-weight="700" fill="#2B2D42">${acc}</text>`}
  g+=`<text x="${x+cw/2}" y="${H-B+15}" text-anchor="middle" font-size="10.5" fill="${dow(d)==0?'#D7263D':'#6B7089'}">${d}</text>`}
 if(m>0){const pts=[];for(let d=1;d<=Math.min(nd,ACL[m-1]);d++){const v=acBase(k).filter(r=>r[0]==m-1&&r[1]==d).length;pts.push(`${(L+(d-1)*cw+cw/2).toFixed(1)},${Y(v).toFixed(1)}`)}g+=`<polyline fill="none" stroke="#E8912D" stroke-width="2" stroke-dasharray="5 4" points="${pts.join(' ')}"/>`}
 const tot=rows.length,days=new Set(rows.map(r=>r[1])).size,pk=Object.entries(dd).map(([d,a])=>[d,a.reduce((x,y)=>x+y,0)]).sort((x,y)=>y[1]-x[1])[0];
 return acLeg(names,colors,`Rata-rata <b>${days?(tot/days).toFixed(1):0}</b>/hari aktif${pk?` · puncak <b>${pk[0]} ${ACS[m]}</b> (${pk[1]})`:''}${m>0?` · <span style="display:inline-block;width:18px;border-top:2px dashed #E8912D;vertical-align:3px"></span> ${ACM[m-1]} (tanggal yang sama)`:''}`)+g+`<text x="${L}" y="${H-6}" font-size="11" fill="#6B7089">Tanggal (merah = hari Minggu)</text></svg>`}
function acLeg(n,c,extra){return`<div class="note" style="display:flex;gap:16px;flex-wrap:wrap;margin:0 0 4px">${n.length>1?n.map((x,j)=>`<span><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${c[j]};vertical-align:-1px"></span> ${x}</span>`).join(''):''}<span>${extra}</span></div>`}
function acSimple(rows,lab,labels,idx){const g=[...group(rows,r=>r[idx])].sort((x,y)=>y[1].length-x[1].length),n=rows.length,mx=g.length?g[0][1].length:1;
 return`<table><tr><th style="text-align:left">${lab}</th><th>Jumlah</th><th>%</th><th style="width:45%"></th></tr>`+g.map(([k,rs])=>`<tr><td style="text-align:left">${labels[k]}</td><td><b>${fi(rs.length)}</b></td><td>${acp(rs.length/n*100)}</td><td><div style="background:#F0F0F7;border-radius:6px;height:16px"><div style="width:${(rs.length/mx*100).toFixed(1)}%;height:100%;background:#6C63D9;border-radius:6px"></div></div></td></tr>`).join('')+`<tr style="font-weight:700;background:var(--sf)"><td style="text-align:left">Total</td><td>${fi(n)}</td><td>100%</td><td></td></tr></table>`}
const H2=(ic,t,n)=>`<h2 style="margin-top:16px"><span class="ic">${ic}</span>${t}</h2>${n?`<p class="note" style="margin:0 0 8px">${n}</p>`:''}`;
function acSub(){const el=$('asub');el.innerHTML='<span class="sl">Report ·</span>'+Object.entries(ACT).map(([k,v])=>`<button class="tab sb${st.as==k?' on':''}" data-a="${k}">${v[0]}</button>`).join('');el.querySelectorAll('.sb').forEach(b=>b.onclick=()=>{st.as=b.dataset.a;renderAC()})}
function renderAC(){
 acSub();const k=st.as,o=ACC[k],cur=acCur(k),prv=acPrv(k),pm=acPm(k),n=cur.length,np=prv?prv.length:null;
 $('acttl').textContent=ACT[k][0]+(st.ab!='ALL'?' · '+st.ab:'');
 $('acmeta').textContent=`Sumber: ${ACC.src} · ${{ao:'sheet AO - 0 (tanggal: TGL ORDER)',mo:'sheet MODOROSO - 1 (tanggal: TGL ORDER)',tk:'sheet INPUT TIKET - 2 (tanggal: TANGGAL INPUT)',nm:'sheet INPUT ORDER NON MODOROSO - 6 (tanggal: TANGGAL ORDER)',on:'sheet ONTRUST ONT HVC - 5 (tanggal: TGL INPUT)'}[k]} · data s.d. ${ACC[k].nmax} Nov 2026`;
 const brs=['ALL',...(o.br||[]).filter(b=>b!='(kosong)'&&b!='Lainnya')];if($('acb').dataset.k!=k){$('acb').innerHTML=brs.map(b=>`<option value="${b}">${b=='ALL'?'Semua branch':b}</option>`).join('');$('acb').dataset.k=k;if(!brs.includes(st.ab))st.ab='ALL';$('acb').value=st.ab}
 const momT=pm?` · ${pm}: ${fi(np)} · MoM ${acmom(acx(n,np))}`:'';let K='',Bd='';
 if(k=='ao'){const c=cur.filter(r=>r[3]==0),i=cur.filter(r=>r[3]==1),cp=cur.filter(r=>r[4]==0).length,cc=cur.filter(r=>r[4]==1).length;
  K=acKpi(k,'🆕 Total AO',fi(n),'Order AO yang dikawal'+momT,'var(--k1)')+acKpi(k,'✅ CLOSED',fi(c.length),`${acp(n?c.length/n*100:null)} · Completed ${fi(cp)} · Cancelled ${fi(cc)}`,'var(--k2)')+acKpi(k,'🔄 INPROGRESS',fi(i.length),`${acp(n?i.length/n*100:null)} dari total AO`,'#E8912D');
  const g=[...group(cur,r=>r[2])].map(([u,rs])=>{const a=rs.filter(r=>r[3]==0).length,ip=rs.length-a,b=group(rs,r=>r[7]),bb=[...b].sort((x,y)=>y[1].length-x[1].length)[0][0];return{key:o.u[u],name:o.u[u],br:o.br[bb],n:rs.length,cl:a,cp:rs.filter(r=>r[4]==0).length,cc:rs.filter(r=>r[4]==1).length,ip,pc:a/rs.length*100,html:`<td>${o.u[u]}</td><td style="text-align:left">${o.br[bb]}</td><td><b>${rs.length}</b></td><td>${a}</td><td>${rs.filter(r=>r[4]==0).length}</td><td>${rs.filter(r=>r[4]==1).length}</td><td style="color:${ip?'#C0392B':'inherit'};font-weight:${ip?700:400}">${ip}</td><td>${acp(a/rs.length*100)}</td>`}});
  Bd=H2('📆','Trend Monitoring Daily AO')+'<div id="act1"></div>'+H2('🏬','Detail AO per Unit','Status dari kolom HASIL (CLOSED / INPROGRESS). Completed dan Cancelled dari kolom INPROGRESS.')+'<div class="tw" style="max-height:420px" id="act2"></div>'+H2('⚠️','Fallout Group – AO berstatus INPROGRESS')+'<div class="two"><div class="tw" id="act3"></div><div class="tw" id="act4"></div></div>'+H2('📝','Detail AO INPROGRESS')+'<div class="tw" style="max-height:420px" id="act5"></div>';
  $('ack').innerHTML=K;$('acbody').innerHTML=Bd;$('act1').innerHTML=acTrend(k,cur,r=>r[3],['CLOSED','INPROGRESS'],['#6C63D9','#E8912D']);
  st.sort.act2=st.sort.act2||['n',-1];table('act2',g,[['Unit (Channel Input)','name'],['Branch','br'],['Total AO','n'],['CLOSED','cl'],['Completed','cp'],['Cancelled','cc'],['INPROGRESS','ip'],['% CLOSED','pc']],null,null);
  $('act3').innerHTML=i.length?acSimple(i,'Fallout Group',o.fg,5):'<p class="note">Tidak ada AO berstatus INPROGRESS pada pilihan ini.</p>';
  $('act4').innerHTML=i.length?acSimple(i,'Last Update (INPROGRESS)',o.lu,6):'';
  $('act5').innerHTML=i.length?'<table><tr><th>Tgl order</th><th>Unit</th><th>Branch</th><th>Order ID</th><th>Fallout Group</th><th>Last Update</th><th>Umur (hari)</th><th>Eskalasi ke</th><th style="min-width:240px">Fallout status / Keterangan</th></tr>'+i.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(r=>`<tr><td>${r[1]} ${ACS[r[0]]}</td><td style="text-align:left">${o.u[r[2]]}</td><td>${o.br[r[7]]}</td><td style="font-size:12px">${r[11]}</td><td style="text-align:left">${o.fg[r[5]]}</td><td style="text-align:left">${o.lu[r[6]]}</td><td>${r[9]}</td><td style="text-align:left;font-size:12px">${r[12]||'–'}</td><td style="text-align:left;white-space:normal;font-size:12.5px">${[o.fs[r[8]],r[10]].filter(Boolean).join(' · ')||'–'}</td></tr>`).join('')+'</table>':'';}
 if(k=='mo'){const c=cur.filter(r=>r[4]==0).length,i=n-c;
  K=acKpi(k,'🔁 Total Order Modoroso',fi(n),'Order yang dikawal'+momT,'var(--k1)')+acKpi(k,'✅ CLOSED',fi(c),`${acp(n?c/n*100:null)} · Completed ${fi(cur.filter(r=>r[5]==0).length)} · Cancelled ${fi(cur.filter(r=>r[5]==1).length)}`,'var(--k2)')+acKpi(k,'🔄 INPROGRESS',fi(i),`${acp(n?i/n*100:null)} dari total order`,'#E8912D');
  Bd=H2('📆','Trend Daily Kawalan Modoroso')+'<div id="act1"></div>'+H2('📡','Order Type per Channel Name berdasarkan LAST STATUS')+'<div class="tw" style="max-height:520px" id="act2"></div>'+H2('🧾','Ringkasan per Order Type')+'<div class="tw" id="act3"></div>';
  $('ack').innerHTML=K;$('acbody').innerHTML=Bd;$('act1').innerHTML=acTrend(k,cur,r=>r[4],['CLOSED','INPROGRESS'],['#6C63D9','#E8912D']);
  const chs=[...group(cur,r=>r[2])].sort((x,y)=>y[1].length-x[1].length);
  $('act2').innerHTML='<table data-nosort><tr><th style="text-align:left">Channel Name</th><th style="text-align:left">Order Type</th><th>CLOSED</th><th>INPROGRESS</th><th>Total</th><th>% CLOSED</th></tr>'+chs.map(([ch,rs])=>{const ots=[...group(rs,r=>r[3])].sort((x,y)=>y[1].length-x[1].length),cc=rs.filter(r=>r[4]==0).length;
   return ots.map(([ot,q],j)=>{const a=q.filter(r=>r[4]==0).length;return`<tr><td style="text-align:left;font-weight:700">${j?'':o.ch[ch]}</td><td style="text-align:left">${o.ot[ot]}</td><td>${fi(a)}</td><td style="color:${q.length-a?'#C0392B':'inherit'}">${fi(q.length-a)}</td><td><b>${fi(q.length)}</b></td><td>${acp(a/q.length*100)}</td></tr>`}).join('')+`<tr style="background:var(--sf);font-weight:700"><td></td><td style="text-align:left">Subtotal ${o.ch[ch]}</td><td>${fi(cc)}</td><td>${fi(rs.length-cc)}</td><td>${fi(rs.length)}</td><td>${acp(cc/rs.length*100)}</td></tr>`}).join('')+`<tr style="font-weight:700;background:#E9E8FB"><td style="text-align:left">Total</td><td></td><td>${fi(c)}</td><td>${fi(i)}</td><td>${fi(n)}</td><td>${acp(n?c/n*100:null)}</td></tr></table>`;
  const ots=[...group(cur,r=>r[3])].sort((x,y)=>y[1].length-x[1].length);
  $('act3').innerHTML='<table><tr><th style="text-align:left">Order Type</th><th>CLOSED</th><th>Completed</th><th>Cancelled</th><th>INPROGRESS</th><th>Total</th><th>% CLOSED</th></tr>'+ots.map(([ot,q])=>{const a=q.filter(r=>r[4]==0).length;return`<tr><td style="text-align:left">${o.ot[ot]}</td><td>${fi(a)}</td><td>${fi(q.filter(r=>r[5]==0).length)}</td><td>${fi(q.filter(r=>r[5]==1).length)}</td><td>${fi(q.length-a)}</td><td><b>${fi(q.length)}</b></td><td>${acp(a/q.length*100)}</td></tr>`}).join('')+'</table>';}
 if(k=='tk'){K=acKpi(k,'🎫 Total Create Tiket',fi(n),'Tiket yang diinput Admin CC'+momT,'var(--k1)');
  Bd=H2('📡','Channel Petugas yang Melaporkan')+'<div class="tw" id="act2" style="max-width:900px"></div>'+H2('📆','Trend Daily Create Tiket')+'<div id="act1"></div>';
  $('ack').innerHTML=K;$('acbody').innerHTML=Bd;$('act2').innerHTML=n?acSimple(cur,'Channel',o.ch,2):'<p class="note">Tidak ada data.</p>';$('act1').innerHTML=acTrend(k,cur,r=>0,['Tiket'],['#6C63D9']);}
 if(k=='nm'){const ci=o.st.indexOf('COMPLETED'),c=cur.filter(r=>r[4]==ci).length;
  K=acKpi(k,'🧾 Total Order Non Modoroso',fi(n),'Order yang diinput'+momT,'var(--k1)')+acKpi(k,'✅ % Complete',acp(n?c/n*100:null),`COMPLETED ${fi(c)} dari ${fi(n)} order`,'var(--k2)')+acKpi(k,'⏳ Belum Complete',fi(n-c),o.st.filter(x=>x!='COMPLETED').map(x=>`${x} ${cur.filter(r=>o.st[r[4]]==x).length}`).join(' · '),'#E8912D');
  Bd=H2('📆','Trend Daily Order Non Modoroso')+'<div id="act1"></div>'+H2('🧮','Requestor × Jenis Permintaan','Jumlah order per REQUESTOR dan PERMINTAAN (kolom E). % Complete = STATUS ORDER COMPLETED ÷ total order.')+'<div class="tw" id="act2"></div>'+H2('✅','Status Order')+'<div class="tw" id="act3" style="max-width:900px"></div>';
  $('ack').innerHTML=K;$('acbody').innerHTML=Bd;
  $('act1').innerHTML=acTrend(k,cur,r=>r[4]==ci?0:1,['COMPLETED','Belum complete'],['#6C63D9','#E8912D']);
  const pms=[...group(cur,r=>r[3])].sort((x,y)=>y[1].length-x[1].length).map(x=>x[0]),rqs=[...group(cur,r=>r[2])].sort((x,y)=>y[1].length-x[1].length);
  $('act2').innerHTML=n?'<table><tr><th style="text-align:left">Requestor</th>'+pms.map(p=>`<th>${o.pm[p]}</th>`).join('')+'<th>Total</th><th>Completed</th><th>% Complete</th></tr>'+rqs.map(([rq,rs])=>{const cc=rs.filter(r=>r[4]==ci).length;return`<tr><td style="text-align:left">${o.rq[rq]}</td>`+pms.map(p=>{const q=rs.filter(r=>r[3]==p);return`<td>${q.length?fi(q.length):'·'}</td>`}).join('')+`<td><b>${fi(rs.length)}</b></td><td>${fi(cc)}</td><td><b>${acp(cc/rs.length*100)}</b></td></tr>`}).join('')+
   '<tr style="font-weight:700;background:var(--sf)"><td style="text-align:left">Total</td>'+pms.map(p=>`<td>${fi(cur.filter(r=>r[3]==p).length)}</td>`).join('')+`<td>${fi(n)}</td><td>${fi(c)}</td><td>${acp(c/n*100)}</td></tr>`+'<tr style="background:#E9E8FB"><td style="text-align:left;font-weight:700">% Complete</td>'+pms.map(p=>{const q=cur.filter(r=>r[3]==p);return`<td><b>${acp(q.filter(r=>r[4]==ci).length/q.length*100)}</b></td>`}).join('')+'<td></td><td></td><td></td></tr></table>':'<p class="note">Tidak ada data.</p>';
  $('act3').innerHTML=n?acSimple(cur,'Status Order',o.st,4):'';}
 if(k=='on'){K=acKpi(k,'📶 Total Permintaan ONTRUST',fi(n),'Permintaan ONT HVC'+momT,'var(--k1)');
  Bd=H2('🗺️','Jumlah Permintaan per Branch')+'<div class="tw" id="act2" style="max-width:900px"></div>'+H2('📆','Trend Daily Permintaan ONTRUST')+'<div id="act1"></div>';
  $('ack').innerHTML=K;$('acbody').innerHTML=Bd;$('act2').innerHTML=n?acSimple(cur,'Branch',o.br,2):'<p class="note">Tidak ada data.</p>';$('act1').innerHTML=acTrend(k,cur,r=>0,['Permintaan'],['#6C63D9']);}
}
$('acm').innerHTML=ACM.map((m,i)=>`<option value="${i}">${m}${i==3?' (1–'+Math.max(...Object.values(ACC).filter(v=>v&&v.nmax).map(v=>v.nmax))+' Nov, parsial)':''}</option>`).join('')+'<option value="all">All Month</option>';$('acm').value='2';
$('acm').onchange=e=>{const v=e.target.value;st.am=v=='all'?'all':+v;renderAC()};
$('acb').onchange=e=>{st.ab=e.target.value;renderAC()};
async function exportAC(){const k=st.as,o=ACC[k],cur=acCur(k),wb=XLSX.utils.book_new(),d=r=>`${r[1]} ${ACS[r[0]]} 2026`;let aoa;
 if(k=='ao')aoa=[['Tgl order','Unit (Channel Input)','Branch','HASIL','Status (INPROGRESS)','Fallout Group','Last Update','Umur','Order ID','Eskalasi ke','Fallout status','Keterangan'],...cur.map(r=>[d(r),o.u[r[2]],o.br[r[7]],r[3]?'INPROGRESS':'CLOSED',['COMPLETED','CANCELLED','INPROGRESS'][r[4]],o.fg[r[5]],o.lu[r[6]],r[9],r[11],r[12],o.fs[r[8]],r[10]])];
 if(k=='mo')aoa=[['Tgl order','Channel Name','Order Type','Branch','LAST STATUS','Status','Last Update'],...cur.map(r=>[d(r),o.ch[r[2]],o.ot[r[3]],o.br[r[6]],r[4]?'INPROGRESS':'CLOSED',['COMPLETED','CANCELLED','INPROGRESS'][r[5]],o.lu[r[7]]])];
 if(k=='tk')aoa=[['Tgl input','Channel Petugas yang melaporkan','Branch','Jenis Keluhan'],...cur.map(r=>[d(r),o.ch[r[2]],o.br[r[3]],o.j[r[4]]])];
 if(k=='nm')aoa=[['Tgl order','Requestor','Permintaan','Status Order','Branch'],...cur.map(r=>[d(r),o.rq[r[2]],o.pm[r[3]],o.st[r[4]],o.br[r[5]]])];
 if(k=='on')aoa=[['Tgl input','Branch','Status Input'],...cur.map(r=>[d(r),o.br[r[2]],o.si[r[3]]])];
 XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(aoa),ACT[k][0].slice(0,31));await saveFile('Kawalan_Admin_CC_'+ACT[k][0].replace(/\s+/g,'_')+'_'+(st.am=='all'?'Agu-Nov':ACS[st.am])+'.xlsx',xlsxBlob(wb))}


/* ===== generic sort untuk tabel statis ===== */
(function(){
 const isTot=tr=>{const st_=(tr.getAttribute('style')||'');return /font-weight:\s*700|background:\s*var\(--sf\)|#E9E8FB/i.test(st_)};
 const val=t=>{t=(t||'').replace(/[▲▼⇅]/g,'').trim();if(t===''||t==='–'||t==='-'||t==='·')return null;
  let m=t.match(/^([+−-]?[\d.,]+)\s*(jam|hari|mnt)\b/);if(m){let v=parseFloat(m[1].replace(',','.'));return m[2]=='hari'?v*24:m[2]=='mnt'?v/60:v}
  m=t.match(/^[+−-]?\d{1,3}(\.\d{3})+(?![\d,])/);if(m)return parseFloat(m[0].replace(/\./g,'').replace('−','-'));
  m=t.match(/^[+−-]?\d+(?:[.,]\d+)?/);if(m)return parseFloat(m[0].replace(',','.').replace('−','-'));return t.toLowerCase()};
 document.addEventListener('click',e=>{const th=e.target.closest('th');if(!th||th.dataset.k)return;const tb=th.closest('table');if(!tb||tb.hasAttribute('data-nosort'))return;
  const hr=th.parentElement,idx=[...hr.children].indexOf(th),body=tb.tBodies[0]||tb,all=[...body.querySelectorAll(':scope > tr')].filter(r=>r!==hr&&!r.querySelector('th'));
  const data=all.filter(r=>!isTot(r)),tots=all.filter(isTot);if(data.length<2)return;
  const dir=th.dataset.dir=='-1'?1:-1;hr.querySelectorAll('th').forEach(x=>{x.removeAttribute('data-s');x.textContent=x.textContent.replace(/ [▲▼]$/,'');delete x.dataset.dir});
  th.dataset.dir=dir;th.setAttribute('data-s','1');th.textContent=th.textContent+(dir>0?' ▲':' ▼');
  data.sort((a,b)=>{const x=val(a.children[idx]&&a.children[idx].textContent),y=val(b.children[idx]&&b.children[idx].textContent);
   if(x===null&&y===null)return 0;if(x===null)return 1;if(y===null)return -1;if(typeof x=='string'||typeof y=='string')return dir*String(x).localeCompare(String(y));return dir*(x-y)});
  const par=data[0].parentElement;data.concat(tots).forEach(r=>par.appendChild(r))});
})();

/* ===== menu gabungan tNPS & Tiket ===== */
(function(){
 const MAP={tn:{m:1,f:11,u:12,l:'tNPS',b:'mtn'},tk:{m:2,f:6,l:'Tiket',b:'mtk'}},LS={tn:1,tk:2};
 const orig=showTab;
 const grpOf=p=>p==1||p==11||p==12?'tn':p==2||p==6?'tk':null;
 showTab=function(p){p=+p;$('pg13').style.display='none';$('osub').style.display='none';$('orw').style.display='none';$('pg14').style.display='none';$('asub').style.display='none';$('acw').style.display='none';if(p==14){orig(14);$('pg14').style.display='';$('asub').style.display='';$('acw').style.display='';document.querySelector('.bar').style.display='none';$('xl').textContent='⬇ Unduh Excel Admin CC';renderAC()}else if(p==13){orig(13);$('pg13').style.display='';$('osub').style.display='';$('orw').style.display='';document.querySelector('.bar').style.display='none';$('xl').textContent='⬇ Unduh Excel Order';renderOR()}else if(p==12){orig(1);st.p=12;$('pg1').style.display='none';$('pg12').style.display='';document.querySelector('.bar').style.display='none';$('fm').parentElement.style.display='none';$('xl').textContent='⬇ Unduh Excel FU tNPS';renderFU()}else if(p!=13&&p!=14){orig(p);$('pg12').style.display='none'}const g=grpOf(p);$('tfw').style.display=p==11?'':'none';$('fuw').style.display=p==12?'':'none';$('sbu').style.display=g=='tn'?'':'none';
  ['tn','tk'].forEach(k=>{const b=$(MAP[k].b);if(b)b.classList.toggle('on',g==k)});
  const sb=$('subtabs');
  if(g){LS[g]=p;sb.style.display='';$('sl').textContent=MAP[g].l+' ·';sb.querySelectorAll('.sb').forEach(b=>b.classList.toggle('on',MAP[g][b.dataset.s]==p))}
  else sb.style.display='none';dmSync()};
 ['tn','tk'].forEach(k=>{$(MAP[k].b).onclick=()=>showTab(LS[k])});
 const DMM={"Master_CAPS": [["raw data GraPARI Jabar", "Master_CAPS__raw_data_GraPARI_Jabar.csv"], ["Target", "Master_CAPS__Target.csv"]], "Master_FU_tNPS": [["Okt", "Master_FU_tNPS__Okt.csv"], ["Nov", "Master_FU_tNPS__Nov.csv"]], "Master_Order": [["Nov", "Master_Order__Nov.csv"], ["Target AO Nov", "Master_Order__Target_AO_Nov.csv"]], "Master_Tiket_Fixed": [["Okt", "Master_Tiket_Fixed__Okt.csv"], ["sept", "Master_Tiket_Fixed__sept.csv"], ["agt", "Master_Tiket_Fixed__agt.csv"], ["Nov", "Master_Tiket_Fixed__Nov.csv"]], "Master_Tiket_Mobile": [["Agt", "Master_Tiket_Mobile__Agt.csv"], ["Sept", "Master_Tiket_Mobile__Sept.csv"], ["Okt", "Master_Tiket_Mobile__Okt.csv"], ["Nov", "Master_Tiket_Mobile__Nov.csv"]], "Master_Visit_Agustus": [["Agustus", "Master_Visit_Agustus__Agustus.csv"]], "Master_Visit_Juli": [["Juli", "Master_Visit_Juli__Juli.csv"]], "Master_Visit_November": [["November", "Master_Visit_November__November.csv"]], "Master_Visit_Oktober": [["Oktober", "Master_Visit_Oktober__Oktober.csv"]], "Master_Visit_September": [["September", "Master_Visit_September__September.csv"]], "Master_Waiting_Time": [["Sheet1", "Master_Waiting_Time__Sheet1.csv"]], "Master_tNPS_Fixed": [["Agt", "Master_tNPS_Fixed__Agt.csv"], ["Sept", "Master_tNPS_Fixed__Sept.csv"], ["Okt", "Master_tNPS_Fixed__Okt.csv"], ["Nov", "Master_tNPS_Fixed__Nov.csv"]], "Master_tNPS_Mobile": [["Agt", "Master_tNPS_Mobile__Agt.csv"], ["Sept", "Master_tNPS_Mobile__Sept.csv"], ["Okt", "Master_tNPS_Mobile__Okt.csv"], ["Nov", "Master_tNPS_Mobile__Nov.csv"]]},DMF={1:['Master_tNPS_Mobile'],11:['Master_tNPS_Fixed'],12:['Master_FU_tNPS'],2:['Master_Tiket_Mobile'],6:['Master_Tiket_Fixed'],4:['Master_Waiting_Time'],5:['Master_CAPS'],13:['Master_Order']},VMN=['Juli','Agustus','September','Oktober','November'];
 const dmList=()=>st.p==14?[]:st.p==3?(st.vm=='all'?VMN:[VMN[st.vm]]).map(m=>'Master_Visit_'+m):(DMF[st.p]||[]);
 window.dmSync=()=>{const L=dmList();$('dm').style.display=L.length?'':'none';$('dm').textContent='⬇ Data master'+(st.p==3?(st.vm=='all'?' (5 file)':' '+VMN[st.vm]):'')};
 $('dm').onclick=async()=>{const L=dmList();if(!L.length)return;const b=$('dm');b.disabled=true;b.textContent='⏳ Mengunduh data master…';try{if(typeof XLSX=='undefined')throw new Error('library Excel belum termuat, pastikan terhubung ke internet lalu muat ulang halaman');for(const f of L){const wb=XLSX.utils.book_new();for(const [sn,fn] of DMM[f]){const r=await fetch('master/'+fn);if(!r.ok)throw new Error(fn+' ('+r.status+')');const w=XLSX.read(await r.text(),{type:'string',raw:true});XLSX.utils.book_append_sheet(wb,w.Sheets[w.SheetNames[0]],sn.slice(0,31))}await saveFile(f+'.xlsx',xlsxBlob(wb))}}catch(e){alert('Gagal mengunduh data master: '+e.message)}b.disabled=false;dmSync()};
 {const ox=$('xl').onclick;$('xl').onclick=()=>st.p==12?exportFU():st.p==13?exportOrder():st.p==14?exportAC():ox()}
 document.querySelectorAll('#subtabs .sb').forEach(b=>b.onclick=()=>{const g=grpOf(st.p);if(g)showTab(MAP[g][b.dataset.s])});
})();

sync();render();showTab(3);
