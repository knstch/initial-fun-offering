import logo from "../../assets/full_logo.svg";
import phantomWalletLogo from "../../assets/phantom_wallet_logo.svg"
import googleLogo from "../../assets/google_logo.svg"
import styles from './Header.module.css'
import {Link} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "../../contexts/Snackbar/SnackbarContext";
import {useAuth} from "../../contexts/Auth/AuthProvider";
import { useModal, usePhantom } from "@phantom/react-sdk";
import { Truncate } from "src/helpers/turncate_text";
import axios from "axios";
import { operations } from "wallets-ido-api/public/generated/wallets.public";

interface Wallet {
    address: string;
    isVerified: boolean;
}

const TRUNCATE_ADDRESS_LENGTH = 8;

const setWalletAddressToStorage = (address: string) => {
    localStorage.setItem("wallet", JSON.stringify({ address, isVerified: false } as Wallet));
}

const getWalletAddressFromStorage = () => {
    const wallet = localStorage.getItem("wallet");
    return wallet ? JSON.parse(wallet) as Wallet : null;
}

const removeWalletAddressFromStorage = () => {
    localStorage.removeItem("wallet");
}

const updateWalletAddressInStorage = (address: string, isVerified: boolean) => {
    const wallet = getWalletAddressFromStorage();
    if (wallet) {
        wallet.address = address;
        wallet.isVerified = isVerified;
        localStorage.setItem("wallet", JSON.stringify(wallet));
    }
}

const Header = () => {
    const auth = useAuth();
    const { showSnackbar } = useSnackbar();
    const { open, close, isOpened } = useModal();
    const { isConnected, addresses } = usePhantom();

    const [error, setError] = useState<Error | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const profileWrapperRef = useRef<HTMLDivElement>(null);
    const user = auth.user;

    useEffect(() => {
        if (error) {
            showSnackbar("An error occurred while signing in, please try again.", 'error');
        }
    }, [error, showSnackbar]);
    
    useEffect(() => {
        if (isConnected) {
            getWallet().then((res) => {
                if (res.isFound) {
                    setWalletAddressToStorage(res)
                }
            })
        }
    }, [isConnected]);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownOpen]);

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
                {
                    !isConnected && (
                        <button className={`${styles.headerButton} ${styles.phantomWalletButton}` } onClick={() => open()}>
                            <img src={phantomWalletLogo} alt={`phantom wallet logo`}/>
                            <span className={`roboto-font`}>Connect wallet</span>
                        </button>
                    )
                }
                {
                    isConnected && (
                        <div className={`${styles.headerButton} ${styles.phantomWalletButtonLinkedWalled}`}>
                            <span className={`roboto-font`}>{Truncate(addresses[0].address, TRUNCATE_ADDRESS_LENGTH)}</span>
                        </div>
                    )
                }
                {
                    !user && (
                        <button className={`${styles.headerButton} ${styles.googleButton}`} onClick={() => auth.signIn()}>
                            <img src={googleLogo} alt={`google logo`}/>
                            <span className={`roboto-font`}>Sign In</span>
                        </button>
                    )
                }
                {
                    user && (
                        <div ref={profileWrapperRef} className={styles.profileWrapper}>
                            <img src={user.profilePicture} className={styles.profilePicture} alt="profile" onClick={() => setDropdownOpen(!dropdownOpen)} />
                            {dropdownOpen && (
                                <div className={styles.dropDownMenu}>
                                    <span className={styles.dropdownMenuItem}>Welcome, {user.firstName}!</span>
                                    <button className={`${styles.dropdownMenuItem} ${styles.dropdownMenuLastButton}`} onClick={() => auth.signOut()}>
                                        <span className="roboto-font">Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </header>
    )
}

type GetWalletOp = operations["Wallets_GetWallet"];
type GetWalletOpResponse = GetWalletOp["responses"]["200"]["schema"];

interface WalletStatus {
    isFound?: boolean;
    isVerified?: boolean;
}

const getWallet = async (): Promise<WalletStatus> => {
    const auth = useAuth();

    try {
        const resp = await axios.get<GetWalletOpResponse>(`${process.env.REACT_APP_WALLETS_HOST}/getWallet`, {
            withCredentials: true,
        });
        return {
            isFound: true,
            isVerified: resp.data.is_verified,
        } as WalletStatus;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                auth.refreshTokens();
                getWallet();
            }
            if (error.response?.status === 404) {
                return {
                    isFound: false,
                } as WalletStatus;
            }
        }
        throw error;
    }
}

export default Header;
