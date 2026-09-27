const loader=document.getElementById("loader");window.addEventListener("load",()=>setTimeout(()=>loader.classList.add("done"),850));const nav=document.getElementById("siteNav"),menu=document.getElementById("menuToggle");menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",open);});document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");}));const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.1});document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;document.querySelectorAll(".nav-link").forEach(a=>a.classList.remove("active"));const a=document.querySelector('.nav-link[href="#'+e.target.id+'"]');if(a)a.classList.add("active");}),{rootMargin:"-35% 0px -55% 0px"});document.querySelectorAll("main section[id]").forEach(s=>navObserver.observe(s));const glow=document.getElementById("cursorGlow");let glowFrame=0,gx=0,gy=0;window.addEventListener("pointermove",e=>{if(!glow)return;gx=e.clientX;gy=e.clientY;if(glowFrame)return;glowFrame=requestAnimationFrame(()=>{glow.style.left=gx+"px";glow.style.top=gy+"px";glowFrame=0;});},{passive:true});if(window.matchMedia("(pointer:fine)").matches){document.querySelectorAll("[data-tilt]").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform="perspective(1000px) rotateX("+(-y*5)+"deg) rotateY("+(x*7)+"deg) translateZ(8px)";});card.addEventListener("pointerleave",()=>card.style.transform="");});}document.getElementById("year").textContent=new Date().getFullYear();
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

/* RAISEN OS — PHASE 2: CINEMATIC 3D REACTOR CORE */
(()=>{
  const canvas=document.getElementById("threeCanvas"), world=document.getElementById("threeWorld"), fallback=document.getElementById("threeFallback");
  if(!canvas||!world)return;

  const showFallback=()=>{
    world.classList.add("three-fallback-active");
    if(fallback)fallback.setAttribute("aria-hidden","false");
    window.raisen3DReady=true;
    window.raisen3DWebGL=false;
  };

  const initThree=()=>{
    if(!window.THREE){showFallback();return;}
    try{
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(34,1,.1,100);
      camera.position.set(0,0,8.6);

      const renderer=new THREE.WebGLRenderer({
        canvas,alpha:true,antialias:true,powerPreference:"high-performance"
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      renderer.setSize(1,1,false);
      renderer.setClearColor(0x000000,0);
      if("outputColorSpace" in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;
      if("toneMapping" in renderer){
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=1.15;
      }
      window.raisen3DReady=true;
      window.raisen3DWebGL=true;

      /* Lighting: soft fill + strong purple key + cool rim */
      scene.add(new THREE.HemisphereLight(0xd8c5ff,0x09030f,2.2));
      const key=new THREE.PointLight(0xc58aff,38,22,2);
      key.position.set(3,3,4);
      scene.add(key);
      const rim=new THREE.PointLight(0x6f25ff,26,18,2);
      rim.position.set(-3,-2,-3);
      scene.add(rim);
      const topLight=new THREE.PointLight(0xf2e9ff,10,10,2);
      topLight.position.set(0,4,1);
      scene.add(topLight);

      const reactor=new THREE.Group();
      scene.add(reactor);

      /* Dense faceted energy core */
      const core=new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.08,3),
        new THREE.MeshPhysicalMaterial({
          color:0x5d18c7,
          emissive:0x8e3fff,
          emissiveIntensity:3.1,
          metalness:.58,
          roughness:.16,
          clearcoat:.8,
          clearcoatRoughness:.12,
          transparent:true,
          opacity:.98
        })
      );
      reactor.add(core);

      /* Hot inner plasma */
      const plasma=new THREE.Mesh(
        new THREE.SphereGeometry(.72,18,18),
        new THREE.MeshBasicMaterial({
          color:0xe8d8ff,
          transparent:true,
          opacity:.20,
          blending:THREE.AdditiveBlending,
          depthWrite:false
        })
      );
      reactor.add(plasma);

      const plasmaHotspot=new THREE.Mesh(
        new THREE.SphereGeometry(.38,16,16),
        new THREE.MeshBasicMaterial({
          color:0xffffff,
          transparent:true,
          opacity:.38,
          blending:THREE.AdditiveBlending,
          depthWrite:false
        })
      );
      reactor.add(plasmaHotspot);

      /* Transparent protective shell */
      const shell=new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.38,2),
        new THREE.MeshPhysicalMaterial({
          color:0x9f67ff,
          emissive:0x4c168e,
          emissiveIntensity:.65,
          metalness:.1,
          roughness:.2,
          clearcoat:1,
          clearcoatRoughness:.05,
          transparent:true,
          opacity:.16,
          wireframe:true
        })
      );
      reactor.add(shell);

      /* Three different orbital rings for depth */
      const ringData=[
        {radius:1.78,x:.62,z:.18,speed:.55,color:0xb978ff},
        {radius:2.12,x:.92,z:-.22,speed:-.34,color:0xe7d9ff},
        {radius:2.50,x:1.22,z:.46,speed:.25,color:0x8d43ff}
      ];
      const orbitalRings=[];
      ringData.forEach((d,i)=>{
        const holder=new THREE.Group();
        holder.rotation.set(d.x,0,d.z);
        reactor.add(holder);

        const glow=new THREE.Mesh(
          new THREE.TorusGeometry(d.radius,.055,6,90),
          new THREE.MeshBasicMaterial({
            color:d.color,transparent:true,opacity:.20,
            blending:THREE.AdditiveBlending,depthWrite:false
          })
        );
        const ring=new THREE.Mesh(
          new THREE.TorusGeometry(d.radius,.014,6,90),
          new THREE.MeshBasicMaterial({
            color:d.color,transparent:true,opacity:.95,
            blending:THREE.AdditiveBlending,depthWrite:false
          })
        );
        holder.add(glow,ring);

        /* Moving light segments make the rings feel energized */
        const arcs=[];
        for(let a=0;a<2;a++){
          const arc=new THREE.Mesh(
            new THREE.TorusGeometry(d.radius+.008,.035,5,42,Math.PI*.42),
            new THREE.MeshBasicMaterial({
              color:a===0?0xffffff:d.color,
              transparent:true,opacity:.9,
              blending:THREE.AdditiveBlending,depthWrite:false
            })
          );
          arc.rotation.z=a*Math.PI;
          holder.add(arc);
          arcs.push(arc);
        }
        orbitalRings.push({holder,glow,ring,arcs,speed:d.speed,index:i});
      });

      /* Floating energy particles arranged around the reactor */
      const particleGroups=[];
      const particleColors=[0xdcc8ff,0xa96cff,0xf1eaff];
      for(let g=0;g<3;g++){
        const count=70;
        const pos=new Float32Array(count*3);
        for(let i=0;i<count;i++){
          const a=Math.random()*Math.PI*2;
          const radius=1.55+g*.36+(Math.random()-.5)*.18;
          const y=(Math.random()-.5)*.34;
          pos[i*3]=Math.cos(a)*radius;
          pos[i*3+1]=y+(Math.random()-.5)*.5;
          pos[i*3+2]=Math.sin(a)*radius;
        }
        const geo=new THREE.BufferGeometry();
        geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
        const points=new THREE.Points(
          geo,
          new THREE.PointsMaterial({
            color:particleColors[g],size:g===1?.022:.016,
            transparent:true,opacity:g===1?.78:.52,
            blending:THREE.AdditiveBlending,depthWrite:false
          })
        );
        points.rotation.x=ringData[g].x;
        points.rotation.z=ringData[g].z;
        reactor.add(points);
        particleGroups.push(points);
      }

      /* Fine star field gives the object scale and depth */
      const starsGeo=new THREE.BufferGeometry();
      const starCount=350;
      const positions=new Float32Array(starCount*3);
      for(let i=0;i<starCount;i++){
        const radius=5+Math.random()*12;
        const a=Math.random()*Math.PI*2;
        const b=Math.acos(2*Math.random()-1);
        positions[i*3]=radius*Math.sin(b)*Math.cos(a);
        positions[i*3+1]=radius*Math.cos(b);
        positions[i*3+2]=radius*Math.sin(b)*Math.sin(a);
      }
      starsGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
      const stars=new THREE.Points(
        starsGeo,
        new THREE.PointsMaterial({
          color:0xcdb7ff,size:.022,transparent:true,opacity:.58,
          depthWrite:false
        })
      );
      scene.add(stars);

      const mouse={x:0,y:0,tx:0,ty:0};
      const clock=new THREE.Clock();
      let dragging=false,lastX=0,lastY=0,rotX=0,rotY=0,worldVisible=true;

      function resize(){
        const r=world.getBoundingClientRect();
        if(!r.width||!r.height)return;
        renderer.setSize(r.width,r.height,false);
        camera.aspect=r.width/r.height;
        camera.updateProjectionMatrix();
      }
      new ResizeObserver(resize).observe(world);
      const visibilityObserver=new IntersectionObserver(entries=>{worldVisible=entries[0]?.isIntersecting??true;},{threshold:0});
      visibilityObserver.observe(world);
      resize();

      canvas.addEventListener("pointermove",e=>{
        const r=canvas.getBoundingClientRect();
        if(r.width&&r.height){
          mouse.tx=((e.clientX-r.left)/r.width-.5)*2;
          mouse.ty=((e.clientY-r.top)/r.height-.5)*2;
        }
        if(dragging){
          rotY+=(e.clientX-lastX)*.009;
          rotX+=(e.clientY-lastY)*.007;
          lastX=e.clientX;
          lastY=e.clientY;
        }
      });
      canvas.addEventListener("pointerdown",e=>{
        dragging=true;
        lastX=e.clientX;
        lastY=e.clientY;
        canvas.setPointerCapture?.(e.pointerId);
      });
      const endDrag=e=>{
        dragging=false;
        if(e&&canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
      };
      canvas.addEventListener("pointerup",endDrag);
      canvas.addEventListener("pointercancel",endDrag);

      function animate(){
        requestAnimationFrame(animate); if(document.hidden || !worldVisible) return;
        const t=clock.getElapsedTime();

        mouse.x+=(mouse.tx-mouse.x)*.045;
        mouse.y+=(mouse.ty-mouse.y)*.045;

        if(!dragging&&window.raisen3DAutoRotate!==false){
          rotY+=.0026;
          rotX+=.00065;
        }

        /* Cinematic floating motion */
        reactor.position.y=Math.sin(t*.72)*.045;
        reactor.rotation.x=rotX+mouse.y*.14+Math.sin(t*.45)*.028;
        reactor.rotation.y=rotY+mouse.x*.20+Math.cos(t*.38)*.035;
        reactor.rotation.z=Math.sin(t*.31)*.012;

        core.rotation.x=t*.22;
        core.rotation.y=t*.34;
        core.rotation.z=t*.10;

        plasma.rotation.y=-t*.55;
        plasma.rotation.x=t*.31;
        plasmaHotspot.rotation.y=t*.9;

        shell.rotation.x=-t*.12;
        shell.rotation.y=t*.18;
        shell.rotation.z=-t*.07;

        const breathe=1+Math.sin(t*2.15)*.035+Math.sin(t*4.4)*.012;
        core.scale.setScalar(breathe);
        plasma.scale.setScalar(1+Math.sin(t*2.7)*.11);
        plasmaHotspot.scale.setScalar(1+Math.sin(t*3.2)*.14);

        key.position.x=3+Math.sin(t*.8)*.7;
        key.position.y=3+Math.cos(t*.6)*.5;
        rim.position.x=-3+Math.cos(t*.5)*.6;

        orbitalRings.forEach((r,i)=>{
          r.holder.rotation.y=t*r.speed*.16;
          r.holder.rotation.x+=Math.sin(t*.25+i)*.00035;
          r.glow.material.opacity=.13+Math.sin(t*2+i)*.035;
          r.arcs.forEach((arc,a)=>{
            arc.rotation.z=a*Math.PI+t*(.5+i*.12)*(a?-.7:1);
            arc.rotation.x=Math.sin(t*.9+i)*.035;
          });
          const pulse=1+Math.sin(t*2.2+i)*.025;
          r.holder.scale.setScalar(pulse);
        });

        particleGroups.forEach((p,i)=>{
          p.rotation.y=t*(.10+i*.055)*(i===1?-1:1);
          p.rotation.z=Math.sin(t*.35+i)*.04;
        });

        stars.rotation.y=t*.006;
        stars.rotation.x=Math.sin(t*.12)*.02;

        camera.position.z=8.6+Math.sin(t*.42)*.07;
        camera.position.x=Math.sin(t*.23)*.08;
        camera.position.y=Math.cos(t*.27)*.05;
        camera.lookAt(0,0,0);

        renderer.render(scene,camera);
      }
      animate();

      document.querySelectorAll(".core-node").forEach(btn=>{
        btn.addEventListener("click",()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"}));
      });
    }catch(error){
      console.warn("RAISEN cinematic 3D unavailable; using visual fallback.",error);
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


/* RAISEN AI — PHASE 2: LIVE CHAT BRIDGE */
(()=>{
 const input=document.getElementById("neuralInput");
 const send=document.getElementById("neuralSend");
 const historyEl=document.getElementById("neuralHistory");
 const statusEl=document.querySelector(".neural-top small");
 if(!input||!send||!historyEl)return;

 /*
  Configure the deployed backend with:
  window.RAISEN_API_BASE="https://your-backend.example.com";
  or localStorage.setItem("raisenApiBase","https://your-backend.example.com")
 */
 const detectedBase=(location.hostname.endsWith(".vercel.app")||location.hostname==="vercel.app")?location.origin:"http://127.0.0.1:8000";\n const API_BASE=(window.RAISEN_API_BASE||localStorage.getItem("raisenApiBase")||detectedBase).replace(/\\/+$/,"");
 const conversation=[];

 const localCommands={
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

 const add=(who,msg,extraClass="")=>{
  const row=document.createElement("div");
  row.className=extraClass;
  const label=document.createElement("b");
  label.textContent=who+":";
  row.appendChild(label);
  row.appendChild(document.createTextNode(" "+msg));
  historyEl.appendChild(row);
  historyEl.scrollTop=historyEl.scrollHeight;
  return row;
 };

 const setStatus=(text,online=false)=>{
  if(statusEl){
   statusEl.textContent=text;
   statusEl.dataset.aiState=online?"online":"offline";
  }
 };

 const setBusy=(busy)=>{
  input.disabled=busy;
  send.disabled=busy;
  send.classList.toggle("busy",busy);
 };

 const parseSSE=(buffer,consume)=>{
  const events=buffer.split("\\n\\n");
  const remainder=events.pop()||"";
  events.forEach(event=>{
   let type="message";
   const data=[];
   event.split("\\n").forEach(line=>{
    if(line.startsWith("event:"))type=line.slice(6).trim();
    if(line.startsWith("data:"))data.push(line.slice(5).trim());
   });
   consume(type,data.join("\\n"));
  });
  return remainder;
 };

 const streamChat=async message=>{
  if(!API_BASE){
   throw new Error("AI backend URL is not configured.");
  }

  const response=await fetch(API_BASE+"/chat/stream",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({
    message,
    conversation_history:conversation.slice(-8)
   })
  });

  if(!response.ok){
   let detail="AI backend returned HTTP "+response.status+".";
   try{
    const body=await response.json();
    if(body.detail)detail=String(body.detail);
   }catch(e){}
   throw new Error(detail);
  }

  if(!response.body)throw new Error("AI backend returned no stream.");

  const row=document.createElement("div");
  const label=document.createElement("b");
  label.textContent="RAISEN:";
  row.appendChild(label);
  row.appendChild(document.createTextNode(" "));
  const textNode=document.createTextNode("");
  row.appendChild(textNode);
  historyEl.appendChild(row);

  let fullReply="";
  let buffer="";
  const reader=response.body.getReader();
  const decoder=new TextDecoder();

  const consume=(type,data)=>{
   if(type==="error"){
    let message=data;
    try{message=JSON.parse(data)}catch(e){}
    throw new Error(String(message||"AI stream failed."));
   }
   if(type==="done")return;
   if(!data)return;
   let chunk=data;
   try{chunk=JSON.parse(data)}catch(e){}
   if(typeof chunk!=="string")chunk=String(chunk);
   fullReply+=chunk;
   textNode.textContent=fullReply;
   historyEl.scrollTop=historyEl.scrollHeight;
  };

  try{
   while(true){
    const {value,done}=await reader.read();
    if(done)break;
    buffer+=decoder.decode(value,{stream:true});
    buffer=parseSSE(buffer,consume);
   }
   buffer+=decoder.decode();
   if(buffer.trim())parseSSE(buffer+"\\n\\n",consume);
  }finally{
   reader.releaseLock();
  }

  if(!fullReply.trim())throw new Error("RAISEN returned an empty response.");
  conversation.push({role:"assistant",content:fullReply});
  return fullReply;
 };

 const run=async()=>{
  const q=input.value.trim();
  if(!q||send.disabled)return;
  input.value="";

  const normalized=q.toLowerCase();
  add("YOU",q,"user-line");

  if(normalized==="clear"){
   historyEl.innerHTML="";
   conversation.length=0;
   setStatus("RAISEN NEURAL CONSOLE / AI READY",true);
   return;
  }

  if(normalized==="home"){
   location.hash="home";
   add("RAISEN",localCommands.home);
   return;
  }

  if(["commands","about","skills","projects","journey","contact","developer","recruiter","lab","system"].includes(normalized)){
   add("RAISEN",localCommands[normalized]);
   conversation.push({role:"user",content:q},{role:"assistant",content:localCommands[normalized]});
   return;
  }

  conversation.push({role:"user",content:q});
  setBusy(true);
  setStatus("RAISEN NEURAL CONSOLE / THINKING...",false);

  try{
   await streamChat(q);
   setStatus("RAISEN NEURAL CONSOLE / AI ONLINE",true);
  }catch(error){
   add("RAISEN","AI link unavailable: "+(error?.message||"connection failed.")+" Try again after the backend is running.");
   conversation.pop();
   setStatus("RAISEN NEURAL CONSOLE / OFFLINE",false);
  }finally{
   setBusy(false);
   input.focus();
  }
 };

 send.addEventListener("click",run);
 input.addEventListener("keydown",e=>{
  if(e.key==="Enter"){
   e.preventDefault();
   run();
  }
 });

 setStatus("RAISEN NEURAL CONSOLE / AI READY",true);
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
