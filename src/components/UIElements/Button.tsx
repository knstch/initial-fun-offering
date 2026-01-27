import React from "react";
import styles from "./Button.module.css"

interface ButtonProps {
    text: string;
    onClick?: () => void;
    isSecondary?: boolean;
    icon?: React.ReactNode;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({text, onClick, isSecondary, icon, type = "button"}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.defaultButton} roboto-font ${isSecondary ? `${styles.secondaryButton}` : ``}`}
        >
            {icon && <span className="btn__icon">{icon}</span>}
            <span>{text}</span>
        </button>
    );
};

export default Button;