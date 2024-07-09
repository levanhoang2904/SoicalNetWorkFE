import styles from './header.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserGroup, faMessage, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Popper from '../../../popper';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../../../state/Constants';
import { useStore } from '../../../../store/hooks';
import socket from '../../../../socket/socket';

const cx = classNames.bind(styles);

function Header() {
    const location = useLocation();
    const [reacts, setReacts] = useState([]);
    const state = useStore();
    const [user] = state;
    const recent = useMemo(() => {
        return [
            {
                title: 'ai đó đã bình luận về bài viết của bạn',
            },
        ];
    }, []);

    const [iconRef, setIconRef] = useState(0);
    const searchResultRef = useRef();
    const notifiRef = useRef();
    const [amountNotifi, setAmountNotifi] = useState(0)
    const handleNotifi = () => {
        notifiRef.current.classList.toggle(cx('activeNotifi'));
        searchResultRef.current.style.display = 'none';
    };

    const handleInputFocus = () => {
        searchResultRef.current.style.display = 'block';
        notifiRef.current.classList.remove(cx('activeNotifi'));
    };

    const handleInputBlur = () => {
        searchResultRef.current.style.display = 'none';
    };

    const onHandleRead = useCallback((data) => {
       
            axios.patch(`http://localhost:3000/notification?id=${data._id}`, config)
            .then((res) => {
               if(amountNotifi > 0) {
                    data.isRead = true
                    setAmountNotifi(prev => prev - 1)
               }
            })
            .catch(error => console.log(error))
            .finally(res => {})
        
    })

    useEffect(() => {
        socket.on('notifiReact', (notifi) => {
            config.data = {
                idPost: notifi.idPost,
                idUser: notifi.idUser,
                categoryNotifi: notifi.categoryNotifi,
                idAction: notifi.idAction,
            };
            console.log(user.user._id !== notifi.idUser);
                axios
                    .post(`http://localhost:3000/notification`, config)
                    .then(function (response) {
                        console.log("a", response);
                        if (response.data) {
                            getNotifi();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
        });

        return () => {
            socket.off('notifiReact');
        };
    }, []);

    const getNotifi = useCallback(() => {
        axios
            .get(`http://localhost:3000/notification?id=${user.user._id}`, config)
            .then(function (response) {
                if (response.data) {
                    setReacts(response.data.data);
                    response.data.data.map(data => {
                        
                        if (data.isRead === false) setAmountNotifi(prev => prev + 1)
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    })

    useEffect(() => {
        if (user.user && user.user._id) {
            getNotifi();
        }
    }, [user.user]);

    return (
        <header className={cx('header', 'fixed bg-white z-50')}>
            <div className={cx('container')}>
                <div className={cx('left')}>
                    <div className={cx('logo')}>
                        <img
                            alt="logo"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/800px-Facebook_Logo_%282019%29.png"
                        />
                        <div className={cx('search-box', 'z-20')}>
                            <div ref={searchResultRef} className={cx('search-result')}>
                                <div className={cx('title')}>
                                    <h3>Mới đây</h3>
                                    <Popper data={recent} />
                                </div>
                            </div>
                            <input
                                placeholder="Nhập tìm kiếm"
                                spellCheck={false}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('center')}>
                    <div className={cx('header-icon', { active: location.pathname === '/' })}>
                        <Link to="/">
                            <FontAwesomeIcon
                                onClick={() => {
                                    setIconRef(0);
                                }}
                                className={cx('icon')}
                                size="lg"
                                icon={faHome}
                            />
                        </Link>
                    </div>
                    <div className={cx('header-icon', { active: location.pathname === '/friends' })}>
                        <Link to="/friends">
                            <FontAwesomeIcon
                                onClick={() => {
                                    setIconRef(1);
                                }}
                                className={cx('icon')}
                                size="lg"
                                icon={faUserGroup}
                            />
                        </Link>
                    </div>
                    <div className={cx('header-icon', { active: iconRef === 2 })}>
                        <FontAwesomeIcon
                            onClick={() => {
                                setIconRef(2);
                            }}
                            className={cx('icon')}
                            size="lg"
                            icon={faMessage}
                        />
                    </div>
                </div>
                <div className={cx('right')}>
                    <div className={cx('header-icon')}>
                        <FontAwesomeIcon className={cx('icon')} size="lg" icon={faUser} />
                    </div>
                    <div className={cx('header-icon')} onClick={handleNotifi}>
                        <div className='relative'>
                        <FontAwesomeIcon className={cx('icon')} size="lg" icon={faBell} />
                        {amountNotifi > 0 && <span className='absolute -top-4 px-2 bg-blue-300 rounded-full py-1'>{amountNotifi}</span>}
                        </div>
                        <div className={cx('notification', 'z-20')} ref={notifiRef}>
                            <h3>Thông báo</h3>
                           
                            <Popper data={reacts} onHandleRead={onHandleRead} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
