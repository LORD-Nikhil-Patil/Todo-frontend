import React, {useEffect} from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

import {useFormInput, useLogIn} from "./hooks"

 const Login = (): JSX.Element => {
    const logIn = useLogIn()
    const { state } = useLocation();
    const navigate = useNavigate();

    const {formValues, handleChange} = useFormInput();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let params = {
            ...formValues
        }
        logIn.execute(params)
    };
    
    const handleSignUp = () => {
        navigate("/")
    }

    useEffect(()=>{
        logIn.error && toast.error(logIn.errorData, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

        if (!logIn.error && logIn.success) {
            navigate(state?.path || "/todos", {state: logIn.data?.user.id});
        } 
    },[logIn.data])

  return (
    <section className="fixed w-full z-10 top-0 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center bg-black bg-opacity-40 px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex justify-center">
                            <span className="pacifico-regular self-center text-3xl font-extrabold whitespace-nowrap text-dark_pink">Log in</span>
                        </div>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input value={formValues.email} onChange={handleChange} type="email" name="email" id="email" autoComplete='on' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input value={formValues.password} onChange={handleChange} type="password" name="password" id="password" autoComplete='on' required placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 bg-dark_pink text-lg font-bold hover:bg-white_pink rounded-md px-5 py-2.5 text-center">Enter</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400" onClick={handleSignUp}>
                                Don't have an account? <span className="font-medium text-primary-600 hover:underline dark:text-primary-500 underline">Sing up here</span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
  );
}

export default Login;