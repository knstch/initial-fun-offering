import logo from "../../assets/full_logo.svg";
import phantomWalletLogo from "../../assets/phantom_wallet_logo.svg"
import googleLogo from "../../assets/google_logo.svg"
import styles from './Header.module.css'
import {Link} from "react-router-dom";

const Header = () => {
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
                <button className={`${styles.headerButton} ${styles.phantomWalletButton}`}>
                    <img src={phantomWalletLogo} alt={`phantom wallet logo`}/>
                    <span className={`roboto-font`}>Connect wallet</span>
                </button>
                <button className={`${styles.headerButton} ${styles.googleButton}`}>
                    <img src={googleLogo} alt={`google logo`}/>
                    <span className={`roboto-font`}>Sign In</span>
                </button>
            </div>
        </header>
    )
}

export default Header;