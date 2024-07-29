import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { config } from "../../state/Constants";

function Register() {
    const emailRef = useRef()
    const passRef = useRef()
    const rePassRef = useRef()
    const nameRef = useRef()
    const [rePassSame, setRePassSame] = useState(true)
    const [isEmailExist, setEmailExist] = useState(false)
    const navigate = useNavigate();
   
   const createUser = (e) => {
    e.preventDefault()
    if (emailRef.current.value === '' || passRef.current.value === '' || nameRef.current.value === '') {
        return;
    }
    if (rePassRef.current.value !== passRef.current.value) {
        setRePassSame(() => false)
        return;   
    }
    const data = {
        email: emailRef.current.value,
        password: passRef.current.value,
        name: nameRef.current.value
    }
    
    axios.post('http://localhost:3000/auth/create', data, config)
    .then(res => {
        console.log(res);
        if (res.data.statusCode === 401) {
            setEmailExist(() => true)
            return;
        }    
        else if (res.data.statusCode === 201) navigate('/login'); 
    })
    .catch(err => {
         console.log(err);
    })
    .finally(() => {});
   }

    return ( 
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div href="" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img
                            className="w-8 h-8 mr-2"
                            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                            alt="logo"
                        />
                        Flowbite
                    </div>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Đăng ký
                            </h1>
                            <form className="space-y-4 md:space-y-6">
                            <div>
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Họ tên
                                    </label>
                                    <input ref={nameRef}
                            
                                        name="name"
                                        id="name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Nguyễn Văn A"
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email
                                    </label>
                                    <input ref={emailRef}
                            
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required=""
                                    />
                                </div>
                                {isEmailExist && <p className="text-sm text-red-500">Email đã tồn tại</p>}
                                <div>
                                    <label
                                        
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Mật khẩu
                                    </label>
                                    <input ref={passRef}
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required=""
                                    />
                                </div>
                                <div>
                                    <label
                                        
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Nhâp lại mật khẩu
                                    </label>
                                    <input ref={rePassRef}
                                        type="password"
                                        name="rePassword"
                                        id="Repassword"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required=""
                                    />
                                </div>
                                {!rePassSame && <p className="text-sm text-red-500"> Vui lòng nhập lại password chính xác </p>}
                                <div className="flex items-center justify-between">
                                    <div onClick={() => navigate('/login')}
                                        href="#"
                                        className="text-sm font-medium cursor-pointer text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Bạn đã có tài khoản? Đăng nhập
                                    </div>
                                </div>
                                <button onClick={(e) => createUser(e)}
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Đăng ký
                                </button>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        
     );
}

export default Register;