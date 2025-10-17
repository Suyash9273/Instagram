import React, {useContext} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {AuthContext} from '../context/AuthContext'

const ProtectedRoute = () => {
    const {currentUser} = useContext(AuthContext);
    //If there is no logged in user, redirect to login page
    //The `Outlet` component will render the child route's element if the user is logged in
    return currentUser? <Outlet/> : <Navigate to = '/login'/>;
}

export default ProtectedRoute;