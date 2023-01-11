import React, { useState } from 'react'
import { useContext } from 'react/cjs/react.development'
import { UserContext } from '../api/userContext'

/// Componente Message
export const Msg = () => {
    /// Estado para la animacion del top
    const [top, setTop] = useState("5vh")

    /// Extraer del UserContext
    const {msg,setMsg} = useContext(UserContext)

    /// Funcion para ocultar el mensaje
    const hide = ()=>{
        setTop("-5vh")
        /// Set Timeout, para que luego de 0.6s (ya finalizada la animacion), el componente borre el mensaje y quede "desactivado" por asi decirlo
        setTimeout(() => {
            setMsg({ ...msg, text: "" })
        }, 600);
    }
    const style = {
        /// esto es como decir top : top (de el estado)
        top
    }

    return (
        <div className={`msg ${msg.color}`} style={style} >
            <p className="_text" >{msg.text}</p>
            <p className="_btn" onClick={hide} >X</p>
        </div>
    )
}
