import React, { useState } from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import Playground from './Playground/Playground';
import { Problem } from '@/utils/types/problem';
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';

type WorkspaceProps = {
    problem:Problem
};

const Workspace:React.FC<WorkspaceProps> = ({problem}) => {
    const {width, height} = useWindowSize();
    const [succes, setSucces] = useState(false);
    const [solved, setSolved] = useState(false);
    return (
        <Split className='split' minSize={0}>
            <ProblemDescription problem={problem} _solved={solved} />
            <div className='bg-dark-fill-2'>
                <Playground problem={problem} setSucces={setSucces} setSolved={setSolved} />
                {succes && (
                    <Confetti gravity={0.3} tweenDuration={4000} width={width-1} height={height-1} />
                )}
            </div>
        </Split>
    )
}
export default Workspace;