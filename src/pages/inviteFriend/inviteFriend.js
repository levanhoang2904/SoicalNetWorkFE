import { memo, useEffect, useState } from "react";
import { useStore } from "../../store/hooks";
import axios from "axios";
import Friend from "../../components/friend";

function InviteFriend() {
    const state = useStore()
    const [user] = state
    const [listInviteFriends, setListInviteFriends] = useState([])
    useEffect(() => {
        console.log(user.user._id);
        axios.get(`http://localhost:3000/friend/invite?id=${user.user._id}`)
        .then(res => {
            setListInviteFriends(res.data.data)
        })
        .catch(error => {
            console.log(error);
        })
        .finally(res => {})
        
    }, [])
    return ( 
        <div>
            {listInviteFriends.length <= 0 ? "Bạn chưa có lời mời kết bạn nào" : listInviteFriends.map((friend, index) => {
                return (
                    <Friend data = {friend} key = {index} title = "Chấp nhận" />
                )
            })}
        </div>
     );
}

export default memo(InviteFriend);