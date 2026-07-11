/** Site-level contact config. Update the WhatsApp number to the SBF/KOBIS secretariat line. */
export const SITE = {
  // Placeholder — replace with the real secretariat number in international format (no +, no spaces).
  whatsappNumber: '601112223333',
  whatsappMessage: 'Hi, I have a question about the SBF BizFund2 assessment portal.',
};

export function whatsappLink(): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
}
