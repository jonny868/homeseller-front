/// Importamos todos los componentes que se van a usar

import MainPage from './pages/mainPage'
import SearchPage from './pages/searchPage';
import ExplorerPage from './pages/explorerPage';
import UserPage from './pages/userPage';
import ItemPage from './pages/item';
import ItemPageNew from './pages/itemNew'
import CompanyPage from './pages/companyPage';
import LoadScreen from './components/loadScreen';
import {ItemPageCinema}  from './pages/itemCinema';
import {ItemPageModal}  from './pages/itemModal';

/// Eliminar unos estilos predeterminados
import './styles/reset.css'

///React Router
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { useState } from 'react';

/// Importamos el UserContext , pendiente, esto no es UseContext, User Context
import { UserContext } from './api/userContext';
import { Msg } from './components/msg';


function App() {

  /// Creamos el estado del usuario que hara login para usar sus datos en toda la app
  const [user, setUser] = useState({
    user:"",
    id : "",
    type:""
  })

  /// Estados para iniciar el LoadScreen y para administrar la animacion de Fade entre "in" , "out"
  const [load, setLoad] = useState(false)
  const [fade, setFade] = useState("in")

  /// Estado con el mensaje de error o aprobacion y su color ¨green" o "red"
  const [msg, setMsg] = useState({
    text:"",
    color:"green"
  })

  return (
    /* El use context ya se esta usando, en el momento que declaramos --UserContext = createContext(null)-- ya lo podemos usar
     en cualquier lado
     Asi que llamamos al componente UserContext.Provider (para proveer los datos en su propiedad "value") y 
     le añadimos lo siguiente

     User / setUser = para leer quien es el usuario que se ha logeado en toda la app
     load / setLoad = para mostrar o no la pantalla de carga
     fade / setFade = para iniciar o finalizar la animacion de carga 
     msg / setMsg = para mostrar los mensajes entre pantallas y en cualquier pantalla
     */
    <UserContext.Provider value={{
      user,
      setUser,
      load,
      setLoad,
      fade,
      setFade,
      msg,
      setMsg,
    }} >
      {/* Colocamos el LoadScreen arriba de todo tambien, ya que esta en position absolute, se mostrara sobre cualquier pagina cuando
      se cumpla la condicion : que el estado "load" sea true, y aqui viene la magia de los estados
      
      cuando se actualiza y es True, muestra la pantalla de carga, pero si es False, retorna un valor nulo y nos ahorramos el espacio
      de leer un componente que no se esta usando, en resumen, solo renderizamos lo que usamos, y nos ahorramos memoria

      */}
      {load ? <LoadScreen/> : null}
      {msg.text !== "" ? <Msg/> : null}

      {/* Englobar todo dentro de Router para poder aplicar las rutas */}
      <Router>
        {/* Switch es lo que te permite cambiar entre paginas, como el tradicional switch de js */}
        <Switch>
          <Route exact path="/" >
            <MainPage />
          </Route>
          <Route path="/search" >
            <SearchPage />
          </Route>
          <Route path="/explore/:text" >
            <ExplorerPage />
          </Route>
          <Route path="/user/:id" >
            <UserPage />
          </Route>
          <Route path="/company/:id" >
            <CompanyPage/>
          </Route>
          {/* ITEMS */}
          <Route path="/itemPage/:id" >
            <ItemPage />
          </Route>
          <Route path="/itemCreate/:id" >
            <ItemPageNew />
          </Route>
          <Route path="/itemPage2" >
            <ItemPageCinema />
          </Route>
          <Route path="/itemPage3" >
            <ItemPageModal />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
