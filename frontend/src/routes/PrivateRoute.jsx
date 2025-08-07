import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom";


const PrivateRoute = ({children}) => {

    const {token} = useContext(AuthContext);
    
    if(!token){
        return <Navigate to='/auth'/>;
    }

    return children;
    
}

export default PrivateRoute;