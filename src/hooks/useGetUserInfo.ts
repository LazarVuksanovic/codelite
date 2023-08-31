import { auth, firestore } from '@/firebase/firebase';
import { Solution } from '@/utils/types/problem';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {useState, useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

export type IUserData = {
    email: string,
    displayName: string,
    likedProblems: string[],
    dislikedProblems: string[],
    starredProblems: string[],
    solvedProblems: string[],
    solutions: Solution[],
    profileImageUrl?: string | null;
}

export default function useGetUserInfo(){
    const [user] = useAuthState(auth);
    const [userData, setUserData] = useState<IUserData>({
        email: "",
        displayName: "",
        likedProblems: [],
        dislikedProblems: [],
        starredProblems: [],
        solvedProblems: [],
        solutions: [],
        profileImageUrl: null
    });
        

    useEffect(() =>{
        const getUserInfo = async () => {
            const userRef = doc(firestore, "users", user!.uid);
            const userDoc = await getDoc(userRef);

            if(userDoc.exists()){
                setUserData({
                    email: userDoc.data().email,
                    displayName: userDoc.data().displayName,
                    likedProblems: userDoc.data().likedProblems,
                    dislikedProblems: userDoc.data().dislikedProblems,
                    starredProblems: userDoc.data().starredProblems,
                    solvedProblems: userDoc.data().solvedProblems,
                    solutions: userDoc.data().solutions,
                    profileImageUrl: userDoc.data().profileImageUrl
                });
            }
        };
        if(user) {
            getUserInfo();
        }
    }, [user]);
    return {user, userData};
}