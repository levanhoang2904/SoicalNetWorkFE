import { useEffect, useState } from 'react';
import { config } from '../../state/Constants';
import  Friend  from '../../components/friend'
import axios from 'axios';
import { useStore } from '../../store/hooks';
function Friends() {
   const [friends, setFriends] = useState([])
   const state = useStore()
   const [user] = state
    useEffect(() => {
      console.log(friends.length);
        const token = localStorage.getItem('accessToken')
        config.headers['Authorization'] = `Bearer ${token}`
        axios.get(`http://localhost:3000/user/all?id=${user.user._id}`, config)
          .then(function (response) {
                if (response.data) {
                    console.log(response.data);
                    setFriends(response.data)
                }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
           
          });
    }, [])
    return ( 
        <div className="flex flex-wrap h-full">
           {friends.map((friend, index) => {
            return <Friend data = {friend} key = {index} />
           })}
            
        </div>
     );
}

export default Friends;