// ======= GSAP PLUGIN REGISTER =======
// স্ক্রল অ্যানিমেশন সচল রাখার জন্য প্লাগইনটি সবার আগে রেজিস্টার করা হলো
gsap.registerPlugin(ScrollTrigger);

// ======= DARK AND LIGHT MODE =======
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("selectedTheme");

  if (savedTheme) {
    html.setAttribute("data-bs-theme", savedTheme);
    if (savedTheme === "dark" && themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun", "text-white", "fs-3");
    }
  }
});

function toggleTheme() {
  const html = document.documentElement;
  let themeIcon = document.getElementById("themeIcon");
  let currentTheme = html.getAttribute("data-bs-theme");

  if (currentTheme === "light") {
    html.setAttribute("data-bs-theme", "dark");
    if (themeIcon) {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun", "text-white", "fs-3");
    }
    localStorage.setItem("selectedTheme", "dark");
  } else {
    html.setAttribute("data-bs-theme", "light");
    if (themeIcon) {
      themeIcon.classList.remove("fa-sun", "text-white", "fs-3");
      themeIcon.classList.add("fa-moon");
    }
    localStorage.setItem("selectedTheme", "light");
  }
}

// ======= DOM CONTENT LOADED (NAV, HERO, BUTTON EFFECTS) =======
// লোডিং স্পিড বাড়ানোর জন্য window.load এর পরিবর্তে DOMContentLoaded ব্যবহার করা হয়েছে
document.addEventListener("DOMContentLoaded", () => {
  // --- NAV PART ACTIVE LINK & SCROLL SPY ---
  const navItems = document.querySelectorAll(".nav_item_body ul li");
  const navLinks = document.querySelectorAll(".nav_item_body ul li a");

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      navItems.forEach((i) => i.classList.remove("active"));
      this.classList.add("active");
    });
  });

  const sections = [];
  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      const section = document.querySelector(targetId);
      if (section) sections.push(section);
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: "-30% 0px -60% 0px",
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach((item) => {
          const link = item.querySelector("a");
          if (link && link.getAttribute("href") === `#${id}`) {
            navItems.forEach((i) => i.classList.remove("active"));
            item.classList.add("active");
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => observer.observe(section));

  // --- NAV ENTRY ANIMATION ---
  gsap.from(".navlogo_img", {
    y: -50,
    duration: 1,
    scale: 1.2,
    ease: "power1.out",
  });

  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(".nav-item", {
    y: 0,
    opacity: 1,
    duration: 0.3,
    stagger: 0.2,
    scale: 1.3,
    ease: "power2.out",
  });

  // --- HERO RINGS ANIMATION ---
  const rings = [
    { el: ".hero_r1", angle: 0, speed: 1, base: 75 },
    { el: ".hero_r2", angle: 120, speed: 0.7, base: 110 },
    { el: ".hero_r3", angle: 240, speed: 0.5, base: 150 },
  ];

  let t = 0;
  gsap.ticker.add(() => {
    t += 0.02;
    rings.forEach((r) => {
      r.angle += r.speed;
      const radius = r.base + Math.sin(t) * 20;
      const rad = (r.angle * Math.PI) / 180;
      const x = Math.cos(rad) * radius;
      const y = Math.sin(rad) * radius;

      gsap.set(r.el + " .herotext", { x: x, y: y, rotation: 0 });
      const scale = 1 + Math.sin(t) * 0.1;
      gsap.set(r.el, { scale: scale });
    });
  });

  // --- HERO TYPING EFFECT ---
  const texts = [
    "Web Development ",
    "WordPress Development ",
    "Theme Customization ",
  ];
  let index = 0,
    charIndex = 0,
    isDeleting = false;
  const element = document.querySelector(".hero_text_typing");

  function typeEffect() {
    if (!element) return;
    const currentText = texts[index];
    element.textContent = isDeleting
      ? currentText.substring(0, charIndex--)
      : currentText.substring(0, charIndex++);

    let speed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentText.length) {
      speed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      index = (index + 1) % texts.length;
      speed = 300;
    }
    setTimeout(typeEffect, speed);
  }
  typeEffect();

  gsap.from(".hero_text_typing", {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });

  // --- BUTTON INTERACTION (FIRE BUTTONS) ---
  const buttons = document.querySelectorAll(".fire-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => btn.classList.add("active"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("active"));
    btn.addEventListener("click", () => {
      btn.classList.remove("clicked");
      void btn.offsetWidth; // Trigger reflow
      btn.classList.add("clicked");
      setTimeout(() => btn.classList.remove("clicked"), 800);
    });
  });
});

// ======= HERO SCROLL ANIMATION =======
const heroTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });

heroTl
  .to(".wel_txt", { opacity: 1, y: 0, startAt: { y: 30 } })
  .to(
    ".hero_hed_text",
    { opacity: 1, y: 0, startAt: { y: 40 }, duration: 1.2 },
    "-=0.7",
  )
  .to(".hero_h3", { opacity: 1, y: 0, startAt: { y: 30 } }, "-=0.8")
  .to(".hero_content_part p", { opacity: 1, y: 0, startAt: { y: 20 } }, "-=0.8")
  .to(
    ".btn_div",
    { opacity: 1, scale: 1, startAt: { scale: 0.9 }, ease: "back.out(1.7)" },
    "-=0.6",
  )
  .to(
    ".hero_right_img",
    {
      opacity: 1,
      x: 0,
      scale: 1,
      startAt: { x: 50, scale: 0.95 },
      duration: 1.4,
    },
    "-=1.5",
  )
  .to(
    ".heroring",
    {
      opacity: 1,
      scale: 1,
      startAt: { scale: 0.5 },
      stagger: 0.2,
      ease: "elastic.out(1, 0.5)",
      duration: 1.5,
    },
    "-=1",
  )
  .to(
    ".herosymbol",
    { opacity: 0.15, scale: 1, startAt: { scale: 0.6 }, stagger: 0.1 },
    "-=1",
  );

heroTl.add(() => {
  gsap.to(".herosymbol", {
    y: "random(-15, 15)",
    x: "random(-10, 10)",
    rotation: "random(-10, 10)",
    duration: "random(3, 5)",
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.1,
  });
});

ScrollTrigger.create({
  trigger: "#hero_section",
  start: "top top",
  end: "bottom 20%",
  onLeave: () => {
    heroTl.progress(0).pause();
  },
  onEnterBack: () => {
    heroTl.play();
  },
});

// ======= SERVICE SECTION =======
const serviceTl = gsap.timeline({
  defaults: { ease: "power4.out", duration: 1.2 },
});
const serviceCards = gsap.utils.toArray("#service_section .col-md-4");

serviceTl
  .to("#service_section header .common_header", {
    opacity: 1,
    y: 0,
    startAt: { y: -40 },
  })
  .to(
    serviceCards[0],
    { opacity: 1, x: 0, startAt: { x: -100, opacity: 0 } },
    "-=0.6",
  )
  .to(
    serviceCards[1],
    { opacity: 1, y: 0, startAt: { y: 60, opacity: 0 } },
    "-=0.9",
  )
  .to(
    serviceCards[2],
    { opacity: 1, x: 0, startAt: { x: 100, opacity: 0 } },
    "-=0.9",
  )
  .to(
    "#service_section .fire_buttoon",
    { opacity: 1, y: 0, startAt: { y: 20 }, ease: "back.out(1.5)" },
    "-=0.6",
  );

ScrollTrigger.create({
  trigger: "#service_section",
  animation: serviceTl,
  start: "top 75%",
  end: "bottom 25%",
  toggleActions: "play reverse restart reverse",
});

// ======= GALLERY SECTION =======
document.addEventListener("DOMContentLoaded", () => {
  const galleryButtons = document.querySelectorAll(".gallery-btn");
  const items = document.querySelectorAll(".gallery-item");

  galleryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeBtn = document.querySelector(".gallery-btn.active");
      if (activeBtn) activeBtn.classList.remove("active");
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      items.forEach((item) => {
        item.style.display =
          filter === "all" || item.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });

  items.forEach((item) => {
    const overlay = item.querySelector(".gallery-overlay");
    if (!overlay) return;

    function getDirection(e, el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      const min = Math.min(y, rect.height - y, x, rect.width - x);
      if (min === y) return "gallery-from-top";
      if (min === rect.height - y) return "gallery-from-bottom";
      if (min === x) return "gallery-from-left";
      return "gallery-from-right";
    }

    item.addEventListener("mouseenter", (e) => {
      overlay.className = "gallery-overlay " + getDirection(e, item);
      overlay.offsetWidth;
      overlay.className = "gallery-overlay gallery-to-center";
    });
    item.addEventListener("mouseleave", (e) => {
      overlay.className = "gallery-overlay " + getDirection(e, item);
    });
  });
});

// --- GALLERY SCREW & DANCE ANIMATION (RETRIEVED & FIXED) ---
const galleryTl = gsap.timeline({
  defaults: {
    ease: "elastic.out(1, 0.6)",
    duration: 1.5,
  },
});

const galleryItems = gsap.utils.toArray(".gallery-item");

galleryTl
  .to("#gallery-section header .common_header", {
    opacity: 1,
    y: 0,
    startAt: { y: -40 },
    ease: "power4.out",
  })
  .to(
    ".gallery-filters",
    { opacity: 1, scale: 1, startAt: { scale: 0.9 }, ease: "power3.out" },
    "-=0.8",
  )

  // আপনার কাস্টম ডিরেকশনাল স্ক্রু এন্ট্রি ইফেক্টগুলো এখানে ১00% নিখুঁতভাবে বসানো হয়েছে:
  .to(
    galleryItems[0],
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      skewX: 0,
      startAt: { x: -120, rotation: -15, skewX: -10, opacity: 0 },
    },
    "-=1.1",
  )
  .to(
    galleryItems[1],
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      startAt: { y: -100, rotation: 10, opacity: 0 },
    },
    "-=1.3",
  )
  .to(
    galleryItems[2],
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      skewX: 0,
      startAt: { x: 120, rotation: 15, skewX: 10, opacity: 0 },
    },
    "-=1.3",
  )
  .to(
    galleryItems[3],
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      startAt: { y: 100, rotation: -10, opacity: 0 },
    },
    "-=1.3",
  )
  .to(
    galleryItems[4],
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      skewX: 0,
      startAt: { x: -120, rotation: -15, skewX: -10, opacity: 0 },
    },
    "-=1.3",
  )
  .to(
    galleryItems[5],
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      skewX: 0,
      startAt: { x: 120, rotation: 15, skewX: 10, opacity: 0 },
    },
    "-=1.3",
  )

  .to(
    "#gallery-section .fire_buttoon",
    { opacity: 1, y: 0, startAt: { y: 30 }, ease: "back.out(1.8)" },
    "-=1",
  );

ScrollTrigger.create({
  trigger: "#gallery-section",
  animation: galleryTl,
  start: "top 70%",
  end: "bottom 30%",
  toggleActions: "play reverse restart reverse",
});

// ======= ABOUT SECTION =======
const aboutTl = gsap.timeline({
  defaults: { ease: "power4.out", duration: 1.2 },
});

aboutTl
  .to("#about-section header .common_header", {
    opacity: 1,
    y: 0,
    startAt: { y: -40 },
  })
  .to(
    ".about-image",
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      startAt: { scale: 0.85, rotation: -5, opacity: 0 },
    },
    "-=0.6",
  )
  .to(
    ".founder-box",
    {
      opacity: 1,
      y: 0,
      scale: 1,
      startAt: { y: 30, scale: 0.9 },
      ease: "back.out(1.7)",
    },
    "-=0.8",
  )
  .to(".ring-red", { rotation: 45, duration: 2, ease: "power2.out" }, "-=1.5")
  .to(".ring-black", { rotation: -45, duration: 2, ease: "power2.out" }, "-=2")
  .to(
    ".col-content h3",
    { opacity: 1, x: 0, startAt: { x: -40, opacity: 0 } },
    "-=1.6",
  )
  .to(
    ".col-content h1",
    { opacity: 1, x: 0, startAt: { x: -50, opacity: 0 }, duration: 1.4 },
    "-=1.4",
  )
  .to(
    ".col-content p",
    { opacity: 1, x: 0, startAt: { x: -30, opacity: 0 } },
    "-=1.2",
  )
  .to(
    ".counter-box",
    {
      opacity: 1,
      y: 0,
      scale: 1,
      startAt: { y: 50, scale: 0.9, opacity: 0 },
      stagger: 0.15,
      ease: "back.out(1.4)",
      onComplete: startCounters,
    },
    "-=0.8",
  );

ScrollTrigger.create({
  trigger: "#about-section",
  animation: aboutTl,
  start: "top 75%",
  end: "bottom 25%",
  toggleActions: "play reverse restart reverse",
  onLeave: resetCounters,
  onEnterBack: resetCounters,
});

function startCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      ease: "power3.out",
    });
  });
}

function resetCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    counter.innerText = "0";
  });
}

// ======= REVIEW SECTION =======
document.addEventListener("DOMContentLoaded", () => {
  const reviews = document.querySelectorAll(".review-card");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const mainWrapper = document.querySelector(".elite-agency-reviews");
  let reviewIndex = 0;

  if (reviews.length > 0 && nextBtn && prevBtn && mainWrapper) {
    function showReview() {
      reviews.forEach((card, i) => {
        card.classList.remove("active", "prev", "next");
        if (i === reviewIndex) card.classList.add("active");
        else if (i === (reviewIndex - 1 + reviews.length) % reviews.length)
          card.classList.add("prev");
        else card.classList.add("next");
      });
    }
    nextBtn.addEventListener("click", () => {
      reviewIndex = (reviewIndex + 1) % reviews.length;
      showReview();
    });
    prevBtn.addEventListener("click", () => {
      reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
      showReview();
    });

    let autoPlay = setInterval(() => nextBtn.click(), 4000);
    mainWrapper.addEventListener("mouseenter", () => clearInterval(autoPlay));
    mainWrapper.addEventListener(
      "mouseleave",
      () => (autoPlay = setInterval(() => nextBtn.click(), 4000)),
    );
    showReview();
  }
});

if (document.querySelector("#review_section")) {
  gsap.set("#nextBtn, #prevBtn", { opacity: 0, scale: 0.5 });
  gsap.set(".review-card", { opacity: 0, y: 60, scale: 0.85 });

  const reviewEntryTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#review_section",
      start: "top 75%",
      end: "bottom 25%",
      toggleActions: "play reverse restart reverse",
    },
  });

  reviewEntryTl
    .to("#review_section header .common_header", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
    })
    .to(
      ".review-card",
      {
        opacity: (index, target) =>
          target.classList.contains("active") ? 1 : 0.7,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.5)",
        onComplete: () => {
          gsap.set(".review-card", { clearProps: "all" });
        },
      },
      "-=0.6",
    )
    .to(
      "#prevBtn",
      {
        opacity: 1,
        scale: 1,
        x: 0,
        startAt: { x: -30 },
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.8",
    )
    .to(
      "#nextBtn",
      {
        opacity: 1,
        scale: 1,
        x: 0,
        startAt: { x: 30 },
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.8",
    );
}

// ======= CONTACT SECTION =======
document.addEventListener("DOMContentLoaded", () => {
  const contactSection = document.querySelector("#contact_part");
  if (!contactSection) return;

  gsap.set("#contact_part header .common_header", { opacity: 0, y: -40 });
  gsap.set("#contact_part .blob-container", {
    opacity: 0,
    x: -100,
    rotationY: 25,
  });
  gsap.set(
    "#contact_part .contact-info-content h3, #contact_part .contact-info-content > p",
    { opacity: 0, x: 50 },
  );
  gsap.set("#contact_part .info-item", { opacity: 0, x: 30 });
  gsap.set("#contact_part .social-icon", {
    opacity: 0,
    scale: 0,
    rotation: -45,
  });

  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact_part",
      start: "top 75%",
      end: "bottom 25%",
      toggleActions: "play reverse restart reverse",
    },
  });

  contactTl
    .to("#contact_part header .common_header", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
    })
    .to(
      "#contact_part .blob-container",
      { opacity: 1, x: 0, rotationY: 0, duration: 1.2, ease: "power3.out" },
      "-=0.6",
    )
    .to(
      "#contact_part .contact-info-content h3, #contact_part .contact-info-content > p",
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.8",
    )
    .to(
      "#contact_part .info-item",
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      "-=0.5",
    )
    .to(
      "#contact_part .social-icon",
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.8)",
      },
      "-=0.4",
    );
});

// ======= BLOG SECTION (INFINITE LOOP + SMOOTH ENTRY) =======
// ======= BLOG SECTION (GSAP ONLY INFINITE LOOP + SMOOTH ENTRY) =======
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("slider");
  if (!track) return;

  const allCards = track.querySelectorAll(".card");
  if (allCards.length === 0) return;

  // ১. পিওর জেস/জিএসএপি লুপের জন্য ট্র্যাকের সিএসেস সেটআপ
  gsap.set(track, {
    display: "flex",
    overflow: "visible",
    width: "max-content",
  });
  if (track.parentElement) {
    gsap.set(track.parentElement, { overflow: "hidden", width: "100%" });
  }

  // ২. শুরুতে এন্ট্রান্স অ্যানিমেশনের জন্য কার্ড এবং বাটন হাইড করা
  function resetCardPositions() {
    allCards.forEach((card, index) => {
      if (index % 4 === 0)
        gsap.set(card, {
          opacity: 0,
          x: -50,
          y: 20,
          rotation: -5,
          scale: 0.95,
        });
      else if (index % 4 === 1)
        gsap.set(card, { opacity: 0, x: 0, y: -50, rotation: 3, scale: 0.95 });
      else if (index % 4 === 2)
        gsap.set(card, { opacity: 0, x: 0, y: 50, rotation: -3, scale: 0.95 });
      else
        gsap.set(card, { opacity: 0, x: 50, y: -20, rotation: 5, scale: 0.95 });
    });
    gsap.set("#blog_part header .common_header", { opacity: 0, y: -40 });
    gsap.set("#blog_part .fire-btn", { opacity: 0, scale: 0.5 }); // বাটন স্কেল ডাউন ও হাইড
  }

  resetCardPositions();

  // ৩. স্ক্রোল ট্রিগার এন্ট্রান্স টাইমলাইন
  const danceTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#blog_part",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  danceTl
    .to("#blog_part header .common_header", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    .to(
      allCards,
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 1,
        stagger: 0.05,
        ease: "back.out(1.2)",
        onComplete: () => {
          // কার্ডের এনিমেশন ক্লিয়ার করে স্লাইডার লুপ চালু করা
          gsap.set(allCards, { clearProps: "rotation, scale" });
          initGsapInfiniteSlider(track, allCards);
        },
      },
      "-=0.4",
    )
    // বাটনটিকে স্মুথলি ফিরিয়ে আনা এবং এনিমেশন শেষে প্রোপার্টি ক্লিয়ার করা যেন টেক্সট হাইড না থাকে
    .to(
      "#blog_part .fire-btn",
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.set("#blog_part .fire-btn", {
            clearProps: "transform, opacity",
          });
        },
      },
      "-=0.4",
    );
});

// ওয়ান অ্যান্ড অনলি GSAP INFINITE LOOP SLIDER LOGIC
function initGsapInfiniteSlider(track, items) {
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  const totalWidth = track.scrollWidth / 2;

  const loop = gsap.to(track, {
    x: -totalWidth,
    duration: 25,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
    },
  });

  track.addEventListener("mouseenter", () => loop.pause());
  track.addEventListener("mouseleave", () => loop.play());
}
/**
 * openBookingPopup Function
 * প্রাইসিং কার্ডের "Book Now" বাটনে ক্লিক করলে এই ফাংশনটি রান হবে।
 * এটি প্রথম মোডালটি বন্ধ করে স্বয়ংক্রিয়ভাবে বুকিং ফর্মের ড্রপডাউন সিলেক্ট করবে।
 * * @param {string} planType - প্ল্যানের নাম ('basic', 'standard', 'premium')
 */
function openBookingPopup(planType) {
    // ১. প্রথমে সার্ভিস ডিটেইলস মোডালটি খুঁজে বের করা
    const serviceModalEl = document.getElementById('dwaServiceDetailsModal');
    
    if (serviceModalEl) {
        // Bootstrap-এর ইনস্ট্যান্স নেওয়া এবং সার্ভিস মোডালটি হাইড (বন্ধ) করা
        const serviceModal = bootstrap.Modal.getInstance(serviceModalEl) || new bootstrap.Modal(serviceModalEl);
        serviceModal.hide();
    }

    // ২. বুকিং ফর্মের প্ল্যান সিলেক্ট ড্রপডাউনটি খুঁজে বের করা
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        // বাটনের প্যারামিটার অনুযায়ী ড্রপডাউনের ভ্যালু সেট করা
        planSelect.value = planType;
    }
}