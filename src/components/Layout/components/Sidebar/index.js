import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '../../../../store/hooks';
import { faUserGroup, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Sidebar() {
    const state = useStore();
    const [user] = state;
    return (
        <div className="text-blue-500 w-1/4 fixed left-0 ">
            <div className="rounded overflow-hidden shadow-lg bg-white px-5  py-3">
                <Link to = {`/profile?id=${user.user._id}`}>
                <div className="flex items-center cursor-pointer hover:bg-sky-700 pl-2 rounded mr-20 py-2">
                    <img
                        className="w-11 h-11 rounded-full object-cover"
                        src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"
                        alt="avatar"
                    />
                    <span className="ml-2 text-slate-400">{user.user.name}</span>
                </div>
                </Link>

                <Link to={'/friends'}>
                    <div className="pl-2 hover:bg-sky-700 py-2 rounded">
                        <FontAwesomeIcon size="2xl" icon={faUserGroup} className="mr-2" />
                        <span>Bạn bè</span>
                    </div>
                </Link>
                <Link to={'/listFriends'}>
                    <div className="pl-2 hover:bg-sky-700 py-2 rounded">
                        <FontAwesomeIcon size="2xl" icon={faUserPlus} className="mr-2" />
                        <span>Lời mời kết bạn</span>
                    </div>
                </Link>
            </div>
            <div className="shadow-lg bg-white px-5 py-3 mt-4 rounded overflow-hidden">

            </div>
        </div>
    );
}

export default Sidebar;
