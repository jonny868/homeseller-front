import "../styles/companyPage.css"
import { useContext, useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router"
import api from "../api/api"
import { UserContext } from "../api/userContext"
import { useHandleErr } from "../api/useHandleErr"
import Header from "../components/header"
import SliderColum from "../components/sliderColum"
import { loadOut } from "../components/loadScreen"
import { Footer } from "../components/footer"

import moment from "moment"

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import img1 from "../images/profile-icon.jpg"
import TextareaAutosize from "react-textarea-autosize"

/// Componente para mostrar cada publicacion perteneciente a la empresa
const ItemDisplay = ({ item, posts, index, setPosts }) => {
    /// Se obtiene el hook para mostrar los errores
    const { handleError } = useHandleErr()

    /// Se extraen los valores del UserContext
    const { setFade, setLoad, setMsg } = useContext(UserContext)

    /// UseHistory permite hacer un "push" a la navegacion y cambiar de pagina sin hacer click en un <Link> (componente de react router)
    /// Basicamente, nos permite cambiar las paginas cuando queramos
    const history = useHistory()

    /// Al hacer click redirige hacia la publicacion
    const click = () => {
        setLoad(true)
        loadOut(setFade, setLoad, history, `/itemPage/${item.id}`)
    }

    ///Aun en desarrollo
    const clickEdit = () => {
        setLoad(true)
        loadOut(setFade, setLoad, history, `/itemCreate/${item.id}`)
    }

    /// Borrar una publicacion de la BD y de la empresa
    const clickDelete = async () => {
        /// Iniciar la pantalla de carga
        setLoad(true)
        const res = await api.deleteItem(item)
        if (res.status === 200) {
            ///Se borra el posts en su respectivo indice y luego actualiza el estado, copiandolo de regreso
            posts.splice(index, 1)
            setPosts([...posts])
            setMsg({
                text: "Se ha borrado correctamente la publicacion",
                color: "green"
            })
            /// Finaliza la pantalla de carga
            loadOut(setFade, setLoad)

        } else {
            handleError(res)
        }
    }

    return (
        <div className="_item-display" >
            {/* Muestra la imagen por su url */}
            <img className="_item-img" src={item.images[0].url} onClick={click} alt="" />
            <div className="_data">
                <div className="_title-price" onClick={click}>
                    <p className="_title"  >{item.title}</p>
                    <p className="_price">{item.price + "$"}</p>
                </div>
                <div className="_dtd">
                    <p>{item.generaldescription}</p>
                </div>
                <div className="_btns-ctn">
                    {/* <button onClick={clickEdit} >Editar</button> */}
                    <button onClick={clickDelete} >Eliminar</button>
                </div>
            </div>
        </div>
    )
}


const CompanyPage = () => {

    const { handleError } = useHandleErr()

    /// Usar el parametro proveniente de el enlace <Route path="/company/:id" >
    ///                                                                  here
    /// Se usara para buscar a la compañia y todas sus publicaciones
    const { id } = useParams()
    ///UseHistory para cambiar entre paginas
    const history = useHistory()

    ///Extraems las variables del UserContext
    const { setFade, setLoad, user, setMsg } = useContext(UserContext)
    ///Estado para habilitar la edicion de los datos
    const [edit, setEdit] = useState(false)
    /// Almacenar en una variable que tipo de display va a tener la publicacion que se va a crear
    // const [newItemType, setNewItemType] = useState(0)
    /// Estado para alternar la ventana modal en la que se selecciona el display del item a crear
    const [createItem, setCreateItem] = useState(false)
    /// Todos los datos de la compañia
    const [data, setData] = useState({
        name: "",
        id: "",
        description: "",
        email: "",
        profilepic: "",
    })
    /// Datos previos de la compañia en caso de que se cancele la edicion
    const [prevData, setPrevData] = useState({
        name: "",
        id: "",
        description: "",
        email: "",

    })
    /// Estado para almacenar todas las publicaciones de la compañia
    const [posts, setPosts] = useState([""])
    /// Estado para almacenar las citas de la compañia
    const [dates, setDates] = useState([])
    /// Estado para almacenar los datos de una cita en especifico
    const [selectedDate, setSelectedDate] = useState({
        date: "...",
        guest: "...",
        name: "...",
        owner: "...",
        phone: "...",
        topic: "...",
        postId:"",
    })


    /// Use Effect que se ejecutara al cargar el componente 
    useEffect(() => {
        /// Creamos una funcion asyncrona ¨fantasma¨
        (async () => {
            const res = await api.getUser(id)
            if (res.status === 200) {
                console.log(res.data)
                /// Si se encontro la compañia, ahora busca sus citas pendientes
                const res2 = await api.getDates(id, 2)
                if (res2.status === 200) {
                    // console.log(res)
                    // console.log(res2)
                    /// Recibimos los posts y los datos de la compañia, luego los añadimos a los respectivos estados
                    setPosts(res.data.posts)
                    setData(res.data)
                    setPrevData(res.data)
                    /// Insertar en el array de citas cada una de las publicaciones con cada una de sus citas, con sus datos completos
                    // console.log(res2.data[0].dates)
                    let aux = []
                    await res2.data.forEach(element => {
                        element.dates.forEach(date => {
                            // setDates([...dates,date])
                            aux.push(date)
                        });
                        // dates.push(element.dates)
                    });
                    setDates([...aux])
                } else {
                    handleError(res)
                }
            } else {
                handleError(res)
            }
        })()
        // eslint-disable-next-line
    }, [])

    /// Funcion para actualizar los valores provenientes de los inputs de Editar
    const handleEdit = (name, value) => setData({ ...data, [name]: value });

    /// Si se confirma la edicion, hacemos un fetch al servidor para actualizarlos
    const handleEditFetch = async () => {
        const res = await api.editData(data, user.type)
        if (res.status === 200) {
            setPrevData(data)
            setEdit(false)
            setMsg({
                text: "Datos actualizados corrrectamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    /// Una vez seleccionado y aceptado el tipo de display que tendra la nueva publicacion
    /// se enviará a la pagina que corresponda
    // const goCreateItem = () => {
    //     switch (newItemType) {
    //         case 1:
    //             loadOut(setFade, setLoad, history, "/itemCreate/new")
    //             break;
    //         case 2:
    //             loadOut(setFade, setLoad, history, "/itemPage2/new")
    //             break;
    //         case 3:
    //             loadOut(setFade, setLoad, history, "/itemPage3/new")
    //             break;
    //         default:
    //             break;
    //     }
    // }
    ///UseRef para referir el inputFile de la imagen de perfil
    const inputFile = useRef(null)

    /// Cuando se le da click al div de la imagen de perfil, simula el click en el inputFile y abre el explorador de archivos
    /// para seleccionar la imagen que se quiere subir
    const profileClick = () => {
        console.log(data)
        inputFile.current.click()
    }
    /// Cuando se seleccione la imagen, se aplica el atributo ¨OnChange¨ del input file y se dispara la siguiente funcion
    const inputFileChange = async (e) => {
        ///Se guardan los datos de el archivo
        let file = e.target.files[0];
        /// Si se guardo correctamente y no se canselo la seleccion
        if (file) {
            ///Guarda los datos en la BD y sube la imagen a cloudinary
            console.log('FILE:',file, 'data:',data)
            const res = await api.updateProfilePic(file, id)
            if (res.status === 200) {
                /// Una vez recibido los datos, copia todo el contenido de el estado ¨Data¨ , pero actualiza el url de la imagen (profilepic)
                setData({ ...data, profilepic: res.data.url })
                setMsg({
                    text: "Imagen de perfil actualizada corrrectamente",
                    color: "green"
                })
            }
        }
    }
    const returnDate = (obj) => {
        console.log(obj)
        return obj.date
    }


    return (
        <div className="companyPage">
            {/* Condicional donde, si el estado de CreateItem es true, mustra el modal para seleccionar el display que tendra la nueva publicacion */}
            {createItem ?
                <div className="blackScreen2">
                    <div className="_modal">
                        <h3
                            onClick={() => {
                                // console.log(dates.filter(returnDate))
                                console.log(dates)
                                dates.map((item) => {
                                    return console.log(item)
                                })
                            }
                            }
                        >Seleccione una fecha</h3>
                        {/* <div className="_img-ctn">
                            <div className={newItemType === 1 ? "_selected" : null} onClick={() => { setNewItemType(1) }}  >
                                <img src={Grp1} alt="" />
                                <p>Tradicional</p>
                            </div>
                            <div className={newItemType === 2 ? "_selected" : null} onClick={() => { setNewItemType(2) }} >
                                <img src={Grp2} alt="" />
                                <p>Modo cine</p>
                            </div>
                            <div className={newItemType === 3 ? "_selected" : null} onClick={() => { setNewItemType(3) }} >
                                <img src={Grp3} alt="" />
                                <p>Ventanas Modale</p>
                            </div>
                        </div> */}
                        <div className="_info-ctn">
                            <div className="_calendar-div">
                                <Calendar
                                    onChange={(e) => {
                                        const date = moment(e)
                                        const fixDate = moment(date).format("DD-MM-YYYY")

                                        let aux = dates.find(item => {
                                            if (item.date === fixDate) return item
                                        })
                                        if (aux !== undefined) setSelectedDate({ ...aux })
                                        else {
                                            setSelectedDate({
                                                date: "...",
                                                guest: "...",
                                                name: "...",
                                                owner: "...",
                                                phone: "...",
                                                topic: "...",
                                                postId:""
                                            })
                                        }
                                    }}
                                    tileClassName={({ date, view }) => {
                                        if (dates.find(x => x.date === moment(date).format("DD-MM-YYYY"))) {
                                            return 'highlight'
                                        }
                                    }}
                                />
                            </div>
                            <div className="_date-ctn">
                                <p>{selectedDate.name}</p>
                                <p>{selectedDate.date}</p>
                                <p>{selectedDate.phone}</p>
                                <p>{selectedDate.topic}</p>
                            </div>
                        </div>
                        <div className="_btn-ctn">
                            <button className="_cancel" onClick={() => { setCreateItem(false) }} >Regresar</button>
                            <button
                                className="_accept"
                                onClick={() => {
                                    setLoad(true)
                                    loadOut(setFade, setLoad, history, `/itemPage/${selectedDate.postId}`)
                                }} >Ver Publicacion</button>
                        </div>
                    </div>
                </div>
                : null}
            {/* Contenido normal */}
            <Header />
            <main className="_general-container">
                <div className="_company-info-container">
                    <div className="_img-div">
                        <div className="_black-div" onClick={profileClick} >
                            {/* Si hay una foto de perfil presentala, si no la hay, presenta la imagen de usuario predeterminada */}
                            {data.profilepic === null ?
                                <img src={img1} alt="" className="_profile-picture" />
                                : <img src={data.profilepic} alt="" className="_profile-picture" />}
                            {/* Input file fantasma al que se le hace referencia para el click  */}
                            <input type='file' id='file' name="images" ref={inputFile} style={{ display: 'none' }} onChange={(e) => { inputFileChange(e) }} />
                        </div>
                    </div>
                    <div className="_info-div">
                        {/* Condicional, si se van a editar los datos, oculta los "p" y presenta los "input" */}
                        {!edit ? (
                            <>
                                <p className="_company-name" onClick={() => {
                                    console.log(data)
                                }} >{data.name}</p>
                                <p>{data.description}</p>
                                <p className="_company-email" >{data.email}</p>
                            </>
                        ) :
                            <>
                                <input className="_input-edit" placeholder="Nombre de usuario" type="text" onChange={(e) => { handleEdit("name", e.target.value) }} value={data.name} />
                                <TextareaAutosize 
                                className="_textarea-edit" placeholder="Descripcion" type="text" onChange={(e) => { handleEdit("description", e.target.value) }} value={data.description} spellCheck={false}
                                minRows={2}
                                maxRows={3}
                                />
                                <input className="_input-edit" placeholder="Correo" type="text" onChange={(e) => { handleEdit("email", e.target.value) }} value={data.email} />
                            </>
                        }
                        {edit ? <p className="_edit" onClick={handleEditFetch} >&#9998; Realizar cambios</p>
                            : <p className="_edit" onClick={() => { setEdit(!edit) }} >&#9998; Editar datos</p>}
                        {!edit ? null : <p className="_edit-cancel" onClick={() => {
                            setData(prevData)
                            setEdit(!edit)
                        }} >&#10006; Cancelar</p>}
                    </div>
                </div>
                <div className="_content-container">
                    <div className="_left">
                        <div style={{ width: "100%", display: "flex" }} >
                            <h2 style={{ width: "50%", }} className="_subtitle" >Inmobiliarios en Venta</h2>
                            <div className="_btn-ctn" >
                                {/* Boton para el display de la ventana modal que mostrara los tipos de publicaciones q se pueden crear */}
                                <button onClick={() => {
                                    setLoad(true)
                                    loadOut(setFade, setLoad, history, "/itemCreate/new") }}  >Anadir</button>
                                <button onClick={() => { setCreateItem(true) }}  >Calendario</button>
                            </div>
                        </div>
                        {/* Condicional donde, mientras la primera publicacion no este vacia, muestra todo su contenido,
                        recorriendo el array y retornando un componente */}
                        {posts[0] !== "" ?
                            posts.map((item, index) => {
                                return <ItemDisplay item={item} key={index} setPosts={setPosts} posts={posts} index={index} />
                            }) : null}
                    </div>
                    <div className="_right">
                        <h2 className="_subtitle"  >Otras Busquedas</h2>
                        {/* Componente para una columna lateral */}
                        <SliderColum />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default CompanyPage