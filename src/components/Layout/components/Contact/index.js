import { useCallback, useEffect, useState } from 'react';
import Message from '../../../Message';
import axios from 'axios';
import { useStore } from '../../../../store/hooks';
import { config } from '../../../../state/Constants';
function Contact() {
    const [userFriends, setUserFriend] = useState([]);
    const [userMess, setUserMess] = useState([]);
    const state = useStore()
    const [user] = state
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        config.headers['Authorization'] = `Bearer ${token}`
        axios
            .get(`http://localhost:3000/user/all?id=${user.user._id}`)
            .then(function (response) {
                if (response.data) {
                    setUserFriend(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {});
    }, []);
    const handleDeleteUserMess = useCallback((index) => {
        const newUserMess = [...userMess];
        newUserMess.splice(index, 1)
        setUserMess(newUserMess); 
    }, [userMess]);
    return (
        <div className="w-1/4 ml-20 fixed right-0 rounded overflow-hidden shadow-lg bg-white px-5 py-3 h-full">
            <div>
                <h3 className="text-lg">Người liên hệ</h3>
            </div>
            {userFriends.map((userFriend, index) => {
                return (
                  userFriend._id !== user.user._id ?   <div className="" key={index}>
                  <div
                      className="flex items-center cursor-pointer hover:bg-sky-300 rounded px-2 py-3"
                      onClick={() => {
                        const userIndex = userMess.findIndex(userMe => userMe._id === userFriend._id);
                        if(userIndex !== -1) {
                            const newUserMess = userMess.filter(userMe => userMe._id !== userFriend._id);
                            setUserMess([...newUserMess, userFriend]);
                        }
                       
                        
                        else {
                            setUserMess([...userMess, userFriend]);
                        }
                        
                      }}
                  >
                      <img
                          className="w-11 h-11 rounded-full mr-4 object-cover"
                          src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                          alt="avatar"
                      />
                      <span>{userFriend.name}</span>
                  </div>
              </div> : ''
                );
            })}
            <Message data={userMess} handleDelete={handleDeleteUserMess} />
        </div>
    );
}

export default Contact;
