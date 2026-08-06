export function renderAvailability(container: HTMLElement, user: any) {
  container.innerHTML = `
    <div class="space-y-6 max-w-2xl">
      <div class="mb-6">
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white mb-2">Availability Settings</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage when clients can send you requests.</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <!-- Master Toggle -->
        <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">Available for new requests</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">When off, your profile will show as "Unavailable".</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" ${user.isAvailable ? 'checked' : ''} class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
          </label>
        </div>
        
        <!-- Status Label -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Availability Status</label>
          <select class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition">
            <option ${user.availability?.includes('Available') ? 'selected' : ''}>Available Today</option>
            <option ${user.availability?.includes('Week') ? 'selected' : ''}>Available This Week</option>
            <option ${user.availability?.includes('Mon-Fri') ? 'selected' : ''}>Mon–Fri: 6 PM – 10 PM</option>
            <option ${user.availability?.includes('Busy') ? 'selected' : ''}>Busy</option>
          </select>
        </div>
        
        <div class="pt-4">
          <button class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-sm w-full md:w-auto">Save Changes</button>
        </div>
      </div>
    </div>
  `;
}
