import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, Crosshair, LocateFixed, MapPin, Navigation, ShieldCheck, Users, ExternalLink, Radio } from "lucide-react";
import { requestCurrentLocation } from "../lib/location";

const BASE_TECHS = [
  { id:"T-201", name:"Rahul Sharma", status:"On job", skill:"Hydraulics L3", dx:.0028, dy:-.0014, tone:"bg-blue-500", phase:0.3 },
  { id:"T-204", name:"Arjun Mehta", status:"Available", skill:"Mechanical L2", dx:-.0018, dy:.0019, tone:"bg-emerald-500", phase:2.1 },
  { id:"T-207", name:"Vikram Rao", status:"Travelling", skill:"Electrical L3", dx:.0041, dy:.0026, tone:"bg-amber-500", phase:4.2 },
];

const mercY = lat => Math.log(Math.tan(Math.PI/4 + lat*Math.PI/360));

export default function TechnicianLiveMap({ onShowGraph, showGraph = false, tasks = [] }){
  const [location,setLocation]=useState(null);
  const [error,setError]=useState("");
  const [asking,setAsking]=useState(false);
  const [tick,setTick]=useState(0);
  const [history,setHistory]=useState([]);
  const [graphOpen, setGraphOpen] = useState(showGraph);
  useEffect(() => {
    setGraphOpen(showGraph);
  }, [showGraph]);
  const [draggedPins,setDraggedPins]=useState({});
  const [draggingId,setDraggingId]=useState(null);
  const mapRef=useRef(null);

  const ask=async()=>{
    setAsking(true); setError("");
    try{
      const x=await requestCurrentLocation({maximumAge:0});
      setLocation(x);
      localStorage.setItem("maintenax-last-location",JSON.stringify(x));
    }catch(e){ setError(e.message); }
    finally{ setAsking(false); }
  };

  useEffect(()=>{ ask(); },[]);
  useEffect(()=>{
    const id=setInterval(()=>setTick(t=>t+1),1800);
    return()=>clearInterval(id);
  },[]);
  useEffect(() => {
    ask();
  }, []);

  const bounds=useMemo(()=>location?{
    west:location.longitude-.010, east:location.longitude+.010,
    south:location.latitude-.0065, north:location.latitude+.0065
  }:null,[location]);

  const pins=useMemo(()=>{
    if(!location||!bounds) return [];
    let telemetry=null;
    try{ telemetry=JSON.parse(localStorage.getItem("maintenax-technician-telemetry")||"null"); }catch{}
    return BASE_TECHS.map((t,i)=>{
      const live=telemetry?.find?.(x=>x.id===t.id);
      // If a technician device publishes GPS, use it exactly. Otherwise animate a bounded preview route.
      const angle=t.phase+tick*(0.16+i*.025);
      const lat=Number(live?.latitude) || location.latitude+t.dy+Math.sin(angle)*.00042;
      const lng=Number(live?.longitude) || location.longitude+t.dx+Math.cos(angle*.82)*.00048;
      const x=(lng-bounds.west)/(bounds.east-bounds.west)*100;
      const y=(mercY(bounds.north)-mercY(lat))/(mercY(bounds.north)-mercY(bounds.south))*100;
      const dLat=(lat-location.latitude)*111000;
      const dLng=(lng-location.longitude)*111000*Math.cos(location.latitude*Math.PI/180);
      return {...t,lat,lng,x,y,distance:Math.round(Math.hypot(dLat,dLng)),source:live?"GPS":"preview"};
    });
  },[location,bounds,tick]);

  useEffect(() => {
    if (!pins.length) return;

    const active = pins.filter((p) => p.status !== "Offline").length;
    const travelling = pins.filter((p) => p.status === "Travelling").length;
    const avg = Math.round(
      pins.reduce((sum, p) => sum + p.distance, 0) / pins.length
    );

    const workload = pins.reduce((total, technician) => {
      const technicianTasks = tasks.filter(
        (task) =>
          task.technician === technician.name ||
          task.assignedTechnician === technician.name,
      );

      return total + technicianTasks.length;
    }, 0);

    setHistory((history) =>
      [
        ...history,
        {
          label: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          active,
          travelling,
          avg,
          workload,
        },
      ].slice(-18)
    );
  }, [pins, tasks]);

  const beginPinDrag=(event,id)=>{
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDraggingId(id);
  };

  const movePin=(event,id)=>{
    if(draggingId!==id||!mapRef.current) return;
    event.preventDefault();
    const rect=mapRef.current.getBoundingClientRect();
    const x=Math.max(3,Math.min(97,((event.clientX-rect.left)/rect.width)*100));
    const y=Math.max(5,Math.min(95,((event.clientY-rect.top)/rect.height)*100));
    setDraggedPins(current=>({...current,[id]:{x,y}}));
  };

  const endPinDrag=(event,id)=>{
    if(draggingId!==id) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDraggingId(null);
    setDraggedPins(current=>{
      try{ localStorage.setItem("maintenax-dragged-field-pins",JSON.stringify(current)); }catch{}
      return current;
    });
  };

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("maintenax-dragged-field-pins")||"{}");
      if(saved&&typeof saved==="object") setDraggedPins(saved);
    }catch{}
  },[]);

  const mapUrl=location&&bounds
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.west}%2C${bounds.south}%2C${bounds.east}%2C${bounds.north}&layer=mapnik`
    : "";
  const openMapUrl=location?`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`:"#";

  const chartPoints =
    history.length > 1
      ? history
          .map((h, i) => {
            const servicing = h.workload + h.travelling * 0.5 + Math.sin(i * 1.7) * 0.8;

            const x = (i / (history.length - 1)) * 100;
            const y = 70 - servicing * 8;

            return `${x},${y}`;
          })
          .join(" ")
      : "0,58 20,56 40,57 60,55 80,56 100,54";

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2"><Navigation className="h-4 w-4 text-cyan-500"/><h3 className="font-bold text-slate-900 dark:text-white">Live Field Overview</h3><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"><Radio className="h-3 w-3"/>Live</span></div>
        <p className="mt-1 text-xs text-slate-500">Operational map, moving technician telemetry and field activity trend</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setGraphOpen(true);
            onShowGraph?.(true);
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 text-xs font-bold text-cyan-700 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-950"
        >
          <Activity className="h-4 w-4" />
          Line Overview
        </button>
        {location&&<a href={openMapUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"><ExternalLink className="h-4 w-4"/>Open map</a>}
        {Object.keys(draggedPins).length>0&&<button onClick={()=>{setDraggedPins({});localStorage.removeItem("maintenax-dragged-field-pins");}} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">Reset pins</button>}
        <button onClick={ask} disabled={asking} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-bold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"><LocateFixed className="h-4 w-4"/>{asking?"Locating…":location?"Refresh GPS":"Allow location"}</button>
      </div>
    </div>

    {!location ? <div className="grid min-h-[430px] place-items-center bg-slate-50 p-8 text-center dark:bg-[#07131c]">
      <div className="max-w-md"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/10"><MapPin className="h-6 w-6 text-cyan-500"/></span><h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Location access required</h4><p className="mt-2 text-sm leading-6 text-slate-500">Allow browser location access so MaintenaX can centre the live operations map and calculate field proximity.</p>{error&&<p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}<button onClick={ask} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 text-sm font-bold text-cyan-600 dark:text-cyan-300"><Crosshair className="h-4 w-4"/>Request location again</button></div>
    </div> : <div className="grid xl:grid-cols-[minmax(0,1.55fr)_360px]">
      <div ref={mapRef} className="relative min-h-[540px] overflow-hidden bg-slate-200 dark:bg-slate-900">
        <iframe title="MaintenaX live operations map" src={mapUrl} className="absolute inset-0 h-full w-full border-0" loading="eager"/>
        <div className="pointer-events-none absolute inset-0 bg-slate-950/[.02]"/>
        <div className="absolute left-3 top-3 rounded-lg border border-white/60 bg-white/95 px-3 py-2 text-[10px] font-black tracking-[.12em] text-slate-700 shadow-lg">OPENSTREETMAP • LIVE FIELD</div>
        <div className="absolute z-20 transition-all duration-1000" style={{left:"50%",top:"50%",transform:"translate(-50%,-50%)"}}><span className="absolute -inset-3 animate-ping rounded-full bg-cyan-500/20"/><span className="relative grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-cyan-500 shadow-xl"><Crosshair className="h-4 w-4 text-slate-950"/></span><span className="absolute left-1/2 top-11 w-max -translate-x-1/2 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">YOU • ±{Math.round(location.accuracy)}m</span></div>
        {pins.map(p=>{
          const manual=draggedPins[p.id];
          const x=manual?.x ?? Math.max(5,Math.min(95,p.x));
          const y=manual?.y ?? Math.max(8,Math.min(92,p.y));
          const dragging=draggingId===p.id;
          return <div
            key={p.id}
            role="button"
            tabIndex={0}
            title="Drag to reposition technician"
            onPointerDown={e=>beginPinDrag(e,p.id)}
            onPointerMove={e=>movePin(e,p.id)}
            onPointerUp={e=>endPinDrag(e,p.id)}
            onPointerCancel={e=>endPinDrag(e,p.id)}
            className={`absolute z-30 select-none touch-none ${dragging?"cursor-grabbing scale-110":"cursor-grab hover:scale-105"} ${manual?"transition-none":"transition-all duration-[1600ms] ease-linear"}`}
            style={{left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)"}}
          >
            <span className={`grid h-10 w-10 place-items-center rounded-full border-[3px] border-white ${p.tone} text-xs font-black text-white shadow-xl ring-offset-2 ${dragging?"ring-4 ring-cyan-300/70":""}`}>{p.name.split(" ").map(x=>x[0]).join("")}</span>
            <span className="pointer-events-none absolute left-1/2 top-12 w-max -translate-x-1/2 rounded-lg bg-slate-950 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg">{p.name} • {p.status}{manual?" • moved":""}</span>
          </div>;
        })}
      </div>

      <aside className="border-l border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-500"/><b className="text-sm text-slate-900 dark:text-white">Field activity</b></div><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Updating</span></div>
          <div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900"><b className="block text-lg text-slate-900 dark:text-white">{pins.length}</b><span className="text-[10px] text-slate-500">Active</span></div><div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900"><b className="block text-lg text-slate-900 dark:text-white">{pins.filter(p=>p.status==='Travelling').length}</b><span className="text-[10px] text-slate-500">Travelling</span></div><div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900"><b className="block text-lg text-slate-900 dark:text-white">{pins.length?Math.round(pins.reduce((s,p)=>s+p.distance,0)/pins.length):0}m</b><span className="text-[10px] text-slate-500">Avg range</span></div></div>
          {graphOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      </span>

                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Live operational health
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Updating automatically from current field activity.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGraphOpen(false);
                      onShowGraph?.(false);
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {history.length
                        ? Math.max(
                            0,
                            Math.min(
                              100,
                              Math.round(
                                100 -
                                  (history.at(-1).avg / 700) * 35 -
                                  history.at(-1).workload * 3
                              )
                            )
                          )
                        : 92}
                      %
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <Radio className="h-3 w-3" />
                    Live
                  </span>
                </div>

                <div className="mt-4 h-56 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <svg
                    viewBox="0 0 100 90"
                    preserveAspectRatio="none"
                    className="h-full w-full overflow-visible"
                  >
                    <line
                      x1="0"
                      y1="82"
                      x2="100"
                      y2="82"
                      stroke="currentColor"
                      className="text-slate-300 dark:text-slate-700"
                      strokeWidth=".7"
                    />

                    <line
                      x1="0"
                      y1="52"
                      x2="100"
                      y2="52"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth=".5"
                      strokeDasharray="2 2"
                    />

                    <polyline
                      points={chartPoints}
                      fill="none"
                      stroke="currentColor"
                      className="text-cyan-500"
                      strokeWidth="2.3"
                      vectorEffect="non-scaling-stroke"
                    />

                    <circle
                      cx="100"
                      cy={
                        history.length
                          ? 82 - (history.at(-1).avg / 700) * 62
                          : 58
                      }
                      r="2.2"
                      fill="currentColor"
                      className="text-cyan-500"
                    />
                  </svg>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>Earlier</span>
                  <span>Operational health</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 h-28 rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
            <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="h-full w-full overflow-visible"><line x1="0" y1="82" x2="100" y2="82" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth=".7"/><line x1="0" y1="52" x2="100" y2="52" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth=".5" strokeDasharray="2 2"/><polyline points={chartPoints} fill="none" stroke="currentColor" className="text-cyan-500" strokeWidth="2.3" vectorEffect="non-scaling-stroke"/><circle cx="100" cy={history.length?82-(history.at(-1).avg/700)*62:58} r="2.2" fill="currentColor" className="text-cyan-500"/></svg>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Average technician range • rolling live window</p>
        </div>
        <div className="p-4"><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-cyan-500"/><b className="text-sm text-slate-900 dark:text-white">Technicians</b></div><span className="text-xs font-bold text-slate-400">{pins.length} online</span></div>
          {pins.map(p=><div key={p.id} className="border-b border-slate-100 py-3 last:border-0 dark:border-slate-800"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${p.tone}`}/><b className="text-sm text-slate-900 dark:text-white">{p.name}</b></div><span className="text-[11px] font-bold text-slate-400">{p.distance} m</span></div><p className="mt-1 text-xs text-slate-500">{p.skill} • {p.status}</p></div>)}
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] leading-5 text-slate-500 dark:bg-slate-900"><ShieldCheck className="mb-1 h-4 w-4 text-cyan-500"/>Map placement uses geographic coordinates. When technician devices publish GPS to <code>maintenax-technician-telemetry</code>, those exact coordinates replace the animated preview routes automatically.</div>
        </div>
      </aside>
    </div>}
  </section>;
}
