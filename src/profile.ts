const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  },
};

import { updateAuthUI, getCurrentUser, setCurrentUser } from "./auth";
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

import "./style.css";

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
const loadingSvg = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

function showToast(message: string, type: "success" | "error" = "success") {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform translate-y-[-100%] opacity-0 ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-y-[-100%]", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-y-[-100%]", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// @ts-ignore
window.navigate = function (hash: any) {
  if (typeof hash === "string") {
    window.location.hash = hash.replace(/^\//, "#/");
  }
};

function renderClientProfile(user: any) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="font-bold text-3xl mb-1 text-gray-900 dark:text-white">${user.full_name}</h1>
          <p class="text-gray-500 dark:text-gray-400 mb-3 text-sm">${user.email}</p>
          <p class="text-gray-700 dark:text-gray-300 font-medium mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            ${user.university || "University Student"}
          </p>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
            Looking for services
          </span>
        </div>
        <button onclick="window.location.assign('/settings')" class="px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-xl transition-colors shadow-sm whitespace-nowrap ml-4">
          Edit Profile
        </button>
      </div>
      
      <button id="mobile-logout" class="md:hidden mt-2 w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition shadow-sm text-center">
        Log out
      </button>
    </section>
  `;
  setTimeout(() => {
    document.getElementById("mobile-logout")?.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/";
      window.location.reload();
    });
  }, 0);
}

function renderProviderProfile(user: any) {
  const app = document.getElementById("app");
  if (!app) return;

  const isAvailable =
    user.availability === "available" || user.availability === "Available";

  const coverImg =
    user.cover_image ||
    user.profile?.coverImage ||
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1200&q=80";
  const profileImg =
    user.profile_image ||
    user.profile?.profileImage ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  let services = user.profile?.services || user.services;
  if (typeof services === "string") {
    try {
      services = JSON.parse(services);
    } catch (e) {
      services = [];
    }
  }
  if (!Array.isArray(services)) services = [];

  app.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <!-- Cover & Header -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div class="h-48 bg-cover bg-center relative" style="background-image: ${coverImg !== "none" ? `url('${coverImg}')` : "none"}; background-color: #f3f4f6;"></div>
        <div class="p-8 relative">
          <div class="absolute -top-16 left-8 w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden bg-white">
            <img src="${profileImg}" class="w-full h-full object-cover">
          </div>
          <div class="mt-14 flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">${user.full_name}</h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">${user.email}</p>
              
              <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${isAvailable ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800/50" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}">
                <span class="w-1.5 h-1.5 rounded-full mr-2 ${isAvailable ? "bg-green-500" : "bg-gray-400"}"></span>
                ${user.availability || "Available"}
              </span>
            </div>
            <button onclick="window.location.assign('/settings')" class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold rounded-xl transition-colors shadow-sm whitespace-nowrap">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">About Me</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">${user.bio || "No bio available yet."}</p>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service / Skill</h4>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">${user.skill || "Not specified"}</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">${user.location || "Not specified"}</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</h4>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">${user.contact || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Services Section -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Services Offered</h3>
              <span class="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold">${services.length} services</span>
            </div>
            
            ${
              services.length === 0
                ? `
              <div class="text-center py-8">
                <p class="text-gray-500 mb-4">You haven't added any services yet.</p>
                <button onclick="window.location.assign('/my-services')" class="px-5 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition text-sm">
                  Add Service
                </button>
              </div>
            `
                : `
              <div class="space-y-4">
                ${services
                  .map(
                    (s: any) => `
                  <div class="p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition bg-gray-50/50 dark:bg-gray-900/50">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-bold text-gray-900 dark:text-white">${s.name}</h4>
                      <span class="font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm">₦${s.price}</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${s.description || "No description provided."}</p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            `
            }
          </div>
        </div>
      </div>
      
      <button id="mobile-logout" class="md:hidden mt-6 w-full px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition shadow-sm text-center">
        Log out
      </button>
    </div>
  `;

  setTimeout(() => {
    document.getElementById("mobile-logout")?.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/";
      window.location.reload();
    });
  }, 0);
}

async function renderSettings(user: any) {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mt-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h1 class="font-bold text-2xl text-gray-900 dark:text-white mb-6">Account Settings</h1>
      
      <form id="settingsForm" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <input type="text" id="settingsName" value="${user.full_name || ""}" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / Description</label>
          <textarea id="settingsBio" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">${user.bio || ""}</textarea>
        </div>
        
        ${
          user.role === "provider"
            ? `
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service / Skill Category</label>
          <input type="text" id="settingsSkill" value="${user.skill || ""}" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
            <select id="settingsState" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
               <option value="${user.state || ""}">${user.state || "Select State"}</option>
               <option value="Abia">Abia</option><option value="Adamawa">Adamawa</option><option value="Akwa Ibom">Akwa Ibom</option><option value="Anambra">Anambra</option><option value="Bauchi">Bauchi</option><option value="Bayelsa">Bayelsa</option><option value="Benue">Benue</option><option value="Borno">Borno</option><option value="Cross River">Cross River</option><option value="Delta">Delta</option><option value="Ebonyi">Ebonyi</option><option value="Edo">Edo</option><option value="Ekiti">Ekiti</option><option value="Enugu">Enugu</option><option value="FCT - Abuja">FCT - Abuja</option><option value="Gombe">Gombe</option><option value="Imo">Imo</option><option value="Jigawa">Jigawa</option><option value="Kaduna">Kaduna</option><option value="Kano">Kano</option><option value="Katsina">Katsina</option><option value="Kebbi">Kebbi</option><option value="Kogi">Kogi</option><option value="Kwara">Kwara</option><option value="Lagos">Lagos</option><option value="Nasarawa">Nasarawa</option><option value="Niger">Niger</option><option value="Ogun">Ogun</option><option value="Ondo">Ondo</option><option value="Osun">Osun</option><option value="Oyo">Oyo</option><option value="Plateau">Plateau</option><option value="Rivers">Rivers</option><option value="Sokoto">Sokoto</option><option value="Taraba">Taraba</option><option value="Yobe">Yobe</option><option value="Zamfara">Zamfara</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">University</label>
            <input type="text" id="settingsUniversity" value="${user.university || ""}" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
            <input type="text" id="settingsLocation" value="${user.location || ""}" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Info</label>
            <input type="text" id="settingsContact" value="${user.contact || ""}" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
          </div>
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
           <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
           <div class="flex items-center space-x-4">
             <img id="profileImagePreview" src="${user.profile_image || user.profile?.profileImage || ""}" class="w-16 h-16 rounded-full object-cover bg-gray-100 hidden">
             <input type="file" id="settingsProfileImage" accept="image/*" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
           </div>
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image URL</label>
           <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
           <div class="space-y-2">
             <img id="coverImagePreview" src="${user.cover_image || user.profile?.coverImage || ""}" class="w-full h-32 object-cover rounded-xl hidden bg-gray-100">
             <input type="file" id="settingsCoverImage" accept="image/*" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
           </div>
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
           <select id="settingsAvailability" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">
             <option value="available" ${user.availability?.toLowerCase() === "available" ? "selected" : ""}>Available</option>
             <option value="not_available" ${user.availability?.toLowerCase() === "not_available" ? "selected" : ""}>Not Available</option>
           </select>
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability Details (e.g. Mon-Fri 4-8pm)</label>
           <textarea id="settingsAvailabilityDetails" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">${user.availability_details || user.profile?.availability_details || ""}</textarea>
        </div>
        
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Policies (e.g. 15min grace period, cash only)</label>
           <textarea id="settingsPolicies" rows="3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-900 dark:text-white">${user.policies || user.profile?.policies || ""}</textarea>
        </div>
        `
            : ""
        }
           
        <div class="pt-6 border-t border-gray-100 dark:border-gray-700">
          <button type="submit" class="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-md hover:bg-gray-800 dark:hover:bg-gray-100 transition transform hover:-translate-y-0.5">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  `;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const profileInput = document.getElementById(
    "settingsProfileImage",
  ) as HTMLInputElement;
  const coverInput = document.getElementById(
    "settingsCoverImage",
  ) as HTMLInputElement;
  const profilePreview = document.getElementById(
    "profileImagePreview",
  ) as HTMLImageElement;
  const coverPreview = document.getElementById(
    "coverImagePreview",
  ) as HTMLImageElement;

  if (user.profile_image || user.profile?.profileImage) {
    profilePreview.src = user.profile_image || user.profile?.profileImage;
    profilePreview.classList.remove("hidden");
  }
  if (user.cover_image || user.profile?.coverImage) {
    coverPreview.src = user.cover_image || user.profile?.coverImage;
    coverPreview.classList.remove("hidden");
  }

  profileInput?.addEventListener("change", async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      profilePreview.src = b64;
      profilePreview.classList.remove("hidden");
      user.profile_image = b64;
    }
  });

  coverInput?.addEventListener("change", async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await fileToBase64(file);
      coverPreview.src = b64;
      coverPreview.classList.remove("hidden");
      user.cover_image = b64;
    }
  });

  document
    .getElementById("settingsForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.querySelector(
        '#settingsForm button[type="submit"]',
      ) as HTMLButtonElement;
      setBtnLoading(btn, true, "Save Changes");

      user.full_name = (
        document.getElementById("settingsName") as HTMLInputElement
      ).value;
      user.fullName = user.full_name;
      user.bio = (
        document.getElementById("settingsBio") as HTMLTextAreaElement
      ).value;

      if (user.role === "provider") {
        user.skill = (
          document.getElementById("settingsSkill") as HTMLInputElement
        ).value;
        user.location = (
          document.getElementById("settingsLocation") as HTMLInputElement
        ).value;
        user.state = (
          document.getElementById("settingsState") as HTMLSelectElement
        ).value;
        user.university = (
          document.getElementById("settingsUniversity") as HTMLInputElement
        ).value;
        user.contact = (
          document.getElementById("settingsContact") as HTMLInputElement
        ).value;

        user.availability = (
          document.getElementById("settingsAvailability") as HTMLSelectElement
        ).value;
        user.availability_details = (
          document.getElementById(
            "settingsAvailabilityDetails",
          ) as HTMLTextAreaElement
        ).value;
        user.policies = (
          document.getElementById("settingsPolicies") as HTMLTextAreaElement
        ).value;

        // Also update the nested profile object for backwards compatibility locally
        user.profile = user.profile || {};
        user.profile.bio = user.bio;
        user.profile.skill = user.skill;
        user.profile.profileImage = user.profile_image;
        user.profile.coverImage = user.cover_image;
      }

      setCurrentUser(user);

      // Save to DB
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            bio: user.bio,
            skill: user.skill,
            location: user.location,
            contact: user.contact,
            profile_image: user.profile_image,
            cover_image: user.cover_image,
            availability: user.availability,
            availability_details: user.availability_details,
            policies: user.policies,
            state: user.state,
            university: user.university,
          }),
        });
        if (res.ok) {
          showToast("Settings saved successfully", "success");
          window.location.assign("/profile");
        } else {
          showToast("Failed to save settings", "error");
        }
      } catch (err) {
        showToast("Error saving settings", "error");
      }
    });
}

async function renderProviderView(id: string) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button onclick="window.location.assign('/requests')" class="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium transition text-sm">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Requests
      </button>
      
      <div class="flex flex-col items-center text-center">
        <div class="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" class="w-full h-full object-cover">
        </div>
        <h1 class="font-bold text-2xl text-gray-900 dark:text-white capitalize">${id.replace("-", " ")}</h1>
        <p class="text-orange-600 dark:text-orange-400 font-medium mb-4">Top Rated Provider</p>
        
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">Experienced student offering high-quality services on campus. Book a session today!</p>
        
        <button class="w-full max-w-xs px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5">
          Send Message
        </button>
      </div>
    </section>
  `;
}

async function renderMyServices(user: any) {
  const mainContent = document.getElementById("app");
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Services</h2>
        <p class="text-gray-500 mb-6">Manage your active service listings and pricing.</p>
        
        <form id="servicesForm" class="space-y-4">
          <div id="servicesList" class="space-y-4">
            <!-- Services will be injected here -->
          </div>
          <button type="button" id="addServiceBtn" class="text-orange-600 font-bold hover:underline">+ Add Another Service</button>
          
          <div class="pt-6 border-t border-gray-100 dark:border-gray-700 flex">
             <button type="submit" class="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition">Save Services</button>
             <button type="button" id="cancelServicesBtn" class="px-6 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-md transition ml-3">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  let services = user.profile?.services;
  if (typeof services === "string") {
    try {
      services = JSON.parse(services);
    } catch (e) {
      services = [];
    }
  }
  if (!Array.isArray(services)) services = [];
  if (services.length === 0) {
    services = [{ name: "", description: "", price: 0 }];
  }

  const servicesList = document.getElementById("servicesList")!;

  function saveDOMToServices() {
    const names = document.querySelectorAll(
      ".service-name",
    ) as NodeListOf<HTMLInputElement>;
    const prices = document.querySelectorAll(
      ".service-price",
    ) as NodeListOf<HTMLInputElement>;
    const descs = document.querySelectorAll(
      ".service-desc",
    ) as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < names.length; i++) {
      if (services[i]) {
        services[i].name = names[i].value;
        services[i].price = Number(prices[i].value);
        services[i].description = descs[i].value;
      }
    }
  }

  function renderServices() {
    servicesList.innerHTML = services
      .map(
        (s: any, i: number) => `
      <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 relative">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
            <input type="text" class="service-name w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" value="${s.name}" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₦)</label>
            <input type="number" class="service-price w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" value="${s.price}" required>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input type="text" class="service-desc w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" value="${s.description}">
          </div>
        </div>
        ${services.length > 1 ? `<button type="button" class="remove-service absolute top-4 right-4 text-red-500 hover:text-red-700" data-index="${i}">✕</button>` : ""}
      </div>
    `,
      )
      .join("");

    document.querySelectorAll(".remove-service").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        saveDOMToServices();
        const index = parseInt(
          (e.currentTarget as HTMLElement).getAttribute("data-index")!,
        );
        services.splice(index, 1);
        renderServices();
      });
    });
  }

  renderServices();

  document
    .getElementById("cancelServicesBtn")
    ?.addEventListener("click", () => {
      (window as any).navigate("/profile");
    });

  document.getElementById("addServiceBtn")?.addEventListener("click", () => {
    saveDOMToServices();
    services.push({ name: "", description: "", price: 0 });
    renderServices();
  });

  document
    .getElementById("servicesForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      saveDOMToServices();
      const btn = document.querySelector(
        '#servicesForm button[type="submit"]',
      ) as HTMLButtonElement;
      setBtnLoading(btn, true, "Save Services");

      user.profile = user.profile || {};
      user.profile.services = services;

      // Save locally
      setCurrentUser(user);

      // Save to DB
      try {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            full_name: user.full_name,
            services: services,
          }),
        });
        if (res.ok) {
          showToast("Services updated successfully", "success");
        } else {
          showToast("Failed to update services in DB", "error");
        }
      } catch (err) {
        showToast("Error updating services", "error");
      } finally {
        setBtnLoading(btn, false, "Save Services");
      }
    });
}

async function renderClientRequests(user: any) {
  const mainContent = document.getElementById("app");
  if (!mainContent) return;

  mainContent.innerHTML = `<div class="p-8 text-center text-gray-500">Loading requests...</div>`;

  try {
    const isProvider = user.role === 'provider';
    const endpoint = isProvider ? `/api/client-requests/${user.email}` : `/api/my-requests/${user.email}`;
    const title = isProvider ? 'Client Requests' : 'My Requests';
    
    const res = await fetch(endpoint);
    const requests = await res.json();

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      mainContent.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${title}</h2>
            <p class="text-gray-500">You have no requests at the moment.</p>
          </div>
        </div>
      `;
      return;
    }

    mainContent.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">${title}</h2>
        <div class="space-y-4">
          ${requests
            .map(
              (req: any) => `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 class="font-bold text-lg text-gray-900 dark:text-white">${req.title}</h3>
                <p class="text-gray-500 text-sm mb-2">${req.description || "No description provided"}</p>
                <div class="flex space-x-4 text-sm font-medium">
                  <span class="text-green-600">Budget: ₦${req.budget || "N/A"}</span>
                  <span class="${req.status === 'open' ? 'text-yellow-600' : 'text-gray-500'}">Status: ${req.status}</span>
                </div>
              </div>
              ${
                req.status === "open" && isProvider
                  ? `
              <div class="mt-4 md:mt-0 flex space-x-2">
                <button class="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition" onclick="updateRequestStatus('${req.id}', 'accepted')">Accept</button>
                <button class="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition" onclick="updateRequestStatus('${req.id}', 'declined')">Decline</button>
              </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  } catch (err) {
    mainContent.innerHTML = `<div class="p-8 text-center text-red-500">Error loading requests.</div>`;
  }
}

(window as any).updateRequestStatus = async function (
  id: string,
  status: string,
) {
  try {
    const res = await fetch(`/api/client-requests/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      // Reload page
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  updateAuthUI();

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "/";
    return;
  }

  // Fetch full profile from backend to get images and fresh data (non-blocking)
  fetch(`/api/provider/${user.email}`).then(async (res) => {
    if (res.ok) {
      const dbUser = await res.json();
      if (dbUser && dbUser.email) {
        Object.assign(user, dbUser);
        if (dbUser.profile_image) user.profile_image = dbUser.profile_image;
        if (dbUser.cover_image) user.cover_image = dbUser.cover_image;
        setCurrentUser(user); // Optional: save updated to local storage
      }
    }
  }).catch(err => {
    console.error("Error fetching fresh profile:", err);
  });

  function handleRoute() {
    const hash = window.location.hash || "#/profile";
    const app = document.getElementById("app");
    if (!app) return;

    if (
      hash.includes("/services") ||
      hash.includes("/my-services") ||
      hash.includes("/post-service")
    ) {
      if (user.role !== "provider") {
        window.location.hash = "#/profile";
        return;
      }
      renderMyServices(user);
    } else if (
      hash.includes("/requests") ||
      hash.includes("/client-requests")
    ) {
      renderClientRequests(user);
    } else if (hash.includes("/settings") || hash.includes("/availability")) {
      renderSettings(user);
    } else {
      if (user.role === "provider") {
        renderProviderProfile(user);
      } else {
        renderClientProfile(user);
      }
    }
  }

  handleRoute();
  window.addEventListener("hashchange", handleRoute);

  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (
        !profileBtn.contains(e.target as Node) &&
        !profileDropdown.contains(e.target as Node)
      ) {
        profileDropdown.classList.add("hidden");
      }
    });
    profileDropdown.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).tagName === "A") {
        profileDropdown.classList.add("hidden");
      }
    });
  }

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
  });

  // Close menu when clicking links in mobile menu
  mobileMenu?.addEventListener("click", (e) => {
    if (
      (e.target as HTMLElement).tagName === "A" ||
      (e.target as HTMLElement).closest("a")
    ) {
      mobileMenu.classList.add("hidden");
    }
  });

  // Mobile bottom tabs
  document.getElementById("mobile-home")?.addEventListener("click", () => {
    document.getElementById("mobile-home").innerHTML = '<div class="w-6 h-6 mb-1 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div><span class="text-[10px] font-medium">Loading</span>';
    window.location.href = "/";
  });
  document.getElementById("mobile-search")?.addEventListener("click", () => {
    window.location.href = "/#search";
  });
  document.getElementById("mobile-post")?.addEventListener("click", () => {
    const user = getCurrentUser();
    if (user?.role === 'provider') {
      window.location.hash = '#/my-services';
    } else {
      window.location.hash = '#/requests';
    }
  });
  document.getElementById("mobile-requests")?.addEventListener("click", () => {
    window.location.hash = "#/requests";
  });
  document.getElementById("mobile-profile")?.addEventListener("click", () => {
    window.location.hash = "#/profile";
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setCurrentUser(null);
      window.location.href = "/";
      window.location.reload();
    });
  }
});

// ---- Theme Logic ----
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIconDark = document.getElementById("themeIconDark");
const themeIconLight = document.getElementById("themeIconLight");

function updateThemeUI(isDark) {
  if (isDark) {
    document.documentElement.classList.add("dark");
    if (themeIconDark) themeIconDark.classList.remove("hidden");
    if (themeIconLight) themeIconLight.classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    if (themeIconDark) themeIconDark.classList.add("hidden");
    if (themeIconLight) themeIconLight.classList.remove("hidden");
  }
}

const storedTheme = safeStorage.getItem("theme");
const initialDark = storedTheme === "dark";
updateThemeUI(initialDark);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const newDark = !isDark;
    safeStorage.setItem("theme", newDark ? "dark" : "light");
    updateThemeUI(newDark);
  });
}

function updateProfileMobileNav() {
  const hash = window.location.hash;
  const btns = {
    "/post-service": document.getElementById("mobile-post"),
    "/requests": document.getElementById("mobile-requests"),
    "/client-requests": document.getElementById("mobile-requests"),
    "/profile": document.getElementById("mobile-profile"),
    "/services": document.getElementById("mobile-profile") // fallback?
  };
  
  // reset all
  Object.values(btns).forEach(btn => {
    if (btn) btn.className = "flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white";
  });
  
  if (hash.includes("/post-service") && btns["/post-service"]) {
    btns["/post-service"].className = "flex flex-col items-center p-2 text-orange-600";
  } else if ((hash.includes("/requests") || hash.includes("/client-requests")) && btns["/requests"]) {
    btns["/requests"].className = "flex flex-col items-center p-2 text-orange-600";
  } else if (btns["/profile"]) {
    btns["/profile"].className = "flex flex-col items-center p-2 text-orange-600";
  }
}
window.addEventListener("hashchange", updateProfileMobileNav);
document.addEventListener("DOMContentLoaded", updateProfileMobileNav);
