import Link from 'next/link';
import React from 'react';
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Timer from '../Timer/Timer';
import { useRouter } from 'next/router';
import { problems } from '@/utils/problems';
import { Problem } from '@/utils/types/problem';
import { BsList } from 'react-icons/bs';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { PiBracketsCurlyBold } from 'react-icons/pi'

type TopbarProps = {
    problemPage?: boolean,
    profilePage?: boolean
};

const Topbar:React.FC<TopbarProps> = ({problemPage, profilePage}) => {
    const {user, userData} = useGetUserInfo();

    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    const handleProfileClick = () => {
        router.push("/profilepage");
    }
    const handleProblemChange = (isForward: boolean) => {
        const {order} = problems[router.query.pid as string] as Problem;
        const direction = isForward ? 1 : -1;
        const nextProblemOrder = order + direction;
        const nextProblemKey = Object.keys(problems).find(key => problems[key].order === nextProblemOrder);

        if(isForward && !nextProblemKey){
            const firstProblemKey = Object.keys(problems).find(key => problems[key].order === 1);
            router.push(`/problems/${firstProblemKey}`);
        }
        else if(!isForward && !nextProblemKey){
            const lastProblemKey = Object.keys(problems).find(key => problems[key].order === Object.keys(problems).length);
            router.push(`/problems/${lastProblemKey}`);
        }
        else {
            router.push(`/problems/${nextProblemKey}`);
        }
    };
    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
            <div className={`flex w-full items-center justify-between ${!problemPage? "max-w-[1200px] mx-auto" : ""}`}>
                <Link href='/' className='h-[22px] flex-1'>
                    <Image src="/topbar-logo2.png" alt='logo' height={100} width={100} />
                </Link>

                {problemPage && (
                    <div className='flex items-center gap-4 flex-1 justify-center'>
                        <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-darkfill-2 h-8 w-8 cursor-pointer'
                        onClick={() => handleProblemChange(false)}>
                            <FaChevronLeft/>
                        </div>
                        <Link href='/' className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor pointer'>
                            <div>
                                <BsList />
                            </div>
                            <p>Problem List</p>
                        </Link>
                        <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-darkfill-2 h-8 w-8 cursor-pointer'
                        onClick={() => handleProblemChange(true)}>
                            <FaChevronRight/>
                        </div>
                    </div>
                )}
                <div className='flex items-center space-x-4 flex-1 justify-end'>
                    {!profilePage && (
                        <div>
                            <a href='' target='_blank'rel='noreferrer'
						    className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2'>
							    Premium
						    </a>
                        </div>
                    )}
                    
                    {!user && (
                        <Link href='/auth' onClick={() => {
                            setAuthModalState((prev) => ({...prev, isOpen: true, type:'login'}))
                            }}>
                            <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded'>
                                Sign In
                            </button>
                        </Link>)
                    }
                    
                    {user && !profilePage && (
                        <div className='cursor-pointer group relative'>
                            <img src={`${userData?.profileImageUrl ? userData.profileImageUrl : "/avatar.png"}`} alt='user profile img' className='h-8 w-8 rounded-full group-hover:opacity-50'
                            onClick={handleProfileClick} />
                            <div
								className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange
                                p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300
                                ease-in-out text-base space-y-3'>
                                <p>{userData?.displayName}</p>
                                <p>{userData?.email}</p>
							</div>
                        </div>
                    )
                    }
                    {user && problemPage && <Timer/>}
                    {user && <Logout />}
                </div>
            </div>
        </nav>
    );
}
export default Topbar;


