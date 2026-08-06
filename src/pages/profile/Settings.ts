export function renderSettings(container: HTMLElement, user: any) {
  container.innerHTML = `
    <div class="space-y-6 max-w-2xl">
      <div class="mb-6">
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white mb-2">Account Settings</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <h3 class="font-bold text-gray-900 dark:text-white text-lg border-b border-gray-100 dark:border-gray-700 pb-3">Personal Details</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Name</label>
            <input type="text" value="${user.fullName || ''}" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email Address</label>
            <input type="email" value="${user.email || ''}" disabled class="w-full bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed">
          </div>
        </div>
        
        <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
           <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-4">Security</h3>
           <button class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full md:w-auto">Change Password</button>
        </div>
        
        <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm w-full md:w-auto">Cancel</button>
          <button class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm w-full md:w-auto">Save Settings</button>
        </div>
      </div>
    </div>
  `;
}
