import phantomWalletLogo from "../../../../assets/phantom_wallet_logo.svg";
import styles from './WalletButton.module.css';
import { usePhantom, useModal } from "@phantom/react-sdk";
import { Truncate } from "src/helpers/turncate_text";

const TRUNCATE_ADDRESS_LENGTH = 8;

const WalletButton = () => {
    const { isConnected, addresses } = usePhantom();
    const { open } = useModal();

    if (!isConnected || !addresses || addresses.length === 0) {
        return (
            <button className={`${styles.headerButton} ${styles.phantomWalletButton}`} onClick={() => open()}>
                <img src={phantomWalletLogo} alt="phantom wallet logo"/>
                <span className="roboto-font">Connect wallet</span>
            </button>
        );
    }

    return (
        <div className={`${styles.headerButton} ${styles.phantomWalletButtonLinkedWalled}`} onClick={() => open()}>
            <span className="roboto-font">{Truncate(addresses[0].address, TRUNCATE_ADDRESS_LENGTH)}</span>
        </div>
    );
};

export default WalletButton;
