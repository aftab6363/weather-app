import React, { useState } from "react";
import "../styles/contact.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add API call or email service integration
    console.log("Form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Me</h2>
          <p>Feel free to reach out for collaborations or inquiries!</p>
          <div className="info-item">
            <FaPhoneAlt />
            <span>+92 313 7783 183</span>
          </div>
          <div className="info-item">
            <FaEnvelope />
            <span>uzair8752@email.com</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt />
            <span>Gujrat, Pakistan</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {submitted && <div className="success-message">Message Sent Successfully!</div>}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
