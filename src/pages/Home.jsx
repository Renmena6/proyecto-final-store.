import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"

const Home = () => {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const fetchingProducts = async () => {
    try {
      const response = await fetch("https://backend-utn.onrender.com/products", {
        method: "GET"
      })
      const dataProducts = await response.json()
      setProducts(dataProducts.data.reverse())
    } catch (e) {
      console.log("Error al traer los productos :(")
    }
  }

  useEffect(() => {
    fetchingProducts()
  }, [])

  const deleteProduct = async (idProduct) => {
    if (!confirm("Esta seguro de que quieres borrar el producto")) {
      return
    }

    try {
      const response = await fetch(`https://backend-utn.onrender.com/products/${idProduct}`, {
        method: "DELETE"
      })
      const dataResponse = await response.json()

      setProducts(products.filter((p) => p._id !== idProduct))

      alert(`${dataResponse.data.name} borrado con éxito.`)
    } catch (error) {
      console.log("Error al borrar el producto.")
    }
  }

  const handleUpdateProduct = (p) => {
    setSelectedProduct(p)
  }

  return (
    <Layout>
      <div className="page-banner">Nuestros Productos</div>

      <section className="page-section">
        <p>
          Bienvenido a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
          tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
        </p>
      </section>

      {
        selectedProduct &&
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchingProducts}
        />
      }

      <section className="products-grid">
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Precio:</strong> ${p.price}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <p><strong>Categoría:</strong> {p.category}</p>
            <div className="cont-btn">
              <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
              {user && <button onClick={() => deleteProduct(p._id)}>Borrar</button>}
            </div>
          </div>
        ))}
      </section>
    </Layout>
  )
}

export default Home
