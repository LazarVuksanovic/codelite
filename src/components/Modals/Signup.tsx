import React, { useState, useEffect } from 'react';
import {useSetRecoilState} from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { auth, firestore } from '@/firebase/firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

type SignupProps = {
    
};

const Signup:React.FC<SignupProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const handleClick = () => {
        setAuthModalState((prev) => ({...prev, type:'login'}));
    };

    const [inputs, setInputs] = useState({email:'', displayName:'', password:''});
    const router = useRouter();
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

    const handleChangeInput = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({...prev, [e.target.name] :  e.target.value}));
    };
    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password || !inputs.displayName) return alert("Please fill all fields");
        try{
            toast.loading("Creating your account", {position:"top-center", toastId:"loadingToast"})
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password)
            if(!newUser) return;
            const userData = {
                uid: newUser.user.uid,
                email: newUser.user.email,
                displayName: inputs.displayName,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                likedProblems: [],
                dislikedProblems: [],
                solvedProblems: [],
                starredProblems: [],
                solutions: [],
                profileImageUrl: null
            }
            await setDoc(doc(firestore, "users", newUser.user.uid), userData)
            router.push('/');
        }
        catch(error:any){
            toast.error(error.message, {position:"top-center"})
        }
        finally{
            toast.dismiss("loadingToast");
        }
    };

    useEffect(() =>{
        if(error) alert(error.message);
    }, [error]);

    return (
        <form className='space-y-8 px-6 py-4' onSubmit={handleRegister}>
            <h3 className='-mt-4 text-2xl font-medium text-white'>Register to LeetClone</h3>
            <div>
                <label htmlFor="email" className='text-base font-medium block mb-2 text-gray-300'>Email</label>
                <input onChange={handleChangeInput} type='email' name='email' id='email' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='name@company.com'/>
            </div>
            <div>
                <label htmlFor="displayName" className='text-base font-medium block mb-2 text-gray-300'>Display Name</label>
                <input onChange={handleChangeInput} type='displayName' name='displayName' id='displayName' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='Kanye West'/>
            </div>
            <div>
                <label htmlFor="password" className='text-base font-medium block mb-2 text-gray-300'>Password</label>
                <input onChange={handleChangeInput} type='password' name='password' id='password' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='Password'/>
            </div>
            <button type='submit' className='w-full focus:ring-blue-300 font-medium rounded-lg text-base
            px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'>
                {loading? "Registering...":"Register"}
            </button>
            <div className='text-sm font-medium text-gray-300'>
                Already have an account?{" "}
                <a onClick={handleClick} href='#' className='text-brand-orange hover:underline'>
                    Log In
                </a>
            </div>
        </form>
    )
}
export default Signup;