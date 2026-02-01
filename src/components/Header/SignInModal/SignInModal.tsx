import SignInButton from "../SignInButton"
import styles from "./SignInModal.module.css";

const SignInModal = () => {
    return (
        <div className={styles.signInModal}>
            <span>Please, sign in first to link your wallet</span>
            <SignInButton />
        </div>
    )
}

export default SignInModal;