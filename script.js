const CONFIG = {
  email: "your.email@example.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/"
};

const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("done"), 850);
});

const nav = document.getElementById("siteNav");
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => sectionObserver.observe(el));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (active) active.classList.add("active");
  });
}, { rootMargin: "-35% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(section => navObserver.observe(section));

const emailLink = document.getElementById("emailLink");
emailLink.textContent = `${CONFIG.email} ↗`;
emailLink.href = `mailto:${CONFIG.email}`;

document.querySelectorAll(".social-row a").forEach(a => {
  const label = a.textContent.trim().split(" ")[0].toLowerCase();
  if (CONFIG[label]) a.href = CONFIG[label];
});

document.getElementById("copyEmail").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(CONFIG.email);
    button.innerHTML = "Copied <span>✓</span>";
    setTimeout(() => button.innerHTML = "Copy email <span>⧉</span>", 1600);
  } catch {
    window.location.href = `mailto:${CONFIG.email}`;
  }
});

const glow = document.getElementById("cursorGlow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

// Small magnetic interaction on desktop.
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.08;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.08;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
