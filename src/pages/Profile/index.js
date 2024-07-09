import {
  faCakeCandles,
  faGlobe,
  faPersonHalfDress,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/hooks';
import axios from 'axios';
import UserPost from '../../components/UserPost';
import { Link, useLocation } from 'react-router-dom';
import { config } from '../../state/Constants';
function Profile() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const [friends, setFriends] = useState([]);
  const state = useStore();
  const [user] = state;
  const id = new URLSearchParams(location.search).get('id');
  const [profile, setProfile] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:3000/post/detailByIdUser?id=${id}`)
      .then((response) => {
        setPosts(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
    axios
      .get(`http://localhost:3000/friend?id=${id}`)
      .then((response) => {
        setFriends(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});

      axios
      .get(`http://localhost:3000/user/${id}`)
      .then((response) => {
        if (response.data.statusCode === 200) {
            setProfile(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }, [id]);
  return (
    <div className="px-[100px]">
      <div className="relative rounded overlow-hidden bg-white">
        <img
          src="https://wpkixx.com/html/pitnik/images/resources/profile-image.jpg"
          alt="ảnh bìa"
          className="object-cover h-96 w-full rounded"
        />
        <img
          src="https://wpkixx.com/html/pitnik/images/resources/author.jpg"
          alt="avatar"
          className="rounded-full absolute bottom-2 left-3 border-solid border-white border-2"
        />
        <div className="absolute bottom-[70px] left-[200px] text-white text-2xl">
          <span>{profile && profile.name}</span> <br />
          <span className="text-lg cursor-pointer hover:text-blue-500">
            Chỉnh sửa ảnh đại diện
          </span>
        </div>
      </div>
      <div className="bg-white flex justify-between items-center">
        <ul className="bg-white flex">
          <li className="text-lg ml-3 px-3 py-3 hover:text-blue-300 cursor-pointer">
            Bài viết
          </li>
          <li className="text-lg ml-3 px-3 py-3 hover:text-blue-300 cursor-pointer">
            Giới thiệu
          </li>
          <li className="text-lg ml-3 px-3 py-3 hover:text-blue-300 cursor-pointer">
            Bạn bè ({friends.length > 0 ? friends[0].friends.length : 0})
          </li>
        </ul>
      </div>

      <div className="w-full flex mt-5">
        <div className=" w-1/3 mr-4 mt-[80px]">
          <div className="px-3 rounded overflow-hidden shadow-lg bg-white inline-block self-start flex flex-col">
            <div className="text-lg border-b-2 border-b-2 border-solid border-slate-500 py-4 ">
              Thông tin cá nhân
            </div>

            <div className="mt-3">
              <div className="flex items-center py-3">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span className="text-sm">
                  Hi, I’m John Carter, I’m 36 and I work as a Digital Designer
                  for the “dewwater” Agency in Ontario, Canada
                </span>
              </div>
              <div className="flex items-center py-3">
                <FontAwesomeIcon icon={faCakeCandles} className="mr-2" />
                <span className="text-sm">29/04/2002</span>
              </div>
              <div className="flex items-center py-3">
                <FontAwesomeIcon icon={faPersonHalfDress} className="mr-2" />
                <span className="text-sm">Nam</span>
              </div>

              <div className="flex items-center py-3">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                <span className="text-sm">Việt Nam</span>
              </div>
            </div>
          </div>
          <div className="rounded overflow-hidden shadow-lg bg-white inline-block px-3 w-full mr-4 mt-[80px] self-start py-3">
            <h2 className="text-xl mb-2">Bạn bè</h2>
            <span>
              {friends.length > 0 ? friends[0].friends.length : '0'} người bạn
            </span>
            {friends.length > 0 &&
              friends[0].friends.map((friend, i) => {
                return (
                  <Link to={`/profile?id=${friend.idFriend._id}`} key={i}>
                    <div className="mt-3 w-1/3 cursor-pointer" >
                      <img
                        src="https://wpkixx.com/html/pitnik/images/resources/author.jpg"
                        alt="avatar"
                        className="rounded-lg border-solid border-white border-2 w-full mb-1"
                      />
                      <span className="text-sm hover:underline">
                        {friend.idFriend && friend.idFriend.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className="flex-1">
          {posts.map((post, index) => {
            return <UserPost data={post} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
