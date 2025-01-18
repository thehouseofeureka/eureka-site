'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './navbar.module.css'

interface MenuSection {
    title: string;
    items?: string[];
}

export default function Navbar() {
    const router = useRouter();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const handleNavigation = (section: string, item?: string) => {
        const path = item
            ? `/${section.toLowerCase()}/${item.toLowerCase()}`.replace(/\s+/g, '-')
            : `/${section.toLowerCase()}`.replace(/\s+/g, '-');
        router.push(path);
        setIsAccountOpen(false);
    };

    const menuSections: MenuSection[] = [
        {
            title: "Membership",
            items: ["Roster", "Structure", "Chapters", "Networking"]
        },
        {
            title: "Programs",
            items: ["Investing", "Employment", "Bartering", "Charity", "Assistance", "Projects"]
        },
        {
            title: "Events",
            items: ["Crusades", "Receptions", "Outings"]
        },
        {
            title: "Establishments",
            items: ["Owned", "Affiliated"]
        }
    ];

    return (
        <div className={styles.container}>
            <nav className={styles.navbar}>
                <p
                    className={styles.logo}
                    onClick={() => router.push('/home')}
                    style={{ cursor: 'pointer' }}
                >
                    HOUSE OF EUREKA
                </p>

                <div className={styles.menuContainer}>
                    {menuSections.map((section) => (
                        <div
                            key={section.title}
                            className={`${styles.menuItem} ${expandedMenu === section.title ? styles.active : ''}`}
                            onMouseEnter={() => setExpandedMenu(section.title)}
                            onMouseLeave={() => setExpandedMenu(null)}
                        >
                            <div className={styles.menuTitle} onClick={() => handleNavigation(section.title)}>
                                {section.title}
                            </div>

                            {expandedMenu === section.title && section.items && (
                                <div className={styles.dropdown}>
                                    {section.items.map((item) => (
                                        <div
                                            key={item}
                                            className={styles.dropdownItem}
                                            onClick={() => handleNavigation(section.title, item)}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div 
                    className={`${styles.account} ${isAccountOpen ? styles.active : ''}`}
                    onMouseEnter={() => setIsAccountOpen(true)}
                    onMouseLeave={() => setIsAccountOpen(false)}
                >
                    <div className={styles.menuTitle}>Account</div>
                    {isAccountOpen && (
                        <div className={`${styles.dropdown} ${styles.accountDropdown}`}>
                            <div 
                                className={styles.dropdownItem}
                                onClick={() => handleNavigation('account', 'login')}
                            >
                                Login
                            </div>
                            <div 
                                className={styles.dropdownItem}
                                onClick={() => handleNavigation('account', 'register')}
                            >
                                Register
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}