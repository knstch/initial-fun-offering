import logo from "../../assets/full_logo.svg";
import styles from './Header.module.css'
import {Link} from "react-router-dom";
import { useAuth } from "../../contexts/Auth/AuthProvider";
import WalletButton from "./WalletButton";
import SignInButton from "./SignInButton";
import UserProfile from "./UserProfile";

const Header = () => {
    const auth = useAuth();
    const user = auth.user;

    return (
        <header className={`${styles.header}`}>
            <Link to={"/"}>
                <img src={logo} alt="logo"/>
            </Link>
            <div className={styles.menuItemsGroup}>
                <span className={`roboto-font ${styles.menuItem}`}>Browse campaigns</span>
                <span className={`roboto-font ${styles.menuItem}`}>My campaigns</span>
            </div>
            <div className={styles.buttonGroup}>
                <WalletButton />
                {!user && <SignInButton />}
                {user && <UserProfile />}
            </div>
        </header>
    )
}

export default Header;
