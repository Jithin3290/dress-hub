import React from 'react'
import { Navigate,useLocation } from 'react-router-dom'

function ProtectedRouter({children}) {
    const location = useLocation()
    const auth = JSON.parse(sessionStorage.getItem("user"))
    if(!auth){
        return <Navigate to="/login" state={{from:location}} replace/>
    }
  return children
}

export default ProtectedRouter