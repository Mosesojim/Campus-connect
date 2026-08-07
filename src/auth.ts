export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const rawUser = JSON.parse(userStr);
    return {
      ...rawUser,
      full_name:
        (rawUser.full_name === "undefined" ? "User" : rawUser.full_name) ||
        (rawUser.fullName === "undefined" ? "User" : rawUser.fullName) ||
        "User",
      bio: rawUser.bio || rawUser.profile?.bio,
      skill:
        rawUser.skill ||
        rawUser.profile?.skill ||
        rawUser.profile?.serviceTitle,
      availability: rawUser.availability || rawUser.profile?.availability,
      location: rawUser.location || rawUser.profile?.location,
      contact: rawUser.contact || rawUser.profile?.contact,
      cover_image:
        rawUser.cover_image ||
        rawUser.profile?.coverImage ||
        rawUser.profile?.coverUrl,
      profile_image:
        rawUser.profile_image ||
        rawUser.profile?.profileImage ||
        rawUser.profile?.avatarUrl,
    };
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: any) {
  if (user) {
    try {
      const userClone = JSON.parse(JSON.stringify(user));
      if (userClone.profile_image) userClone.profile_image = "";
      if (userClone.cover_image) userClone.cover_image = "";
      if (userClone.profile) {
        if (userClone.profile.profileImage) userClone.profile.profileImage = "";
        if (userClone.profile.coverImage) userClone.profile.coverImage = "";
      }
      localStorage.setItem("user", JSON.stringify(userClone));
    } catch (e) {
      console.error("Storage quota exceeded even with clone", e);
    }
  } else {
    localStorage.removeItem("user");
  }
}

export function clearUser() {
  localStorage.removeItem("user");
}

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  },
};

export function updateAuthUI() {
  const userStr = safeStorage.getItem("user");
  const authContainer = document.getElementById("authContainer");
  const profileContainer = document.getElementById("profileContainer");
  const authContainerMobile = document.getElementById("authContainerMobile");
  const profileContainerMobile = document.getElementById(
    "profileContainerMobile",
  );

  const profileBadgeDesktop = document.getElementById("profileBadgeDesktop");
  const profileBadgeMobile = document.getElementById("profileBadgeMobile");
  const verificationBadgeIndicator = document.getElementById(
    "verificationBadgeIndicator",
  );
  const verificationBadgeIndicatorMobile = document.getElementById(
    "verificationBadgeIndicatorMobile",
  );
  const verifyProfileBtn = document.getElementById("verifyProfileBtn");
  const verifyProfileBtnMobile = document.getElementById(
    "verifyProfileBtnMobile",
  );

  if (userStr) {
    let user;
    try {
      user = JSON.parse(userStr);
      if (!user || typeof user !== "object") throw new Error();
    } catch (e) {
      safeStorage.removeItem("user");
      return;
    }

    // Verify user still exists in database
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return { deleted: false };
      })
      .then((data) => {
        if (data.deleted) {
          // User was deleted from DB, clear local session
          safeStorage.removeItem("user");
          window.location.reload();
        }
      })
      .catch(console.error);

    if (authContainer) authContainer.classList.add("hidden");
    if (profileContainer) {
      profileContainer.classList.remove("hidden");
      const profileName = document.getElementById("profileName");
      const dropdownEmail = document.getElementById("dropdownEmail");
      const dropdownName = document.getElementById("dropdownName");
      if (profileName)
        profileName.textContent = user.full_name
          ? user.full_name.split(" ")[0]
          : "User";
      if (dropdownEmail) dropdownEmail.textContent = user.email || "";
      if (dropdownName) dropdownName.textContent = user.full_name || "User";
    }

    if (authContainerMobile) authContainerMobile.classList.add("hidden");
    if (profileContainerMobile) {
      profileContainerMobile.classList.remove("hidden");
      const profileNameMobile = document.getElementById("profileNameMobile");
      const dropdownEmailMobile = document.getElementById(
        "dropdownEmailMobile",
      );
      if (profileNameMobile)
        profileNameMobile.textContent = user.full_name
          ? user.full_name.split(" ")[0]
          : "User";
      if (dropdownEmailMobile)
        dropdownEmailMobile.textContent = user.email || "";
    }

    
    const viewProfileBtn = document.getElementById("viewProfileBtn");

    // Fetch Notifications
    const isProvider = user.role === 'provider';
    if (!user.email) return;
    const endpoint = isProvider ? `/api/client-requests/${user.email}` : `/api/my-requests/${user.email}`;
    
    fetch(endpoint)
      .then(res => res.json())
      .then(reqs => {
        if (!Array.isArray(reqs)) return;
        const pending = reqs.filter(r => r.status === 'open');
        if (pending.length > 0) {
           const profileName = document.getElementById("profileName");
           if (profileName && !profileName.innerHTML.includes('red-500')) {
              profileName.innerHTML += ` <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-[10px] font-bold text-white bg-red-500 rounded-full">${pending.length}</span>`;
           }
           
           const profileNameMobile = document.getElementById("profileNameMobile");
           if (profileNameMobile && !profileNameMobile.innerHTML.includes('red-500')) {
              profileNameMobile.innerHTML += ` <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-[10px] font-bold text-white bg-red-500 rounded-full">${pending.length}</span>`;
           }

           // Update dropdown links
           const links = document.querySelectorAll('a[href="profile.html#/client-requests"], a[href="profile.html#/requests"]');
           links.forEach(link => {
             if (!link.innerHTML.includes('red-500')) {
               link.innerHTML += ` <span class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">${pending.length}</span>`;
             }
           });
        }
      })
      .catch(e => console.error(e));

    const viewProfileBtnMobile = document.getElementById(
      "viewProfileBtnMobile",
    );
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileBtnMobile = document.getElementById(
      "editProfileBtnMobile",
    );

    // Role based Verification UI
    if (user.role === "provider") {
      if (verifyProfileBtn) verifyProfileBtn.classList.remove("hidden");
      if (verifyProfileBtnMobile)
        verifyProfileBtnMobile.classList.remove("hidden");
      if (viewProfileBtn) viewProfileBtn.classList.remove("hidden");
      if (viewProfileBtnMobile) viewProfileBtnMobile.classList.remove("hidden");
      if (editProfileBtn) editProfileBtn.classList.remove("hidden");
      if (editProfileBtnMobile) editProfileBtnMobile.classList.remove("hidden");
    } else {
      if (verifyProfileBtn) verifyProfileBtn.classList.add("hidden");
      if (verifyProfileBtnMobile)
        verifyProfileBtnMobile.classList.add("hidden");
      if (viewProfileBtn) viewProfileBtn.classList.add("hidden");
      if (viewProfileBtnMobile) viewProfileBtnMobile.classList.add("hidden");
      if (editProfileBtn) editProfileBtn.classList.add("hidden");
      if (editProfileBtnMobile) editProfileBtnMobile.classList.add("hidden");
    }

    // Verification Badges
    if (user.isVerified) {
      if (profileBadgeDesktop) profileBadgeDesktop.classList.remove("hidden");
      if (profileBadgeMobile) profileBadgeMobile.classList.remove("hidden");
      if (verificationBadgeIndicator) {
        verificationBadgeIndicator.classList.remove("hidden");
        verificationBadgeIndicator.innerHTML =
          '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>';
      }
      if (verificationBadgeIndicatorMobile)
        verificationBadgeIndicatorMobile.classList.remove("hidden");
      if (verifyProfileBtn)
        verifyProfileBtn.querySelector("span")!.textContent = "Verified";
      if (verifyProfileBtnMobile)
        verifyProfileBtnMobile.querySelector("span")!.textContent = "Verified";
    } else if (user.verificationStatus === "pending") {
      if (profileBadgeDesktop) profileBadgeDesktop.classList.add("hidden");
      if (profileBadgeMobile) profileBadgeMobile.classList.add("hidden");
      if (verificationBadgeIndicator) {
        verificationBadgeIndicator.classList.remove("hidden");
        verificationBadgeIndicator.innerHTML =
          '<svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      }
      if (verificationBadgeIndicatorMobile) {
        verificationBadgeIndicatorMobile.classList.remove("hidden");
        verificationBadgeIndicatorMobile.innerHTML =
          '<svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      }
      if (verifyProfileBtn)
        verifyProfileBtn.querySelector("span")!.textContent =
          "Pending Verification";
      if (verifyProfileBtnMobile)
        verifyProfileBtnMobile.querySelector("span")!.textContent =
          "Pending Verification";
    } else {
      if (profileBadgeDesktop) profileBadgeDesktop.classList.add("hidden");
      if (profileBadgeMobile) profileBadgeMobile.classList.add("hidden");
      if (verificationBadgeIndicator)
        verificationBadgeIndicator.classList.add("hidden");
      if (verificationBadgeIndicatorMobile)
        verificationBadgeIndicatorMobile.classList.add("hidden");
      if (verifyProfileBtn)
        verifyProfileBtn.querySelector("span")!.textContent = "Verification";
      if (verifyProfileBtnMobile)
        verifyProfileBtnMobile.querySelector("span")!.textContent =
          "Verification";
    }

    // Role based dropdown menus
    const dropdownLinksContainer = document.getElementById(
      "dropdownLinksContainer",
    );
    const mobileLinksContainer = document.getElementById(
      "mobileLinksContainer",
    );

    const clientDesktopLinks = `
      <a href="profile.html#/profile" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">My Profile</a>
      <a href="profile.html#/requests" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">My Requests</a>
      <a href="profile.html#/saved-providers" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Saved Providers</a>
      <a href="profile.html#/settings" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-t border-gray-100 dark:border-gray-800">Account Settings</a>
    `;

    const clientMobileLinks = `
      <a href="profile.html#/profile" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span>My Profile</span>
      </a>
      <a href="profile.html#/requests" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        <span>My Requests</span>
      </a>
      <a href="profile.html#/saved-providers" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        <span>Saved Providers</span>
      </a>
      <a href="profile.html#/settings" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <span>Account Settings</span>
      </a>
    `;

    const providerDesktopLinks = `
      <a href="profile.html#/profile" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">My Profile</a>
      <a href="profile.html#/my-services" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">My Services</a>
      <a href="profile.html#/client-requests" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Client Requests</a>
      <a href="profile.html#/availability" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Availability</a>
      <a href="profile.html#/settings" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-t border-gray-100 dark:border-gray-800">Account Settings</a>
    `;

    const providerMobileLinks = `
      <a href="profile.html#/profile" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span>My Profile</span>
      </a>
      <a href="profile.html#/my-services" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <span>My Services</span>
      </a>
      <a href="profile.html#/client-requests" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        <span>Client Requests</span>
      </a>
      <a href="profile.html#/availability" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <span>Availability</span>
      </a>
      <a href="profile.html#/settings" class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full text-left flex items-center space-x-3 mb-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        <span>Account Settings</span>
      </a>
    `;

    if (user.role === "provider") {
      if (dropdownLinksContainer)
        dropdownLinksContainer.innerHTML = providerDesktopLinks;
      if (mobileLinksContainer)
        mobileLinksContainer.innerHTML = providerMobileLinks;
    } else {
      if (dropdownLinksContainer)
        dropdownLinksContainer.innerHTML = clientDesktopLinks;
      if (mobileLinksContainer)
        mobileLinksContainer.innerHTML = clientMobileLinks;
    }
  } else {
    if (authContainer) authContainer.classList.remove("hidden");
    if (profileContainer) profileContainer.classList.add("hidden");
    if (authContainerMobile) authContainerMobile.classList.remove("hidden");
    if (profileContainerMobile) profileContainerMobile.classList.add("hidden");
  }
}
