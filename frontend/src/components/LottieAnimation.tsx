import Lottie from "lottie-react";
import animationData from "../assets/animation.json";

interface LottieAnimationProps {
    width?: string | number;
    height?: string | number;
    className?: string;
}

const LottieAnimation = ({ width = 200, height = 200, className = "" }: LottieAnimationProps) => {
    return (
        <div style={{ width, height }} className={className}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieAnimation;
