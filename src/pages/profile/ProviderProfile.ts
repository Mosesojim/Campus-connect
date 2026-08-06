import { renderProfileHeader } from '../../components/profile/ProfileHeader';

export function renderProviderProfile(container: HTMLElement, user: any) {
  container.innerHTML = `
    ${renderProfileHeader(user, true)}
    
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
      <h2 class="font-bold text-xl text-gray-900 dark:text-white mb-3">About</h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">${user.bio}</p>
    </section>

    <div id="services-container">
      <div class="skeleton mt-6" style="height: 150px; border-radius: 16px;"></div>
    </div>
    
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
      <h2 class="font-bold text-xl text-gray-900 dark:text-white mb-3">Availability</h2>
      <div class="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
        <div class="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <p class="font-medium">${user.availability}</p>
      </div>
    </section>

    <div id="reviews-container">
      <div class="skeleton mt-6" style="height: 150px; border-radius: 16px;"></div>
    </div>
  `;
}
