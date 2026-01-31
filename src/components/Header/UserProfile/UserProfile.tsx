import { useState, useEffect, useRef } from "react";
import styles from './UserProfile.module.css';
import { useAuth } from "../../../contexts/Auth/AuthProvider";

const UserProfile = () => {
    const auth = useAuth();
    const user = auth.user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const profileWrapperRef = useRef<HTMLDivElement>(null);

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

    if (!user) {
        return null;
    }

    return (
        <div ref={profileWrapperRef} className={styles.profileWrapper}>
            <img 
                src={user.profilePicture} 
                className={styles.profilePicture} 
                alt="profile" 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
            />
            {dropdownOpen && (
                <div className={styles.dropDownMenu}>
                    <span className={styles.dropdownMenuItem}>Welcome, {user.firstName}!</span>
                    <button 
                        className={`${styles.dropdownMenuItem} ${styles.dropdownMenuLastButton}`} 
                        onClick={() => auth.signOut()}
                    >
                        <span className="roboto-font">Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
