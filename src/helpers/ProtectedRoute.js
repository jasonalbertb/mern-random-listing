import React from 'react'

import {Navigate, Outlet} from "react-router-dom";
import {ROUTES} from "../helpers/constants/routes";

import {useSelector} from "react-redux";

export const ProtectedRoute = ({
    children
}) => {
    const {userCred} = useSelector(state=>state.user);
    if (!userCred) {
        return <Navigate to={ROUTES.LOGIN}/>
    }

    return children ? children: <Outlet />
}
