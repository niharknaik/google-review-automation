import React, { useState } from "react";
import { generateWhatsAppLink, generateSMSLink, generateTrackingLink } from "../services/api";
import MessagePreview from "./MessagePreview";

export default function CustomerList({
  customers,
  onDelete,
  onMarkSent,
  onEdit,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: "#ff9800",
      sent: "#2196f3",
      opened: "#4caf50",
    };
    return (
      <span className="status-badge" style={{ backgroundColor: colors[status] }}>
        {status.toUpperCase()}
      </span>
    );
  };

  const handleQuickSend = (customer, via) => {
    const trackingLink = generateTrackingLink(customer.trackingId);
    const message = `Hi ${customer.name}, thanks for visiting us! Please leave a review: ${trackingLink}`;

    let link;
    if (via === "whatsapp") {
      link = generateWhatsAppLink(customer.phone, message);
    } else {
      link = generateSMSLink(customer.phone, message);
    }

    window.open(link, "_blank");

    setTimeout(() => {
      onMarkSent(customer._id);
    }, 500);
  };

  if (customers.length === 0) {
    return (
      <div className="empty-state">
        <p>No customers yet. Add your first customer to get started!</p>
      </div>
    );
  }

  return (
    <div className="customer-list">
      <div className="list-header">
        <h2>Customers ({customers.length})</h2>
        <div className="sort-controls">
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date Added</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer) => (
              <React.Fragment key={customer._id}>
                <tr className={expandedId === customer._id ? "expanded" : ""}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{getStatusBadge(customer.status)}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn btn-small btn-info"
                      onClick={() =>
                        setExpandedId(
                          expandedId === customer._id ? null : customer._id
                        )
                      }
                    >
                      {expandedId === customer._id ? "Hide" : "Details"}
                    </button>
                    <button
                      className="btn btn-small btn-warning"
                      onClick={() => onEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${customer.name}?`)) {
                          onDelete(customer._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {expandedId === customer._id && (
                  <tr className="expanded-content">
                    <td colSpan="5">
                      <div className="expanded-details">
                        <div className="detail-section">
                          <MessagePreview customer={customer} />
                        </div>

                        <div className="quick-send-buttons">
                          <button
                            className="btn btn-whatsapp"
                            onClick={() => handleQuickSend(customer, "whatsapp")}
                          >
                            💬 Send via WhatsApp
                          </button>
                          <button
                            className="btn btn-sms"
                            onClick={() => handleQuickSend(customer, "sms")}
                          >
                            📱 Send via SMS
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={() => onMarkSent(customer._id)}
                          >
                            ✓ Mark as Sent
                          </button>
                        </div>

                        {customer.notes && (
                          <div className="notes-section">
                            <strong>Notes:</strong>
                            <p>{customer.notes}</p>
                          </div>
                        )}

                        {customer.messageSentAt && (
                          <div className="info-section">
                            <p>
                              <strong>Sent:</strong>{" "}
                              {new Date(customer.messageSentAt).toLocaleString()}
                            </p>
                          </div>
                        )}

                        {customer.linkClickedAt && (
                          <div className="info-section">
                            <p>
                              <strong>Link Clicked:</strong>{" "}
                              {new Date(customer.linkClickedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
