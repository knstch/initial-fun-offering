import googleLogo from "../../../assets/google_logo.svg";
import styles from './SignInButton.module.css';
import { useAuth } from "../../../contexts/Auth/AuthProvider";

const SignInButton = () => {
    const auth = useAuth();

    return (
        <button className={`${styles.headerButton} ${styles.googleButton}`} onClick={() => auth.signIn()}>
            <img src={googleLogo} alt="google logo"/>
            <span className="roboto-font">Sign In</span>
        </button>
    );
};

export default SignInButton;
