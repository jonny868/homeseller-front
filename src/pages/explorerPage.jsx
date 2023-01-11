import "../styles/explorePage.css"
import "../styles/sliderBar.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import api from "../api/api"
import { UserContext } from "../api/userContext"
import Header from "../components/header"
import Card from "../components/card"
import { Footer } from "../components/footer"


/// Componente filtro
/// Su funcion es la de tomar el array de datos, y modificarlo segun el filtro correspondiente,
/// esto lo manejamos a traves de su nombre
const Filter = ({ name, data, setSort, sort, setCopy }) => {

    /// Funcion que se ejecuta al dar click
    const click = () => {
        /// Copia el array de el resultado de la busqueda
        const arr = [...data]

        /// Si el nombre de el filtro y de el estado "sort" son iguales, significa que el usuario
        /// esta dando click en el filtro por segunda vez, por ende, vaciamos el valor de "sort"
        if (name === sort) {
            setSort("")
        } else {
            /// Si el estado "sort" no es igual al nombre actual de el filtro cliqueado
            /// Ejecuta las funciones de filtro segun el nombre
            if (name === "Precio") price(arr)
            if (name === "Nombre") title(arr)
            if (name === "Mas visitados") views(arr)
            setSort(name)
        }
        // console.log(arr)
        setCopy(arr)
    }
    ///Ordena mediante precio
    const price = (arr) => {
        arr.sort((a, b) => (a.price < b.price) ? 1 : -1)
    }
    ///Ordena mediante titulo
    const title = (arr) => {
        arr.sort((a, b) => (a.title > b.title) ? 1 : -1)
    }
    ///Ordena mediante visitas
    const views = (arr) => {
        arr.sort((a, b) => (a.views > b.views) ? 1 : -1)
    }

    const style = { text: { color: "#191919" } }

    return (
        <div className="filter" onClick={click}  >
            <div className="_circle" >
                {sort === name ? <div className="_dot" ></div> : null}
            </div>
            <p className="name" style={sort === name ? style.text : null} >{name}</p>
        </div>
    )
}

const ExplorerPage = () => {

    /// Propiedad text extraida de el url <Route path="/explore/:text" > <--- App.js
    const { text } = useParams()

    /// UserContext
    const { setMsg } = useContext(UserContext)

    /// Estado para almacenar el nombre del filtro que esta activo en el momento
    const [sort, setSort] = useState("")

    /// Estado para copiar los datos de la busqueda
    const [copyData, setCopyData] = useState([])
    /// Estado para almacenar los datos originales de la busqueda, en caso de que se quiten los filtros
    const [cardData, setCardData] = useState([])

    /// Cada vez que el parametro "text" de la url cambie, realiza una peticion para buscar publicaciones
    /// con un titulo o descripcion general que hagan match con el texto
    useEffect(() => {

        (async () => {
            let res
            /// Si el text esta vacio, consigue todas las publicaciones
            if (text === " ") {
                res = await api.getAll()
                console.log(res)
            /// Caso contrario, busca publicaciones segun el texto
            } else {
                res = await api.search(text)
                console.log(res)
            }
            /// Si la peticion fue exitosa, guarda los datos
            if (res.status === 200) {
                console.log(res)
                setSort("")
                setCardData(res.data)
                setCopyData(res.data)
            /// Caso contrario muestra el error
            } else {
                console.log(res.result);
                setMsg({
                    text: "No se ha podido realizar la busqueda",
                    color: "red"
                })
            }
        })()
        // eslint-disable-next-line
    }, [text])


    return (
        <>
            <div className="explorePage" >
                <Header />
                <div className="_contentContainer">
                    <aside className="_filter">
                        <h2 >Filtros</h2>
                        {/* Filtros */}
                        <Filter name="Recientes" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                        <Filter name="Precio" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                        <Filter name="Mas visitados" data={cardData} setSort={setSort} sort={sort} setCopy={setCopyData} />
                    </aside>
                    <div className="_result">
                        {/* Todos los datos seran presentados aqui, recorre el array y devuelve un componente de Card */}
                        {copyData.map((value, index) => {
                            return <Card key={index} item={value} />
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ExplorerPage