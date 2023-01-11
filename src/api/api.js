const axios = require("axios").default

//Aqui se alterna entre el local host y la url en heroku del servidor
// const url = "http://localhost:4000/"
// const url = "https://home-seller-back.herokuapp.com/"
// const url = "https://10.0.0.115:4000/"
const url = "http://10.1.10.115:4000/"



/// Funcion general para el catch error que se usa en TODAS las peticiones 
const catchError = async (err) => {
    /// Error  
    if (err.response) {
        console.log(err.response)
        return err.response
        /// Error de mala conexion
    } else if (err.request) {
        console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
        /// Error inesperado
    } else {
        console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, contacte al administrador" } }
    }
}

/*
La logica es super sencilla en casi todos
Crea una variable "response" donde va a esperar de forma asincrona para la respuesta del ".then" luego de la peticion de axios

El "then catch" no tiene ciencia, si todo funciona bien guarda el "res" en "response" y caso contrario, 
se ejecuta el "catch" y "catchError" verifica el tipo de error y manda el mensaje

Todo se va a guardar en "response" y será retornado al componente que ejecuto la funcion para hacer el display del mensaje

*/

/// Login
const loginUser = async (data) => {
    let response
    const { email, password } = data
    await axios.get(`${url}login/${email}/${password}`)
        .then((res) => {
            // console.log('DATA:',res.data)
            response = res
            return response.data
        }).catch((err) => {
            response = catchError(err)
        })
    return response

}

/// Register
const register = async (item) => {
    const { username, email, password, confirmPassword, type } = item
    let response
    await axios.post(`${url}register`, {
        username,
        email,
        password,
        confirmPassword,
        type
    }).then(res => {
        response = res
    })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

/// Get user by id
const getUser = async (id) => {
    let response
    await axios.get(`${url}user/${id}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

///Editar datos
const editData = async (data, type) => {
    let response
    await axios.post(`${url}edit`, { data, type })
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}
/// Crear item
const createItem = async (dataOriginal, files) => {
    
    /// Aqui si hay trabajo
    /// El response sigue siendo normal
    let response
    /// Creamos una constante que almacene los datos originales de la publicacion
    const data = { ...dataOriginal }
    /// Creamos una variable especial para poder separa y enviar las imagenes y el contenido de variables y de mas
    const formData = new FormData()

    ///Para evitar enviar datos innecesarios, borramos la url de las imagenes, porque crearemos nuevas url con cloudinary
    data.images.map((item, index) => {
        delete data.images[index].url
        return 0
    })

    /// Copiamos todo el contenido en "copyData" pero en forma de string, para poder ser almacenado en formato "jsonb" y ser leido en postgresql
    const copyData = JSON.stringify(data.images)
    /// Para añadirlo a la "variable especial" usamos ".append" , el nombre que queremos darle y el contenido => .append("nombre",contenido)
    formData.append("copyData", copyData)
    /// Borramos las imagenes porque ya no las vamos a necesitar y asi liberamos espacio para lo siguiente
    delete data.images
    ///Le añadimos el resto de los datos de forma tradicional en el FormData, ya que estos son strings que seran leidos normalmente en el servidor
    for (var key in data) {
        formData.append(key, data[key]);
    }
    /*Ahora vamos con las imagenes
    Por cada imagen, aplica un .append, y el contenido es la imagen con sus datos, que sera leida por "Multer" en el servidor y automaticamente 
    guardara la image*/
    files.forEach(element => {
        formData.append("images", element)
    });

    /// Enviamos el form data y listo
    await axios.post(`${url}createItem`, formData)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

/// Buscar una publicacion por ID
const getItem = async (id) => {
    let response
    await axios.get(`${url}getItem/${id}`)
        .then(res => {
            // console.log('LOG:',res.data)
            response = res
         
        })
        .catch(err => {
             response = catchError(err)
        })
    return response
}

/// Buscar todas las publicaciones
const getAll = async () => {
    let response
    await axios.get(`${url}getAllItems`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}
/// Borrar una publicacion 
const deleteItem = async (item) => {
    let response
    /// Usamos posts porque tenemos que enviarle los datos de las imagenes para poder borrarlas de claudinary
    await axios.post(`${url}deleteItem`, item)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

/// Actualizamos la imagen de perfil, usando FormData y la ID del usuario o compañia
const updateProfilePic = async (data, id) => {
    console.log('data:',data,'ID:', id)
    const formData = new FormData()
    formData.append("image", data)
    formData.append("id", id)
    let response
    await axios.post(`http://10.1.10.115:4000/updateProfilePic`, formData)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}
/// Enviamos un comentario
const sendComment = async (comment, id) => {
    let response
    await axios.post(`${url}sendComment`, { comment, id })
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

/// Funcion para la barra de busqueda del header
const search = async (data) => {
    let response
    await axios.get(`${url}search/${data}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

/// Le sumamos +1 a la vista de una publicacion cuando la renderizamos
const plusView = async (id) => {
    let response
    await axios.get(`${url}plusView/${id}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

const setDate = async (dates,id)=>{
    let response
    await axios.post(`${url}setDate`,{dates,id})
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}

const getDates = async (id,type)=>{
    let response
    await axios.get(`${url}getDates/${id}/${type}`)
        .then(res => {
            response = res
        })
        .catch(err => {
            response = catchError(err)
        })
    return response
}


let api

// eslint-disable-next-line
export default api = {
    getAll, getItem, createItem, editData, getUser, register, loginUser, deleteItem, updateProfilePic, sendComment,  plusView , search,setDate,getDates
}