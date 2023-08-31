import React from 'react';

type CircleSkeletonProps = {
    
};

const CircleSkeleton:React.FC<CircleSkeletonProps> = () => {
    
    return (
        <div className='space-y-2.5 animate-puls'>
            <div className='felx items-center w-full space-x-2'>
                <div className='h-6 w-6 rounded-full bg-dark-fill-3'/>
            </div>
        </div>
    );
}
export default CircleSkeleton;