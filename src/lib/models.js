import * as THREE from 'three';
export function setupScene(R){
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1.6,.1,80);
// studio reflections: soft boxes baked into an environment map
const es=new THREE.Scene();es.background=new THREE.Color(0x15222f);
const sb=(w,h,x,y,z,c,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(i),side:2}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)};
sb(14,5,0,9,0,0xffffff,5);sb(3,8,-9,3,0,0xffffff,3);sb(3,8,9,3,2,0xbfe6ff,3);sb(10,2,0,2,-9,0xff7a2e,3);sb(8,1.5,0,1,9,0xffffff,2);
sc.environment=new THREE.PMREMGenerator(R).fromScene(es,.02).texture;
sc.add(new THREE.HemisphereLight(0xffffff,0x223344,.35));
const sun=new THREE.DirectionalLight(0xffffff,1.1);sun.position.set(3,8,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:25});sc.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,14),new THREE.ShadowMaterial({opacity:.35}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;sc.add(floor);
const ringM=new THREE.MeshBasicMaterial({color:0xe8570f}),ring=new THREE.Mesh(new THREE.RingGeometry(3.7,3.78,96),ringM);ring.rotation.x=-Math.PI/2;ring.position.y=.005;sc.add(ring);

return{sc,cam,ringM}}
// materials
const std=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c},o));
const tire=std(0x0c0c0e,{roughness:.9}),rimM=std(0xd5dbe0,{metalness:1,roughness:.22}),dark=std(0x07080a,{roughness:.5,metalness:.4}),carbon=std(0x101114,{roughness:.35,metalness:.6}),
glass=new THREE.MeshPhysicalMaterial({color:0x06101a,metalness:.95,roughness:.06,clearcoat:1}),redL=new THREE.MeshBasicMaterial({color:0xff2230}),lamp=new THREE.MeshBasicMaterial({color:0xeaf6ff}),calip=std(0xd62828,{roughness:.4});
// helpers
const mk=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;return o};
const bx=(a,b,c,m,x,y,z)=>mk(new THREE.BoxGeometry(a,b,c),m,x,y,z);
const ext=(s,d,b)=>{const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:6,curveSegments:28});g.translate(0,0,-d/2);return g};
let wheels=[];
function wheel(r,w,x,z){
 const out=new THREE.Group(),sp=new THREE.Group();out.add(sp);
 const cyl=(a,h,m)=>{const g=new THREE.CylinderGeometry(a,a,h,40);g.rotateX(Math.PI/2);return new THREE.Mesh(g,m)};
 sp.add(cyl(r,w,tire),cyl(r*.7,w+.012,rimM),cyl(r*.58,w+.024,dark),cyl(r*.13,w+.05,rimM));
 for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(r*1.1,r*.15,.02),rimM);s.position.z=w/2+.016;s.rotation.z=i*Math.PI*2/5;sp.add(s)}
 const cp=new THREE.Mesh(new THREE.BoxGeometry(r*.3,r*.22,.03),calip);cp.position.set(r*.05,r*.42,w/2+.01);out.add(cp);
 out.position.set(x,r,z);out.traverse(o=>o.castShadow=true);if(z<0)out.rotation.y=Math.PI;
 wheels.push({sp,side:z<0?-1:1});return out}
function sports(paint,hyper){
 const g=new THREE.Group(),s=new THREE.Shape();
 s.moveTo(-2.3,.3);s.absarc(-1.4,.3,.44,Math.PI,0,true);s.lineTo(.98,.3);s.absarc(1.42,.3,.44,Math.PI,0,true);s.lineTo(2.3,.3);
 s.bezierCurveTo(2.42,.34,2.42,.56,2.26,.64);s.quadraticCurveTo(2,.76,1.6,.82);s.lineTo(.7,.9);s.lineTo(-.4,.92);s.lineTo(-1.2,.98);s.quadraticCurveTo(-2.15,1,-2.3,.8);s.lineTo(-2.3,.3);
 g.add(mk(ext(s,1.7,.14),paint));
 const c=new THREE.Shape();c.moveTo(.85,.88);c.quadraticCurveTo(.4,1.28,-.1,1.32);c.lineTo(-.6,1.32);c.quadraticCurveTo(-1.15,1.22,-1.5,.98);c.lineTo(.85,.88);
 const cm=mk(ext(c,1.1,.1),glass),k=hyper?.88:1;cm.scale.y=k;cm.position.y=.88*(1-k);g.add(cm);
 g.add(bx(.55,.05,1.95,carbon,2.3,.14,0),bx(.5,.18,1.6,carbon,-2.35,.28,0),bx(.12,.08,.2,paint,.72,1,1.08),bx(.12,.08,.2,paint,.72,1,-1.08));
 [1,-1].forEach(z=>{g.add(bx(2,.07,.08,carbon,-.2,.15,z*.97),bx(.8,.1,.02,dark,-.6,.58,z*1),bx(.1,.06,.5,lamp,2.32,.5,z*.55),bx(.06,.32,.06,carbon,-2.2,.95,z*.5),bx(.6,.2,.03,carbon,-2.25,1.12,z),wheel(.33,.3,1.42,z*.88),wheel(.33,hyper?.36:.32,-1.4,z*.88))});
 g.add(bx(.06,.07,1.5,redL,-2.42,.76,0),bx(.55,.05,2,carbon,-2.25,1.12,0));
 return g}
function formula(paint){
 const g=new THREE.Group(),cy=(a,b,h,x,y,sy,sz)=>{const o=new THREE.CylinderGeometry(a,b,h,32);o.rotateZ(-Math.PI/2);const m=mk(o,paint,x,y,0);m.scale.set(1,sy,sz);return m};
 g.add(cy(.07,.3,2.4,1.25,.38,1,.9),cy(.3,.27,1.8,-.35,.42,1,.9),cy(.23,.1,1.5,-1.35,.55,1,.7),bx(.7,.35,.03,paint,-1.5,.78,0),bx(3,.04,1.5,carbon,-.1,.12,0));
 [1,-1].forEach(z=>{const p=mk(new THREE.SphereGeometry(1,32,24),paint,-.2,.36,z*.52);p.scale.set(.95,.27,.27);g.add(p);
  g.add(bx(.4,.2,.03,carbon,2.45,.18,z*.97),bx(.6,.5,.03,carbon,-2.15,.85,z*.68),bx(.03,.03,.55,carbon,1.5,.3,z*.55),bx(.03,.03,.55,carbon,-1.45,.34,z*.5),wheel(.33,.3,1.55,z*.88),wheel(.36,.42,-1.5,z*.84))});
 g.add(bx(.35,.04,1.9,carbon,2.48,.1,0),bx(.25,.03,1.8,carbon,2.38,.2,0),bx(.4,.04,1.3,carbon,-2.15,.95,0),bx(.3,.03,1.3,carbon,-2.1,1.07,0),bx(.06,.5,.06,carbon,-2.1,.72,0));
 const h=mk(new THREE.TorusGeometry(.22,.018,8,24,Math.PI),carbon,.15,.7,0);h.rotation.x=Math.PI/2;h.rotation.z=Math.PI/2;g.add(h,bx(.03,.22,.03,carbon,.45,.6,0));
 g.add(mk(new THREE.SphereGeometry(.13,24,16),std(0xffffff,{roughness:.3}),-.1,.64,0));
 g.scale.setScalar(.95);return g}

export function buildCar(c){
 wheels=[];
 const paint=new THREE.MeshPhysicalMaterial({color:c.c,metalness:.55,roughness:.28,clearcoat:1,clearcoatRoughness:.04});
 const group=c.cl==='Open-wheel'?formula(paint):sports(paint,c.cl==='Hypercar');
 return{group,paint,wheels};
}
