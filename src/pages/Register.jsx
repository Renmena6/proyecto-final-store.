import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
     const response = await fetch("https://proyecto-final-backend-3gw2.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()

      // cambiando el manejo de errores :)
      if (!responseData.success) {
        
        let errorMessage = "Error desconocido al registrar.";

        // Comprobamos si el error es el objeto detallado de validación del Backend (fieldErrors)
        if (responseData.error && typeof responseData.error === 'object') {
          // Extraemos el primer error específico del campo 'password' o 'email'
          // Esto evita que el alert muestre '[object Object]'
          const fieldErrors = responseData.error.password || responseData.error.email || [];
          errorMessage = fieldErrors[0] || "Validación fallida.";
        
        // Si el error es un mensaje simple de texto (ej: "El usuario ya existe...")
        } else if (responseData.error) {
          errorMessage = responseData.error;
        }
        
        alert(`❌ Error: ${errorMessage}`)
        return // Detenemos la ejecución
      }
      // 🚀 FIN DEL CÓDIGO CORREGIDO 🚀

      alert(`✅ Usuario creado con éxito: ${responseData.data._id}`)
      navigate("/login")
    } catch (error) {
      console.log("Error al registrar el usuario", error)
      alert("Error de red o servidor. Inténtalo de nuevo.")
    }
  }

  return (
    <Layout>
      <div className="center-auth">
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>Crear Cuenta</h3>
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={handleChange}
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </Layout>
  )
}

export default Register