import "../styles/userPage.css"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { UserContext } from "../api/userContext"
import api from "../api/api"
import { useHandleErr } from "../api/useHandleErr"

import Header from "../components/header"
import SliderColum from "../components/sliderColum"
import { Footer } from "../components/footer"
import SliderBar from "../components/sliderBar"
import profileIcon from "../images/profile-icon.jpg"


const UserPage = () => {
    /// Se extrae el "id" de la url para poder hacer la busqueda del usuario
    const { id } = useParams()

    const { handleError } = useHandleErr()
    /// Extraer estados del UserContext
    const { user, setMsg } = useContext(UserContext)
    /// Estado para almacenar las publicaciones de getAll()
    const [data, setData] = useState([])
    /// Estado para alternar si se estan editando o no los datos del usuario
    const [edit, setEdit] = useState(false)
    /// Estado para almacenar los datos del usuario
    const [userData, setUserData] = useState({
        name: "",
        id: "",
        description: "",
        email: ""
    })
    /// Estado para recuperar los datos del usuario en caso de querer editarlos y luego cancelar
    const [prevData, setPrevData] = useState({
        name: "",
        id: "",
        description: "",
        email: ""
    })
    /// Funcion para insertar los valores en userData
    const handleEdit = (name, value) => setUserData({ ...userData, [name]: value });

    /// Funcion para enviar los datos a la BD y actualizarlos
    const handleEditFetch = async () => {
        const res = await api.editData(userData, user.type)
        if (res.status === 200) {
            setEdit(false)
            setPrevData(userData)
            setMsg({
                text: "Datos actualizados corrrectamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    /// useEffect al cargar el componente la primera vez
    useEffect(() => {
        (async () => {
            /// Realiza una busqueda del usuario por su ID
            const res = await api.getUser(id)
            if (res.status === 200) {
                /// Guardamos los datos del usuario en el estado correspondiente
                setUserData(res.data)
                setPrevData(res.data)
                /// Si todo sale bien , busca todas las publicaciones para mostrarlas en SliderColum
                const res2 = await api.getAll()
                if (res2.status === 200) {
                    // Comprobar que el status === 200 y luego actualizar el estado con los datos
                    setData(res2.data)
                } else {
                    setMsg({
                        text: "No se ha podido realizar la busqueda",
                        color: "red"
                    })
                }
            } else {
                handleError(res)
            }
        })()
        // eslint-disable-next-line
    }, [])
    return (
        <>
            <div className="userPage">
                <Header />
                <main className="_general-container">
                    <div className="_left-content">
                        <div className="_user-info-container">
                            <div className="_img-div">
                                <img src={profileIcon} alt="" className="_profile-picture" />
                            </div>
                            <div className="_info-div">
                                {/* Si no se esta editando, muestra el nombre,descripcion (que se la pienso quitar
                                    porque nada hace un usuario con descripcion), y el email del usuario */}
                                {!edit ? (
                                    <>
                                        <p style={{ fontSize: "1.4em" }} >{userData.name}</p>
                                        <p>{userData.description}</p>
                                        <p>{userData.email}</p>
                                    </>
                                ) :/// Caso que se este editanto, en vez de ser <p> son inputs para insertar los valores
                                    <>
                                        <input className="_input-edit" placeholder="Nombre de usuario" type="text" onChange={(e) => { handleEdit("name", e.target.value) }} value={userData.name} />
                                        <input className="_input-edit" placeholder="Correo" type="text" onChange={(e) => { handleEdit("email", e.target.value) }} value={userData.email} />
                                    </>
                                }
                                {/* Alterna entre 2 botones para comenzara editar los datos o para realizarlos */}
                                {edit ? <p className="_edit" onClick={handleEditFetch} >&#9998; Realizar cambios</p>
                                    : <p className="_edit" onClick={() => { setEdit(!edit) }} >&#9998; Editar datos</p>}
                                {/* Alterna entre mostrar o no el boton para cancelar la edicion de datos */}
                                {edit ? <p className="_edit-cancel" onClick={() => {
                                    setUserData(prevData)
                                    setEdit(!edit)
                                }} >&#10006; Cancelar</p> : null}
                            </div>
                        </div>
                        <h2 style={{ color: "#000" }}  >Otras publicaciones</h2>
                        {/* Sliders sin motivo aun */}
                        <SliderBar data={data} SPV={4} />
                        {/* <SliderBar data={data} SPV={4} /> */}
                    </div>
                    <aside className="_right-content">
                        <h2 className="_subtitle" >Busquedas Relacionadas</h2>
                        {/* SliderColum sin motivo aun */}
                        <SliderColum />
                    </aside>
                </main>
            </div>
            <Footer />
        </>
    )
}

export default UserPage