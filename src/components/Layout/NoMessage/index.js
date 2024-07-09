import { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import style from "../DefaultLayout/defaultLayout.module.scss"
import classNames from "classnames/bind";
import { useStore } from "../../../store/hooks";
import axios from "axios";
import { config } from "../../../state/Constants";
import { setUser } from "../../../state/actions";
const cx = classNames.bind(style)

function NoMessageLayout({children}) {
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
            <Header />
            <div className={cx('container', 'flex', 'relative')}>
                <Sidebar className={cx('sidebar')}/>
                <div className="content flex-1">
                 <div className="w-1/2 m-auto">
                    {children}    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoMessageLayout;