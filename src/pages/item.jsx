import "../styles/itemPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContext } from "react/cjs/react.development";
import api from "../api/api";
import { useHandleErr } from '../api/useHandleErr'
import { UserContext } from "../api/userContext";

import { Footer } from "../components/footer";
import Header from "../components/header"
import SliderColum from "../components/sliderColum";
import TextareaAutosize from "react-textarea-autosize";
import Banner from "../images/Banner1.png"
import pay from "../images/pay.png"

import moment from "moment"

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

//////  COMMENT  ////////////////////////////////////////////////////////
const Comment = ({ item, index, dataContainer, setDataContainer }) => {
    /// El id extraido del url para buscar al dueño de la publicacion
    const { id } = useParams()
    /// Extrer los datos del UserContext , "user" : para saber la id del usuario logeado que va a comentar
    /// y setMsg para los errores
    const { user, setMsg } = useContext(UserContext)
    /// Hook para los errores
    const { handleError } = useHandleErr()
    /// Estado para manejar el input en caso de haber
    const [input, setInput] = useState("")
    /// Estado para guardar quien esta escribiendo o escribió el comentario
    const [username, setUsername] = useState("")

    /// Cuando cargues el comentario haz una peticion buscando al usuario por ID
    /// y guarda sus datos 
    useEffect(() => {
        (async () => {
            const res = await api.getUser(item.user_id)
            console.log(res)
            if (res.status === 200) {
                setUsername(res.data.name)
            } else {
                // handleError(res)
            }
        })()
        return 0
        // eslint-disable-next-line
    }, [])

    /// Funcion para responder a un comentario
    const replyClick = async () => {

        /// Copiamos el contenido de los comentarios en un array nuevo
        const commentData = [...dataContainer.comments]
        /* Los comentarios estan presentados en orden inverso, mas nuevos arriba y mas viejos abajo
         Por ende, los index estan invertidos, pero para eso se usa lo siguiente
         [la cantidad de comentarios que hay] - [1] - [el index de el comentario]
         esto nos dara la posicion original de el comentario y podremos modificarlo y añadirle la respuesta
        */
        const position = dataContainer.comments.length - 1 - index

        /// Al array que copiamos, le añadimos el valor de el input y la fecha/hora actual
        commentData[position].reply = input
        commentData[position].reply_date = Date.now()
        /// Hacemos una peticion para enviar los datos y si todo sale bien, añadimos el contenedor de comentario que 
        /// copiamos en el estado de ¨dataContainer¨, una vez que el comentario tiene respuesta, no se puede responder mas
        const res = await api.sendComment(commentData, id)
        if (res.status === 200) {
            setMsg({
                text: "Comentario publicado satisfactoriamente",
                color: "green"
            })
            setDataContainer({ ...dataContainer, comments: commentData })
        } else {
            handleError(res)
        }
    }

    return (
        <>
            {/* Presenta el nombre de usuario y el texto de el comentario */}
            <div className="comment-display" >
                <p className="_date" >{username}</p>
                <p className="_comment">{item.text}</p>
            </div>
            {/* Si el comentario no tiene respuesta, verifica si el dueño de la publicacion
            es el mismo usuario que esta logeado actualmente */}
            {item.reply === "" ?
                ///////////// Verificacion del dueño de la publicacion y usuario logeado
                /// Si el usuario logeado es el mismo que el dueño, entonces puede responder los comentarios
                dataContainer.owner === user.id ?
                    <div className="_reply-textarea-ctn">
                        <button onClick={replyClick} >Enviar</button>
                        {/* Componente Textarea pero con tamaño que se ajusta automaticamente */}
                        <TextareaAutosize
                            minRows={1}
                            maxRows={3}
                            placeholder={"Escribe aqui..."}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                // setDataContainer({...dataContainer,  })
                            }}
                            className="_comment-textarea"
                        />
                    </div>
                    : null
                ///////////// En caso de existir una respuesta, presentala
                : <div className="reply-display" >
                    <p className="_date" > </p>
                    <p className="_comment">{item.reply}</p>
                </div>}
        </>
    )
}


//////   ITEM PAGE ////////////////////////////////////////////////////////
const ItemPage = () => {

    /// El id extraido del url para buscar los datos de la publicacion
    const { id } = useParams()
    /// Extrer los datos del UserContext , "user" : para saber que usuario esta loggeado y si es el dueño del post o una compaía
    /// y setMsg para los errores
    const { user, setMsg } = useContext(UserContext)
    /// Hook para los errores
    const { handleError } = useHandleErr()

    ////COMPONENTES INTERNOS ////////////////////////////////////////////////////////////////////////////////////////////////
    //////  MINI IMAGE ////////////////////////////////////////////////////////
    /// Estas son las mini imagenes que ves en la parte izquierda de la pantalla
    const MiniImage = ({ url, index }) => {
        /// Al hacer click, setShow te mostrara la imagen clickeada en el contenedor grande
        /// y seleccionará su index para poder buscar entre el array de los datos y mostrar sus caracteristicas detalladas
        /// dataContainer.images[imgIndex].detaildescription
        const click = async () => {
            setShow(url)
            setImgIndex(index)
        }
        return (
            <img src={url} alt="" className="mini-image" onClick={click} />
        )
    }


    /////// ESTADOS ////////////////////////////////////////////////////////////////////
    /// Estado para la informacion general de la publicacion
    const [dataContainer, setDataContainer] = useState({
        title: "a",
        price: "b",
        generaldescription: "",
        type: 1,
        comments: [],
        owner: "",
        images: [{
            title: "cargando...",
            detaildescription: ["cargando..."],
            url: ""
        }],
        dates: [],
    })
    /// Estado para el index de la imagen que se esta mostrando y 
    /// asi buscar y presentar la descripcion detallada de la imagen
    /// dataContainer.images[imgIndex].detaildescription
    const [imgIndex, setImgIndex] = useState(0)
    /// Estado para el index de la imagen que se esta mostrando en el contenedor grande
    const [show, setShow] = useState(dataContainer.images[imgIndex].url)

    /// Si es un usuario normal, puede comentar la publicacion
    const [commentInput, setCommentInput] = useState("")

    /// Estado para el modal
    const [modal, setModal] = useState(false)

    /// Estado para saber si la persona ya aparto una cita o no
    const [enableDate, setEnableDate] = useState(true)
    /// Estado para seleccionar dias en el calendario
    const [dayClick, setDayClick] = useState(null)
    const past = {
        before: new Date(2021, 11, 16),
    }
    const pastStyle = `.DayPicker-Day--past{
        background-color: orange;
        color: white;
      }`;
    /// Estado para los datos de la cita
    const [dateInputs, setDateInputs] = useState({
        name: "",
        date: "Seleccione una fecha",
        topic: "",
        phone: "",
        guest: user.id,
        postId: id,
    })
    const handleDayInputs = (name, value) => { setDateInputs({ ...dateInputs, [name]: value }) }
    const setupDate = async () => {
        const res = await api.setDate(dataContainer.dates, id)
        if(res.status === 200){
            setEnableDate(false)
            setModal(false)
            setMsg({
                color:"green",
                text:"Cita reservada exitosamente"
            })
        }else{
            handleError(res)
        }
        console.log(res)
    }
    const mark = [
        '04-11-2021',
        '03-11-2021',
        '05-11-2021'
    ]

    // Una vez cargado el componente, busca los datos de la publicacion por el id de la url
    useEffect(() => {
        // console.log(dataContainer)
        (async () => {
            const res = await api.getItem(id)
            /// Si se consiguieron los datos, almacenalos en sus respectivos estados
            if (res.status === 200) {
                console.log('asdasda:',res.data)
                setDataContainer(res.data)
                /// Y presenta la primera imagen en el contenedor grande
                setShow(res.data.images[0].url)
                console.log(res);
                if(user.type === true){
                    res.data.dates.forEach(element => {
                        if(element.guest === id) setEnableDate(false)
                    });
                }
            } else {
                handleError(res)
            }
        })()
        return () => {
            // Cada vez que la pagina se renderice, aplica un +1 a las vistas
            api.plusView(id)
        }
        // eslint-disable-next-line
    }, [])

    /// Funcion para enviar un comentario
    const sendComment = async (comment) => {
        /// Copia el contenido de los comentarios actuales en una nueva variable pero añadele uno nuevo con los datos de:
        /// el comentario, la fecha y el id de quien lo escribió, dejando vacia la respuesta y la fecha de respuesta
        const commentData = [...dataContainer.comments, {
            text: comment,
            date: Date.now(),
            user_id: user.id,
            reply: "",
            reply_date: "",
        }]
        /// Envia la peticion al servidor con el contenido completo de los comentarios y la ID de la publicacion
        /// de esta forma busca la publicacion por ID y le actualiza los comentarios
        const res = await api.sendComment(commentData, id)

        if (res.status === 200) {
            setMsg({
                text: "Comentario publicado satisfactoriamente",
                color: "green"
            })
            /// Si todo salio bien, añade el nuevo comentario al estado para que se actualice
            setDataContainer({ ...dataContainer, comments: commentData })
        } else {
            handleError(res)
        }
    }

    

    return (
        <div className="itemPage">
            {modal ?
                <div className="blackScreen2">
                    <div className="_modal">
                        <h3 onClick={()=>{
                            
                            console.log(dataContainer)
                        }} >Seleccione una fecha</h3>
                        <div className="_info-ctn">
                            <div className="_calendar-div" >
                                <Calendar
                                tileClassName={({ date, view }) => {
                                    if (dataContainer.dates.find(x => x.date === moment(date).format("DD-MM-YYYY"))) {
                                        return 'disable-day'
                                    }
                                }}
                                    minDate={new Date(Date.now())}
                                    onChange={(e) => {
                                        const date = moment(e)
                                        const fixDate = moment(date).format("DD-MM-YYYY")
                                        const aux = dataContainer.dates.some(x => x.date === moment(e).format("DD-MM-YYYY"))
                                        if(!aux){
                                            setDayClick(e)
                                            dataContainer.dates[dataContainer.dates.length-1].date = fixDate;
                                            handleDayInputs("date", `${fixDate}`)
                                        }
                                    }}

                                    value={dayClick}
                                />
                            </div>
                            <div className="_date-ctn">
                                <input type="text" value={dateInputs.name} placeholder="Nombre completo" onChange={(e) => {
                                    dataContainer.dates[dataContainer.dates.length - 1].name = e.target.value
                                    handleDayInputs("name", e.target.value)
                                }} />
                                {/* <p>{dayClick}</p> */}
                                <p style={{marginLeft:".5em"}} >{"Fecha: " + dateInputs.date}</p>
                                <input type="text" value={dateInputs.phone} placeholder="Número de contacto" onChange={(e) => {
                                    dataContainer.dates[dataContainer.dates.length - 1].phone = e.target.value
                                    handleDayInputs("phone", e.target.value)
                                }} />
                                <TextareaAutosize
                                className="calendar-textarea"
                                    minRows={3}
                                    maxRows={5}
                                    placeholder={"Escribe aqui..."}
                                    spellCheck={false}
                                    value={dateInputs.topic}
                                    onChange={(e) => {
                                        dataContainer.dates[dataContainer.dates.length - 1].topic = e.target.value
                                        handleDayInputs("topic", e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="_btn-ctn">
                            <button className="_cancel" onClick={() => {
                                dataContainer.dates.pop()
                                setModal(false)
                            }} >Cancelar</button>
                            <button className="_accept" onClick={setupDate} >Aceptar</button>
                        </div>
                    </div>
                </div>
                : null}
            <Header />
            <main className="_general-div">
                <div className="_title-div">
                    <h1 >{dataContainer.title + "  " + dataContainer.price + "$"}</h1>
                </div>
                <div className="_content-div">
                    {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                    <div className="_left-content">
                        <div className="_images-container">
                            <div className="_images-preview">
                                {/* Recorre todas las imagenes y devuelve el componente MiniImage */}
                                {dataContainer.images.map((value, index) => {
                                    return <MiniImage key={index} index={index} url={value.url} />
                                })}
                            </div>
                            <div className="_image-display">
                                {/* Imagen grande */}
                                <img src={show} alt="" className="big-image" />
                            </div>
                        </div>
                        <h2 className="_subtitle" onClick={
                            () => { setDataContainer({ ...dataContainer, dates: [] }) }
                        } >Caracteristicas generales</h2>
                        <p className="_general-description" >{dataContainer.generaldescription}</p>
                        <h2 className="_subtitle" id="title-comment" onClick={() => { console.log(dataContainer) }} >Comentarios</h2>
                        <div className="_comment-container">
                            {/* Condicional para verificar que hay un usuario logeado y no un invitado */}
                            {user.id !== "" ?
                                /// Condicional para saber si el usuario logeado es el dueño de la publicacion
                                user.id === dataContainer.owner ? null :
                                    /// Si el usuario logeado no es el dueño, muestra un TextareaAutosize para escribir un comentario
                                    <div className="_textarea-ctn">
                                        <TextareaAutosize
                                            minRows={1}
                                            maxRows={3}
                                            placeholder={"Escribe aqui..."}
                                            value={commentInput}
                                            onChange={(e) => {
                                                setCommentInput(e.target.value)
                                            }}
                                            className="_comment-textarea"
                                        />
                                        <button onClick={() => { sendComment(commentInput) }} >Enviar</button>
                                    </div>
                                : null}
                            {/* Cometarios 
                            Presenta los comentarios pero en orden inverso, y asi apareceran los mas nuevos de primero
                            */}
                            {dataContainer.comments.slice(0).reverse().map((item, index) => {
                                /// en ¨owner¨ esta la condicional:  Si el usuario logeado es el dueño = True, caso contrario False
                                /// y asi podemos saber si habilitamos la respuesta del comentario o no
                                return <Comment
                                    key={index} index={index}
                                    item={item} owner={user.id === dataContainer.owner ? true : false}
                                    dataContainer={dataContainer} setDataContainer={setDataContainer}

                                />
                            })}
                        </div>
                        <div className="_bannerContainer small-banner " >
                            <p className="_text" >Proximamente Homeseller para dispositivos móviles.</p>
                            <img src={Banner} alt="" className="banner" />
                        </div>
                    </div>
                    {/* RIGHT CONTENT /////////////////////////////////////////////////////////////// */}
                    <aside className="_right-content">
                        <h2 className="_room-name">{dataContainer.images[imgIndex].title}</h2>
                        <p className="_dtd" style={
                            /// Si no hay descripcion detallada en la imagen, ocultamos el titulo de "Descripcion Detallada"
                            dataContainer.images[imgIndex].detaildescription.length > 0 ? null : { display: "none" }
                        } >Descripcion detallada</p>
                        <div className="_dtd-container">
                            {/* Muestra todas las descripciones detalladas que tiene la imagen, y si no hay simplemente no muestra nada */}
                            {dataContainer.images[imgIndex].detaildescription.map((item, index) => {
                                return <p key={index} >{item}</p>
                            })}
                        </div>

                        {/* <h2 className="_pay-title" >Metodos de pago</h2>
                        <img src={pay} alt="" className="_pay-img" /> */}
                        {/* Si el usuario logeado es el dueño, desabilitar el boton */}
                        {user.id === dataContainer.owner || user.id === "" || !enableDate ? null :<button className="_btn" onClick={() => {
                            console.log(dataContainer)
                            dataContainer.dates.push({
                                name: "",
                                date: "Seleccione una fecha",
                                topic: "",
                                phone: "",
                                guest: user.id,
                                owner: dataContainer.owner,
                                postId: id
                            })
                            setModal(true)
                        }} >Apartar Cita</button>}
                        <h2 className="_pay-title" >Otras Publicaciones</h2>
                        {/* Columna lateral de publicaciones */}
                        <SliderColum />
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    )
}


export default ItemPage