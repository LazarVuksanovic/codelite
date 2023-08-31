import React from 'react';
import { AiFillLike, AiFillDislike, AiFillStar } from "react-icons/ai";

type TabsProps = {
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const Tabs: React.FC<TabsProps> = ({activeTab, setActiveTab}) => {

    return (
        <div className="radio-inputs p-2 gap-2 pl-0">
            <label onClick={() => setActiveTab(1)} className={`radio bg-dark-layer-2 p-1 rounded-lg
            ${activeTab === 1 ? "text-white" : "text-gray-500"}`}>
                <input type="radio" name="radio"/>
                    <span className="name">Liked</span>
            </label>
            <label onClick={() => setActiveTab(2)} className={`radio bg-dark-layer-2 p-1 rounded-lg
            ${activeTab === 2 ? "text-white" : "text-gray-500"}`}>
                <input type="radio" name="radio"/>
                    <span className="name">Disliked</span>
            </label>

            <label onClick={() => setActiveTab(3)} className={`radio bg-dark-layer-2 p-1 rounded-lg
            ${activeTab === 3 ? "text-white" : "text-gray-500"}`}>
                <input type="radio" name="radio"/>
                    <span className="name">Starred</span>
            </label>
        </div>
    )
}
export default Tabs;