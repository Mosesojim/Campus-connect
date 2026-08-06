import { renderServiceCard } from '../../components/profile/ServiceCard';

export function renderMyServices(container: HTMLElement) {
  const services = [
    {
      title: 'Website Design',
      price: '₦15,000',
      description: 'Responsive landing pages and student project websites.',
      isEditable: true
    },
    {
      title: 'Presentation Design',
      price: '₦5,000',
      description: 'Seminar slides, assignment presentations, and pitch decks.',
      isEditable: true
    }
  ];

  const servicesHtml = services.map(s => renderServiceCard(s)).join('');

  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-bold text-2xl text-gray-900 dark:text-white">My Services</h2>
        <button class="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-sm text-sm whitespace-nowrap">+ Add Service</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${servicesHtml}
      </div>
    </div>
  `;
}
