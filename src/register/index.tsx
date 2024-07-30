import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegister, usePostRegister } from './hooks';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    let register = usePostRegister()

    const { formValues, handleChange } = useRegister();

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const params = {
            ...formValues,
        }
       await register.execute(params)
    }

    const handleLogin = () => {
        navigate("/login")
    }

    useEffect(() => {

        register.error && toast.error(register.errorData, {
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

        if (!register.error && register.success) {
            navigate("/todos", {state:register.data.user.id});
        }

    }, [register.data, register.errorData])
    return (
        <section className="w-full z-10 h-lvh bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center bg-black bg-opacity-40 px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex justify-center">
                            <span className="pacifico-regular self-center text-3xl font-bold whitespace-nowrap text-dark_pink">Register</span>
                        </div>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                <input
                                    value={formValues.name}
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Your Name"
                                    autoComplete='on'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input value={formValues.email} onChange={handleChange} type="email" name="email" id="email" autoComplete='on' required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input value={formValues.password} onChange={handleChange} type="password" name="password" id="password" autoComplete='on' required placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full text-lg font-bold text-white bg-dark_pink hover:bg-white_pink rounded-lg px-5 py-2.5 text-center">Create an account</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400" onClick={handleLogin}>
                                Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500 underline">Login here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>)
}

export default memo(Register);