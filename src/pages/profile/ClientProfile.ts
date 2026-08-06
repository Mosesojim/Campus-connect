import { renderProfileHeader } from '../../components/profile/ProfileHeader';

export function renderClientProfile(container: HTMLElement, user: any) {
  // Client profile just loads user info and summary
  container.innerHTML = `
    ${renderProfileHeader(user, false)}
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
      <h2 class="font-bold text-xl text-gray-900 dark:text-white mb-4">My Requests Summary</h2>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <span class="block text-3xl font-black text-gray-900 dark:text-white mb-1">2</span>
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</span>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <span class="block text-3xl font-black text-gray-900 dark:text-white mb-1">5</span>
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</span>
        </div>
      </div>
      <div class="mt-4 text-center">
        <a href="#requests" class="inline-block text-orange-600 font-bold hover:underline">View all requests &rarr;</a>
      </div>
    </section>
  `;
}
