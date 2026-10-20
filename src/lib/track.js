/* ---------- circuit (Catmull–Rom spline through control points) ---------- */
const CP=[[.12,.55],[.17,.26],[.37,.13],[.55,.3],[.7,.13],[.88,.22],[.92,.5],[.78,.68],[.6,.58],[.5,.85],[.28,.88],[.1,.78]];
const cr=(a,b,c,d,t)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
const P=[],C=[0];let L=0,slow=[];
(function(){const n=CP.length;
for(let i=0;i<n;i++){const a=CP[(i+n-1)%n],b=CP[i],c=CP[(i+1)%n],d=CP[(i+2)%n];
for(let k=0;k<12;k++){const t=k/12;P.push([cr(a[0],b[0],c[0],d[0],t),cr(a[1],b[1],c[1],d[1],t)])}}
const N=P.length;
for(let i=0;i<N;i++){const p=P[i],q=P[(i+1)%N];L+=Math.hypot((q[0]-p[0])*1.6,q[1]-p[1]);C.push(L)}
const ang=P.map((p,i)=>{const q=P[(i+1)%N];return Math.atan2(q[1]-p[1],(q[0]-p[0])*1.6)});
const k=ang.map((a,i)=>{let d=ang[(i+1)%N]-a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return Math.abs(d)});
slow=k.map((_,i)=>{let s=0;for(let j=-4;j<=4;j++)s+=k[(i+j+N)%N];return 1-.5*Math.min(1,s/9/.18)});
})();
function at(s){s=((s%L)+L)%L;let lo=0,hi=C.length-1;
while(hi-lo>1){const m=(lo+hi)>>1;if(C[m]<=s)lo=m;else hi=m}
const N=P.length,i=lo%N,f=(s-C[lo])/((C[lo+1]-C[lo])||1),p=P[i],q=P[(i+1)%N];
return{x:p[0]+(q[0]-p[0])*f,y:p[1]+(q[1]-p[1])*f,i}}


export {P,C,L,slow,at};
