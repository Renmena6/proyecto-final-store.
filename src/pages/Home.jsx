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
    
    // URL BASE DE RENDER
    const RENDER_URL = 'https://proyecto-final-backend-3gw2.onrender.com';

    const fetchingProducts = async (query = "") => {
        setResponseServer(initialErrorState)
        try {
            // URL DE RENDER (Asegurando que la query tenga el '?' si no es la URL base)
            const url = `${RENDER_URL}/products${query ? '?' + query : ''}`;
            
            const response = await fetch(url, {
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
            // URL DE RENDER
            const response = await fetch(`${RENDER_URL}/products/${idProduct}`, {
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
        // Lógica mejorada: solo añade el filtro si tiene un valor significativo
        if (filters.stock > 0) query.append("stock", filters.stock) 
        if (filters.category) query.append("category", filters.category)
        if (filters.minPrice > 0) query.append("minPrice", filters.minPrice)
        if (filters.maxPrice > 0) query.append("maxPrice", filters.maxPrice)

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
        fetchingProducts() // Llama a fetch sin query para restablecer la lista
    }

    return (
        <Layout>
            <div className="page-banner">Nuestros Productos</div>

            <section className="page-section">
                <p>
                    Bienvenido {user && user.email} a mi página! Aquí encontrarás una amplia variedad de productos publicados por usuarios. Registrate, inicia sesión y agrega tus productos.
                </p>
            </section>

            {/* AÑADIR CLASE PARA EL ESTILO DE FILTROS */}
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
                        <option value="">Todas las categorias</option>
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
                    {/* Cambié Cancelar por Restablecer y le puse type="button" */}
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
                        
                        {/* CAMBIO DE ESTILO 1: NOMBRE DEL PRODUCTO (NEÓN) */}
                        <h3 className="product-name">{p.name}</h3>
                        
                        {/* Descripción (dejar como p normal) */}
                        <p>{p.description}</p>
                        
                        {/* CAMBIO DE ESTILO 2: PRECIO (ETIQUETA ATENUADA / VALOR RESALTADO) */}
                        <p>
                            <span className="product-label">Precio:</span> 
                            <span className="product-value">${p.price}</span>
                        </p>
                        
                        {/* CAMBIO DE ESTILO 3: STOCK (ETIQUETA ATENUADA / VALOR RESALTADO) */}
                        <p>
                            <span className="product-label">Stock:</span>
                            <span className="product-value">{p.stock}</span>
                        </p>
                        
                        {/* CAMBIO DE ESTILO 4: CATEGORÍA (ETIQUETA ATENUADA / VALOR RESALTADO) */}
                        <p>
                            <span className="product-label">Categoría:</span>
                            <span className="product-value">{p.category}</span>
                        </p>
                        
                        {/* IMPLEMENTACIÓN DE LA RESTRICCIÓN DE OWNER: Solo si hay usuario Y el producto le pertenece */}
                        {
                            user && p.owner === user.id && (
                                <div className="cont-btn">
                                    <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
                                    <button onClick={() => deleteProduct(p._id)}>Borrar</button>
                                </div>
                            )
                        }
                    </div>
                ))}
            </section>
            
            {!responseServer.error.fetch && <ToastMessage color={"red"} msg={responseServer.notification} />}
            {responseServer.success && <ToastMessage color={"green"} msg={responseServer.notification} />}
        </Layout>
    )
}

export default Home