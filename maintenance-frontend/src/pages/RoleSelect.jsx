import { Building2, ChevronRight, HardHat, ShieldCheck, UserRound, Wrench } from "lucide-react";
const roles=[
 {id:"Facility Manager",title:"Facility Manager",desc:"Full operational control, requests, workforce, reports and settings.",icon:Building2,tag:"OPERATIONS"},
 {id:"Supervisor",title:"Supervisor",desc:"Review work, verify completion, resolve conflicts and monitor SLAs.",icon:ShieldCheck,tag:"OVERSIGHT"},
 {id:"Technician",title:"Technician",desc:"View assigned jobs, update progress and complete maintenance tasks.",icon:HardHat,tag:"FIELD"},
 {id:"Requester",title:"Requester / User",desc:"Raise maintenance requests and track their status from one workspace.",icon:UserRound,tag:"SERVICE"},
];
export default function RoleSelect({onSelect}){
 return <main className="min-h-screen bg-[#050b12] text-white">
  <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-6 py-8 lg:px-12">
   <header className="flex items-center justify-between border-b border-white/10 pb-6">
    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20"><Wrench className="h-5 w-5 text-cyan-300"/></span><div><div className="text-2xl font-black tracking-[-.04em]">Maintena<span className="text-cyan-300">X</span></div><p className="text-[10px] font-bold tracking-[.2em] text-slate-500">ADAPTIVE MAINTENANCE INTELLIGENCE</p></div></div>
    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-bold tracking-[.14em] text-emerald-300">● SYSTEM ONLINE</span>
   </header>
   <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[.82fr_1.18fr]">
    <div><p className="text-xs font-bold tracking-[.18em] text-cyan-300">SECURE ROLE GATEWAY</p><h1 className="mt-5 max-w-xl text-5xl font-black leading-[1.03] tracking-[-.05em] lg:text-6xl">Enter the workspace built for <span className="text-cyan-300">your role.</span></h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-400">MaintenaX gives every stakeholder a focused operational workspace with secure role-based access.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">{roles.map(({id,title,desc,icon:Icon,tag})=><button key={id} onClick={()=>onSelect(id)} className="group min-h-[210px] rounded-2xl border border-white/10 bg-[#091722] p-6 text-left shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-[#0b1c29]"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/5"><Icon className="h-6 w-6 text-cyan-300"/></span><span className="text-[9px] font-bold tracking-[.16em] text-slate-500">{tag}</span></div><h2 className="mt-7 text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-cyan-300">Continue as {title}<ChevronRight className="h-4 w-4 transition group-hover:translate-x-1"/></div></button>)}</div>
   </section>
  </div>
 </main>
}