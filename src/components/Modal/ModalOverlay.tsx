import { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./ModalOverlay.module.css";
import CloseIcon from "../../assets/close_icon.png";

interface ModalProps {
    Title: string
    CloseFunc: () => void
    children: React.ReactNode;
}

const modalRoot = document.getElementById('modal');

const ModalOverlay: React.FC<ModalProps> = (props) => {
    if (!modalRoot) {
        return null
    }

    const handleOverlayClick = () => {
        props.CloseFunc();
    };

    return ReactDOM.createPortal(
        (
            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                <Modal {...props}/>
            </div>
        ), modalRoot
    )
}

const Modal: React.FC<ModalProps> = (props) => {
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.CloseFunc()
            }
        }

        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [props])

    return (
        <div className={styles.modalContainer} onClick={handleModalClick}>
            <div className={`${styles.modalHeadline}`}>
                <h3 className={styles.modalTitle}>{props.Title}</h3>
                <img src={CloseIcon} alt="Close" className={styles.modalCloseIcon} onClick={() => props.CloseFunc()}/>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export default ModalOverlay;