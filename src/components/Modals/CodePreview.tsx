import { DBProblem } from '@/utils/types/problem';
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { IoClose } from 'react-icons/io5';
import { RxCopy } from 'react-icons/rx'

type CodePreviewProps = {
    problem: DBProblem | null;
    setCodePreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
    code: string;
};

const CodePreview:React.FC<CodePreviewProps> = ({problem, setCodePreviewModal, code}) => {
    const [showModal, setShowModal] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 2000);
    };


    return (
        <>
            <div onClick={() => setCodePreviewModal(false)} className='absolute top-0 left-0 w-full h-full flex items-center
            justify-center bg-black/60 ' />
            <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] pt-2
            bg-dark-layer-1 rounded-lg px-4 py-4 text-white text-lg flex flex-col items-start gap-3'>
                <IoClose fontSize={"35"} className='cursor-pointer absolute -top-16 right-0
                        hover:text-gray-500 rounded-lg' onClick={() => setCodePreviewModal(false)} />
                <div className='flex w-full items-end justify-between'>
                    <p className='text-xl'>{problem?.title}</p>
                    <p className={`text-xs rounded-[21px] bg-opacity-[.15] px-2.5 py-1 font-medium
                                        ${problem?.difficulty === "Easy" ? "bg-olive text-olive" : problem?.difficulty === "Medium" ?
                            "bg-dark-yellow text-dark-yellow" : "bg-dark-pink text-dark-pink"}`}>
                        {problem?.difficulty}
                    </p>
                </div>
                <div className='flex w-full items-end justify-between'>
                    <p>Your submitted solution:</p>
                    <div className='flex items-end'>
                        {showModal && (
                            <div className="bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                Copied!
                            </div>
                        )}
                        <RxCopy className="hover:text-gray-500" onClick={handleCopy} />
                    </div>
                </div>
                <div className="w-full overflow-auto rounded-lg">
                    <CodeMirror
                        value={code}
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        style={{ fontSize: "16px" }}
                        editable={false}
                    />
                </div>
            </div>
        </>

    )
}
export default CodePreview;