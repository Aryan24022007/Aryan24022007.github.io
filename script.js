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
    [1.85,.55,0.18,0.25],
    [2.2,.85,-.2,-.18],
    [2.65,1.15,.45,.12]
  ];
  ringData.forEach((d,i)=>{
    const torus=new THREE.Mesh(
      new THREE.TorusGeometry(d[0],.012,8,120),
      new THREE.MeshBasicMaterial({color:i===1?0xd2b8ff:0x8f55ff,transparent:true,opacity:.55})
    );
    torus.rotation.x=d[1]; torus.rotation.z=d[2]; torus.userData.speed=d[3];
    group.add(torus);
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
    group.children.slice(2,5).forEach((o,i)=>{o.rotation.z+=ringData[i][3]*.006;o.rotation.y+=.0015*(i+1)});
    stars.rotation.y=t*.008;
    core.scale.setScalar(1+Math.sin(t*2.1)*.025);
    renderer.render(scene,camera);
  }
  animate();

  document.querySelectorAll(".core-node").forEach(btn=>{
    btn.addEventListener("click",()=>document.getElementById(btn.dataset.target)?.scrollIntoView({behavior:"smooth"}));
  });
})();
