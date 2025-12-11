import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import { CATEGORIES } from "../constants/categories.js"
import { ToastMessage } from "../components/ToastMessage.jsx"


const Home = () => {
    const initialErrorState = {
        success: null,
        notification: null,
        error: {
            fetch: null,
            delete: null
        }
    }

    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [filters, setFilters] = useState({
        name: "",
        stock: 0,
        category: "",
        minPrice: 0,
        maxPrice: 0
    })
    const [responseServer, setResponseServer] = useState(initialErrorState)

    // { id: '6925fe9645e9b029b62ac797', iat: 1764101665, exp: 1764105265 }
    const { user, token } = useAuth()

    const fetchingProducts = async (query = "") => {
        setResponseServer(initialErrorState)
        try {
            // NOTA: Si ya desplegaste el Backend en Render, cambia 'localhost' por la URL de Render aquí
            const response = await fetch(`http://localhost:4000/products?${query}`, {
                method: "GET"
            })
            const dataProducts = await response.json()
            setProducts(dataProducts.data.reverse())
            setResponseServer({
                success: true,
                notification: "Éxito al cargar los productos",
                error: {
                    ...responseServer.error,
                    fetch: true
                }
            })
        } catch (e) {
            setResponseServer({
                success: false,
                notification: "Error al traer los datos",
                error: {
                    ...responseServer.error,
                    fetch: false
                }
            })
        }
    }

    useEffect(() => {
        fetchingProducts()
    }, [])

    const deleteProduct = async (idProduct) => {
        if (!confirm("¿Está seguro de que quiere borrar el producto? Esta acción es irreversible.")) {
            return
        }

        try {
            const response = await fetch(`http://localhost:4000/products/${idProduct}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const dataResponse = await response.json()

            if (dataResponse.error) {
                alert(dataResponse.error) // Muestra el error de autorización del backend (ej: 403 Forbidden)
                return
            }

            setProducts(products.filter((p) => p._id !== idProduct))

            alert(`${dataResponse.data.name} borrado con éxito.`)
        } catch (error) {
            console.error("Error en la petición DELETE:", error)
            alert("Error al intentar borrar el producto. Revisa la conexión o tu token.")
        }
    }

    const handleUpdateProduct = (p) => {
        setSelectedProduct(p)
    }

    const handleChange = (e) => {
        // Corrección: Asegura que los campos numéricos se guarden como números si tienen valor
        const value = e.target.type === 'number' && e.target.value !== ''
            ? Number(e.target.value)
            : e.target.value;

        setFilters({
            ...filters,
            [e.target.name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const query = new URLSearchParams()

        // Ajuste: solo añade el parámetro a la URL si el valor no es falsy (como 0 para strings o 0 para numbers que no son stock)
        if (filters.name) query.append("name", filters.name)
        if (filters.stock > 0) query.append("stock", filters.stock) // Solo si stock es mayor a 0
        if (filters.category) query.append("category", filters.category)
        if (filters.minPrice > 0) query.append("minPrice", filters.minPrice) // Solo si minPrice es mayor a 0
        if (filters.maxPrice > 0) query.append("maxPrice", filters.maxPrice) // Solo si maxPrice es mayor a 0
        
        // Llamada a la función con el string de query
        fetchingProducts(query.toString())
    }

    const handleResetFilters = () => {
        setFilters({
            name: "",
            stock: 0,
            category: "",
            minPrice: 0,
            maxPrice: 0
        })
        fetchingProducts() // Vuelve a cargar sin filtros
    }

    return (
        <Layout>
            <div className="page-banner">Nuestros Productos</div>

            <section className="page-section">
                <p>
                    Hola! **{user ? user.email : "Visitante"}** a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
                    tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
                </p>
            </section>

            {/* APLICACIÓN DE LA CLASE 'filters-section' AQUÍ */}
            <section className="filters-section">
                <form className="filters-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Buscar por nombre"
                        onChange={handleChange}
                        value={filters.name}
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Ingrese el stock"
                        onChange={handleChange}
                        value={filters.stock}
                        min="0"
                    />
                    <select
                        name="category"
                        onChange={handleChange}
                        value={filters.category}
                    >
                        {/* El valor de esta opción debe ser vacío para que el backend la ignore si está seleccionada */}
                        <option value="">Todas las categorías</option>
                        {
                            CATEGORIES.map((category) =>
                                <option key={category.id}
                                    value={category.value}>{category.content}
                                </option>
                            )
                        }
                    </select>
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Precio mínimo"
                        onChange={handleChange}
                        value={filters.minPrice}
                        min="0"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Precio máximo"
                        onChange={handleChange}
                        value={filters.maxPrice}
                        min="0"
                    />
                    <button type="submit">Aplicar filtros</button>
                    <button type="button" onClick={handleResetFilters}>Restablecer</button>
                </form>
            </section>

            {
                selectedProduct &&
                <UpdateProduct
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onUpdate={() => fetchingProducts()} // Recarga los productos después de actualizar
                />
            }

            <section className="products-grid">
                {products.map((p) => (
                    <div key={p._id} className="product-card">
                        {/* APLICACIÓN DE LAS CLASES PARA EL ESTILO NEÓN */}
                        <h3 className="product-name">{p.name}</h3> {/* Título Neón */}

                        <p>{p.description}</p>
                        
                        <p>
                            <span className="product-label">Precio:</span> 
                            <span className="product-value">${p.price}</span>
                        </p>
                        
                        <p>
                            <span className="product-label">Stock:</span>
                            <span className="product-value">{p.stock}</span>
                        </p>
                        
                        <p>
                            <span className="product-label">Categoría:</span>
                            <span className="product-value">{p.category}</span>
                        </p>
                        
                        {/* Los botones solo se muestran si el usuario está logueado */}
                        {
                            user && p.owner === user.id && ( /* VERIFICACIÓN DE PROPIEDAD ADICIONAL */
                                <div className="cont-btn">
                                    <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
                                    <button onClick={() => deleteProduct(p._id)}>Borrar</button>
                                </div>
                            )
                        }
                         {/* Mensaje de propietario (Opcional, si quieres resaltar quién creó el producto) */}
                         {
                            user && p.owner !== user.id && (
                                <p className="product-label" style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                                    (Propiedad de otro usuario)
                                </p>
                            )
                        }
                    </div>
                ))}
            </section>
            
            {/* Mensajes de Toast */}
            {responseServer.notification && (
                <ToastMessage 
                    color={responseServer.success ? "" : "red"} 
                    msg={responseServer.notification} 
                />
            )}
            
        </Layout>
    )
}

export default Home