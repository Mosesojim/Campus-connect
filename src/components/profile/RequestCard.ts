export function renderRequestCard(request: any): string {
  const statusColors: any = {
    'open': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'accepted': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    'completed': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
  };

  return `
    <div class="border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:border-gray-200 dark:hover:border-gray-600 transition">
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-bold text-gray-900 dark:text-white text-lg">${request.title}</h3>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[request.status]} capitalize">${request.status}</span>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">${request.description}</p>
      
      <div class="flex flex-wrap gap-4 text-sm mb-4">
        <div class="flex items-center text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="font-medium text-gray-700 dark:text-gray-300">Budget: ${request.budget}</span>
        </div>
        <div class="flex items-center text-gray-500 dark:text-gray-400">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Due in ${request.dueInDays} days</span>
        </div>
      </div>
      
      ${request.isProviderView && request.status === 'open' ? `
        <div class="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
          <button class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm">Accept Request</button>
          <button class="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition text-sm">Message Client</button>
        </div>
      ` : ''}
      
      ${!request.isProviderView && request.status === 'open' ? `
        <div class="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
           <button class="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-lg transition text-sm">Edit Request</button>
           <button class="flex-1 border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition text-sm">Cancel</button>
        </div>
      ` : ''}
    </div>
  `;
}
