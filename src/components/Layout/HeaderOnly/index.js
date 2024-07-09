import axios from "axios";
import { useStore } from "../../../store/hooks";
import Header from "../components/Header";
import style from "../DefaultLayout/defaultLayout.module.scss"
import classNames from "classnames/bind";
import { useEffect, useLayoutEffect } from "react";
import { setUser } from "../../../state/actions";
import { config } from "../../../state/Constants";
const cx = classNames.bind(style)
function HeaderOnly({children}) {
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
                <div className="content flex-1">
                    <div className="w-full m-auto">
                    {children}    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeaderOnly;
