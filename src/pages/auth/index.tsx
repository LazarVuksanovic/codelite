import Navbar from '@/components/Navbar/Navbar';
import React, { useEffect, useState } from 'react';
import AuthModal from '@/components/Modals/AuthModal';
import{useRecoilValue} from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import Image from 'next/image';

type AuthPageProps = {};

const AuthPage:React.FC<AuthPageProps> = () => {
    const authModal = useRecoilValue(authModalState);
    const [user, loading, error] = useAuthState(auth);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();

    useEffect(() =>{
        if(user) router.push('/');
        if(!loading && !user) setPageLoading(false);
    }, [user, router, loading]);

    if(pageLoading) return null;

    return(
        <div className='bg-[url("/bg-auth.png")] from-gray-600 to-black h-screen relative'>
            <div className='max-w-7xl mx-auto'>
                <Navbar/>
                {authModal.isOpen && <AuthModal/>}
            </div>
        </div>  
    ) 
}
export default AuthPage;