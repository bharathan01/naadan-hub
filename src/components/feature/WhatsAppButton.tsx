export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <i className="ri-whatsapp-line text-3xl text-white"></i>
    </a>
  );
}