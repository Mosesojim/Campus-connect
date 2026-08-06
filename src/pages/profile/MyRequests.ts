import { renderRequestCard } from '../../components/profile/RequestCard';

export function renderMyRequests(container: HTMLElement) {
  const requests = [
    {
      title: 'Need a UI designer for final year project',
      description: 'Looking for a student who can design 3 mobile app screens for a final-year project presentation.',
      status: 'open',
      budget: '₦10,000',
      dueInDays: 2,
      isProviderView: false
    },
    {
      title: 'Math 101 Assignment Help',
      description: 'Need help solving 5 calculus questions for tomorrow.',
      status: 'completed',
      budget: '₦2,000',
      dueInDays: 0,
      isProviderView: false
    }
  ];

  const requestsHtml = requests.map(r => renderRequestCard(r)).join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white">My Requests</h2>
        <button class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-sm text-sm whitespace-nowrap">+ New Request</button>
      </div>
      
      <div class="flex space-x-2 border-b border-gray-100 dark:border-gray-700 mb-6 overflow-x-auto hide-scrollbar pb-1">
        <button class="px-4 py-2 border-b-2 border-orange-600 text-orange-600 font-bold whitespace-nowrap">Active (1)</button>
        <button class="px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap">Completed (1)</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${requestsHtml}
      </div>
    </div>
  `;
}
