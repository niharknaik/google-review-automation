import React, { useState } from "react";

export default function CustomerForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    googleReviewLink: initialData?.googleReviewLink || "",
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.googleReviewLink.trim()) newErrors.googleReviewLink = "Google review link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        phone: "",
        googleReviewLink: "",
        notes: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>{initialData ? "Edit Customer" : "Add New Customer"}</h2>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Customer name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 234 567 8900"
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label>Google Review Link *</label>
        <input
          type="url"
          name="googleReviewLink"
          value={formData.googleReviewLink}
          onChange={handleChange}
          placeholder="https://www.google.com/maps/..."
        />
        {errors.googleReviewLink && <span className="error">{errors.googleReviewLink}</span>}
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional notes about the customer"
          rows="3"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {initialData ? "Update Customer" : "Add Customer"}
      </button>
    </form>
  );
}
