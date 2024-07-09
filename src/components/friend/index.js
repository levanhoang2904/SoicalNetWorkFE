import React, { memo, useEffect, useState } from "react";
import { useStore } from "../../store/hooks";
import axios from 'axios';
import { config } from "../../state/Constants";
function Friend(props) {
    const [isFriend, setIsFriend] = useState(false);
    const state = useStore()
    const[user] = state
    const [friends, setFriends] = useState([])
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        config.headers['Authorization'] = `Bearer ${token}`
        axios.get(`http://localhost:3000/friend?id=${user.user._id}`, config)
          .then(function (response) {
                if (response.data) {
                    setFriends(response.data)
                }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
           
          });
    }, [isFriend])

    const checkAddFriend = () => {
        let listFriend = []
        friends.map(item => {
            item.friends.map(friend => {
                listFriend = [...listFriend, friend]
            })
        })
        
       return listFriend.some(item => {
        return item.idFriend._id === props.data._id && item.status === 0
       });
    }

    const handleAddFriend = () => {
        
        config['data'] = {
            idUser: user.user._id,
            idFriend: props.data._id
        }
        axios
            .post(`http://localhost:3000/friend?id=${user.user._id}`, config)
            .then(function (response) {
                if (response.data) {
                    setIsFriend(!isFriend);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {});
    };

    const handleConfirm = (confirm) => {
        axios
        .patch(`http://localhost:3000/friend/confirm?idUser=${props.data.idUser._id}&idFriend=${user.user._id}&confirm=${confirm}`, config)
        .then(function (response) {
            if (response.data) {
                // setIsFriend(!isFriend);
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {});
    }
    

    return (
        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 rounded-lg overflow-hidden px-1 pb-2">
            <div className="bg-white py-2">
                <div className="w-full h-3/4 px-2 cursor-pointer">
                    <img
                        className="w-full h-full object-cover mb-3"
                        src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-thien-nhien-3d-005.jpg"
                        alt="Friend"
                    />
                    <div className="flex flex-col">
                        <span className="pl-3 text-lg">
                            {props.title && props.data.idUser.name }
                            {!props.title && props.data.name}</span>
                        {props.title && <button
                            onClick={() => {handleConfirm(true)}}
                            className="bg-blue-500 text-white font-bold py-2 rounded-lg mt-3 transition duration-300 ease-in-out hover:bg-blue-700"
                        >
                            Xác nhận
                        </button>}
                        {!props.title && <button
                            onClick={handleAddFriend}
                            className="bg-blue-500 text-white font-bold py-2 rounded-lg mt-3 transition duration-300 ease-in-out hover:bg-blue-700"
                        >
                            {!checkAddFriend() === false  ? "Hủy lời mời" :"Kết bạn"}
                        </button> }
                        {props.title && <button
                            onClick={handleAddFriend}
                            className="bg-blue-500 text-white font-bold py-2 rounded-lg mt-3 transition duration-300 ease-in-out hover:bg-blue-700"
                        >
                            Hủy
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Friend);
