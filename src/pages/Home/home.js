import {useCallback, useEffect, useState } from 'react';
import Post from '../../components/Post';
import UserPost from '../../components/UserPost';
import style from './home.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import { useStore } from '../../store/hooks';
const cx = classNames.bind(style);

function Home() {
    const [posts, setPosts] = useState([])
    const state = useStore()
    const [user] = state
    useEffect(() => {
        axios.get('http://localhost:3000/post')
        .then((response) => {
          setPosts(response.data.data)
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
       
      });
    }, [])

    const handleSetPosts = useCallback((data) => {
        setPosts((prevPosts) => [data, ...prevPosts]);
    }, [])
    return (
       <div>
         <div className="flex-2 flex rounded overflow-hidden shadow-lg bg-white px-5 py-3">
            <div className={cx('w-1/4 px-2 cursor-pointer', 'story')}>
                <div className={cx('h-full relative', 'content')}>
                    <div className={cx('image-story', 'h-3/4 relative')}>
                        <img
                            className="rounded mr-4 h-full object-cover"
                            src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                            alt="avatar"
                        />
                    </div>
                    <div className="bg-white h-1/4 w-full rounded relative p-2">
                        <button className="bg-blue-500 text-white font-bold absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full text-lg">
                            +
                        </button>
                        <span className="absolute bottom-2 font-bold left-1/2 -translate-x-1/2">Tạo Tin</span>
                    </div>
                </div>
            </div>

            <div className={cx('w-1/4 px-2 cursor-pointer', 'story')}>
                <div className={cx('h-full relative', 'content')}>
                    <img
                        className="rounded mr-4 h-full object-cover"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <img
                        className="rounded-full border-solid border-blue-500 border-4 object-cover absolute top-2 left-2 w-12 h-12"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <span className="absolute bottom-2 ml-2">Lê Văn Hoàng</span>
                </div>
            </div>

            <div className={cx('w-1/4 px-2 cursor-pointer', 'story')}>
                <div className={cx('h-full relative', 'content')}>
                    <img
                        className="rounded mr-4 h-full object-cover"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <img
                        className="rounded-full border-solid border-blue-500 border-4 object-cover absolute top-2 left-2 w-12 h-12"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <span className="absolute bottom-2 ml-2">Lê Văn Hoàng</span>
                </div>
            </div>
            <div className={cx('w-1/4 px-2 cursor-pointer', 'story')}>
                <div className={cx('h-full relative', 'content')}>
                    <img
                        className="rounded mr-4 h-full object-cover"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <img
                        className="rounded-full border-solid border-blue-500 border-4 object-cover absolute top-2 left-2 w-12 h-12"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <span className="absolute bottom-2 ml-2">Lê Văn Hoàng</span>
                </div>
            </div>
        </div>
        <div>
            <Post handleAddPost = {handleSetPosts} className="w-full"/>
        </div>
        <div>
            {posts.map((post, index) => {
                return (
                    <UserPost data = {post} key={index} user = {user}/>
                )
            })}
        </div>
       </div>
    );
}

export default Home;
