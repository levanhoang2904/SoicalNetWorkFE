import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faLocationDot, faVideo } from "@fortawesome/free-solid-svg-icons";
import { config } from "../../state/Constants";
import { memo, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useStore } from "../../store/hooks";
import Comment from "../comment/comment";
function Post(props) {
    const token = localStorage.getItem('accessToken')
    config.headers['Authorization'] = `Bearer ${token}`
    const textareaRef = useRef('')
    const fileRef = useRef()
    const state = useStore()
    const [user] = state
    const [images, setImages] = useState([])
 
    const handlePost = () => {
        const data = {
            idUser: user.user._id,
            title: textareaRef.current.value,
            images
        }
        axios.post('http://localhost:3000/post', data, config)
        .then(function (response) {
            if (response.data) {
                props.handleAddPost(response.data.data)
                textareaRef.current.value = ''
                setImages([])
            }
        })
        .catch(function (error) {
        console.log(error);
        })
        .finally(function () {
        
        });
    }

    const uploadImage = () => {
        fileRef.current.click()
    }

    const onChangeFileImage = (e) => {
        if (e.target.files[0].size > 50000) {
            alert("Vui lòng chọn ảnh có kích thước nhỏ hơn")
            return 
        }
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setImages((prevImages) => [...prevImages, reader.result]);
            fileRef.current.value = ''
        }
        reader.onerror = error => {
            console.log("Error", error);
        }
    }

   
    return (
        <div className="w-full rounded overflow-hidden shadow-lg bg-white mt-20">
            
            <div className="px-6 py-4">
                <div className="pb-4 font-bold text-xl mb-2 border-solid border-slate-500 border-b-2">Đăng bài</div>
                <div className="flex mt-5">
                    <img alt="avatar" className="w-12 h-12 mr-3 object-cover rounded-full"  src="https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"/>
                    <textarea ref= {textareaRef} placeholder="Văn ơi, bạn đang nghĩ gì thế" className="flex-1 px-2 pt-2 bg-slate-200 outline-none resize-none h-24 bg-white" />
                    
                </div>
                {images.map((image, index) => (
                        <img key={index} src={image} alt={`uploaded ${index}`} className="w-full h-auto mb-4" />
                    ))}
                <div className="mt-6">
                    <FontAwesomeIcon size="lg" className="mr-5 cursor-pointer" icon={faLocationDot} />
                    <input type="file" hidden ref = {fileRef} onChange={onChangeFileImage}  />
                    <FontAwesomeIcon size="lg" className="mr-5 cursor-pointer" icon={faImage} onClick={uploadImage} />
                    <FontAwesomeIcon size="lg" className="mr-5 cursor-pointer" icon={faVideo} />
                </div>
                <button onClick={handlePost} className="bg-blue-300 rounded-lg px-2 py-2 w-full mt-5 text-white font-bold hover:bg-red-300">Đăng bài</button>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #photography
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #travel
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #winter
                </span>
            </div>
            
        </div>
    );
}

export default memo(Post);
