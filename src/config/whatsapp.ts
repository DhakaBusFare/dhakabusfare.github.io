export const WHATSAPP_CONFIG = {
  phoneNumber: '8801581741680', // Replace with your official WhatsApp Business phone number (with country code, no + or spaces)
  businessUsername: 'DhakaBusFare Support',
  defaultMessage: 'Hello DhakaBusFare! I have an inquiry regarding bus routes & fares.',
};

/**
 * Generate a WhatsApp Click-to-Chat direct messaging link.
 */
export function getWhatsAppChatUrl(message?: string): string {
  const text = encodeURIComponent(message || WHATSAPP_CONFIG.defaultMessage);
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${text}`;
}

export interface CommunityUpdateData {
  busLine: string;
  fromStation: string;
  toDestination: string;
  updatedFare: number | string;
  notes?: string;
}

/**
 * Generate a WhatsApp direct messaging URL pre-formatted with community update details.
 */
export function getCommunityUpdateWhatsAppUrl(data: CommunityUpdateData): string {
  const message = `🚌 *New Bus Fare Community Update*
----------------------------------------
• *Bus Line*: ${data.busLine}
• *Route*: ${data.fromStation} ➔ ${data.toDestination}
• *Updated Fare*: ৳${data.updatedFare}
${data.notes ? `• *Notes*: ${data.notes}\n` : ''}
----------------------------------------
Please verify and update in DhakaBusFare.`;

  return getWhatsAppChatUrl(message);
}

