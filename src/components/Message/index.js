import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import style from './message.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import socket from '../../socket/socket';
import { useStore } from '../../store/hooks';
const cx = classNames.bind(style);

function Message(props) {
    const [messages, setMessages] = useState([]);
    const state = useStore();
    const [user, dispatch] = state;
    const inputMess = useRef([]);
    const containerRef = useRef([]);
    useEffect(() => {
        handleScroll();
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    toId: message.toId,
                    id: message.id,
                    message: message.message,
                },
            ]);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    }, [state]);

    const handleMess = (e, toId, index) => {
        e.preventDefault();
        if (inputMess.current[index].value.trim() != '') {
            socket.emit('message', {
                id: user.user._id,
                toId,
                message: inputMess.current[index].value,
            });
        }
        inputMess.current[index].value = '';
        containerRef.current[index].scrollTop = containerRef.current[index].scrollHeight + 16;
    };

    const handleScroll = () => {
        props.data.forEach((userMess, index) => {
            if (containerRef.current[index]) {
                containerRef.current[index].scrollTop = containerRef.current[index].scrollHeight;
            }
        });
    };

    useEffect(() => {
        handleScroll();
    }, [messages]);
    return (
        props.data.length > 0 &&
        props.data.map((userMess, index) => {
            return (
                <div
                    className={cx('message', 'fixed bottom-0', 'bg-white')}
                    key={index}
                    style={{ right: `${330 * index + index * 20 + 10}px` }}
                >
                    <div className={cx('title', 'flex items-center justify-between py-3 pl-2')}>
                        <div className="flex items-center">
                            <img
                                className="w-11 h-11 rounded-full mr-4 object-cover"
                                src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                                alt="avatar"
                            />
                            <div>
                                <h2>{userMess.name}</h2>
                                <span className="text-sm">Đang hoạt động</span>
                            </div>
                            <FontAwesomeIcon className="ml-2" icon={faMagnifyingGlass} />
                        </div>
                        <span
                            className="text-2xl px-2 mr-3 pb-1 rounded-full hover:cursor-pointer hover:bg-custom-rgba flex"
                            onClick={() => props.handleDelete(index)}
                        >
                            &times;
                        </span>
                    </div>
                    <div className={cx('container')} id="container" ref={(el) => (containerRef.current[index] = el)}>
                        {messages.map((message, index) =>
                            message.id === user.user._id && message.toId === userMess._id ? (
                                <div key={index} className="flex items-center pr-2 justify-end mb-3">
                                    <span className="bg-slate-300 px-3 py-2 rounded-full">{message.message}</span>
                                    <img
                                        className="w-9 h-9 rounded-full ml-4 object-cover"
                                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                                        alt="avatar"
                                    />
                                </div>
                            ) : message.toId === user.user._id && userMess._id === message.id ? (
                                <div key={index} className="flex items-center pl-2 mb-3">
                                    <img
                                        className="w-9 h-9 rounded-full mr-4 object-cover"
                                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                                        alt="avatar"
                                    />
                                    <span className="bg-slate-300 px-3 py-2 rounded-full">{message.message}</span>
                                </div>
                            ) : (
                                ''
                            ),
                        )}
                    </div>
                    <div className={cx('footer', 'flex justify-center border-t-2 border-solid border-slate-300 py-3')}>
                        <form
                            onSubmit={(e) => {
                                handleMess(e, userMess._id, index);
                            }}
                        >
                            <input
                                ref={(el) => (inputMess.current[index] = el)}
                                placeholder="Aa"
                                className="py-2 px-2 bg-slate-100 rounded-full outline-transparent"
                            />
                            <button className="px-2 py-1" type="submit">
                                Gửi
                            </button>
                        </form>
                    </div>
                </div>
            );
        })
    );
}

export default memo(Message);
