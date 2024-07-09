import axios from "axios";
import { useStore } from "../../../store/hooks";
import Contact from "../components/Contact";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import style from "./defaultLayout.module.scss"
import classNames from "classnames/bind";
import { useEffect, useLayoutEffect } from "react";
import { setUser } from "../../../state/actions";
import { config } from "../../../state/Constants";
const cx = classNames.bind(style)
function DefaultLayout({children}) {
    const state = useStore()
    const [user, dispatch] = state
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        config.headers['Authorization'] = `Bearer ${token}`
        axios.get('http://localhost:3000/user', config)
          .then(function (response) {
                if (response.data) {
                    dispatch(setUser(response.data.data))
                }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
           
          });
    }, [])
    return (
        <div className="flex flex-col">
            {user.user._id !== undefined ? <Header /> : <div>Loading...</div>}
            <div className={cx('container', 'flex', 'relative')}>
                <Sidebar className={cx('sidebar')}/>
                <div className="content flex-1">
                    <div className="w-1/2 m-auto">
                    {children}    
                    </div>
                </div>
                {user.user._id !== undefined ? <Contact /> : <div>Loading...</div>}
            </div>
        </div>
    );
}

export default DefaultLayout;
