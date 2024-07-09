import classNames from 'classnames/bind';
import style from './userpost.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComment,
    faFaceAngry,
    faFaceSadTear,
    faFaceSmile,
    faHeart,
    faShareNodes,
    faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { config } from '../../state/Constants';
import { formatDistanceToNow } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import Comment from '../comment/comment';
import socket from '../../socket/socket';
import { useStore } from '../../store/hooks';
const cx = classNames.bind(style);
function UserPost(props) {
    const [name, setName] = useState();
    const commentRef = useRef();
    const state = useStore();
    const [user] = state;
    const [comments, setComment] = useState(props.data.comments);
    const [likeLength, setLikeLength] = useState(0);
    const [bgLiked, setBgLiked] = useState('');
    const [render, setRender] = useState(false)
    useEffect(() => {
        const reactionTypes = ['likes', 'hearts', 'smiles', 'sads', 'angrys'];
        
        const updateLength = () => {
            for (let i = 0 ; i < reactionTypes.length; i++) {
                props.data[reactionTypes[i]].map(like => {
                    if (like._id === user.user._id && props.data.idUser === user.user._id && likeLength > 0) setBgLiked('text-blue-500'); 
                })
            }
        setLikeLength(props.data.likes.length + props.data.hearts.length + props.data.smiles.length +  props.data.sads.length +  props.data.angrys.length)

        }

        updateLength()
        socket.on('comment', (comment) => {
            if (props.data._id === comment.idPost)
                setComment((prevComment) => {
                    return [
                        ...prevComment,
                        {
                            idUser: {
                                _id: comment.idUser._id,
                                name: comment.idUser.name,
                            },
                            comment: comment.comment,
                            createdAt: new Date()
                        },
                    ];
                });
        });
        socket.on('like', (like) => {
            if (like.status === 200) {
                if (props.data._id === like.idPost) {
                    if (like.idUser === user.user._id) {
                        setBgLiked('text-blue-500');
                    }
                    if (like.likeCurrent === '')   {
                        setLikeLength((prevLike) => prevLike + 1);
                    }
                    if (like.likeCurrent !== '') 
                     {
                        setRender((prevRender => !prevRender))
                        props.data[like.likeCurrent].length -= 1;
                    }
                    props.data[like.categoryLike + 's'].length += 1;
                }
               
            } else if (like.status === 201) {
                if (props.data._id === like.idPost) {
                     if (like.idUser === user.user._id) {
                        setBgLiked('');
                    }
                    setLikeLength((prevLike) => prevLike - 1);
                    props.data[like.categoryLike + 's'].length -= 1;
                
                }
               
            }
        });

        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;

            axios
                .get(`http://localhost:3000/user/${props.data.idUser}`)
                .then(function (response) {
                    if (response.data.statusCode === 200) {
                        setName(response.data.data.name);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {});
        }

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('comment');
            socket.off('like');
        };
    }, [props.data._id, props.data.idUser, likeLength]);
    useEffect(() => {}, [likeLength]);
    const handleLikePost = (like) => {
        axios
            .patch(
                `http://localhost:3000/post?categoryLike=${like}&idUser=${user.user._id}&idPost=${props.data._id}`,
                config,
            )
            .then((res) => {
                if (res.data.statusCode === 200) {
                    
                    socket.emit('like', {
                        idPost: props.data._id,
                        status: 200,
                        likeCurrent: res.data.likeCurrent,
                        idUser: user.user._id,
                        categoryLike: like,
                    });
                    socket.emit('notifiReact', {
                        idPost: props.data._id,
                        idUser: props.data.idUser,
                        categoryNotifi: 'react',
                        idAction: user.user._id
                    });
                } else if (res.data.statusCode === 201) {
                    socket.emit('like', {
                        idPost: props.data._id,
                        status: 201,
                        idUser: user.user._id,
                        categoryLike: like,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally((res) => {});
    };
    const handleComment = useCallback(
        (e) => {
            e.preventDefault();
            socket.emit('comment', {
                comment: commentRef.current.value,
                idPost: props.data._id,
                idUser: {
                    _id: user.user._id,
                    name: user.user.name,

                },
                createdAt: new Date(),
            });

            
           
            const payload = {
                idUser: user.user._id,
                comment: commentRef.current.value,
            };
            config['data'] = payload;
            axios
                .post(`http://localhost:3000/comment?idPost=${props.data._id}`, config)
                .then((res) => {
                    if (res.data)  socket.emit('notifiReact', {
                        idPost: props.data._id,
                        idUser: props.data.idUser,
                        categoryNotifi: 'comment',
                        idAction: user.user._id
                    });
                })
                .catch((error) => {})
                .finally((res) => {
                    commentRef.current.value = '';
                });
        },
        [user.user._id, user.user.name, props.data._id],
    );

    const handleDelete = (idComment, index) => {
        const newCommets = [...comments];
        newCommets.splice(index, 1);
        setComment(newCommets);
            axios
                .delete(`http://localhost:3000/comment?idComment=${idComment}&idPost=${props.data._id}`, config)
                .then((res) => {
                    if (res.data.statusCode === 200) {
                        const newCommets = [...comments];
                        newCommets.splice(index, 1);
                        setComment(newCommets);
                    }
                })
                .catch((error) => {})
                .finally((res) => {});
    };
    return (
        <div className="w-full rounded overflow-hidden shadow-lg bg-white mt-20">
            <div className="px-6 py-4">
                <div className="pb-4 font-bold text-xl mb-2 flex items-center">
                    <img
                        alt="avatar"
                        className="w-12 h-12 mr-3 object-cover rounded-full"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                    />
                    <div>
                        <div className="text-sm font-normal">{name}</div>
                        <div className="text-sm text-slate-400 font-thin">
                            {formatDistanceToNow(props.data.createdAt, { addSuffix: true, locale: viLocale })}
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <span>{props.data.title}</span>
                    <div className="w-full flex h-96 mt-5 h-full">
                        <div className={'w-full h-full flex flex-wrap -mx-1'}>
                            {props.data.images.length <= 4 &&
                                props.data.images.map((image, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`${
                                                index === 2 || (index === 0 && props.data.images.length === 1)
                                                    ? 'w-full pt-2'
                                                    : 'w-1/2 pt-2 '
                                            } px-1 cursor-pointer h-full`}
                                        >
                                            <img className="w-full h-full object-cover" alt="" src={image} />
                                        </div>
                                    );
                                })}
                            {props.data.images.length > 4 && (
                                <div className="w-1/2 px-1 overlow-hidden">
                                    {props.data.images.map((image, index) => {
                                        return (
                                            index <= 1 && (
                                                <div className={`w-full cursor-pointer h-1/2`} key={index}>
                                                    <img className="w-full h-full object-cover" alt="" src={image} />
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            )}

                            {props.data.images.length > 4 && (
                                <div className="w-1/2  overlow-hidden px-1">
                                    {props.data.images.map((image, index) => {
                                        return (
                                            index > 1 && (
                                                <div
                                                    key={index}
                                                    className={cx(
                                                        'h-1/3 cursor-pointer relative',
                                                        `${index === props.data.images.length - 1 ? 'last-img' : ''}`,
                                                    )}
                                                >
                                                    <img className="h-full w-full object-cover" alt="" src={image} />
                                                    {index === props.data.images.length - 1 ? <span className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold text-white text-2xl">
                                                        +3
                                                    </span>: ''}
                                                </div>
                                            )
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex mt-3 items-center justify-between">
                    <div className="flex items-center">
                        {props.data.likes.length > 0 && (
                            <div className="rounded-full px-2 py-2 bg-blue-300 z-40">
                                <FontAwesomeIcon color="white" icon={faThumbsUp} />
                            </div>
                        )}
                        {props.data.hearts.length > 0 && (
                            <div className="-ml-2 rounded-full px-2 py-2 bg-red-300 z-30">
                                <FontAwesomeIcon color="white" icon={faHeart} />
                            </div>
                        )}
                         {props.data.smiles.length > 0 && (
                            <div className="-ml-2 rounded-full px-2 py-2 bg-yellow-300 z-20">
                                <FontAwesomeIcon color="white" icon={faFaceSmile} />
                            </div>
                        )}
                         {props.data.sads.length > 0 && (
                            <div className="-ml-2 rounded-full px-2 py-2 bg-orange-300 z-10">
                                <FontAwesomeIcon color="white" icon={faFaceSadTear} />
                            </div>
                        )}
                         {props.data.angrys.length > 0 && (
                            <div className="-ml-2 rounded-full px-2 py-2 bg-red-300 z-0">
                                <FontAwesomeIcon color="white" icon={faFaceAngry} />
                            </div>
                        )}
                        {likeLength > 0 && <div className="ml-2">{likeLength}</div>}
                    </div>
                    <div>
                        <span>{comments.length} bình luận</span>
                    </div>
                </div>

                <div className="flex justify-around w-full py-3 border-solid border-t-2 border-b-2 border-black-300 mt-5">
                    <div className="flex-1 text-center">
                        <FontAwesomeIcon className={`mr-2 cursor-pointer ${bgLiked}`} icon={faThumbsUp} />
                        <span className={`group cursor-pointer relative ${bgLiked}`}>
                            Thích
                            <div className="group-hover:flex hidden absolute top-0 group-hover:animate-moveTop bg-white border-solid border-2 border-black px-2 py-2 z-50 rounded-full">
                                <div
                                    onClick={() => {
                                        handleLikePost('like');
                                    }}
                                    className="rounded-full px-2 py-2 bg-blue-300 z-10 mr-1 hover:scale-150"
                                >
                                    <FontAwesomeIcon color="white" icon={faThumbsUp} />
                                </div>
                                <div
                                    onClick={() => {
                                        handleLikePost('heart');
                                    }}
                                    className="rounded-full px-2 py-2 bg-red-300 mr-1 hover:scale-150"
                                >
                                    <FontAwesomeIcon color="white" icon={faHeart} />
                                </div>

                                <div
                                    onClick={() => {
                                        handleLikePost('smile');
                                    }}
                                    className="rounded-full px-2 py-2 bg-yellow-300 mr-1 hover:scale-150"
                                >
                                    <FontAwesomeIcon color="white" icon={faFaceSmile} />
                                </div>

                                <div
                                    onClick={() => {
                                        handleLikePost('sad');
                                    }}
                                    className="rounded-full px-2 py-2 bg-orange-300 mr-1 hover:scale-150"
                                >
                                    <FontAwesomeIcon color="white" icon={faFaceSadTear} />
                                </div>

                                <div
                                    onClick={() => {
                                        handleLikePost('angry');
                                    }}
                                    className="rounded-full px-2 py-2 bg-red-300 hover:scale-150"
                                >
                                    <FontAwesomeIcon color="white" icon={faFaceAngry} />
                                </div>
                            </div>
                        </span>
                    </div>

                    <div className="flex-1 text-center">
                        <FontAwesomeIcon className="mr-2 cursor-pointer" icon={faComment} />
                        <span className="cursor-pointer">Bình luận</span>
                    </div>

                    <div className="flex-1 text-center">
                        <FontAwesomeIcon className="mr-2 cursor-pointer" icon={faShareNodes} />
                        <span className="cursor-pointer">Chia sẻ</span>
                    </div>
                </div>

                <div className="flex mt-5">
                    <img
                        alt="avatar"
                        className="w-12 h-12 mr-3 object-cover rounded-full"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                    />
                    <form className="flex flex-1 mr-3">
                        <textarea
                            ref={commentRef}
                            placeholder="Nhập bình luận"
                            className="flex-1 resize-none pt-4 max-h-96 rounded-full px-4 outline-none bg-slate-300 mr-3"
                        />
                        <button type="submit" onClick={handleComment}>
                            Gửi
                        </button>
                    </form>
                </div>
            </div>

            <div className="px-6">
                <Comment comments={comments} deleteComment={handleDelete} />
            </div>
        </div>
    );
}

export default memo(UserPost);
