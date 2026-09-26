const loader=document.getElementById("loader");window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("done"),850));const nav=document.getElementById("siteNav"),menu=document.getElementById("menuToggle");menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open);});document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");}));const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.1});document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;document.querySelectorAll(".nav-link").forEach(a=>a.classList.remove("active"));const a=document.querySelector('.nav-link[href="#'+e.target.id+'"]');if(a)a.classList.add("active");}),{rootMargin:"-35% 0px -55% 0px"});document.querySelectorAll("main section[id]").forEach(s=>navObserver.observe(s));const glow=document.getElementById("cursorGlow");window.addEventListener("pointermove",e=>{if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}});if(window.matchMedia("(pointer:fine)").matches){document.querySelectorAll("[data-tilt]").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform="perspective(1000px) rotateX("+(-y*5)+"deg) rotateY("+(x*7)+"deg) translateZ(8px)";});card.addEventListener("pointerleave",()=>card.style.transform="");});}document.getElementById("year").textContent=new Date().getFullYear();
/* RAISEN OS — PHASE 1 INTERACTIONS */
(()=>{
 const boot=document.getElementById("osBoot"), progress=document.getElementById("bootProgress"), status=document.getElementById("bootStatus"), log=document.getElementById("bootLog"), skip=document.getElementById("bootSkip");
 const lines=["LOADING IDENTITY MATRIX...","MOUNTING PROJECT DATABASE...","SYNCING SKILL MODULES...","CALIBRATING CURIOSITY ENGINE...","RAISEN CORE ONLINE."];
 let i=0, timer;
 const finish=()=>{clearInterval(timer);progress.style.width="100%";status.textContent="SYSTEM ONLINE";log.textContent="WELCOME, ARYAN.";setTimeout(()=>boot.classList.add("done"),450);sessionStorage.setItem("raisenBooted","1");};
 if(sessionStorage.getItem("raisenBooted")==="1"){boot.classList.add("done");}else{
  timer=setInterval(()=>{i++;progress.style.width=Math.min(i*20,100)+"%";status.textContent=lines[Math.min(i-1,lines.length-1)];log.textContent=lines[Math.min(i-1,lines.length-1)];if(i>=5)finish();},420);
 }
 skip.addEventListener("click",finish);
})();
(()=>{
 const overlay=document.getElementById("osLauncher"), openBtn=document.getElementById("osCommandButton"), closeBtn=document.getElementById("launcherClose"), input=document.getElementById("commandInput"), output=document.getElementById("commandOutput");
 const commands={help:"Available: about • skills • projects • lab • developer • recruiter • neural • journey • contact • github • home • clear",about:"Aryan Kumar — 2nd year CSE (AI & ML) student, builder and explorer.",skills:"C • C++ • Python • DSA • AI/ML → Generative AI",projects:"Raisen Portfolio • Tic-Tac-Toe • LeetCode / DSA practice",journey:"C → DSA → Python → ML → Generative AI",contact:"Scroll to the contact section or use the social links.",github:"Opening GitHub...",home:"Returning to the core..."};
 const run=(raw)=>{const c=raw.trim().toLowerCase();if(!c)return;if(c==="clear"){output.innerHTML="";return}if(c==="github"){output.textContent="Opening GitHub...";setTimeout(()=>window.open("https://github.com/Aryan24022007","_blank"),250);return}if(c==="home"){location.hash="home";close();return}if(["about","skills","projects","lab","developer","journey","contact","neural"].includes(c)){const target=c==="lab"?"project-lab":c==="developer"?"developer-world":c==="neural"?"neural-console":c;output.textContent=commands[c]||("Opening "+c+"...");location.hash=target;return}output.innerHTML=commands[c]?commands[c]:"Command not found. Type <b>help</b>.";};
 const open=()=>{overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");setTimeout(()=>input.focus(),100)};
 const close=()=>{overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");input.value=""};
 openBtn.addEventListener("click",open);closeBtn.addEventListener("click",close);overlay.addEventListener("click",e=>{if(e.target===overlay)close()});input.addEventListener("keydown",e=>{if(e.key==="Enter")run(input.value);if(e.key==="Escape")close()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("open"))close();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();open()}});
 document.querySelectorAll(".launcher-hints button").forEach(b=>b.addEventListener("click",()=>run(b.dataset.command)));
})();

/* RAISEN OS — PHASE 2: THREE.JS CORE WORLD — HARDENED */
(()=>{
  const canvas=document.getElementById("threeCanvas"), world=document.getElementById("threeWorld"), fallback=document.getElementById("threeFallback");
  if(!canvas || !world) return;

  const showFallback=()=>{
    world.classList.add("three-fallback-active");
    if(fallback) fallback.setAttribute("aria-hidden","false");
    window.raisen3DReady=true;
    window.raisen3DWebGL=false;
  };

  const initThree=()=>{
    if(!window.THREE){showFallback();return;}
    try{
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(38,1,.1,100);
      camera.position.set(0,0,7.8);

      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      if("outputColorSpace" in renderer) renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000,0);
      window.raisen3DReady=true;
      window.raisen3DWebGL=true;

      const group=new THREE.Group();
      scene.add(group);

      scene.add(new THREE.AmbientLight(0xb58cff,2.4));
      const key=new THREE.PointLight(0xc18aff,28,20);
      key.position.set(2.5,3,4);
      scene.add(key);
      const rim=new THREE.PointLight(0x6c2cff,18,16);
      rim.position.set(-3,-2,-2);
      scene.add(rim);

      const core=new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.15,4),
        new THREE.MeshStandardMaterial({
          color:0x6b20d8,emissive:0xa45cff,emissiveIntensity:2.4,
          metalness:.35,roughness:.18,transparent:true,opacity:.98
        })
      );
      group.add(core);

      const shell=new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.45,2),
        new THREE.MeshBasicMaterial({color:0xe1caff,wireframe:true,transparent:true,opacity:.42})
      );
      group.add(shell);

      const innerGlow=new THREE.Mesh(
        new THREE.SphereGeometry(.78,32,32),
        new THREE.MeshBasicMaterial({color:0xd8baff,transparent:true,opacity:.10,blending:THREE.AdditiveBlending,depthWrite:false})
      );
      group.add(innerGlow);

      const ringData=[
        [1.82,.62,.18,.42,0xb16cff],
        [2.18,.92,-.22,-.30,0xe3d2ff],
        [2.58,1.22,.46,.22,0x8b45ff]
      ];
      const orbitalRings=[];
      ringData.forEach((d,i)=>{
        const glow=new THREE.Mesh(
          new THREE.TorusGeometry(d[0],.085,12,192),
          new THREE.MeshBasicMaterial({color:d[4],transparent:true,opacity:.18,blending:THREE.AdditiveBlending,depthWrite:false})
        );
        const ring=new THREE.Mesh(
          new THREE.TorusGeometry(d[0],.032,12,192),
          new THREE.MeshBasicMaterial({color:d[4],transparent:true,opacity:.98,blending:THREE.AdditiveBlending,depthWrite:false})
        );
        glow.rotation.x=d[1]; glow.rotation.z=d[2];
        ring.rotation.copy(glow.rotation);
        glow.userData.speed=d[3]; ring.userData.speed=d[3];
        group.add(glow); group.add(ring);
        orbitalRings.push({glow,ring});
      });

      const starsGeo=new THREE.BufferGeometry(), starCount=900, positions=new Float32Array(starCount*3);
      for(let i=0;i<starCount;i++){
        const radius=5+Math.random()*10, a=Math.random()*Math.PI*2, b=Math.acos(2*Math.random()-1);
        positions[i*3]=radius*Math.sin(b)*Math.cos(a);
        positions[i*3+1]=radius*Math.cos(b);
        positions[i*3+2]=radius*Math.sin(b)*Math.sin(a);
      }
      starsGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
      const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xd9c7ff,size:.028,transparent:true,opacity:.7}));
      scene.add(stars);

      const mouse={x:0,y:0,tx:0,ty:0}, clock=new THREE.Clock();
      let dragging=false,lastX=0,lastY=0,rotX=0,rotY=0;

      function resize(){
        const r=world.getBoundingClientRect();
        if(!r.width||!r.height)return;
        renderer.setSize(r.width,r.height,false);
        camera.aspect=r.width/r.height;
        camera.updateProjectionMatrix();
      }
      new ResizeObserver(resize).observe(world);
      resize();

      canvas.addEventListener("pointermove",e=>{
        const r=canvas.getBoundingClientRect();
        if(r.width&&r.height){
          mouse.tx=((e.clientX-r.left)/r.width-.5)*2;
          mouse.ty=((e.clientY-r.top)/r.height-.5)*2;
        }
        if(dragging){
          rotY+=(e.clientX-lastX)*.008;
          rotX+=(e.clientY-lastY)*.006;
          lastX=e.clientX; lastY=e.clientY;
        }
      });
      canvas.addEventListener("pointerdown",e=>{
        dragging=true;lastX=e.clientX;lastY=e.clientY;
        canvas.setPointerCapture?.(e.pointerId);
      });
      const endDrag=e=>{
        dragging=false;
        if(e&&canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
      };
      canvas.addEventListener("pointerup",endDrag);
      canvas.addEventListener("pointercancel",endDrag);

      function animate(){
        requestAnimationFrame(animate);
        const t=clock.getElapsedTime();
        mouse.x+=(mouse.tx-mouse.x)*.045;
        mouse.y+=(mouse.ty-mouse.y)*.045;
        if(!dragging && window.raisen3DAutoRotate!==false){rotY+=.0028;rotX+=.0008}
        const cinematicEase=.5+.5*Math.sin(t*.9);
        group.rotation.x=rotX+mouse.y*.16+Math.sin(t*.55)*.035;
        group.rotation.y=rotY+mouse.x*.24+Math.cos(t*.42)*.045;
        group.rotation.z=Math.sin(t*.34)*.018;
        core.rotation.x=t*.28+Math.sin(t*.8)*.08;
        core.rotation.y=t*.38+Math.cos(t*.65)*.1;
        shell.rotation.x=-t*.14+Math.sin(t*.5)*.05;
        shell.rotation.y=t*.20+Math.cos(t*.4)*.06;
        const corePulse=1+Math.sin(t*2.1)*.035+Math.sin(t*4.7)*.012;
        core.scale.setScalar(corePulse);
        innerGlow.scale.setScalar(1+Math.sin(t*2.4)*.08+cinematicEase*.025);
        innerGlow.material.opacity=.08+Math.sin(t*1.7)*.025;
        orbitalRings.forEach((r,i)=>{
          const speed=.008*(1+i*.18);
          r.glow.rotation.z+=r.glow.userData.speed*speed;
          r.ring.rotation.z+=r.ring.userData.speed*speed;
          r.glow.rotation.x+=Math.sin(t*.35+i)*.0007;
          r.ring.rotation.x+=Math.sin(t*.35+i)*.0007;
          r.glow.rotation.y+=.0025*(i+1);
          r.ring.rotation.y+=.0025*(i+1);
          const pulse=1+Math.sin(t*2.4+i)*.045+Math.sin(t*1.1+i)*.018;
          r.glow.scale.setScalar(pulse);
          r.ring.scale.setScalar(pulse);
          r.glow.material.opacity=.12+Math.sin(t*2+i)*.035;
        });
        stars.rotation.y=t*.01;
        stars.rotation.x=Math.sin(t*.12)*.025;
        camera.position.z=7.8+Math.sin(t*.55)*.08;
        camera.lookAt(0,0,0);
        renderer.render(scene,camera);
      }
      animate();

      document.querySelectorAll(".core-node").forEach(btn=>{
        btn.addEventListener("click",()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"}));
      });
    }catch(error){
      console.warn("RAISEN 3D WebGL unavailable; using visual fallback.",error);
      showFallback();
    }
  };

  if(window.THREE){
    initThree();
  }else{
    const script=document.createElement("script");
    script.src="https://unpkg.com/three@0.180.0/build/three.min.js";
    script.async=true;
    script.onload=initThree;
    script.onerror=showFallback;
    document.head.appendChild(script);
    setTimeout(()=>{if(!window.raisen3DReady)showFallback()},5000);
  }
})(); 

/* RAISEN OS — PHASE 3 INTERACTIONS */
(()=>{const shell=document.querySelector(".dev-world-shell"),display=document.getElementById("moduleDisplay"),toggle=document.getElementById("recruiterToggle");if(!shell||!display||!toggle)return;const data={projects:{code:"PROJECT DATABASE // 03 ENTRIES",title:"What I've built so far.",text:"Raisen Portfolio, Tic-Tac-Toe in C, and DSA practice. This is a living build log — every new project can become another module.",label:"PROJECTS"},skills:{code:"SKILL MATRIX // CURRENT STATE",title:"Capabilities, not claims.",text:"C is currently the strongest area. C++ and Python are developing, DSA is in progress, and AI/ML → Generative AI is the next learning arc.",label:"SKILLS"},journey:{code:"EVOLUTION TREE // ACTIVE PATH",title:"C → DSA → Python → ML → GenAI",text:"The path is deliberately layered: strengthen programming, build problem-solving ability, learn Python, then move into ML and Generative AI.",label:"EVOLUTION"},contact:{code:"OPEN CHANNEL // CONNECTION",title:"Want to build something?",text:"Use the contact section for LinkedIn, GitHub, Instagram or email. The channel is open for projects, opportunities and conversations.",label:"CONNECT"}};const setModule=name=>{const d=data[name];if(!d)return;document.querySelectorAll(".module-card").forEach(b=>b.classList.toggle("active",b.dataset.module===name));display.querySelector(".display-code").textContent=d.code;display.querySelector("h3").textContent=d.title;display.querySelector("p").textContent=d.text;document.getElementById("moduleObject").querySelector("span").textContent=d.label+" // ONLINE"};document.querySelectorAll(".module-card").forEach(btn=>btn.addEventListener("click",()=>setModule(btn.dataset.module)));toggle.addEventListener("click",()=>{shell.classList.toggle("recruiter-mode");toggle.classList.toggle("active");toggle.innerHTML=shell.classList.contains("recruiter-mode")?'<i class="fa-solid fa-user"></i> STUDENT MODE':'<i class="fa-solid fa-briefcase"></i> RECRUITER MODE';if(shell.classList.contains("recruiter-mode")){display.querySelector(".display-code").textContent="RECRUITER VIEW // QUICK SCAN";display.querySelector("h3").textContent="C • DSA • PYTHON • AI/ML";display.querySelector("p").textContent="Second-year B.Tech CSE (AI & ML) student. Current focus: Python fundamentals, DSA practice and exploring Generative AI.";document.getElementById("moduleObject").querySelector("span").textContent="PROFILE // SCANNED"}else setModule(document.querySelector(".module-card.active")?.dataset.module||"projects")})})();


/* RAISEN OS — PHASE 4 INTERACTIONS */
(()=>{
 const lab=document.querySelector(".project-lab"), modal=document.getElementById("systemModal");
 if(!lab||!modal)return;
 const projects={
  portfolio:{code:"MODULE 01 // WEB / 3D SYSTEM",title:"Raisen Portfolio",text:"A futuristic personal portfolio built as an interactive system, with Three.js, responsive layouts and command-style interactions.",tags:["HTML","CSS","JAVASCRIPT","THREE.JS"]},
  tictactoe:{code:"MODULE 02 // C / LOGIC",title:"Tic-Tac-Toe",text:"A console-based C mini project focused on conditions, loops, functions and game logic.",tags:["C","LOGIC","CONSOLE"]},
  dsa:{code:"MODULE 03 // DSA / PRACTICE",title:"DSA Practice",text:"A growing problem-solving track focused on arrays and core data-structure practice.",tags:["ARRAYS","DSA","PROBLEM SOLVING"]}
 };
 const display=document.getElementById("labDisplay");
 const setProject=name=>{
  const p=projects[name]; if(!p)return;
  lab.querySelectorAll(".lab-card").forEach(b=>b.classList.toggle("active",b.dataset.lab===name));
  display.querySelector(".lab-code").textContent=p.code;
  display.querySelector("h3").textContent=p.title;
  display.querySelector("p").textContent=p.text;
  display.querySelector(".lab-tags").innerHTML=p.tags.map(t=>"<b>"+t+"</b>").join("");
  display.querySelector("#labStatus").textContent="MODULE ONLINE";
 };
 lab.querySelectorAll(".lab-card").forEach(b=>b.addEventListener("click",()=>setProject(b.dataset.lab)));

 const list=document.getElementById("diagnosticList"), footer=document.getElementById("diagnosticFooter");
 const checks=[
  ["Core DOM","document.querySelector('#home') && document.querySelector('#contact')"],
  ["Navigation","[...document.querySelectorAll('.nav-link')].every(a=>document.querySelector(a.getAttribute('href')))"],
  ["3D Core","window.raisen3DReady===true && document.getElementById('threeCanvas')"],
  ["Project Lab","document.querySelectorAll('.lab-card').length===3"],
  ["Developer World","document.querySelector('.dev-world-shell') && document.querySelector('#recruiterToggle')"],
  ["Command Center","document.querySelector('#osLauncher') && document.querySelector('#osCommandButton')"],
  ["Contact Channels","document.querySelectorAll('.social-card').length>=4"]
 ];
 const runCheck=()=>{
  list.innerHTML="";
  let passed=0;
  checks.forEach(([name,expr])=>{
   let ok=false; try{ok=Boolean(Function("return ("+expr+")")())}catch(e){ok=false}
   if(ok)passed++;
   const row=document.createElement("div");row.className="diag-row "+(ok?"ok":"fail");
   row.innerHTML="<span>"+name+"</span><b>"+(ok?"ONLINE":"CHECK")+"</b>";list.appendChild(row);
  });
  footer.textContent=passed===checks.length?"SYSTEM CHECK COMPLETE // ALL MODULES ONLINE":passed+"/"+checks.length+" MODULES ONLINE // REVIEW REQUIRED";
 };
 const open=()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");runCheck()};
 const close=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")};
 document.getElementById("systemCheck").addEventListener("click",open);
 document.getElementById("systemModalClose").addEventListener("click",close);
 modal.addEventListener("click",e=>{if(e.target===modal)close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))close()});
})(); 


/* RAISEN OS — PHASE 5 INTERACTIONS */
(()=>{
 const input=document.getElementById("neuralInput"),send=document.getElementById("neuralSend"),history=document.getElementById("neuralHistory");
 if(!input||!send||!history)return;
 const answers={
  commands:"Try: about, skills, projects, journey, contact, developer, recruiter, lab, system, home, clear.",
  about:"Aryan Kumar — second-year B.Tech CSE (AI & ML) student, builder and explorer.",
  skills:"Current stack: C, C++ basics, Python beginner, DSA learning. AI/ML → Generative AI is the next learning direction.",
  projects:"Current projects: Raisen Portfolio, Tic-Tac-Toe in C, and DSA/LeetCode practice.",
  journey:"Current path: C → DSA → Python → ML → Generative AI.",
  contact:"Open the Contact section for email, LinkedIn, GitHub and Instagram.",
  developer:"Developer World contains the interactive skill, project, evolution and connection modules.",
  recruiter:"Recruiter Mode is inside Developer World and gives a compact profile view.",
  lab:"Project Lab lets you inspect the three current projects and run a system diagnostic.",
  system:"Use RUN SYSTEM CHECK inside Project Lab to inspect the major page modules.",
  home:"Returning to the core."
 };
 const add=(who,msg)=>{
  const row=document.createElement("div");
  row.className=who==="YOU"?"user-line":"";
  row.innerHTML="<b>"+who+":</b> "+msg;
  history.appendChild(row);history.scrollTop=history.scrollHeight;
 };
 const run=()=>{
  const q=input.value.trim().toLowerCase();if(!q)return;
  add("YOU",q);input.value="";
  if(q==="clear"){history.innerHTML="";return}
  if(q==="home"){location.hash="home";add("RAISEN",answers.home);return}
  const key=Object.keys(answers).find(k=>q===k||q.includes(k));
  add("RAISEN",key?answers[key]:"I don't have a live AI model attached. Try 'commands' to explore what this local console can do.");
 };
 send.addEventListener("click",run);
 input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();run()}});
})(); 

/* PHASE 5 — HARDENING */
(()=>{
 const canvas=document.getElementById("threeCanvas");
 if(canvas){
   canvas.addEventListener("pointercancel",()=>{});
 }
})();


/* RAISEN OS — PHASE 6 INTERACTIONS */
(()=>{
 const ids=["toggle3d","toggleFx","toggleMotion","toggleCompact"], els=ids.map(id=>document.getElementById(id)), status=document.getElementById("controlStatus"), reset=document.getElementById("resetControls");
 if(els.some(x=>!x)||!status||!reset)return;
 const defaults={toggle3d:true,toggleFx:true,toggleMotion:false,toggleCompact:false};
 const save=()=>{const state={};ids.forEach((id,i)=>state[id]=els[i].checked);localStorage.setItem("raisenControls",JSON.stringify(state));apply(state)};
 const apply=state=>{
  document.body.classList.toggle("fx-off",!state.toggleFx);
  document.body.classList.toggle("reduced-motion",state.toggleMotion);
  document.body.classList.toggle("compact-mode",state.toggleCompact);
  window.raisen3DAutoRotate=state.toggle3d;
  const active=[];if(state.toggle3d)active.push("3D");if(state.toggleFx)active.push("FX");if(state.toggleMotion)active.push("LOW-MOTION");if(state.toggleCompact)active.push("COMPACT");
  status.textContent="SYSTEM PROFILE: "+(active.length?active.join(" + "):"MINIMAL");
 };
 const stored=(()=>{try{return JSON.parse(localStorage.getItem("raisenControls")||"null")}catch(e){return null}})();
 const state=stored?{...defaults,...stored}:defaults;
 ids.forEach((id,i)=>els[i].checked=Boolean(state[id]));apply(state);
 els.forEach(el=>el.addEventListener("change",save));
 reset.addEventListener("click",()=>{ids.forEach((id,i)=>els[i].checked=defaults[id]);save()});
})(); 

/* PHASE 6 — 3D CONTROL BRIDGE */
(()=>{
 const oldFlag=window.raisen3DAutoRotate;
 window.raisen3DAutoRotate=oldFlag===undefined?true:oldFlag;
})();
