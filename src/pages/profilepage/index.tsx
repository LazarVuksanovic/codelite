import Topbar from '@/components/Topbar/Topbar';
import { firestore } from '@/firebase/firebase';
import useGetUserInfo, { IUserData } from '@/hooks/useGetUserInfo';
import { DBProblem } from '@/utils/types/problem';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useState, useEffect } from 'react';
import Tabs from '@/components/Tabs/Tabs';
import { GoCodescan } from 'react-icons/go'
import CodePreview from '@/components/Modals/CodePreview';
import ProfileInfo from '@/components/ProfileInfo';
import useHasMounted from "@/hooks/useHasMounted";

type ProfilePageProps = {
    
};

const ProfilePage:React.FC<ProfilePageProps> = () => {
    const router = useRouter();
    let [displayArray, setDisplayArray] = useState<string[]>([]);
    const {user, userData} = useGetUserInfo();
    const [currentUserData, setCurrentUserData] = useState<IUserData>(userData);
    const problems = useGetProblemInfo();
    const [activeTab, setActiveTab] = useState(1);
    const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
    const [codePreviewModal, setCodePreviewModal] = useState<boolean>(false);

    const [problemPreview, setProblemPreview] = useState<DBProblem | null>(null);
    const handleTabChange = (tabId: number) => {
        setActiveTab(tabId);
        if(currentUserData){
            switch(tabId){
                case 1: setDisplayArray([...currentUserData?.likedProblems]); break;
                case 2: setDisplayArray([...currentUserData?.dislikedProblems]); break;
                case 3: setDisplayArray([...currentUserData?.starredProblems]); break;
                default: setDisplayArray([]); break;
            }
        }
    };

    const handlePreview = (problem: DBProblem) => {
        setCodePreviewModal(true);
        setProblemPreview(problem);
    }

    const handleGoToProblem = (problemId: string) => {
        router.push(`/problems/${problemId}`);
    };

    const handleGetSolution = (problemId: string): string => {
        if(user)
            return currentUserData?.solutions.find(solution => solution.id === problemId)?.code as string;
        return "";
    }

    useEffect(() => {
        setCurrentUserData(userData);
    }, [userData]);

    useEffect(() => {
        let temp: string[] = [];
        problems.forEach(problem => {
            userData?.solutions.forEach(solution => {
                if(solution.id === problem.id)
                temp.push(problem.id);
            })
        })
        setSolvedProblems(temp);
    }, [problems])

    useEffect(() => {
        handleTabChange(activeTab);

    },[activeTab, currentUserData]);

    const hasMounted = useHasMounted();
    if(!hasMounted) return null;

    if(!user){
        return(
            <main className="bg-dark-layer-2 min-h-screen " >
                <Topbar profilePage />
                <p className='text-xl text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    You must be logged in to see your profile
                </p>
            </main>
        )
    }

    return (
        <main className="bg-dark-layer-2 min-h-screen" >
            <Topbar profilePage />
            <div className='flex gap-5 mt-20 justify-center'>
                <ProfileInfo currentUserData={currentUserData} setCurrentUserData={setCurrentUserData} user={user}/>
                <div className='flex flex-col gap-5 w-[700px]'>
                    <div className='bg-dark-layer-1 rounded-lg overflow-auto' >
                        <div className='mx-4 items-start mt-2'>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab}/>
                            <div className='flex flex-wrap w-full gap-2 justify-start mt-10 pb-5'>
                                {problems.filter((problem) => displayArray.includes(problem.id)).map((filtered) => {
                                    return (
                                        <div className='items-center transition-all focus:outline-none inline-flex bg-dark-fill-3
                                    hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap text-white text-md'
                                            onClick={() => handleGoToProblem(filtered.id)}
                                            key={filtered.id}>
                                            {filtered.title}
                                        </div>
                                    )

                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-dark-layer-1 rounded-lg grow overflow-auto flex flex-col gap-10'>
                        <div className='flex justify-between items-center p-5 pb-0'>
                            <h1 className='text-white text-2xl '>Solved</h1>
                            <div className='flex flex-row gap-4'>
                                <p className={`text-xs rounded-[21px] bg-opacity-[.15] px-2.5 py-1 font-medium capitalize bg-olive text-olive`}>
                                    Easy: {problems.filter((problem) => solvedProblems.includes(problem.id)).filter((diff) => diff.difficulty === 'Easy').length}
                                </p>
                                <p className={`text-xs rounded-[21px] bg-opacity-[.15] px-2.5 py-1 font-medium capitalize bg-dark-yellow text-dark-yellow`}>
                                    Medium: {problems.filter((problem) => solvedProblems.includes(problem.id)).filter((diff) => diff.difficulty === 'Medium').length}
                                </p>
                                <p className={`text-xs rounded-[21px] bg-opacity-[.15] px-2.5 py-1 font-medium capitalize bg-dark-pink text-dark-pink`}>
                                    Hard: {problems.filter((problem) => solvedProblems.includes(problem.id)).filter((diff) => diff.difficulty === 'Hard').length}
                                </p>
                            </div>
                        </div>
                        {problems.filter((problem) => solvedProblems.includes(problem.id)).length === 0 ? (
                            <p className='text-center text-white'>Try to solve something first</p>
                        ) : (
                            <table className='table-auto mx-5 rounded border-b mb-5'>
                                <thead className="text-sm text-gray-700 dark:text-gray-400 border-b">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 w-0 font-medium text-left">Title</th>
                                        <th scope="col" className="px-6 py-3 w-0 font-medium text-left">Difficulty</th>
                                        <th scope="col" className="px-6 py-3 w-0 font-medium text-left">Category</th>
                                        <th scope="col" className="px-6 py-3 w-0 font-medium text-left">Code</th>
                                    </tr>
                                </thead>
                                <tbody className='text-white bg-dark-layer-1 max-h-[500px] overflow-y-auto'>
                                    {problems.filter((problem) => solvedProblems.includes(problem.id)).map((filtered, idx) => {
                                        const difficultyColor = filtered.difficulty === "Easy" ? "text-dark-green-s" : filtered.difficulty === "Medium" ?
                                            "text-dark-yellow" : "text-dark-pink";
                                        return (
                                            <tr key={filtered.id} className={`${idx % 2 == 1 ? 'bg-dark-layer-1' : 'bg-dark-layer-2'}`}>
                                                <td className='px-6 py-4'>{filtered.title}</td>
                                                <td className={`px-6 py-4 ${difficultyColor}`}>{filtered.difficulty} </td>
                                                <td className={'px-6 py-4'}>{filtered.category} </td>
                                                <td className={'pl-8 py-4'}><GoCodescan onClick={() => handlePreview(filtered)} className="hover:text-gray-500 hover:cursor-pointer" /></td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                        
                        {codePreviewModal && (
                            <CodePreview
                                problem={problemPreview}
                                setCodePreviewModal={setCodePreviewModal}
                                code={handleGetSolution(problemPreview!.id)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
export default ProfilePage;

function useGetProblemInfo() {
    const [problems, setProblems] = useState<DBProblem[]>([]);
    
    useEffect(() => {
        const getProblems = async () => {
            //fetching data logic
            //setLoadingProblems(true);
            const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const tmp: DBProblem[] = [];
            querySnapshot.forEach((doc) => {
                tmp.push({id:doc.id, ...doc.data()} as DBProblem);
            });
            setProblems(tmp);
            //setLoadingProblems(false);
        }

        getProblems();
    }, []);

    return problems;
}