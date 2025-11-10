import { useEffect } from "react";
import { formatString } from "../functions";
/* eslint-disable */
// Import your images
import coconut from "../../public/coconut.png";
import crackedCoconut from "../../public/crackedCoconut.png" // Assumes you have this image

type AnswerPopType = {
    answer: string;
    wasRight: boolean;
    scoreChange: string; // e.g., "-0.4x" or "+1.2x"
};

export default function AnswerPopUp(props: AnswerPopType) {
    // This effect can be used to automatically close the popup after a few seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            // Add logic here to close the popup, e.g., by updating parent state
        }, 2000); // Popup disappears after 2 seconds

        return () => clearTimeout(timer);
    }, [props.answer]);

    const isCorrect = props.wasRight;

    return (
        <div className={`fixed font-1 top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-80 ${!isCorrect ? 'animate-shake' : ''}`}>
            {/* Themed dialog box styling */}
            <div className={`font-1 text-white border-4 rounded-lg shadow-lg p-6 text-center 
                ${isCorrect 
                    ? 'bg-success border-success-content' 
                    : 'bg-error border-error-content'
                }`}
            >
                {/* Icon and score change */}
                <div className="flex justify-center items-center gap-2 mb-4">
                    <img 
                        src={isCorrect ? coconut : crackedCoconut} 
                        alt={isCorrect ? "Coconut" : "Cracked Coconut"} 
                        className={`w-12 h-12 ${isCorrect ? 'animate-pulse' : ''}`} 
                    />
                    <p className={`text-2xl font-bold ${isCorrect ? 'text-success-content' : 'text-error-content'}`}>
                        {props.scoreChange}
                    </p>
                </div>

                {/* Message based on correctness */}
                {isCorrect ? (
                    <p className="text-2xl font-bold text-yellow-200">Correct!</p>
                ) : (
                    <div>
                        <p className="text-lg">Incorrect!</p>
                        <p className="text-base mb-2">The correct answer was:</p>
                        <p className="text-xl font-bold text-error-content p-2 bg-black/20 rounded">
                            {formatString(props.answer)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}