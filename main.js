const toggleBtn = document.querySelector('.nav__toggle');
const menu = document.querySelector('#navLinks');

toggleBtn.addEventListener('click', () => {
  menu.classList.toggle('open');

  const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  toggleBtn.setAttribute('aria-expanded', !expanded);
});

let lastScrollY = window.scrollY;
let isFixed = false;

const nav = document.querySelector('.nav-section');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const navRect = nav.getBoundingClientRect();

  // ✅ STEP 1: Activate fixed ONLY when nav is fully gone
  if (!isFixed && navRect.bottom <= 0) {
    nav.classList.add('fixed');
    isFixed = true;
  }

  // ✅ STEP 2: Release back to normal when near top
  if (isFixed && currentScrollY <= 0) {
    nav.classList.remove('fixed', 'show', 'hide');
    isFixed = false;
  }

  // ✅ STEP 3: Handle scroll direction ONLY when fixed
  if (isFixed) {
    if (currentScrollY < lastScrollY) {
      // SCROLL UP → SHOW
      nav.classList.add('show');
      nav.classList.remove('hide');
    } else {
      // SCROLL DOWN → HIDE
      nav.classList.add('hide');
      nav.classList.remove('show');
    }
  }

  lastScrollY = currentScrollY;
});

//Active Buttons
const buttons = document.querySelectorAll(".amount-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    // remove active from all
    buttons.forEach(b => b.classList.remove("active"));

    // add active to clicked one
    btn.classList.add("active");
  });
});

//Counter Animation onScroll
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target);
    const duration = 6000;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);

      // Add formatting
      if (counter.classList.contains("donation")) {
        counter.textContent = "$" + value.toLocaleString();
      } else {
        counter.textContent = value;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final value formatting
        if (counter.classList.contains("donation")) {
          counter.textContent = "$" + target.toLocaleString();
        } else if (target === 30) {
          counter.textContent = target + "+";
        } else {
          counter.textContent = target;
        }
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  counters.forEach(counter => observer.observe(counter));
});

//Location Map 
const statusText = document.getElementById("map");

window.addEventListener("load", () => {
  if (!navigator.geolocation) {
    statusText.textContent = "Geolocation not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(success, error);
});

function success(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("You are here 📍")
    .openPopup();
}

function error(err) {
  console.log(err);
  statusText.textContent = "Location permission denied or unavailable.";
}

// Page Transition Loader
const loader = document.querySelector(".page-loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hide");
    document.body.classList.add("fade-in");
  }, 2000);
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    const href = this.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      this.target === "_blank"
    ) return;

    e.preventDefault();

    loader.classList.remove("hide");

    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  });
});

//Payment Method Dispay 
const radios = document.querySelectorAll('input[name="payment"]');
const sections = document.querySelectorAll('.method');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    sections.forEach(sec => sec.style.display = 'none');
    document.getElementById(radio.value).style.display = 'block';
  });
});

//Modal Slide Down Effect
// ===== MODAL CONTROL =====
const donateBtns = document.querySelectorAll(".donate-btn");
const modal = document.getElementById("donationModal");
const closeBtn = document.getElementById("closeModal");

donateBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    modal.classList.add("show");
    document.body.style.overflow = "auto";
  });
});

closeBtn.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
}


// ===== AMOUNT BUTTONS =====
const amountBtns = document.querySelectorAll(".amount-btn");
const amountInput = document.querySelector('input[name="amount"]');

amountBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    amountBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    amountInput.value = btn.dataset.amount;
  });
});

// Remove active if user types manually
amountInput.addEventListener("input", () => {
  amountBtns.forEach(btn => btn.classList.remove("active"));
});


// ===== PAYMENT METHOD SWITCH =====
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const methods = document.querySelectorAll(".method");

paymentRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    methods.forEach(m => m.style.display = "none");

    const selected = document.getElementById(radio.value);
    if (selected) selected.style.display = "block";
  });
});


// ===== FORM VALIDATION =====
const form = document.querySelector(".modal-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;

  const requiredInputs = form.querySelectorAll("input[required]");

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, "This field is required");
      isValid = false;
    } else {
      clearError(input);
    }
  });

  // Email validation
  const email = form.querySelector('input[name="email"]');
  if (email && !validateEmail(email.value)) {
    showError(email, "Enter a valid email");
    isValid = false;
  }

  // Amount validation
  if (!amountInput.value || amountInput.value <= 0) {
    showError(amountInput, "Enter a valid amount");
    isValid = false;
  }

  if (isValid) {
    alert("Donation submitted successfully 🎉");
    form.reset();
    closeModal();
  }
});


// ===== HELPER FUNCTIONS =====
function showError(input, message) {
  input.classList.add("error");

  let error = input.parentElement.querySelector(".error-message");
  if (!error) {
    error = document.createElement("small");
    error.className = "error-message";
    input.parentElement.appendChild(error);
  }

  error.innerText = message;
}

function clearError(input) {
  input.classList.remove("error");

  const error = input.parentElement.querySelector(".error-message");
  if (error) error.remove();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Progress Animation Bar
const bars = document.querySelectorAll(".progress-bar");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateBar(entry.target);
      observer.unobserve(entry.target); 
    }
  });
}, { threshold: 0.5 });

bars.forEach(bar => observer.observe(bar));

function animateBar(bar) {
  const target = +bar.dataset.percent;
  const label = bar.querySelector(".progress-label");

  let current = 0;

  const duration = 3000;
  const stepTime = 10;
  const increment = target / (duration / stepTime);

  const counter = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(counter);
    }

    bar.style.width = current + "%";
    label.textContent = Math.floor(current) + "%";
  }, stepTime);
}

// Campaign Slides
const allCampaigns = document.querySelector(".campaign-cards");
const campaigns = document.querySelectorAll(".card-item");
const dots = document.querySelectorAll(".circle");

if(allCampaigns && campaigns.length && dots.length) {
  let currentIndex = 0;
  let startX = 0;
  let endX = 0;
  const swipe = 50;

  function displayCards() {
    if(window.innerWidth >= 992) return 3;
    if(window.innerHeight >= 768) return 2;
    return 1;
  }

  function showCampaigns(index) {
    const theCards = displayCards();
    const totalCards = campaigns.length - theCards;

    if(index < 0) index = 0;
    if(index > totalCards) index = totalCards;

    const campaignsWidth = campaigns[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(allCampaigns).gap);
    const moveX = index * (campaignsWidth + gap);

    allCampaigns.style.transform = 
    `translateX(-${moveX}px)`;
    dots.forEach(dot => dot.classList.remove("active"));
    if(dots[index]) dots[index].classList.add("active");

    currentIndex = index;
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showCampaigns(Number(dot.dataset.index));
    });
  });

  allCampaigns.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  allCampaigns.addEventListener("touchmove", e => endX = e.touches[0].clientX);

  allCampaigns.addEventListener("touchend", () => {
    const distance = startX - endX;
    if(Math.abs(distance) > swipe) {
      if(distance > 0) showCampaigns(currentIndex + 1);
      if(distance < 0) showCampaigns(currentIndex - 1);
    }
    startX = endX = 0;
  });
  window.addEventListener("resize", () => showCampaigns(currentIndex));
}

//FAQs
const toggles = document.querySelectorAll(".faq-btn");
toggles.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    if(content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});