import { firestore, storage } from '@/firebase/firebase';
import { IUserData } from '@/hooks/useGetUserInfo';
import { User } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

type ProfileEditModalProps = {
    setProfileEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    currentUserData: IUserData | undefined;
    setCurrentUserData: React.Dispatch<React.SetStateAction<IUserData>>;
    user: User;
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ setProfileEditModal, currentUserData, user, setCurrentUserData }) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [newName, setNewName] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileUploaded = e.target.files && e.target.files[0];
        if (fileUploaded) {
            setSelectedImage(fileUploaded);
        }
    };

    const metadata = {
        contentType: 'image/jpeg'
    };

    const handleImageUpload = async () => {
        if (!user) {
            return;
        }
        if(!selectedImage){
            handleURLAndNameToDatabase();
            return;
        }

        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);
        uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            handleURLAndNameToDatabase(downloadURL);
          });
        }
      );
    };

    const handleURLAndNameToDatabase = async (downloadURL?: string) => {
        const userRef = doc(firestore, "users", user.uid);
        let newData;
        if(!downloadURL){
            newData = {
                ...currentUserData,
                displayName: newName || currentUserData?.displayName
            };
        }
        else{
            newData = {
                ...currentUserData,
                profileImageUrl: downloadURL,
                displayName: newName || currentUserData?.displayName
            };
        }
        
    
        await setDoc(userRef, newData);
        setCurrentUserData(newData as IUserData);
    };

    const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (user) {
            await handleImageUpload();
            setProfileEditModal(false);
        }
    };

    const handleClose = () => {
        setProfileEditModal(false);
    }
    return (
        <>
            <div onClick={() => handleClose()} className='z-40 absolute top-0 left-0 w-full h-full flex items-center
            justify-center bg-black/60 ' />
            <div className='z-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
                bg-dark-layer-1 rounded-lg p-10 text-white text-lg flex flex-col items-start gap-3'>
                <IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0
                hover:text-gray-500 rounded-lg' onClick={() => handleClose()} />
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-10 items-center justify-center mb-16'>
                        <div className='relative flex flex-col items-center gap-4'>
                            <Image
                                src={selectedImage ? URL.createObjectURL(selectedImage) : (currentUserData?.profileImageUrl || "/avatar.png")}
                                width={150} height={150}
                                alt='user profile img'
                                className='transition ease-in-out mx-auto rounded-full w-[150px] h-[150px]' />
                            <input
                                type="file"
                                name='image'
                                onChange={handleFileChange}
                                ref={hiddenFileInput}
                                className='ml-16'
                            />

                        </div>
                        <div className='flex-col space-y-7 text-white mt-5'>
                            <div className='flex justify-between items-center'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-xs' >Name</label>
                                    <input type='text'
                                        placeholder={currentUserData?.displayName}
                                        onChange={handleNewNameChange}
                                        className='rounded-sm px-2 py-1.5 bg-dark-fill-2' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button type='submit' className='text-black py-1.5 px-3 cursor-pointer rounded bg-brand-orange'>
                            Submit
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
}

export default ProfileEditModal;
