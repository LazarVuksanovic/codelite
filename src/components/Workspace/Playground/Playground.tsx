import React, { useState, useEffect } from 'react';
import PreferenceNav from './PreferenceNav/PreferenceNav';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter';
import { CompilerResponse, Problem, Solution } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { problems } from '@/utils/problems';
import { useRouter } from 'next/router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useLocalStorage from '@/hooks/useLocalStorage';
import testSubmittedCode from '@/utils/apicalls/compilerApiCall';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

type PlaygroundProps = {
    problem:Problem
    setSucces: React.Dispatch<React.SetStateAction<boolean>>
    setSolved: React.Dispatch<React.SetStateAction<boolean>>
};

export interface ISettings{
    fontSize: string,
    settingsModalIsOpen: boolean,
    dropdownIsOpen: boolean
}

const Playground:React.FC<PlaygroundProps> = ({problem, setSucces, setSolved}) => {
    // loader.init().then((monaco) => {
    //     monaco.editor.defineTheme('myTheme', {
    //         base: 'vs-dark',
    //         inherit: true,
    //         rules: [],
    //         colors: {
    //             'editor.background': '#ffffff24',
    //         },
    //     });
    // });
    const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
    const [viewOutput, setViewOutput] = useState<boolean>(false)
    const [compilerResponse, setCompilerResponse] = useState<CompilerResponse | undefined>(undefined)
    const [executing, setExecuting] = useState<boolean>(false)
    let [userCode, setUserCode] = useState<string>(problem.starterCode);

    const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
    const [settings, setSettings] = useState<ISettings>({
        fontSize: fontSize,
        settingsModalIsOpen: false,
        dropdownIsOpen: false
    });

    const [user] = useAuthState(auth);
    const {query: {pid}} = useRouter();

    const handleSubmit = async () => {
        setExecuting(true)
        if(!user){
            toast.error("Please login to submit code", {
                position:"top-center",
                autoClose: 3000,
                theme: "dark"
            });
            return
        }

        const response: CompilerResponse = await testSubmittedCode(userCode, problems[pid as string])
        setCompilerResponse(response)
        setViewOutput(true)
        if(response.success){
            toast.success("Congrats! All tests passed!", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            });
            setSucces(true);
            setTimeout(() => { setSucces(false) }, 4000);

            const newSolution: Solution = {
                id: problem.id,
                code: userCode
            }

            const userRef = doc(firestore, "users", user.uid);
            await updateDoc(userRef, {
                solvedProblems: arrayUnion(pid),
                solutions: arrayUnion(newSolution)
            });
            setSolved(true);
        }
        else {
            toast.error("Incorrect submission. Refer to output for details.", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            })
        }
        setExecuting(false)
    };

    useEffect(() => {
        const code = localStorage.getItem(`code-${pid}`);
        if(user){
            setUserCode(code ?  JSON.parse(code) : problem.starterCode);
        }
        else{
            setUserCode(problem.starterCode);
        }
    }, [pid, user, problem.starterCode]);

    const onChange = (value: string) => {
        setUserCode(value);
        localStorage.setItem(`code-${pid}`, JSON.stringify(value))
    };
    return (
        <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
            <PreferenceNav settings={settings} setSettings={setSettings} />
            <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}>
                <div className="w-full overflow-auto">
                    <CodeMirror 
                        value={userCode}
                        theme={vscodeDark}
                        onChange={onChange}
                        extensions={[javascript()]}
                        style={{fontSize: settings.fontSize}}
                    />
                    {/* <Editor
                        height="100vh"
                        theme='vs-dark'
                        defaultLanguage="javascript"
                        defaultValue={userCode}
                        // onMount={handleEditorDidMount}
                    /> */}
                </div>
                <div className='w-full px-5 overflow-auto'>
                    <div className='flex gap-4 select-none'>
                        <div className='flex h-10 items-center space-x-6' onClick={() => { setViewOutput(false) }}>
                            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                                <div className='text-sm font-medium leading-5 text-white'>Test Cases</div>
                                {!viewOutput && <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}
                            </div>
                        </div>
                        <div className='flex h-10 items-center space-x-6' onClick={() => { setViewOutput(true) }}>
                            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                                <div className='text-sm font-medium leading-5 text-white'>Output</div>
                                {viewOutput && <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />}
                            </div>
                        </div>
                    </div>

                    {viewOutput ?
                        (<div className='mt-4'>
                            {compilerResponse ? 
                            (
                                <div>
                                    {compilerResponse.success? 
                                    (<h1 className='text-green-400 text-2xl'>Correct! Runtime {compilerResponse.cpuTime} sec</h1>
                                    ) : (
                                        <>
                                            <h1 className='text-red-500 text-2xl'>Error!</h1>
                                            <p className='text-red-500'>{compilerResponse?.message}</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className='text-white'>No submission.</div>
                            )}
                        </div>
                        ) : (
                            <>
                                <div className="flex">
                                    {
                                        problem.examples.map((example, index) => (
                                            <div className='mr-2 items-start mt-2' key={example.id}
                                                onClick={() => setActiveTestCaseId(index)}>
                                                <div className="flex flex-wrap items-center gap-y-4">
                                                    <div className={`font-medium items-center transition-all focus:outline-none inline-flex
                                        bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                                        ${activeTestCaseId === index ? "text-white" : "text-gray-500"}`}>
                                                        Case {index + 1}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>

                                <div className='font-semibold my-4'>
                                    <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent
                                    text-white mt-2'>
                                        {problem.examples[activeTestCaseId].inputText}
                                    </div>
                                    <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                                    <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent
                                    text-white mt-2'>
                                        {problem.examples[activeTestCaseId].outputText}
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </Split>
            <EditorFooter handleSubmit={handleSubmit} executing={executing} />
        </div>
    )
}
export default Playground;