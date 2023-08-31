import { auth } from '@/firebase/firebase';
import React, { useEffect, useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

type ResetPasswordProps = {
    
};

const ResetPassword:React.FC<ResetPasswordProps> = () => {
    const [email, setEmail] = useState('');
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
    const handleReset = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await sendPasswordResetEmail(email);
          if (success) {
            toast.success("Password reset email sent.", {position: "top-center", autoClose: 3000, theme: "dark"});
          }
    };

    useEffect(()=>{
        if(error) alert(error.message);
    },[error]);

    return (
        <form className='space-y-8 px-6 pt-4 sm:pb-6 xl:pb8' onSubmit={handleReset}>
            <h3 className='-mt-4 text-2xl font-medium text-white'>Reset Password</h3>
            <p className='text-sm text-white'>
                Forgoten your password? Enter your e-mail addres below, and we&apos;ll send you an e-mail allowing you to reset it.
            </p>
            <div>
                <label htmlFor="email" className='text-base font-medium block mb-2 text-gray-300'>Your Email</label>
                <input onChange={(e) => setEmail(e.target.value)} type='email' name='email' id='email' 
                className='border-2 outline-none sm:text-sm text-white rounded-lg focus:ring-blue-500 focus:boredr-blue
                block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-while' placeholder='name@company.com'/>
            </div>
            <button type='submit' className='w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base
            px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s'>
                Reset Password
            </button>
        </form>
    )
}
export default ResetPassword;