const ERROR = "/error";
const NOT_FOUND = "/not-found"
const DASHBOARD = "/";
const ABOUT = "/about";
const LOGIN = "/login";
const SIGNUP = "/signup";
const PROFILE_ROUTE = "/user/:userId";
const PROFILE = (userId)=>{
    return PROFILE_ROUTE.replace(":userId", userId);
}
const CREATE_LISTING = "/create-listing";
const LISTING_ITEM_ROUTE = "/listing/:id";
const LISTING_ITEM = (id)=>{
    return LISTING_ITEM_ROUTE.replace( ":id", id)
}

const UPDATE_LISTING_ROUTE = "/update-listing/:id";
const UPDATE_LISTING = (id)=>{
    return UPDATE_LISTING_ROUTE.replace( ":id", id)
}

const SEARCH = "/s";
const SEARCH_QUERY = (searchQuery)=>{
    return SEARCH + `/?${searchQuery}`
}
export const ROUTES = {
    ERROR,
    NOT_FOUND,
    DASHBOARD,
    ABOUT,
    LOGIN,
    SIGNUP,
    PROFILE_ROUTE, PROFILE,
    CREATE_LISTING,
    LISTING_ITEM_ROUTE, LISTING_ITEM,
    UPDATE_LISTING_ROUTE, UPDATE_LISTING,
    SEARCH, SEARCH_QUERY
}