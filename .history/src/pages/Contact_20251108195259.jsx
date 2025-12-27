import React, { useState } from "react";
import "../styles/contact.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-wrapper">
      {/* Header */}
      <div className="contact-header fade-in">
        <h1>Contact Us</h1>
        <p>We are here to assist you. Get in touch with us anytime!</p>
      </div>

      {/* Contact Cards */}
      <div className="contact-cards fade-in-delay">
        <div className="contact-card">
          <FaPhoneAlt className="contact-icon" />
          <h3>Phone</h3>
          <p>+92 3404811692</p>
          <p>+92 3051633767</p>
          <p>+92 3478967506</p>  
        </div>

        <div className="contact-card">
          <FaEnvelope className="contact-icon" />
          <h3>Email</h3>
          <p>support@smartweatherapp.com</p>
        </div>

        <div className="contact-card">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Address</h3>
          <p>Lahore, Pakistan</p>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-box fade-in-delay2">
        <div className="input-group">
          <label>Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label>Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows="5"
            required
          />
        </div>

        <button className="send-btn" type="submit">
          Send Message
        </button>
      </form>

      {/* Social Icons */}
      <div className="social-links fade-in-delay3">
        <a href="#"><FaFacebook /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaTwitter /></a>
      </div>

      {/* Google Map */}
      <div className="map-container fade-in-delay4">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13609.523891390953!2d74.338757!3d31.520369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b6c3fdbb7d9%3A0xc0b0b3a8e8f0f5b4!2sLahore!5e0!3m2!1sen!2s!4v1636707033334!5m2!1sen!2s"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default Contact;
