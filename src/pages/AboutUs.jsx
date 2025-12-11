import Layout from "../components/Layout"

const AboutUs = () => {
    return (
        <Layout>
            
            <div className="page-banner">Acerca del Proyecto</div>

            <section className="page-section">
                
                <h2>¿Qué es esta página?</h2>
                <p>
                    Esta aplicación funciona como una demostración técnica integral Full Stack. Consiste en un Front-end desarrollado en React que consume una API REST, tipada en TypeScript y con arquitectura MVC, desplegada en Render.com. Su principal objetivo es validar la arquitectura y la seguridad.
                </p>


                <h2>Objetivos Técnicos Principales</h2>
                

                <ul>
                    <li>Demostrar la implementación completa del patrón Arquitectónico MVC en el Backend.</li>
                    
                    <li>Garantizar el tipado estricto en TypeScript para toda la API REST.</li>
                    
                    <li>Implementar un sistema de Autenticación basado en tokens JWT.</li>
                    
                    <li>Asegurar las rutas de escritura (Creación, Actualización y Eliminación) mediante un middleware de Autorización (Owner).</li>
                    
                    <li>Implementar Rate Limiting en las rutas de autenticación y Validación de Inputs consistente.</li>
                    
                    <li>Optimizar las consultas a la base de datos utilizando Query Params para filtrado y búsqueda.</li>
                </ul>
            
            </section>
        
        </Layout>
    )
}

export default AboutUs