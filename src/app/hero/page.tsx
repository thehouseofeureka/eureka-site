'use client'
import { useState } from 'react'
import styles from './hero.module.css'

interface MenuSection {
  title: string;
  items?: string[];
}

export default function Hero() {
  // State to track which menu is currently expanded
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

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
        <p className={styles.logo}>HOUSE OF EUREKA</p>
        
        <div className={styles.menuContainer}>
          {menuSections.map((section) => (
            <div 
              key={section.title}
              className={styles.menuItem}
              onMouseEnter={() => setExpandedMenu(section.title)}
              onMouseLeave={() => setExpandedMenu(null)}
            >
              {section.title}
              {expandedMenu === section.title && section.items && (
                <div className={styles.dropdown}>
                  {section.items.map((item) => (
                    <div key={item} className={styles.dropdownItem}>
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
  )
}