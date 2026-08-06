export function renderProfileHeader(user: any, isProvider: boolean): string {
  return `
    <section class="profile-header bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all">
      <img src="${user.avatarUrl}" class="avatar w-20 h-20 rounded-full border-4 border-gray-50 dark:border-gray-700 shadow-sm object-cover" alt="Avatar" />
      
      <div class="profile-info flex-1">
        <h1 id="profile-name" class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">${user.fullName}</h1>
        <p id="profile-role" class="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-2 font-medium">${isProvider ? user.serviceTitle : 'Student'}</p>
        ${isProvider ? (user.isAvailable 
          ? '<span class="availability inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800/50"><span class="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft"></span> Available for work</span>' 
          : '<span class="availability inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-600">Unavailable</span>')
          : ''
        }
      </div>

      <button id="edit-profile-btn" onclick="window.location.hash='#settings'" class="w-full md:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm whitespace-nowrap active:scale-95">Edit Profile</button>
    </section>
  `;
}
