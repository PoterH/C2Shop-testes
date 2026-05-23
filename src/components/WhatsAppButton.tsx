import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '5581997349300', // Substitua pelo seu número real do WhatsApp
  message = 'Olá, tenho interesse em um software da C2Tech e gostaria de tirar uma dúvida.'
}) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-300 group"
      aria-label="Falar no WhatsApp"
      id="whatsapp-floating-btn"
    >
      {/* Pulse effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping -z-10"></span>
      
      {/* Icon */}
      <svg
        className="w-8 h-8 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.48 4.965 1.488 5.413.002 9.818-4.388 9.822-9.782.002-2.614-1.011-5.07-2.855-6.918-1.847-1.85-4.3-2.868-6.919-2.869-5.418 0-9.825 4.39-9.829 9.786-.002 1.8.48 3.55 1.393 5.093l-.95 3.473 3.573-.937zm11.367-7.397c-.266-.134-1.58-.78-1.826-.869-.247-.089-.427-.134-.607.135-.18.267-.695.869-.851 1.047-.158.178-.315.2-.581.067-.266-.134-1.127-.415-2.147-1.325-.79-.705-1.325-1.576-1.48-1.844-.155-.267-.016-.41.118-.543.12-.12.266-.31.4-.467.135-.156.18-.267.27-.446.09-.178.045-.334-.022-.468-.067-.134-.607-1.47-.83-2.006-.217-.523-.456-.453-.623-.461-.16-.008-.343-.01-.526-.01-.18 0-.476.068-.724.34-.248.271-.947.925-.947 2.257 0 1.332.968 2.616 1.103 2.795.135.178 1.905 2.91 4.615 4.08.644.278 1.147.444 1.54.568.647.206 1.238.177 1.704.108.52-.077 1.58-.646 1.803-1.27.223-.623.223-1.157.157-1.27-.067-.111-.247-.178-.513-.312z" />
      </svg>

      {/* Tooltip on hover */}
      <span className="absolute right-20 bg-slate-900 text-white text-sm font-medium py-2 px-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none border border-slate-700">
        Tire suas dúvidas
      </span>
    </a>
  );
};
