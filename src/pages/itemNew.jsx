import "../styles/itemPage.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import api from "../api/api";
import { UserContext } from "../api/userContext";
import { useHandleErr } from '../api/useHandleErr'

import { loadOut } from "../components/loadScreen";
import { Footer } from "../components/footer";
import Header from "../components/header"
import TextareaAutosize from "react-textarea-autosize";
import plusCube from "../images/PlusCube.png"


//////  ITEM PAGE New ////////////////////////////////////////////////////////
const ItemPageNew = () => {

    const { handleError } = useHandleErr()

    const { id } = useParams()

    ////Componente interno ////////////////////////////////////////////////////////////////////////////////////////////////
    //////   MINI IMAGE ////////////////////////////////////////////////////////
    /// Recibe como parametros la url de la imagen que se cargará y su propio index
    const MiniImage = ({ url, index }) => {
        /// UseRef para el input file y poder añadir una imagen nueva
        const inputFile = useRef(null)

        ///Funcion al hacer click en la imagen
        const click = async () => {
            /* Hay dos casos, si el url de la imagen es "plusCube", significa que es la imagen con signo de "+"
            usada con el proposito de, al darle click, añadir una nueva imagen
            En caso contrario es una imagen normal:
            seleccionamos su index en setImgIndex y setShow para mostrarla en el contenedor grande
            Esto puede ser muy confuso asi que si tienes dudas me avisas
            */
            if (url !== plusCube) {
                setShow(url)
                setImgIndex(index)

                /// Si se dio click a la imagen con signo de "+", simula un click en el inputFile
            } else {
                inputFile.current.click();
            }
        }

        /// Una vez que se seleccione la nueva imagen, inputFile ejecutara su funcion "OnChange" y alli podemos
        /// manejar la nueva imagen
        const inputFileChange = (e) => {

            /// Verificamos que la imagen se haya seleccionado y no cancelado
            if (e.target.files[0]) {

                /// Guarda los datos de el archivo en una variable
                let file = e.target.files[0];

                /// FileReader() nos permite leer la imagen que seleccionamos, porque originalmente, no nos da la url exacta
                let reader = new FileReader();

                /// Creamos una funcion que se ejecutara cuando leamos un archivo con "reader" ( FileReader() )
                reader.onload = (event) => {
                    /// event.target.result me dara la url de la imagen, y eso es lo que estabamos buscando
                    /// al contenedor de los datos le insertamos un nuevo elemento en las imagenes, con url, sin titulo ni descripciones detalladas
                    dataContainer.images.push({
                        url: event.target.result,
                        title: "",
                        detaildescription: [],
                    })

                    /// Le añadimos los datos de la imagen al estado Files, para poder enviar todas las imagenes al servidor y subirlas a cloudinary
                    files.push(file)
                    /// Ajustamos el index de la imagen para asi mostrar la nueva que se esta creando
                    setImgIndex(imgIndex + 1)
                    /// Estado de las ¨Mini Imagenes¨ le añadimos la url de la imagen que seleccionamos y asi poder mostrarla
                    setMiniImgArray([...miniImgArray, event.target.result])
                    /// Presentamos la nueva imagen en el contenedor grande
                    setShow(event.target.result)
                };

                /// Leemos el archivo que se selecciono con reader, pero la funcion es
                // "Read as data url", y asi leemos la ruta original de el archivo y obtenemos su ubicacion en "event.target.result"
                reader.readAsDataURL(file);
            }
        }

        return (
            <>
                <img src={url} alt="" className="mini-image" onClick={click} />
                {/* Si la imagen es el signo de "+" , habilita el inputFile, en caso contrario devuelve un valor nulo */}
                {url === plusCube ?
                    <input type='file' id='file' name="images" ref={inputFile} style={{ display: 'none' }} onChange={(e) => { inputFileChange(e) }} /> : null}
            </>
        )
    }


    /// Extraemos el contenido del UserContext
    const { user, setLoad, setFade, setMsg } = useContext(UserContext)

    /// useHistory para movernos entre paginas
    const history = useHistory()

    /// Al cargar la pagina hacemos lo siguiente
    useEffect(() => {
        (async () => {
            /// Verificamos que haya un usuario logeado y que no sea un usuario normal, si no que sea una compañia
            if (!user.type && user.type !== "") {
                /// verificamos si se va a crear una publicacion o a editarla
                /// NOTA : La edicion de publicaciones no esta terminada, porque la logica es muy larga y no es prioridad
                if (id !== "new") {
                    /// Busca la publicacion por ID y luego llena los estados con la informacion
                    const res = await api.getItem(id)
                    if (res.status === 200) {
                        const aux = []
                        await res.data.images.map((item, index) => {
                            console.log(item)
                            aux.push(item.url)
                            return 0
                        })
                        setMiniImgArray(aux)
                        setShow(res.data.images[0].url)
                        setImgIndex(0)
                        setDataContainer(res.data)
                        console.log(miniImgArray)
                    } else {
                        handleError(res)
                    }
                }
                /// Si el usuario no tiene permitido entrar habilita la pantalla de carga y devuelvelo a la pantalla de busqueda 
                /// con un mensaje de error
            } else {
                setLoad(true)
                setMsg({
                    text: "Ha intentado ingresar a una pagina a la cual no tiene acceso",
                    color: "red"
                })
                loadOut(setFade, setLoad, history, "/search")
            }

        })()
        // eslint-disable-next-line
    }, [])


    /// Estado para almacenar todas las imagenes que se van a subir                        
    const [files, setFiles] = useState([])

    /// Estado para los url de las mini imagenes al lado izquierdo
    const [miniImgArray, setMiniImgArray] = useState([])
    /// Estado para almacenar la url de la imagen grande
    const [show, setShow] = useState(``)
    /// Estado para todos los datos de la publicacion
    const [dataContainer, setDataContainer] = useState({
        title: "",
        price: "",
        images: [],
        generaldescription: "",
        type: 1,
        owner: user.id
    })
    /// Ajustamos el index de la imagen seleccionada en -1, de esta forma cuando se seleccione una imagen, comenzará con el index en 0
    /// dataContainer.images[0]
    const [imgIndex, setImgIndex] = useState(-1)

    /// Funcion para actualizar los valores de el titulo, precio, y la descripcion general de DataContainer
    const handleData = (name, value) => { setDataContainer({ ...dataContainer, [name]: value }) }

    /// Funcion para borrar la imagen seleccionada en el momento
    const deleteCurrentImage = () => {

        /// Mientras el index no sea -1, borra todo referente a la imagen
        if (imgIndex !== -1) {

            /// Borra su ubicacion en el array de imagenes en el estado DataContainer 
            dataContainer.images.splice(imgIndex, 1)
            /// Borra su ubicacion en el array de las mini imagenes
            miniImgArray.splice(imgIndex, 1)

            /// si la imagen no es la primera, seleccionamos la imagen anterior para ser mostrada en el contenedor grande
            if (imgIndex !== 0) {
                setShow(dataContainer.images[imgIndex - 1].url)

                /// Si la imagen eliminada es la primera, selecciona como un string vacio el contenedor grande 
            } else if (imgIndex === 0) {
                setShow("")
            }
            /// Le restamos 1 al index de las imagenes, y si llega a -1 (en caso de que eliminemos la primera imagen)
            /// tendremos que seleccionar otra imagen en las mini imagenes, para acceder a sus datos y continuar normalmente
            setImgIndex(imgIndex - 1)

            /// Nota: esto se entiende mejor en la practica, asi que si puedes probar paso a paso en la pagina, mejor
        }
    }

    /// Funcion para finalmente subir la publicacion
    const createClick = async () => {
        /// Habilitamos la pantalla de carga
        setLoad(true)
        /// Enviamos al servidor los datos y los archivos (imagenes)
        const res = await api.createItem(dataContainer, files)
        console.log(res);
        if (res.status === 200) {
            /// Si todo salio bien, envianos al la publicacion mediante su ID
            loadOut(setFade, setLoad, history, `/itemPage/${res.data.id}`)
        } else {
            handleError(res)
        }
    }


    return (
        <>
            <div className="itemPage">
                <Header />
                <section className="_choice-ctn">
                    {/* Falta hacer el boton de cancelar, solo seria redireccionar a la pantalla de la compañia */}
                    <button>Cancelar</button>
                    <button onClick={createClick} >Finalizar</button>
                </section>
                <main className="_general-div">
                    <div className="_title-div">
                        <input className="_title-input" type="text" placeholder="Titulo" maxLength={60} spellCheck={false} value={dataContainer.title} onChange={(e) => {
                            /// HandleData("title",value) nos actualizara el valor de "title" dentro de DataContainer
                            handleData("title", e.target.value)
                        }} />
                        <input className="_price-input" type="text" placeholder="/Precio" spellCheck={false} value={dataContainer.price} onChange={(e) => {
                            /// HandleData("title",value) nos actualizara el valor de "price" dentro de DataContainer
                            handleData("price", e.target.value)
                            // }
                        }} />
                    </div>
                    <div className="_content-div">
                        {/* LEFT CONTENT /////////////////////////////////////////////////////////////// */}
                        <div className="_left-content">
                            <div className="_images-container">
                                <div className="_images-preview">
                                    {/* Recorre el array de miniImg y retorna el componente con el url de cada una */}
                                    {miniImgArray.map((value, index) => {
                                        return <MiniImage key={index} index={index} url={value} />
                                    })}

                                    {/* Esta imagen siempre estara al final y es el cubo con el "+"
                                    Al hacer click en el, se seleccionara el inputFile para añadir una nueva imagen*/}
                                    <MiniImage url={plusCube} />
                                </div>
                                <div className="_image-display">
                                    {/* Imagen Grande */}
                                    <img src={show} alt="" className="big-image" />
                                </div>
                            </div>
                            <h2 className="_subtitle" >Caracteristicas generales</h2>
                            {/* Textarea de las caracteristicas generales */}
                            <TextareaAutosize
                                minRows={5}
                                maxRows={50}
                                placeholder={"Escribe aqui..."}
                                className="_general-description"
                                onChange={(e) => {
                                    handleData("generaldescription", e.target.value)
                                }}
                                value={dataContainer.generaldescription}
                            />
                        </div>
                        {/* RIGHT CONTENT /////////////////////////////////////////////////////////////// */}
                        <aside className="_right-content"><>
                            {/* Condicional, mientras el index seleccionado no sea === undefined, muestra el contenido */}
                            {dataContainer.images[imgIndex] !== undefined ?
                                <>
                                    <input type="text" placeholder="Nombre de la habitacion" className="_input-room-name" value={dataContainer.images[imgIndex].title} onChange={(e) => {
                                        /// Cambia el valor de el titulo cada que se escriba en el input, y luego actualiza el estado con su propio contenido
                                        /// Esto es para que se actualice, se hace asi porque llegar hasta el fonde de dataContainer => images[] => title, es algo dificil
                                        /// Seria algo como 
                                        /*
                                        setDataContainer({...dataContainer, images:[...dataContainer.images , title: e.target.value]})
                                        */
                                        dataContainer.images[imgIndex].title = e.target.value
                                        setDataContainer({ ...dataContainer })
                                    }} />
                                    <p className="_dtd" >Descripcion detallada</p>
                                    <div className="_btns" >
                                        <button onClick={() => {
                                            /// Boton para añadir caracteristica detallada 
                                            /// Le añadimos un string vacio al array de las descripciones detalladas, que despues podremos rellenar
                                            /// y actualizamos el estado haciendo que se copie a si mismo
                                            dataContainer.images[imgIndex].detaildescription.push("")
                                            setDataContainer({ ...dataContainer })
                                        }} >Añadir detalle</button>
                                        <button onClick={() => {
                                            /// Igual que el boton de añadir pero eliminamos el ultimo indes de las descripciones detalladas
                                            dataContainer.images[imgIndex].detaildescription.pop()
                                            setDataContainer({ ...dataContainer })
                                        }} >Eliminar detalle</button>
                                    </div>
                                    <div className="_dtd-container">
                                        {/* Verificamos que el index de la imagen no sea undefined */}
                                        {dataContainer.images[imgIndex] !== undefined ?
                                            /// Recorremos el array de las descripciones detalladas y en cada una le retornamos un componente con un input para insertar los datos
                                            dataContainer.images[imgIndex].detaildescription.map((value, index) => {
                                                return <InputDetail index={index} key={index} imgIndex={imgIndex} dataContainer={dataContainer} text={value} />
                                            }) : null}
                                        <button onClick={deleteCurrentImage} className="_deleteImage-btn" >Eliminar imagen actual</button>
                                    </div>
                                </>
                                : null}
                        </>
                        </aside>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}

const InputDetail = ({ dataContainer, index, imgIndex, text }) => {
    /// El estado para almacenar el contenido de el input (textareaAutosize)
    const [input, setInput] = useState("")

    /* Si al momento de cargar el componente, se pasa un parametro llamado "text={value}"
    Imaginalo de esta forma, cuando ya haz creado descripciones detalladas de una imagen, vas a otra imagen, y luego regresas
    debes de poder leer esas descripciones detalladas que habias escrito antes, con este useEffect, al momento de cargar el componente
    lee la propiedad "text", y si tiene valor, actualiza el input con ese valor
    */
    useEffect(() => {
        if (text !== undefined) {
            setInput(text)
        }
        // eslint-disable-next-line
    }, [dataContainer.images[imgIndex].detaildescription])

    return (
        <div className="_input-dtd" key={index} >
            {/* El input es un textareaAutosize, esto es muy comodo para el diseño */}
            <TextareaAutosize onChange={(e) => {
                /// Cada vez que se escriba en el, añade el valor al DataContainer, sin embargo no hace falta que se actualice, porque ya el textarea
                /// muestra el valor que se esta escribiendo
                dataContainer.images[imgIndex].detaildescription[index] = e.target.value

                /// Actualiza el estado con los valores que se escriben
                setInput(e.target.value)
            }} name="input" id={index} minRows={1} maxRows={5} spellCheck={false} value={input} />
        </div>
    )
}

export default ItemPageNew