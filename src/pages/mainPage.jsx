import '../styles/MainPage.css'
import { useHistory } from 'react-router-dom'
import { useContext, useState } from 'react'
import api from '../api/api'
import { useHandleErr } from '../api/useHandleErr'
import { UserContext } from '../api/userContext'
import {  loadOut } from '../components/loadScreen'


import logo from '../images/LogoWhite.png'
import mainBackground from '../images/imageMain.png'

const MainPage = () => {

    /// Estado para los inputs del login
    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: "",
    })
    /// Estado para los inputs del register
    const [registerInputs, setRegisterInputs] = useState({
        email: "",
        password: "",
        confirmPasword: "",
        username: "",
        type: true
    })

    /// Se extrae el contenido del UserContext
    const { setUser, user, setLoad, setFade, setMsg } = useContext(UserContext)
    const { handleError } = useHandleErr()

    /// Use history para navegar entre paginas
    const history = useHistory()

    /// Funciones para llenar los estados de loginInput y registerInput
    const handleLogin = (name, value) => setLoginInputs({ ...loginInputs, [name]: value });
    const handleRegister = (name, value) => setRegisterInputs({ ...registerInputs, [name]: value });

    const toggleType = () => {
        setRegisterInputs({...registerInputs, type : !registerInputs.type})
    }



    /*///////////////////////////////////////////*/
    /*HANDLE CLICKS RETURN*/
    /*///////////////////////////////////////////*/

    /// Register Fetch
    const handleRegisterReturn = async () => {
        /// Iniciamos la pantalla de carga
        setLoad(true)
        /// Hacemos la peticion para insertar los datos
        const res = await api.register(registerInputs)
        if (res.status === 200) {
            /// Si todo salio bien, termina la pantalla de carga y redirigeme a /search
            /// Ademas, al estado user (App.js) dale los valores del usuario, username,id,type (Aqui se hace uso del useContext)
            loadOut(setFade, setLoad, history, "/search")
            setUser({
                user: res.data.username,
                id: res.data.id,
                type: res.data.type
            })
            setMsg({
                text: "Cuenta creada satisfactoriamente",
                color: "green"
            })
        } else {
            handleError(res)
        }
    }

    /// Login Fetch
    const handleLoginReturn = async () => {
        /// Inicia pantalla de carga
        setLoad(true)
        /// Peticion al servidor con los datos
        const res = await api.loginUser(loginInputs)
        if (res.status === 200) {
            // console.log('From:',res.data)
            /// Si todo sale bien , redirecciona a /serach y añade los datos del usuario al estado user (App.js)
            setUser({
                user: res.data.username,
                id: res.data.id,
                type: res.data.type
            })
            loadOut(setFade, setLoad, history, "/search")
        } else {
            handleError(res)
        }

    }
    /// Styles ///////////////////////////////////////////////////////////////

    /// Estado para el margen derecho del login
    const [loginRight, setloginRight] = useState("-40vw")
    /// Estado para el margen izquierdo del register
    const [registerLeft, setRegisterLeft] = useState("-40vw")
    /// Estado para el margen izquierdo del contenedor principal
    const [mainContainerLeft, setMainContainerLeft] = useState("0vw")
    /// Opacidad de el contenedor principal
    const [opacity, setOpacity] = useState("1")
    /// Opacidad de la pantalla negra
    const [blackScreenOpacity, setBlackScreenOpacity] = useState("0")

    /// Funcion para ocultar el login o register y devolver el contenedor principal a margin-left : 0
    const blackScreenClick = () => {
        if (loginRight === "0vw") {
            setloginRight("-40vw")
        }
        if (registerLeft === "0vw") {
            setRegisterLeft("-40vw")
        }
        setMainContainerLeft("0vw")
        setBlackScreenOpacity("0")
        setOpacity("1")
    }
    
    /// Funcion para mostrar el login o el register y ocultar el contenedor principal
    const showHide = (type) => {
        if (type === "login") {
            setloginRight("0vw")
            setMainContainerLeft("-100vw")
            setBlackScreenOpacity("1")
        } else if (type === "register") {
            setRegisterLeft("0vw")
            setMainContainerLeft("100vw")
            setBlackScreenOpacity("1")
        }
        setOpacity("0")
    }


    /// Se usan los estilos en linea porque asi podemos usar react para alterar sus datos en tiempo real
    const styles = {
        registerAside: {
            left: registerLeft
        },
        loginAside: {
            right: loginRight
        },
        mainContainer: {
            marginLeft: mainContainerLeft,
            opacity: opacity,
        }, blackScreen: {
            opacity: blackScreenOpacity,
        }

    }

    return (
        <div className="generalContainer" >
            {/* Black Screen */}
            <img src={mainBackground} alt="" className="mainBackground" />
            <div className="blackScreen" style={styles.blackScreen} onClick={blackScreenClick} ></div>
            {/*REGISTER ASIDE*/}
            <aside className="login" style={styles.registerAside} >
                <p className="register-subtitle" >Registro</p>
                <form >
                    <p className="_subtitle" >Seleccione su tipo de cuenta</p>
                    <div className="check-ctn">
                        <label className="_user-ctn">
                            <input checked={registerInputs.type} onChange={(toggleType)} type="checkbox" name="user" id="1" />
                            Comprador
                        </label>
                        <label className="_company-ctn">
                            <input checked={!registerInputs.type} onChange={toggleType} type="checkbox" name="user" id="2" />
                            Compañía
                        </label>
                    </div>
                    <label htmlFor="Username">{
                        /// Dependiendo si cambia registerInputs.type a true o false, cambia el texto a mostrar
                        registerInputs.type ? "Nombre de usuario" : "Nombre de la Compania"
                    }</label>
                    {/* Inputs con sus funciones de handleRegister y los valores correspondientes */}
                    <input className="_input" autoComplete="off" onChange={(e) => {handleRegister("username", e.target.value)}} type="text" name="username" />
                    <label htmlFor="Username">Email</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {handleRegister("email", e.target.value)}} type="text" name="email" />
                    <label htmlFor="Password"  >Contraseña</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {handleRegister("password", e.target.value)}} type="password" name="password" />
                    <label htmlFor="Password"  >Confirmar contraseña</label>
                    <input className="_input" autoComplete="off" onChange={(e) => {handleRegister("confirmPassword", e.target.value)}} type="password" name="password" />
                    {/* Boton con la funcion para enviar los datos */}
                    <button type="button" onClick={handleRegisterReturn} >Crear cuenta</button>
                </form>
            </aside>
            {/*MAIN CONTAINER*/}
            <main className="mainContainer" style={styles.mainContainer} >
                <div className="itemsContainer" >
                    <img src={logo} alt="imagen" className="logoWhite" />
                    <p className="firstText">No necesitas construir tu futuro cuando puedes comprarlo!!</p>
                    <p className="secondText">Echa un vistazo a nuestro amplio catalogo de casas y departamentos</p>
                    <div className="btnContainer" >
                        {/* Botones para mostrar u ocultar el login y el register */}
                        <button className="btnMain" onClick={() => { showHide("register") }} >Registrarse</button>
                        <button className="btnMain" onClick={() => { showHide("login") }}>Iniciar Sesión</button>
                    </div>
                    <div className="thirdTextContainer" >
                        {/* Texto con el OnClick para ir a la pagina de busqueda como invitado, sin iniciar sesion */}
                        <p onClick={() => { 
                            setLoad(true)
                            loadOut(setFade, setLoad, history, "/search") }} className="thirdText" >Continuar como invitado</p>

                    </div>
                </div>
            </main>
            {/*LOGIN ASIDE*/}
            <aside className="login" style={styles.loginAside} >
                <p className="loginSubtitle" >Iniciar Sesión</p>
                <form action="#">
                    <label htmlFor="email">Email</label>
                    {/* Inputs con sus funciones de handleLogin y los valores correspondientes */}
                    <input className="_input" autoComplete="off" onChange={(e) => { handleLogin("email", e.target.value) }} type="text" value={loginInputs.email} name="email" />
                    <label htmlFor="password"  >Contraseña</label>
                    <input className="_input" autoComplete="off" onChange={(e) => { handleLogin("password", e.target.value) }} type="password" name="password" />
                    {/* Boton con la funcion para enviar los datos */}
                    <button type="button" onClick={handleLoginReturn} >Ingresar</button>
                </form>
            </aside>
        </div>
    )
}




export default MainPage