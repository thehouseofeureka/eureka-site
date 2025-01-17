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

    const handleNavigation = (section: string, item?: string) => {
        const path = item
            ? `/${section.toLowerCase()}/${item.toLowerCase()}`.replace(/\s+/g, '-')
            : `/${section.toLowerCase()}`.replace(/\s+/g, '-');
        router.push(path);
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

    const isMenuExpanded = expandedMenu !== null;

    return (
        <>
            {isMenuExpanded && (
                <div
                    className={styles.overlay}
                    onClick={() => setExpandedMenu(null)}
                />
            )}

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
                                className={styles.menuItem}
                                onMouseEnter={() => setExpandedMenu(section.title)}
                                onMouseLeave={() => setExpandedMenu(null)}
                            >
                                <span onClick={() => handleNavigation(section.title)}>
                                    {section.title}
                                </span>

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

                    <div className={styles.account}>Account</div>
                </nav>
            </div>
        </>
    )
}
