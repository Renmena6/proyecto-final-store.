import { useState } from "react";
import Layout from "../components/Layout";

export default function Contact() {
  const [form, setForm] = useState({
    subject: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://proyecto-final-backend-3gw2.onrender.com/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const dataResponse = await response.json()

      console.log(dataResponse)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Layout>
      <h1>Contacto</h1>

      <form className="contact-form" onSubmit={handleSubmit}>


        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Asunto</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Mensaje</label>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </Layout>
  );
}
