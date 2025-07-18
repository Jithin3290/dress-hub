import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedLogin({children}) {
    const auth = JSON.parse(sessionStorage.getItem("user"))
    if(auth){
        return <Navigate to="/"  replace/>
    }
  return children
}

export default ProtectedLogin