import { useCallback, useEffect, useState } from "react";
import { useAuth } from "src/contexts/Auth/AuthProvider";
import phantomWalletLogo from "../../../assets/phantom_wallet_logo.svg";
import styles from './WalletButton.module.css';
import { usePhantom, useModal } from "@phantom/react-sdk";
import { Truncate } from "src/helpers/turncate_text";
import ModalOverlay from "src/components/Modal/ModalOverlay";
import SignInModal from "../SignInModal/SignInModal";
import axios from "axios";
import { definitions } from "wallets-ido-api/public/generated/wallets.public";

const TRUNCATE_ADDRESS_LENGTH = 8;

type AddWalletsRequest = definitions["publicAddWalletsRequest"];

const WalletButton = () => {
    const auth = useAuth();
    const { isConnected, addresses } = usePhantom();
    const { open } = useModal();
    const [showSignInModal, setShowSignInModal] = useState(false);

    const wallets: string[] = [];
    addresses?.forEach(address => {
        wallets.push(address.address);
    });

    const linkWallets = useCallback(async (wallets: string[]) => {
        const accessToken = auth.getAccessToken();
        if (!accessToken) return;

        const body: AddWalletsRequest = { pubkeys: wallets };
    
        try {
            const walletsHost = process.env.REACT_APP_WALLETS_HOST ?? '';
            await axios.post(`${walletsHost}/addWallets`, body, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
        } catch (error) {
            console.error(error);
        }
    }, [wallets]);

    useEffect(() => {
        if (isConnected && addresses && addresses.length > 0) {
            linkWallets(wallets);
        }
    }, [isConnected])

    if (!isConnected || !addresses || addresses.length === 0) {
        return (
            <>
                <button
                    className={`${styles.headerButton} ${styles.phantomWalletButton}`}
                    onClick={() => {
                        if (!auth.user) {
                            setShowSignInModal(true);
                        } else {
                            open();
                        }
                    }}
                >
                    <img src={phantomWalletLogo} alt="phantom wallet logo"/>
                    <span className="roboto-font">Connect wallet</span>
                </button>
                {showSignInModal && (
                    <ModalOverlay Title="" CloseFunc={() => setShowSignInModal(false)}>
                        <SignInModal/>
                    </ModalOverlay>
                )}
            </>
        );
    }

    return (
        <div className={`${styles.headerButton} ${styles.phantomWalletButtonLinkedWalled}`} onClick={() => open()}>
            <span className="roboto-font">{Truncate(addresses[0].address, TRUNCATE_ADDRESS_LENGTH)}</span>
        </div>
    );
};

export default WalletButton;
