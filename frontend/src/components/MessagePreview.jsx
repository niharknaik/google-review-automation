import React from "react";
import { generateWhatsAppLink, generateSMSLink, generateTrackingLink } from "../services/api";

export default function MessagePreview({ customer }) {
  const trackingLink = generateTrackingLink(customer.trackingId);
  const message = `Hi ${customer.name}, thanks for visiting us! Please leave a review: ${trackingLink}`;

  const whatsappLink = generateWhatsAppLink(customer.phone, message);
  const smsLink = generateSMSLink(customer.phone, message);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="message-preview">
      <h3>Message Preview</h3>

      <div className="preview-message">
        <p>{message}</p>
        <button
          className="btn btn-small"
          onClick={() => copyToClipboard(message)}
        >
          Copy Message
        </button>
      </div>

      <div className="tracking-link">
        <strong>Tracking Link:</strong>
        <code>{trackingLink}</code>
        <button
          className="btn btn-small"
          onClick={() => copyToClipboard(trackingLink)}
        >
          Copy Link
        </button>
      </div>

      <div className="action-buttons">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
        >
          💬 Send via WhatsApp
        </a>

        <a
          href={smsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sms"
        >
          📱 Send via SMS
        </a>
      </div>
    </div>
  );
}
