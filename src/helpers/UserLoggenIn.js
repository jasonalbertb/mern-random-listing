import React from 'react'
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import {ROUTES} from "./constants/routes";

export const UserLoggenIn = ({children}) => {
    const {userCred} = useSelector(state=>state.user);

    if (userCred) {
        return <Navigate to={ROUTES.DASHBOARD}/>
    }   

    return (
        children ? children : <Outlet />
    )
}
