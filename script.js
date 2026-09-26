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
 const commands={help:"Available: about • skills • projects • journey • contact • github • home • clear",about:"Aryan Kumar — 2nd year CSE (AI & ML) student, builder and explorer.",skills:"C • C++ • Python • DSA • AI/ML → Generative AI",projects:"Raisen Portfolio • Tic-Tac-Toe • LeetCode / DSA practice",journey:"C → DSA → Python → ML → Generative AI",contact:"Scroll to the contact section or use the social links.",github:"Opening GitHub...",home:"Returning to the core..."};
 const run=(raw)=>{const c=raw.trim().toLowerCase();if(!c)return;if(c==="clear"){output.innerHTML="";return}if(c==="github"){output.textContent="Opening GitHub...";setTimeout(()=>window.open("https://github.com/Aryan24022007","_blank"),250);return}if(c==="home"){location.hash="home";close();return}if(["about","skills","projects","journey","contact"].includes(c)){output.textContent=commands[c];location.hash=c;return}output.innerHTML=commands[c]?commands[c]:"Command not found. Type <b>help</b>.";};
 const open=()=>{overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");setTimeout(()=>input.focus(),100)};
 const close=()=>{overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");input.value=""};
 openBtn.addEventListener("click",open);closeBtn.addEventListener("click",close);overlay.addEventListener("click",e=>{if(e.target===overlay)close()});input.addEventListener("keydown",e=>{if(e.key==="Enter")run(input.value);if(e.key==="Escape")close()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("open"))close();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();open()}});
 document.querySelectorAll(".launcher-hints button").forEach(b=>b.addEventListener("click",()=>run(b.dataset.command)));
})();

/* RAISEN OS — PHASE 2: THREE.JS CORE WORLD */
(()=>{
  const canvas=document.getElementById("threeCanvas"), world=document.getElementById("threeWorld");
  if(!canvas || !window.THREE) return;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);
  camera.position.set(0,0,7.8);

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000,0);

  const group=new THREE.Group();
  scene.add(group);

  const ambient=new THREE.AmbientLight(0x8d6ccf,1.5);
  scene.add(ambient);
  const key=new THREE.PointLight(0xa66cff,18,18);
  key.position.set(2.5,3,4);
  scene.add(key);
  const rim=new THREE.PointLight(0x5b27c9,12,12);
  rim.position.set(-3,-2,-2);
  scene.add(rim);

  const coreGeo=new THREE.IcosahedronGeometry(1.15,5);
  const coreMat=new THREE.MeshStandardMaterial({color:0x4e18a5,emissive:0x8b45ff,emissiveIntensity:1.5,metalness:.45,roughness:.2,transparent:true,opacity:.92});
  const core=new THREE.Mesh(coreGeo,coreMat);
  group.add(core);

  const shell=new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.42,2),
    new THREE.MeshBasicMaterial({color:0xb78cff,wireframe:true,transparent:true,opacity:.24})
  );
  group.add(shell);

  const ringData=[
    [1.82,.62,0.18,0.42,0x9b5cff],
    [2.18,.92,-.22,-0.30,0xd7bfff],
    [2.58,1.22,.46,0.22,0x7d3cff]
  ];
  const orbitalRings=[];
  ringData.forEach((d,i)=>{
    const glow=new THREE.Mesh(
      new THREE.TorusGeometry(d[0],.065,10,160),
      new THREE.MeshBasicMaterial({color:d[4],transparent:true,opacity:.10,blending:THREE.AdditiveBlending,depthWrite:false})
    );
    const ring=new THREE.Mesh(
      new THREE.TorusGeometry(d[0],.022,10,160),
      new THREE.MeshBasicMaterial({color:d[4],transparent:true,opacity:.88,blending:THREE.AdditiveBlending,depthWrite:false})
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
  const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xc9b6ff,size:.025,transparent:true,opacity:.55}));
  scene.add(stars);

  const mouse={x:0,y:0,tx:0,ty:0}, clock=new THREE.Clock();
  let dragging=false,lastX=0,lastY=0,rotX=0,rotY=0;

  function resize(){
    const r=world.getBoundingClientRect();
    renderer.setSize(r.width,r.height,false);
    camera.aspect=r.width/r.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(world); resize();

  canvas.addEventListener("pointermove",e=>{
    const r=canvas.getBoundingClientRect();
    mouse.tx=((e.clientX-r.left)/r.width-.5)*2;
    mouse.ty=((e.clientY-r.top)/r.height-.5)*2;
    if(dragging){rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY;}
  });
  canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener("pointerup",()=>{dragging=false});
  canvas.addEventListener("pointerleave",()=>{dragging=false});

  function animate(){
    requestAnimationFrame(animate);
    const t=clock.getElapsedTime();
    mouse.x+=(mouse.tx-mouse.x)*.045; mouse.y+=(mouse.ty-mouse.y)*.045;
    if(!dragging){rotY+=.0022;rotX+=.0006}
    group.rotation.x=rotX+mouse.y*.12;
    group.rotation.y=rotY+mouse.x*.2;
    core.rotation.x=t*.22; core.rotation.y=t*.31;
    shell.rotation.x=-t*.1; shell.rotation.y=t*.14;
    orbitalRings.forEach((r,i)=>{
      r.glow.rotation.z+=r.glow.userData.speed*.006;
      r.ring.rotation.z+=r.ring.userData.speed*.006;
      r.glow.rotation.y+=.002*(i+1);
      r.ring.rotation.y+=.002*(i+1);
      const pulse=1+Math.sin(t*2.2+i)*.035;
      r.glow.scale.setScalar(pulse);
      r.ring.scale.setScalar(pulse);
    });
    stars.rotation.y=t*.008;
    core.scale.setScalar(1+Math.sin(t*2.1)*.025);
    renderer.render(scene,camera);
  }
  animate();

  document.querySelectorAll(".core-node").forEach(btn=>{
    btn.addEventListener("click",()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"}));
  });
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
  ["3D Core","window.THREE && document.getElementById('threeCanvas')"],
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
