import NoMessageLayout from "../components/Layout/NoMessage"
import comment from "../components/comment/comment"
import Friends from "../pages/Friend/friend"
import Home from "../pages/Home/home"
import Login from "../pages/Login/login"
import inviteFriend from "../pages/inviteFriend/inviteFriend"
import Profile from "../pages/Profile"
import HeaderOnly from "../components/Layout/HeaderOnly"
import Register from "../pages/Register/register"


const publicRoutes = [
    {path: '/', component: Home},
    {path: '/login', component: Login, layout: null},
    {path: '/friends', component: Friends, layout: NoMessageLayout},
    {path: '/listFriends', component: inviteFriend, layout: NoMessageLayout},
    {path: '/register', component: Register, layout: null},
    {path: '/profile', component: Profile, layout: HeaderOnly}
]

const privateRoutes = [
]

export {publicRoutes, privateRoutes}