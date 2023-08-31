import { IUserData } from '@/hooks/useGetUserInfo';
import Image from 'next/image';
import React, { useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import ProfileEditModal from './Modals/ProfileEditModal';
import { User } from 'firebase/auth';

type ProfileInfoProps = {
    currentUserData: IUserData | undefined;
    setCurrentUserData: React.Dispatch<React.SetStateAction<IUserData>>;
    user: User;
};

const ProfileInfo:React.FC<ProfileInfoProps> = ({currentUserData, setCurrentUserData, user}) => {
    const [profileEditModal, setProfileEditModal] = useState<boolean>(false);

    return (
        <>
            <div className='bg-dark-layer-1 rounded-lg p-10 flex-col items-center justify-center' >
                <div className='relative group flex flex-col items-center gap-3'>
                    <Image src={currentUserData?.profileImageUrl ? currentUserData.profileImageUrl : '/avatar.png'}
                        width={150} height={150}
                        alt='user profile img'
                        className='transition ease-in-out mx-auto rounded-full w-[150px] h-[150px]' />
                    <TbEdit onClick={() => setProfileEditModal(true)}
                        size={24}
                        className="text-white hover:opacity-60 transition ease-in-out" />
                </div>
                <div className='flex-col space-y-7 text-white mt-5'>
                    <div>
                        <label className='text-xs' >Name</label>
                        <p className='text-sm'>{currentUserData?.displayName}</p>
                    </div>
                    <div>
                        <label className='text-xs' >Email</label>
                        <p className='text-sm'>{currentUserData?.email}</p>
                    </div>
                    <div>
                        <label className='text-xs' >Date Created</label>
                        <p className='text-sm'>12/12/2020</p>
                    </div>
                </div>
            </div>
            {profileEditModal && (
                <ProfileEditModal
                    setProfileEditModal={setProfileEditModal}
                    currentUserData={currentUserData}
                    setCurrentUserData={setCurrentUserData}
                    user={user} />
            )}
        </>
    )
}
export default ProfileInfo;