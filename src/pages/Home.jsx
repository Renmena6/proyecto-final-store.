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
            // URL original: NO MODIFICADA
            const response = await fetch(`http://localhost:4000/products${query}`, {
                method: "GET"
            })
            const dataProducts = await response.json()
            setProducts(dataProducts.data.reverse())
            setResponseServer({
                success: true,
                notification: "Exito al cargar los productos",
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
        if (!confirm("Esta seguro de que quieres borrar el producto")) {
            return
        }

        try {
            // URL original: NO MODIFICADA
            const response = await fetch(`http://localhost:4000/products/${idProduct}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            const dataResponse = await response.json()

            if (dataResponse.error) {
                alert(dataResponse.error)
                return
            }

            setProducts(products.filter((p) => p._id !== idProduct))

            alert(`${dataResponse.data.name} borrado con éxito.`)
        } catch (error) {
            // setResponseServer({ ...error, delete: "Error al borrar el producto." })
        }
    }

    const handleUpdateProduct = (p) => {
        setSelectedProduct(p)
    }

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const query = new URLSearchParams()

        if (filters.name) query.append("name", filters.name)
        // Corrección de bug de lógica (no de estilo): Si stock es 0, no lo envía, si es > 0 sí.
        if (filters.stock > 0) query.append("stock", filters.stock)
        if (filters.category) query.append("category", filters.category)
        if (filters.minPrice > 0) query.append("minPrice", filters.minPrice)
        if (filters.maxPrice > 0) query.append("maxPrice", filters.maxPrice)

        // Nota: Se pasa la query sin "?" inicial, ya que fetchProducts agrega el "?"
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
        fetchingProducts()
    }

    return (
        <Layout>
            <div className="page-banner">Nuestros Productos</div>

            <section className="page-section">
                <p>
                    Hola! {user && user.email} a nuestra tienda. Aquí encontrarás una amplia variedad de productos diseñados para satisfacer
                    tus necesidades. Nuestro compromiso es ofrecer calidad y confianza.
                </p>
            </section>

            {/* CAMBIO DE ESTILO 1: Añadir clase filters-section */}
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
                    />
                    <select
                        name="category"
                        onChange={handleChange}
                        value={filters.category}
                    >
                        <option value="">Todas las categorias</option> {/* Ajuste para que el valor sea vacío */}
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
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Precio máximo"
                        onChange={handleChange}
                        value={filters.maxPrice}
                    />
                    <button type="submit">Aplicar filtros</button>
                    {/* Botón de reset debe estar dentro del formulario para estilos */}
                    <button type="button" onClick={handleResetFilters}>Restablecer</button> 
                </form>
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
                        {/* CAMBIO DE ESTILO 2: Aplicar clase al nombre (título neón) */}
                        <h3 className="product-name">{p.name}</h3>
                        
                        {/* Descripción (se estiliza con CSS como atenuada) */}
                        <p>{p.description}</p> 
                        
                        {/* CAMBIO DE ESTILO 3: Aplicar clases para atenuar/resaltar */}
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
                        
                        {
                            user && <div className="cont-btn">
                                <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
                                <button onClick={() => deleteProduct(p._id)}>Borrar</button>
                            </div>
                        }
                    </div>
                ))}
            </section>
            
            {/* Mensajes de Toast */}
            {!responseServer.error.fetch && <ToastMessage color={"red"} msg={responseServer.notification} />}
            {responseServer.success && <ToastMessage color={"green"} msg={responseServer.notification} />}
            {/* {error.delete && <ToastMessage error={error.delete} color={"red"} />} */}
        </Layout>
    )
}

export default Home