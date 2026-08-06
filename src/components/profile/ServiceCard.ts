export function renderServiceCard(service: any): string {
  return `
    <div class="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-orange-200 dark:hover:border-orange-800 transition">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-gray-900 dark:text-white text-lg">${service.title}</h3>
        <span class="font-black text-orange-600 dark:text-orange-400 whitespace-nowrap">${service.price}</span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">${service.description}</p>
      
      ${service.isEditable ? `
      <div class="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <span class="text-xs font-bold text-gray-500 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-green-500"></span> Active</span>
        <span class="text-xs text-gray-400">&bull;</span>
        <span class="text-xs text-gray-500">2-3 days delivery</span>
        <div class="flex-1"></div>
        <button class="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pause</button>
        <button class="text-sm font-bold text-orange-600 hover:text-orange-700">Edit</button>
      </div>` : ''}
    </div>
  `;
}
