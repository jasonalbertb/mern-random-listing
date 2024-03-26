import React, { useState } from 'react'

import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Suspense} from "react";

//components
import {ReactLoader} from "./components/loaders/ReactLoader"

//helpers
import {ROUTES} from "./helpers/constants/routes";
import {ProtectedRoute} from "./helpers/ProtectedRoute";
import {UserLoggenIn} from "./helpers/UserLoggenIn";

//pages
const NotFound = React.lazy(()=>import("./pages/NotFound"));
const Error = React.lazy(()=>import("./pages/Error"));
const Dashboard = React.lazy(()=>import("./pages/Dashboard"))
const Login = React.lazy(()=>import("./pages/Login"));
const Signup = React.lazy(()=>import("./pages/Signup"));
const About = React.lazy(()=>import("./pages/About"));
const Profile = React.lazy(()=>import ("./pages/Profile"));
const CreateListing = React.lazy(()=>import("./pages/CreateListing"));
const ListingItem = React.lazy(()=> import("./pages/ListingItem"));
const UpdateListing = React.lazy(()=>import("./pages/UpdateListing"));
const Search = React.lazy(()=>import("./pages/Search"));

export const App = () => {
  const [appIsLoading, setAppIsLoading] = useState(false);
  if (appIsLoading) {
    return <ReactLoader />
  }

  return (
    <>
      <Suspense fallback={<ReactLoader />}>
        <BrowserRouter>
          <Routes>
            <Route>
              <Route index element={<Dashboard />} />
              <Route path={ROUTES.ABOUT} element={<About />}/>
              <Route path={ROUTES.SIGNUP} element={<Signup />}/>
              <Route path={ROUTES.PROFILE_ROUTE } element={<Profile />}/>
              <Route path={ROUTES.LISTING_ITEM_ROUTE } element={<ListingItem />}/>
              <Route path={ROUTES.SEARCH } element={<Search />}/>

              <Route element={<UserLoggenIn />}>
                  <Route path={ROUTES.LOGIN} element={<Login />}/>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.CREATE_LISTING} element={<CreateListing />}/>
                <Route path={ROUTES.UPDATE_LISTING_ROUTE} element={<UpdateListing />}/>
              </Route>      
             
              <Route path={ROUTES.ERROR} element={<Error />}/>
              <Route path="*" element={< NotFound />}/>  
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
}

