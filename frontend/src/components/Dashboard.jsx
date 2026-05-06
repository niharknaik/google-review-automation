import React, { useState, useEffect } from "react";
import { customerService } from "../services/api";
import CustomerForm from "./CustomerForm";
import CustomerList from "./CustomerList";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0, opened: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customerService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const handleAddCustomer = async (formData) => {
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer._id, formData);
        setEditingCustomer(null);
      } else {
        await customerService.createCustomer(formData);
      }
      setShowForm(false);
      fetchCustomers();
      fetchStats();
    } catch (err) {
      setError("Failed to save customer");
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);
      fetchCustomers();
      fetchStats();
    } catch (err) {
      setError("Failed to delete customer");
      console.error(err);
    }
  };

  const handleMarkSent = async (id) => {
    try {
      await customerService.markAsSent(id);
      fetchCustomers();
      fetchStats();
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📧 Google Review Automation</h1>
        <p>Send review requests via WhatsApp and SMS</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Customers</p>
        </div>
        <div className="stat-card pending">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card sent">
          <h3>{stats.sent}</h3>
          <p>Sent</p>
        </div>
        <div className="stat-card opened">
          <h3>{stats.opened}</h3>
          <p>Opened</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="main-content">
        <div className="form-section">
          {showForm ? (
            <>
              <CustomerForm
                onSubmit={handleAddCustomer}
                initialData={editingCustomer}
              />
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add New Customer
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading customers...</div>
        ) : (
          <CustomerList
            customers={customers}
            onDelete={handleDeleteCustomer}
            onMarkSent={handleMarkSent}
            onEdit={handleEditCustomer}
          />
        )}
      </div>
    </div>
  );
}
