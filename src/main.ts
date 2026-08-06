import { updateAuthUI, getCurrentUser, setCurrentUser } from "./auth";

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-gray-800";

  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-auto`;

  const icon = document.createElement("div");
  if (type === "success") {
    icon.innerHTML =
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
  } else if (type === "error") {
    icon.innerHTML =
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  } else {
    icon.innerHTML =
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  }

  const text = document.createElement("p");
  text.className = "text-sm font-medium";
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  });

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

import "./style.css";

const safeStorage = {
  getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
safeStorage.removeItem("all_providers");

async function syncUserToDB(user: any) {
  try {
    if (user.role === "provider" && user.profile) {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          full_name: user.profile.displayName || user.fullName,
          skill: user.profile.serviceTitle,
          bio: user.profile.bio,
          availability: user.profile.availability,
          cover_image: user.profile.coverUrl,
          profile_image: user.profile.avatarUrl,
          location: user.profile.location || user.location,
          contact: user.profile.contact || user.contact,
          state: user.state || user.profile.state,
          university: user.university || user.profile.university,
        }),
      });
      if (user.profile.services && user.profile.services.length > 0) {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            full_name: user.profile.displayName || user.fullName,
            services: user.profile.services,
          }),
        });
      }
    }
  } catch (e) {
    console.error("Failed to sync profile to DB", e);
  }
}

// ---- Theme Toggle Logic ----
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIconDark = document.getElementById("themeIconDark");
const themeIconLight = document.getElementById("themeIconLight");

function updateThemeUI(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add("dark");
    themeIconDark?.classList.remove("hidden");
    themeIconLight?.classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    themeIconDark?.classList.add("hidden");
    themeIconLight?.classList.remove("hidden");
  }
}

// Check local storage or system preference
const storedTheme = safeStorage.getItem("theme");
const initialDark = storedTheme === "dark";
updateThemeUI(initialDark);

themeToggleBtn?.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  const newDark = !isDark;
  safeStorage.setItem("theme", newDark ? "dark" : "light");
  updateThemeUI(newDark);
});

/**
 * CampusConnect - Landing Page & Modal Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mobile-home")?.addEventListener("click", () => {
    window.location.href = "/";
  });
  document.getElementById("mobile-search")?.addEventListener("click", () => {
    window.location.href = "profile.html#/services";
  });
  document.getElementById("mobile-post")?.addEventListener("click", () => {
    window.location.href = "profile.html#/post-service";
  });
  document.getElementById("mobile-requests")?.addEventListener("click", () => {
    window.location.href = "profile.html#/requests";
  });
  document.getElementById("mobile-profile")?.addEventListener("click", () => {
    window.location.href = "profile.html#/profile";
  });

  // Modal Elements
  const modal = document.getElementById("authModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalBackdrop = document.getElementById("modalBackdrop");

  // Form Elements
  const roleRadios = document.querySelectorAll('input[name="role"]');

  const modalForm = document.getElementById("modalForm") as HTMLFormElement;

  // Upload Elements

  // Submit Elements
  const submitBtn = document.getElementById(
    "modalSubmitBtn",
  ) as HTMLButtonElement;
  const submitText = document.getElementById("modalSubmitText");

  // Alerts
  const alertsContainer = document.getElementById("modalAlerts");
  const alertYellow = document.getElementById("modal-alert-yellow");
  const alertGreen = document.getElementById("modal-alert-green");
  const alertRed = document.getElementById("modal-alert-red");

  let selectedFiles: File[] = [];

  // ---- Modal Toggle Logic ----
  function openModal() {
    modal?.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  function closeModal() {
    modal?.classList.add("hidden");
    document.body.style.overflow = "";
    // Optional: reset form on close
  }

  openModalBtn?.addEventListener("click", openModal);
  const openModalBtnMobile = document.getElementById("openModalBtnMobile");
  openModalBtnMobile?.addEventListener("click", () => {
    mobileMenu?.classList.add("hidden");
    openModal();
  });
  closeModalBtn?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  // ---- Become a Provider Link Handler ----
  document.querySelectorAll('a[href="#provider"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu) mobileMenu.classList.add("hidden");

      const user = getCurrentUser();
      if (user) {
        if (user.role !== "provider") {
          showToast(
            "You are currently logged in as a client. To become a provider, please log out and sign up again as a provider.",
            "error",
          );
        } else {
          window.location.href = "profile.html";
        }
      } else {
        const tabSignup = document.getElementById("tabSignup");
        if (tabSignup) tabSignup.click();

        const providerRadio = document.querySelector(
          'input[name="role"][value="provider"]',
        ) as HTMLInputElement;
        if (providerRadio) {
          providerRadio.checked = true;
          providerRadio.dispatchEvent(new Event("change"));
        }

        const modal = document.getElementById("authModal");
        if (modal) {
          modal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        }
      }
    });
  });

  // ---- Mobile Menu Logic ----
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu?.classList.add("hidden");
    });
  });

  // ---- Role Selection Logic ----
  roleRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const val = (e.target as HTMLInputElement).value;
    });
  });

  // ---- Hero Carousel Logic ----
  const heroCarousel = document.getElementById("hero-carousel");
  const heroDots = document
    .getElementById("hero-dots")
    ?.querySelectorAll("button");

  if (heroCarousel && heroDots) {
    heroCarousel.addEventListener("scroll", () => {
      const scrollLeft = heroCarousel.scrollLeft;
      const slideWidth = heroCarousel.offsetWidth;
      const currentSlide = Math.round(scrollLeft / slideWidth);

      heroDots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.remove("bg-white/30");
          dot.classList.add("bg-orange-500");
        } else {
          dot.classList.remove("bg-orange-500");
          dot.classList.add("bg-white/30");
        }
      });
    });

    heroDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        heroCarousel.scrollTo({
          left: heroCarousel.offsetWidth * index,
          behavior: "smooth",
        });
      });
    });
  }

  let isLoginMode = false;
  const tabSignup = document.getElementById("tabSignup");
  const tabLogin = document.getElementById("tabLogin");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const fullNameGroup = document.getElementById("fullNameGroup");
  const matricGroup = document.getElementById("matricGroup");
  const roleGroup = document.getElementById("roleGroup");

  if (tabSignup && tabLogin) {
    tabSignup.addEventListener("click", () => {
      isLoginMode = false;
      tabSignup.classList.replace("text-gray-500", "text-gray-900");
      tabSignup.classList.add("bg-white", "shadow-sm");
      tabSignup.classList.remove("hover:text-gray-900");

      tabLogin.classList.replace("text-gray-900", "text-gray-500");
      tabLogin.classList.remove("bg-white", "shadow-sm");
      tabLogin.classList.add("hover:text-gray-900");

      if (modalTitle) modalTitle.textContent = "Join CampusConnect";
      if (modalSubtitle)
        modalSubtitle.textContent =
          "Sign up to access trusted campus services.";
      if (fullNameGroup) {
        fullNameGroup.classList.remove("hidden");
        const fullNameInput = document.getElementById("fullName");
        if (fullNameInput) fullNameInput.setAttribute("required", "true");
      }
      if (matricGroup) {
        matricGroup.classList.remove("hidden");
        const matricInput = document.getElementById("matricNumber");
        if (matricInput) matricInput.setAttribute("required", "true");
      }
      if (roleGroup) roleGroup.classList.remove("hidden");
      const signupLocGroup = document.getElementById("signupLocGroup");
      if (signupLocGroup) {
        signupLocGroup.classList.remove("hidden");
        const signupState = document.getElementById("signupState");
        if (signupState) signupState.setAttribute("required", "true");
        const signupUniversity = document.getElementById("signupUniversity");
        if (signupUniversity) signupUniversity.setAttribute("required", "true");
      }

      setBtnLoading(submitBtn as HTMLButtonElement, false, "Create Account");

      const selectedRole = document.querySelector('input[name="role"]:checked');
    });

    tabLogin.addEventListener("click", () => {
      isLoginMode = true;
      tabLogin.classList.replace("text-gray-500", "text-gray-900");
      tabLogin.classList.add("bg-white", "shadow-sm");
      tabLogin.classList.remove("hover:text-gray-900");

      tabSignup.classList.replace("text-gray-900", "text-gray-500");
      tabSignup.classList.remove("bg-white", "shadow-sm");
      tabSignup.classList.add("hover:text-gray-900");

      if (modalTitle) modalTitle.textContent = "Welcome Back";
      if (modalSubtitle) modalSubtitle.textContent = "Login to your account.";
      if (fullNameGroup) {
        fullNameGroup.classList.add("hidden");
        const fullNameInput = document.getElementById("fullName");
        if (fullNameInput) fullNameInput.removeAttribute("required");
      }
      if (matricGroup) {
        matricGroup.classList.add("hidden");
        const matricInput = document.getElementById("matricNumber");
        if (matricInput) matricInput.removeAttribute("required");
      }
      if (roleGroup) roleGroup.classList.add("hidden");
      const signupLocGroup = document.getElementById("signupLocGroup");
      if (signupLocGroup) {
        signupLocGroup.classList.add("hidden");
        const signupState = document.getElementById("signupState");
        if (signupState) signupState.removeAttribute("required");
        const signupUniversity = document.getElementById("signupUniversity");
        if (signupUniversity) signupUniversity.removeAttribute("required");
      }

      setBtnLoading(submitBtn as HTMLButtonElement, false, "Login");
    });
  }

  // ---- Form Submission Logic ----
  modalForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    if (isLoginMode) {
      setBtnLoading(submitBtn as HTMLButtonElement, true, "Logging in...");
      const email = (document.getElementById("email") as HTMLInputElement)
        ?.value;
      const password = (document.getElementById("password") as HTMLInputElement)
        ?.value;

      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Server error");
          return data;
        })
        .then((data) => {
          submitBtn.disabled = false;
          setBtnLoading(submitBtn as HTMLButtonElement, false, "Login");
          closeModal();
          showToast(data.message || "Login successful!", "success");
          const userFullName =
            data.session?.user?.user_metadata?.full_name || "User";
          const role = data.session?.user?.user_metadata?.role || "client";
          const isVerified =
            data.session?.user?.user_metadata?.is_verified || false;
          try {
            setCurrentUser({ fullName: userFullName, email, role, isVerified });
            syncUserToDB({ fullName: userFullName, email, role, isVerified });
            updateAuthUI();
            window.location.reload();
          } catch (error) {
            console.error("Storage error:", error);
          }
        })
        .catch((err) => {
          console.error(err);
          submitBtn.disabled = false;
          setBtnLoading(submitBtn as HTMLButtonElement, false, "Login");
          const authNotice = document.getElementById("authNotice");
          if (authNotice) {
            authNotice.classList.remove("hidden");
            // specifically handle the case where credential is not found / invalid
            if (
              err.message &&
              (err.message.toLowerCase().includes("invalid") ||
                err.message.toLowerCase().includes("not found") ||
                err.message.toLowerCase().includes("credential"))
            ) {
              authNotice.textContent =
                "The credentials provided are invalid or an account with this email does not exist.";
            } else {
              authNotice.textContent = err.message || "Error logging in.";
            }
          } else {
            showToast(err.message || "Error logging in.", "error");
          }
        });
      return;
    }

    // Signup mode
    setBtnLoading(submitBtn as HTMLButtonElement, true, "Creating Account...");
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    const fullName = (document.getElementById("fullName") as HTMLInputElement)
      ?.value;
    const matricNumber = (
      document.getElementById("matricNumber") as HTMLInputElement
    )?.value;
    const selectedRole =
      (document.querySelector('input[name="role"]:checked') as HTMLInputElement)
        ?.value || "client";
    const state = (document.getElementById("signupState") as HTMLSelectElement)
      ?.value;
    const university = (
      document.getElementById("signupUniversity") as HTMLInputElement
    )?.value;

    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName,
        matricNumber,
        role: selectedRole,
        state,
        university,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Server error");
        return data;
      })
      .then((data) => {
        submitBtn.disabled = false;
        setBtnLoading(submitBtn as HTMLButtonElement, false, "Create Account");

        if (data.notice) {
          showToast(data.message, "success");
          const tabLogin = document.getElementById("tabLogin");
          if (tabLogin) tabLogin.click();
        } else {
          closeModal();
          showToast(data.message || "Account created successfully!", "success");
          setCurrentUser({
            fullName,
            email,
            role: selectedRole,
            isVerified: false,
          });
          syncUserToDB({
            fullName,
            email,
            role: selectedRole,
            isVerified: false,
          });
          updateAuthUI();
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error(err);
        submitBtn.disabled = false;
        setBtnLoading(submitBtn as HTMLButtonElement, false, "Create Account");
        const authNotice = document.getElementById("authNotice");
        if (authNotice) {
          authNotice.classList.remove("hidden");
          authNotice.textContent = err.message || "Error creating account.";
        } else {
          showToast(err.message || "Error creating account.", "error");
        }
      });
  });
});

// ---- Simple Hash Router ----
function handleRoute() {
  const hash = window.location.hash;
  const sections = {
    hero: document.getElementById("hero"),
    categories: document.getElementById("categories"),
    providers: document.getElementById("providers"),
    feed: document.getElementById("feed"),
    howItWorks: document.getElementById("how-it-works"),
    search: document.getElementById("search-results-section"),
    profile: document.getElementById("provider-profile-section"),
    privacy: document.getElementById("privacy-section"),
    terms: document.getElementById("terms-section"),
  };

  // Hide all sections first
  Object.values(sections).forEach((sec) => {
    if (sec) sec.classList.add("hidden");
  });

  if (hash === "#categories") {
    sections.categories?.classList.remove("hidden");
    sections.categories?.classList.remove("opacity-0", "translate-y-8");
  } else if (hash === "#providers") {
    sections.providers?.classList.remove("hidden");
    sections.providers?.classList.remove("opacity-0", "translate-y-8");
  } else if (hash === "#how-it-works") {
    sections.howItWorks?.classList.remove("hidden");
    sections.howItWorks?.classList.remove("opacity-0", "translate-y-8");
  } else if (hash === "#feed") {
    sections.feed?.classList.remove("hidden");
    sections.feed?.classList.remove("opacity-0", "translate-y-8");
  } else if (hash === "#search") {
    sections.search?.classList.remove("hidden");
  } else if (hash === "#profile") {
    sections.profile?.classList.remove("hidden");
  } else if (hash === "#privacy") {
    sections.privacy?.classList.remove("hidden");
  } else if (hash === "#terms") {
    sections.terms?.classList.remove("hidden");
  } else if (hash === "#hero" || hash === "" || hash === "#") {
    sections.hero?.classList.remove("hidden");
    sections.categories?.classList.remove("hidden");
    sections.providers?.classList.remove("hidden");
    sections.feed?.classList.remove("hidden");
    sections.howItWorks?.classList.remove("hidden");
  } else {
    // Default Home view (Landing Page)
    sections.hero?.classList.remove("hidden");
    sections.categories?.classList.remove("hidden");
    sections.providers?.classList.remove("hidden");
    sections.feed?.classList.remove("hidden");
    sections.howItWorks?.classList.remove("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", handleRoute);
document.addEventListener("DOMContentLoaded", handleRoute);

function showProfile() {
  window.location.hash = "#profile";
}

function hideProfile() {
  window.location.hash = "#home";
}

// Call on load

// ---- Scroll Animations ----
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-8");
          entry.target.classList.add("opacity-100", "translate-y-0");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  // Set up mutation observer to observe dynamically added elements too
  const observeAllScrollSections = () => {
    document
      .querySelectorAll(".scroll-section:not(.observed)")
      .forEach((section, index) => {
        section.classList.add("observed");
        // Give a slight staggered delay to children in some cases, or just let observer handle it
        observer.observe(section);
      });
  };

  observeAllScrollSections();

  const mutationObserver = new MutationObserver((mutations) => {
    let shouldObserve = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldObserve = true;
        break;
      }
    }
    if (shouldObserve) observeAllScrollSections();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
});

document.addEventListener("DOMContentLoaded", updateAuthUI);

updateAuthUI();

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");
const logoutBtnMobile = document.getElementById("logoutBtnMobile");

if (profileBtn && profileDropdown) {
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("hidden");
  });

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (
      !profileBtn.contains(e.target as Node) &&
      !profileDropdown.contains(e.target as Node)
    ) {
      profileDropdown.classList.add("hidden");
    }
  });
}

function handleLogout() {
  safeStorage.removeItem("user");
  updateAuthUI();
  if (profileDropdown) profileDropdown.classList.add("hidden");
  window.location.hash = "#home";
  window.location.reload();
}

if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
if (logoutBtnMobile) logoutBtnMobile.addEventListener("click", handleLogout);

// ---- Verification Modal Logic ----

const verifyProfileBtn = document.getElementById("verifyProfileBtn");
const verifyProfileBtnMobile = document.getElementById(
  "verifyProfileBtnMobile",
);
const verificationModal = document.getElementById("verificationModal");
const closeVerificationBtn = document.getElementById("closeVerificationBtn");
const verificationModalBackdrop = document.getElementById(
  "verificationModalBackdrop",
);

function openVerificationModal() {
  verificationModal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (profileDropdown) profileDropdown.classList.add("hidden");
  document.getElementById("mobileMenu")?.classList.add("hidden");
}

function closeVerificationModal() {
  verificationModal?.classList.add("hidden");
  document.body.style.overflow = "";
}

verifyProfileBtn?.addEventListener("click", openVerificationModal);
verifyProfileBtnMobile?.addEventListener("click", openVerificationModal);
closeVerificationBtn?.addEventListener("click", closeVerificationModal);
verificationModalBackdrop?.addEventListener("click", closeVerificationModal);

// ---- Verification File Upload Logic ----
let verificationFiles: File[] = [];
const verificationFileInput = document.getElementById(
  "verificationDocumentUpload",
) as HTMLInputElement;
const verificationDropZone = document.getElementById("verificationDropZone");
const verificationFileList = document.getElementById("verificationFileList");
const verifySubmitBtn = document.getElementById(
  "verifySubmitBtn",
) as HTMLButtonElement;
const verifySubmitText = document.getElementById("verifySubmitText");
const verifAlerts = document.getElementById("verificationAlerts");
const verifAlertYellow = document.getElementById("verif-alert-yellow");
const verifAlertGreen = document.getElementById("verif-alert-green");
const verifAlertRed = document.getElementById("verif-alert-red");

function handleVerificationFiles(files: FileList | File[]) {
  Array.from(files).forEach((file) => {
    if (verificationFiles.length < 5) {
      verificationFiles.push(file);
    }
  });
  renderVerificationPreviews();
}

verificationFileInput?.addEventListener("change", (e) => {
  const target = e.target as HTMLInputElement;
  if (target.files) handleVerificationFiles(target.files);
  target.value = "";
});

verificationDropZone?.addEventListener("dragover", (e) => {
  e.preventDefault();
  verificationDropZone.classList.add("border-orange-500", "bg-orange-50");
});

verificationDropZone?.addEventListener("dragleave", (e) => {
  e.preventDefault();
  verificationDropZone.classList.remove("border-orange-500", "bg-orange-50");
});

verificationDropZone?.addEventListener("drop", (e) => {
  e.preventDefault();
  verificationDropZone.classList.remove("border-orange-500", "bg-orange-50");
  if (e.dataTransfer?.files) handleVerificationFiles(e.dataTransfer.files);
});

function renderVerificationPreviews() {
  if (!verificationFileList) return;
  verificationFileList.innerHTML = "";
  verificationFiles.forEach((file, index) => {
    const item = document.createElement("div");
    item.className =
      "flex items-center justify-between p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm";

    const isPdf = file.type === "application/pdf";
    const iconHtml = isPdf
      ? `<svg class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`
      : `<svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;

    item.innerHTML = `
      <div class="flex items-center truncate max-w-[80%]">
        ${iconHtml}
        <span class="truncate text-gray-700 font-medium">${file.name}</span>
      </div>
      <button type="button" class="text-gray-400 hover:text-red-500 transition remove-btn" data-index="${index}">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;
    verificationFileList.appendChild(item);
  });

  verificationFileList.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const idx = parseInt(target.dataset.index || "0");
      verificationFiles.splice(idx, 1);
      renderVerificationPreviews();
    });
  });
}

verifySubmitBtn?.addEventListener("click", () => {
  if (verificationFiles.length < 2) {
    showToast(
      "Please upload at least two documents for AI Verification.",
      "error",
    );
    return;
  }

  verifAlerts?.classList.remove("hidden");
  verifAlertYellow?.classList.remove("hidden");
  verifAlertGreen?.classList.add("hidden");
  verifAlertRed?.classList.add("hidden");

  verifySubmitBtn.disabled = true;
  if (verifySubmitText) verifySubmitText.textContent = "Processing...";

  // Process Verification
  setTimeout(() => {
    verifAlertYellow?.classList.add("hidden");
    verifAlertGreen?.classList.remove("hidden");
    verifySubmitBtn.disabled = false;
    if (verifySubmitText)
      verifySubmitText.textContent = "Submit for Verification";

    // Auto close and update user state
    setTimeout(() => {
      closeVerificationModal();
      showToast("Verification Successful!", "success");
      const userStr = safeStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isVerified = true;
        setCurrentUser(user);
        syncUserToDB(user);
        updateAuthUI();
      }
    }, 1500);
  }, 2500);
});

function setBtnLoading(
  btn: HTMLButtonElement | null,
  isLoading: boolean,
  text: string,
) {
  if (!btn) return;
  btn.disabled = isLoading;
  if (isLoading) {
    btn.innerHTML = `<div class="flex items-center justify-center">${loadingSvg}${text}</div>`;
  } else {
    btn.innerHTML = text;
  }
}

// ---- Utilities ----
const loadingSvg = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
function getUniAbbr(name?: string | null): string {
  if (!name) return "Uni";
  if (name.length <= 8) return name;
  const words = name.split(/[s-]+/);
  if (words.length > 1) {
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return name.substring(0, 6) + ".";
}

let selectedCoverDataUrl = "";
let selectedAvatarDataUrl = "";

// ---- Edit Profile ----
const editProfileModal = document.getElementById("editProfileModal");
const closeEditProfileBtn = document.getElementById("closeEditProfileBtn");
const cancelEditProfileBtn = document.getElementById("cancelEditProfileBtn");
const editProfileForm = document.getElementById(
  "editProfileForm",
) as HTMLFormElement;
const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileBtnMobile = document.getElementById("editProfileBtnMobile");

async function openEditProfileModal() {
  if (editProfileModal) {
    editProfileModal.classList.remove("hidden");
    editProfileModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  const user = getCurrentUser();
  if (!user) return;

  try {
    const res = await fetch(`/api/provider/${user.email}`);
    if (res.ok) {
      const providerData = await res.json();
      const val = (id: string, v: string) => { const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement; if (el) el.value = v || ""; }
      val("editDisplayName", providerData.full_name);
      val("editLocation", providerData.location);
      val("editContact", providerData.contact);
      val("editServiceTitle", providerData.skill || providerData.service_title);
      val("editState", providerData.state);
      val("editUniversity", providerData.university);
      val("editBio", providerData.bio);
      if (providerData.services && providerData.services.length > 0) {
        val("editServiceName", providerData.services[0].name);
        val("editServiceDescription", providerData.services[0].description);
        val("editServicePrice", providerData.services[0].price);
      }
      val("editAvailability", providerData.availability_details || (providerData.availability ? (Array.isArray(providerData.availability) ? providerData.availability.join(", ") : providerData.availability) : ""));
    }
  } catch (err) { console.error(err); }
};

(window as any).closeEditProfileModal = function () {
  const editProfileModal = document.getElementById("editProfileModal");
  if (editProfileModal) {
    editProfileModal.classList.add("hidden");
    editProfileModal.classList.remove("flex");
    document.body.style.overflow = "auto";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editProfileForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
       e.preventDefault();
       const user = getCurrentUser();
       if (!user) return;
       const btn = form.querySelector('button[type="submit"]');
       if (btn) btn.textContent = "Saving...";
       try {
         const services = [];
         if ((document.getElementById("editServiceName") as HTMLInputElement).value) {
            services.push({
               name: (document.getElementById("editServiceName") as HTMLInputElement).value,
               description: (document.getElementById("editServiceDescription") as HTMLInputElement).value,
               price: (document.getElementById("editServicePrice") as HTMLInputElement).value
            });
         }
         
         const availText = (document.getElementById("editAvailability") as HTMLInputElement).value;
         
         // Call /api/profile
         const profileRes = await fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               email: user.email,
               full_name: (document.getElementById("editDisplayName") as HTMLInputElement).value,
               skill: (document.getElementById("editServiceTitle") as HTMLInputElement).value,
               bio: (document.getElementById("editBio") as HTMLInputElement).value,
               state: (document.getElementById("editState") as HTMLInputElement).value,
               university: (document.getElementById("editUniversity") as HTMLInputElement).value,
               location: (document.getElementById("editLocation") as HTMLInputElement).value,
               contact: (document.getElementById("editContact") as HTMLInputElement).value,
               availability_details: availText,
               policies: availText,
               services: services
            })
         });
         
         if (profileRes.ok) {
            showToast("Profile updated successfully!", "success");
            (window as any).closeEditProfileModal();
            fetchAndRenderProviders();
            
            // update current user in local storage
            const updatedProfileRes = await profileRes.json();
            // Process the metadata properly
            let meta = updatedProfileRes.provider?.services || {};
            if (typeof meta === "string") {
              try { meta = JSON.parse(meta); } catch(e) { meta = {}; }
            }
            if (Array.isArray(meta)) {
              updatedProfileRes.provider.services = meta;
            } else {
              updatedProfileRes.provider.availability_details = meta.availability_details;
              updatedProfileRes.provider.policies = meta.policies;
              updatedProfileRes.provider.services = meta.list || [];
            }

            const currentUser = getCurrentUser();
            setCurrentUser({ ...currentUser, profile: updatedProfileRes.provider });
         } else {
            showToast("Failed to update profile", "error");
         }
       } catch (err) {
         showToast("An error occurred", "error");
       } finally {
         if (btn) btn.textContent = "Save Changes";
       }
    });
  }
});

async function fetchAndRenderProviders() {
  try {
    const res = await fetch("/api/providers");
    if (res.ok) {
      const providers = await res.json();
      (window as any).globalProviders = providers;
      renderProviders(providers);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderProviders(providers) {
  const container = document.getElementById("providersContainer");
  if (!container) return;
  if (providers.length === 0) {
    container.innerHTML = `<div class="col-span-full p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">No providers found.</div>`;
    return;
  }
  container.innerHTML = providers.map(p => {
     return `
      <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer" onclick="showProfileForUser('${p.email}')">
         <div class="h-32 bg-gray-200 dark:bg-gray-700 relative bg-cover bg-center" style="background-image: url('${p.cover_url || p.cover_image || ''}')">
            <div class="absolute -bottom-10 left-6">
              <div class="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
                 <img src="${p.avatar_url || p.profile_image || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover" />
              </div>
            </div>
         </div>
         <div class="pt-14 p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              ${p.full_name}
              ${p.is_verified ? `<svg class="w-5 h-5 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>` : ''}
            </h3>
            <p class="text-orange-600 dark:text-orange-400 font-medium text-sm mt-1">${p.service_title || 'Provider'}</p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2">${p.bio || 'No bio available.'}</p>
         </div>
      </div>
     `;
  }).join('');
}

(window as any).searchProviders = function() {
   const q = (document.getElementById("searchInput") as HTMLInputElement)?.value.toLowerCase() || "";
   const loc = (document.getElementById("locationFilter") as HTMLSelectElement)?.value || "";
   const all = (window as any).globalProviders || [];
   const filtered = all.filter((p) => {
      const matchQ = (p.full_name||'').toLowerCase().includes(q) || (p.service_title||'').toLowerCase().includes(q) || (p.bio||'').toLowerCase().includes(q) || (p.skill||'').toLowerCase().includes(q);
      const matchLoc = !loc || (p.location||'').includes(loc) || (p.state||'').includes(loc) || (p.university||'').includes(loc);
      return matchQ && matchLoc;
   });
   renderProviders(filtered);
}

document.addEventListener("DOMContentLoaded", fetchAndRenderProviders);

(window as any).showProfileForUser = function showProfileForUser(email) {
  if (!email) {
    // updateProfilePageUI(); // fallback to current user logic
    showProfile();
    return;
  }
  let allProviders = (window as any).globalProviders || [];
  const user = allProviders.find((p) => p.email === email);
  if (!user) return;
  
  showProfile(); // hide others, show profile container
  
  const nameDisplay = document.getElementById("profileNameDisplay");
  const serviceType = document.getElementById("profileServiceType");
  const bio = document.getElementById("profileBio");
  const coverImage = document.getElementById("profileCoverImage");
  const avatar = document.getElementById("profileAvatar");
  const verifiedBadge = nameDisplay?.nextElementSibling;
  const locationDisplay = document.getElementById("profileLocationDisplay");
  const contactDisplay = document.getElementById("profileContactDisplay"); 
  const servicesList = document.getElementById("profileServicesList");
  const availabilityList = document.getElementById("profileAvailabilityList");
  const policiesList = document.getElementById("profilePoliciesList");
  const hireMeBtn = document.getElementById("hireMeBtn");
  
  if (hireMeBtn) {
    const currentUser = getCurrentUser();
    if (currentUser?.email === user.email) {
       hireMeBtn.classList.add("hidden");
    } else {
       hireMeBtn.classList.remove("hidden");
       hireMeBtn.onclick = () => {
         const bookingModal = document.getElementById("bookingModal");
         if (bookingModal) {
            bookingModal.classList.remove("hidden");
            bookingModal.classList.add("flex");
            document.body.style.overflow = "hidden";
            const form = document.getElementById("bookingForm");
            if (form) {
              form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = form.querySelector("button");
                if (btn) {
                  btn.textContent = "Sending...";
                  btn.disabled = true;
                }
                try {
                  const serviceName = (document.getElementById("bookingServiceName") as HTMLInputElement).value;
                  const date = (document.getElementById("bookingDate") as HTMLInputElement).value;
                  const time = (document.getElementById("bookingTime") as HTMLInputElement).value;
                  const details = (document.getElementById("bookingDetails") as HTMLInputElement).value;
                  const res = await fetch("/api/requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      provider_email: user.email,
                      client_email: currentUser.email,
                      client_name: currentUser.full_name || currentUser.fullName,
                      service_name: serviceName,
                      date,
                      time,
                      details,
                    }),
                  });
                  if (res.ok) {
                    showToast("Request sent successfully!", "success");
                    bookingModal.classList.add("hidden");
                    bookingModal.classList.remove("flex");
                    document.body.style.overflow = "auto";
                    (form as HTMLFormElement).reset();
                  } else {
                    const errorData = await res.json().catch(() => ({}));
                    showToast(errorData.error || "Failed to send request", "error");
                  }
                } catch (err) {
                  showToast("An error occurred", "error");
                } finally {
                  if (btn) {
                    btn.textContent = "Send Request";
                    btn.disabled = false;
                  }
                }
              };
            }
         }
       };
    }
  }

    if (nameDisplay) nameDisplay.textContent = user.full_name;
    if (serviceType) serviceType.textContent = user.service_title || "Provider";
    if (bio)
      bio.textContent =
        user.profile?.bio || user.bio || "No bio available yet.";

    if (coverImage) {
      coverImage.style.backgroundImage = user.profile?.coverImage
        ? `url('${user.profile.coverImage}')`
        : user.cover_url
          ? `url('${user.cover_url}')`
          : "none"; // Empty placeholder
    }

    if (avatar) {
      (avatar as HTMLImageElement).src = user.profile?.profileImage
        ? user.profile.profileImage
        : user.avatar_url
          ? user.avatar_url
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    }

    if (verifiedBadge) {
      (verifiedBadge as HTMLElement).style.display = user.is_verified ? "flex" : "none";
    }

    if (locationDisplay) {
      const location = user.location || user.profile?.location;
      const state = user.state;
      const uni = user.university;

      if (location) {
        locationDisplay.textContent = location;
      } else if (state && uni) {
        locationDisplay.textContent = `${uni}, ${state}`;
      } else if (uni) {
        locationDisplay.textContent = uni;
      } else if (state) {
        locationDisplay.textContent = state;
      } else {
        locationDisplay.textContent = "Not specified";
      }
    }

    if (availabilityList) {
      const availDetails =
        user.availability_details || user.profile?.availability_details;
      if (availDetails) {
        availabilityList.innerHTML = `<li class="text-sm text-gray-900 whitespace-pre-wrap">${availDetails}</li>`;
      } else {
        availabilityList.innerHTML = `<li class="text-sm text-gray-500">No availability details provided.</li>`;
      }
    }

    if (policiesList) {
      const policies = user.policies || user.profile?.policies;
      if (policies) {
        policiesList.innerHTML = policies
          .split("\n")
          .filter((p: string) => p.trim())
          .map(
            (p: string) => `
          <li class="flex items-start">
            <svg class="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${p}
          </li>
        `,
          )
          .join("");
      } else {
        policiesList.innerHTML = `<li class="text-sm text-gray-500">No policies provided.</li>`;
      }
    }

    if (servicesList) {
      let services = user.profile?.services || user.services || [];
      if (typeof services === "string") {
        try {
          services = JSON.parse(services);
        } catch (e) {
          services = [];
        }
      }
      if (!Array.isArray(services)) services = [];
      if (services.length > 0) {
        servicesList.innerHTML = services
          .map(
            (service: any) => `
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <h4 class="font-semibold text-gray-900">${service.name}</h4>
              <p class="text-sm text-gray-500">${service.description}</p>
            </div>
            <span class="font-bold text-gray-900">₦${Number(service.price).toLocaleString()}</span>
          </div>
        `,
          )
          .join("");
      } else {
        servicesList.innerHTML =
          '<p class="text-gray-500 text-sm">No services listed yet.</p>';
      }
    }

    // Add contact to the header if needed (optional since design might not have it natively, let's append it next to location or below)
    let contactInfo = document.getElementById("dynamicContactInfo");
    if (!contactInfo) {
      contactInfo = document.createElement("div");
      contactInfo.id = "dynamicContactInfo";
      contactInfo.className = "flex items-center text-sm text-gray-600 mt-1";
      const container = locationDisplay?.parentElement?.parentElement; // The div wrapping stars and location
      if (container) {
        container.appendChild(contactInfo);
      }
    }
    if (contactInfo) {
      contactInfo.innerHTML = user.profile?.contact
        ? `<svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> ${user.profile.contact}`
        : "";
    }
  showProfile();
};


const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const quickSearchTags = document.querySelectorAll(".quick-search-tag");

searchBtn?.addEventListener("click", () => {
  if (searchInput) {
    // performSearch(searchInput.value);
  } else {
    // performSearch("");
  }
});

searchInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    // performSearch(searchInput.value);
  }
});

quickSearchTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    e.preventDefault();
    const query = tag.textContent || "";
    if (searchInput) searchInput.value = query;
    // performSearch(query);
  });
});

// ---- Render Top Providers ----
(window as any).renderTopProviders = async function renderTopProviders() {
  const providerScroll = document.getElementById("providerScroll");
  if (!providerScroll) return;

  providerScroll.innerHTML = `
  <div class="flex items-center justify-center p-10 w-full col-span-full">
    ${loadingSvg.replace("text-white", "text-orange-600").replace("h-5 w-5", "h-10 w-10")}
    <span class="ml-3 text-gray-600 dark:text-gray-400 font-medium">Loading providers...</span>
  </div>`;

  let allProviders = [];
  try {
    const res = await fetch("/api/providers");
    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        allProviders = await res.json();
      } else {
        console.warn("Expected JSON but got", contentType);
      }
    }
  } catch (e) {
    console.error("Error fetching providers", e);
  }

  // Cache it globally for search and profile viewing

  (window as any).globalProviders = allProviders;

  // Render Global Feed
  const globalFeed = document.getElementById("globalFeedContainer");
  if (globalFeed) {
    globalFeed.innerHTML = "";
    const providers = allProviders.filter((u: any) => u.role === "provider");
    if (providers.length === 0) {
      globalFeed.innerHTML =
        '<div class="col-span-full p-6 text-gray-500 italic text-center">No providers registered yet.</div>';
    } else {
      providers.forEach((user: any) => {
        const serviceTitle =
          user.service_title ||
          (typeof user.services === 'string' ? user.services.substring(0, 30) : (Array.isArray(user.services) && user.services[0] ? user.services[0].name : '')) ||
          "Provider Services";
        const coverImg =
          user.cover_image ||
          user.profile?.coverImage ||
          user.cover_url ||
          "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80";
        const profileImg =
          user.profile_image ||
          user.profile?.profileImage ||
          user.avatar_url ||
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

        const card = document.createElement("div");
        card.className =
          "w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer scroll-section opacity-0 translate-y-8 transition-all duration-700 ease-out";
        card.innerHTML = `
          <div class="h-32 bg-cover bg-center relative" style="background-image: ${coverImg ? "url('" + coverImg + "')" : "none"}; background-color: #f3f4f6;"></div>
          <div class="p-6 relative">
            <div class="absolute -top-10 right-6 w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
               <img src="${profileImg}" class="w-full h-full object-cover">
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">${user.profile?.serviceTitle || "Professional Services"}</h3>
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-gray-500 dark:text-gray-400 text-sm font-medium">${user.full_name}</span>
              ${user.is_verified ? '<svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' : ""}
            </div>
            <div class="flex items-center text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">
               ${user.university || "N/A"} • ${user.state || "N/A"}
            </div>
            <button class="w-full py-2.5 rounded-lg border border-orange-100 dark:border-orange-900/50 text-orange-600 dark:text-orange-500 font-bold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition text-sm">
              View Profile
            </button>
          </div>
        `;
        card.addEventListener("click", () => {
          if (typeof (window as any).showProfileForUser === "function") {
            (window as any).showProfileForUser(user.email);
          }
        });
        globalFeed.appendChild(card);
      });
    }
  }

  providerScroll.innerHTML = "";

  if (!allProviders || allProviders.length === 0) {
    providerScroll.innerHTML =
      '<div class="p-6 text-gray-500 italic w-full text-center">No providers registered yet. Be the first to join!</div>';
    return;
  }

  allProviders.forEach((user: any) => {
    if (user.role !== "provider") return;

    // Determine title for the service
    const serviceTitle =
      user.service_title ||
      (typeof user.services === 'string' ? user.services.substring(0, 30) : (Array.isArray(user.services) && user.services[0] ? user.services[0].name : '')) ||
      "Provider Services";
    const dynamicCard = document.createElement("div");
    dynamicCard.className =
      "min-w-[300px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer scroll-section opacity-0 translate-y-8 transition-all duration-700 ease-out";
    dynamicCard.setAttribute("data-provider-email", user.email);

    const cImg = user.profile?.coverImage || user.cover_url || "";
    const pImg =
      user.profile?.profileImage ||
      user.avatar_url ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

    dynamicCard.innerHTML = `
      <div class="h-40 bg-cover bg-center relative" style="background-image: ${cImg ? "url('" + cImg + "')" : "none"}; background-color: #f3f4f6;"></div>
      <div class="p-6 relative">
        <div class="absolute -top-10 right-6 w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
           <img src="${pImg}" class="w-full h-full object-cover">
        </div>
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-bold text-gray-900 dark:text-white text-lg">${user.full_name?.split(" ")[0] || "User"}</h3>
          ${user.is_verified ? '<span class="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded border border-orange-100 dark:border-orange-800/50 flex items-center"><svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>VERIFIED</span>' : ""}
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">${user.profile?.serviceTitle || "Professional Services"}</p>
        <div class="flex justify-between items-center text-sm">
          <div class="flex items-center text-yellow-400">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span class="text-gray-900 ml-1 font-bold">${getUniAbbr(user.university || user.profile?.university)}</span>
          </div>
          <button class="text-orange-600 font-bold hover:underline view-provider-btn" data-provider-email="${user.email}">View</button>
        </div>
      </div>
    `;
    providerScroll.appendChild(dynamicCard);
  });

  // Re-attach view event listeners on newly created cards
  const clonedCards = providerScroll.querySelectorAll(".cursor-pointer");
  clonedCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const email = card.getAttribute("data-provider-email");
      if (typeof (window as any).showProfileForUser === "function") {
        (window as any).showProfileForUser(email);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  (window as any).renderTopProviders();
});

// ---- Back to Home logic for Provider Profile ----
document.getElementById("backToHomeBtn")?.addEventListener("click", () => {
  window.location.hash = "#home";
});

// Wire up category clicks
document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll("#categories .group");
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const categoryName = card.querySelector("h3")?.textContent || "";
      if (categoryName && searchInput) {
        searchInput.value = categoryName;
        searchBtn?.click();
      }
    });
  });

  // Wire up quick search tags
  const tags = document.querySelectorAll(".quick-search-tag");
  tags.forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.preventDefault();
      if (searchInput) {
        searchInput.value = tag.textContent?.trim() || "";
        searchBtn?.click();
      }
    });
  });
});

const navSearchInput = document.getElementById(
  "navSearchInput",
) as HTMLInputElement;
if (navSearchInput) {
  navSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const mainSearchInput = document.getElementById(
        "searchInput",
      ) as HTMLInputElement;
      if (mainSearchInput) {
        mainSearchInput.value = navSearchInput.value;
      }
      const searchBtn = document.getElementById("searchBtn");
      if (searchBtn) {
        searchBtn.click();
      }
    }
  });
}

const navSearchForm = document.getElementById("navSearchForm");
if (navSearchForm) {
  navSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const navInput = document.getElementById("navSearchInput");
    const mainInput = document.getElementById("searchInput");
    if (mainInput && navInput) {
      (mainInput as HTMLInputElement).value = (navInput as HTMLInputElement).value;
    }
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
      searchBtn.click();
    }
  });
}
