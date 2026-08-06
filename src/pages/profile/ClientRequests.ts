import { renderRequestCard } from '../../components/profile/RequestCard';

export function renderClientRequests(container: HTMLElement) {
  const requests = [
    {
      title: 'Need a UI designer for final year project',
      description: 'Looking for a student who can design 3 mobile app screens for a final-year project presentation.',
      status: 'open',
      budget: '₦10,000',
      dueInDays: 2,
      isProviderView: true
    }
  ];

  const requestsHtml = requests.map(r => renderRequestCard(r)).join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="mb-6">
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white mb-2">Client Requests</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Incoming job opportunities and active projects.</p>
      </div>
      
      <div class="flex space-x-2 border-b border-gray-100 dark:border-gray-700 mb-6 overflow-x-auto hide-scrollbar pb-1">
        <button class="px-4 py-2 border-b-2 border-orange-600 text-orange-600 font-bold whitespace-nowrap">Incoming (1)</button>
        <button class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">Active (0)</button>
        <button class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">Completed</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${requestsHtml}
      </div>
    </div>
  `;
}
