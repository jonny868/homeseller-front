import { useContext } from 'react'
import { UserContext } from './userContext'

/*
Esto es un hook, no es un componente , si no una funcion, pero tiene las propiedades de un componente
Si intentas usar propiedades de un hook (useState,useRef...) en una funcion normal, no te va a dejar
Para eso usamos Hooks
*/
export const useHandleErr = () => {
    /// Extraemos de UserContext
    const { setFade, setLoad, setMsg } = useContext(UserContext)
    /// Y esta es la funcion que nos interesa, handleError
    /// Cuando recibe un error, termina la animacion de la pantalla de carga y muestra el mensaje
    const handleError = (res)=>{
        setFade("out")
        setMsg({
            text: res.data.msg,
            color: "red"
        })
        setTimeout(() => {
            setLoad(false)
            setFade("in")
        }, 500);
    }
    
    /// Este return pertenece al Hook, de esta forma podemos acceder a la funcion externamente
    /// const {handleError} = useHandleErr()
    return({
        handleError
    })


}
