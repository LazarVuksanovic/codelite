import { authModalState } from '@/atoms/authModalAtom';
import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { auth } from '@/firebase/firebase';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type LoginProps = {};

const Login:React.FC<LoginProps> = () => {
    const [inputs, setInputs] = useState({email:'', password:''});
    const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);
    const router = useRouter();
    const setAuthModalState = useSetRecoilState(authModalState);
    const handleClick = (type:'login' | 'register' | 'forgotPassword') => {
        setAuthModalState((prev) => ({...prev, type}));
    };
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password) return alert("Please fill all fields");
        try{
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
            if(!newUser) return;
            router.push("/");
        }
        catch(error: any){
            toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
        }
    };

    useEffect(()=>{
        if(error) toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
    }, [error]);
    return (
        <form className='space-y-8 px-6 py-4' onSubmit={handleLogin}>
            <h3 className='-mt-4 text-2xl font-medium text-white'>Sing in to the LeetClone</h3>
            <div>
                <label htmlFor="email" className='text-base font-medium block mb-2 text-gray-300'>Your Email</label>
                <input onChange={handleInputChange} type='email' name='email' id='email' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='name@company.com'/>
            </div>
            <div>
                <label htmlFor="password" className='text-base font-medium block mb-2 text-gray-300'>Your Password</label>
                <input onChange={handleInputChange} type='password' name='password' id='password' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='Password'/>
            </div>
            <button type='submit' className='w-full text-whit focus:ring-blue-300 font-medium rounded-lg text-sm
            px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'>
                {loading? "Loading..." : "Log In"}
            </button>
            <button onClick={() => handleClick("forgotPassword")} className='flex w-full justify-end'>
                <a href='#' className='-my-4 text-sm block text-brand-orange hover:underline w-full text-right'>
                    Forgot password?
                </a>
            </button>
            <div onClick={() => handleClick("register")} className='text-sm font-medium text-gray-300'>
                Not Registered?{" "}
                <a href='#' className='text-brand-orange hover:underline'>
                    Create account
                </a>
            </div>
        </form>
    )
}
export default Login;