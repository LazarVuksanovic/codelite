import React from 'react';
import { BsChevronUp } from 'react-icons/bs';

type EditorFooterProps = {
    handleSubmit: () => void;
	executing: boolean
};

const EditorFooter:React.FC<EditorFooterProps> = ({handleSubmit, executing}) => {
    
    return (
        <div className='flex bg-transparent absolute bottom-0 z-10 w-full'>
	        <div className='mx-5 my-[10px] flex justify-between w-full'>
		        <div className='ml-auto flex items-center space-x-4'>
			        <button disabled={executing} className={`px-3 py-1.5 font-medium items-center transition-all focus:outline-none
                    inline-flex text-sm text-white ${executing ? "bg-dark-green-s/35" : "bg-dark-green-s"} hover:bg-green-3 rounded-lg`} onClick={handleSubmit}>
				        {executing ? "Executing" : "Submit"}
			        </button>
		        </div>
	        </div>
        </div>
    )
}
export default EditorFooter;