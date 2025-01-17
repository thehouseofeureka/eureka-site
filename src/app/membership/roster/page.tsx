'use client'
import React, { useState, useMemo } from 'react';
import styles from './page.module.css'
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';
import { Search, ChevronDown, ArrowDown, ChevronUp, ArrowRight } from 'lucide-react';

interface RosterMember {
  name: string;
  rank: string[];
  chapters: string;
  joinDate: string;
  projectGroups: string[];
  tags: string[];
  contacts: {
    email: string;
    phone: string;
    instagram: string;
  };
}

export default function Roster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rosterData: RosterMember[] = [
    {
      name: 'Devin Deng',
      rank: ['Founder'],
      chapters: 'Founding Chapter',
      joinDate: '09/26/2004',
      projectGroups: [
        'Priory of Strategic Outcomes - Administrator',
        'Project Irad - Administrator',
        'Project Hesychia - Administrator',
        'Project Diopetes - Administrator'
      ],
      tags: ['Stuyvesant High School', 'New York University', 'Instagram'],
      contacts: {
        email: 'devindeng6793@gmail.com',
        phone: '(929) 525-7783',
        instagram: '@father.devin'
      }
    },
    {
      name: 'Leonaurdo Angel Bernarbe Zheng',
      rank: ['Son'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: ['Department of Web Development - Lead Developer'],
      tags: ['Stuyvesant High School', 'Daughter', 'Instagram'],
      contacts: {
        email: 'leo.zheng@gmail.com',
        phone: '(646) 555-0123',
        instagram: '@leo.codes'
      }
    },
    {
      name: 'Preston Tang',
      rank: ['Son'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Department of Web Development - Senior Developer',
        'Project Atlas - Contributor'
      ],
      tags: ['New York University', 'Son', 'Instagram'],
      contacts: {
        email: 'preston.tang@gmail.com',
        phone: '(917) 555-0456',
        instagram: '@preston.dev'
      }
    },
    {
      name: 'Megan Lin',
      rank: ['Daughter'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Department of Human Development - Director',
        'Project Nurture - Lead'
      ],
      tags: ['Stuyvesant High School', 'New York University'],
      contacts: {
        email: 'megan.lin@gmail.com',
        phone: '(718) 555-0789',
        instagram: '@megan.grows'
      }
    },
    {
      name: 'Brian Lee',
      rank: ['Father-in-Training'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Priory of Strategic Outcomes - Strategist',
        'Project Mentor - Lead'
      ],
      tags: ['Instagram', 'New York University'],
      contacts: {
        email: 'brian.lee@gmail.com',
        phone: '(347) 555-1012',
        instagram: '@brian.leads'
      }
    },
    {
      name: 'Flavio Hideaki Senaga Shiray',
      rank: ['Son'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Priory of Strategic Outcomes - Analyst',
        'Project Insight - Coordinator'
      ],
      tags: ['Stuyvesant High School', 'Son'],
      contacts: {
        email: 'flavio.shiray@gmail.com',
        phone: '(212) 555-1314',
        instagram: '@flavio.analyzes'
      }
    },
    {
      name: 'Lanie Tang',
      rank: ['Mother-in-Training'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Department of Maneating - Director',
        'Project Nurture - Advisor'
      ],
      tags: ['Instagram', 'New York University'],
      contacts: {
        email: 'lanie.tang@gmail.com',
        phone: '(646) 555-1516',
        instagram: '@lanie.nurtures'
      }
    },
    {
      name: 'Jeffrey Yeung',
      rank: ['Father-in-Training'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Priory of Strategic Outcomes - Coordinator',
        'Project Guidance - Lead'
      ],
      tags: ['Stuyvesant High School', 'Instagram'],
      contacts: {
        email: 'jeffrey.yeung@gmail.com',
        phone: '(917) 555-1718',
        instagram: '@jeffrey.guides'
      }
    },
    {
      name: 'Nathan Jung',
      rank: ['Son'],
      chapters: 'Founding Chapter',
      joinDate: '—',
      projectGroups: [
        'Department of Engineering - Lead Engineer',
        'Project Infrastructure - Architect'
      ],
      tags: ['New York University', 'Son', 'Instagram'],
      contacts: {
        email: 'nathan.jung@gmail.com',
        phone: '(718) 555-1920',
        instagram: '@nathan.builds'
      }
    },
    {
      name: 'Sarah Chen',
      rank: ['Daughter'],
      chapters: 'Eastern Chapter',
      joinDate: '03/15/2023',
      projectGroups: [
        'Department of Communication - Director',
        'Project Outreach - Lead'
      ],
      tags: ['Stuyvesant High School', 'Daughter'],
      contacts: {
        email: 'sarah.chen@gmail.com',
        phone: '(347) 555-2122',
        instagram: '@sarah.speaks'
      }
    },
    {
      name: 'Michael Kim',
      rank: ['Father-in-Training', 'Mentor'],
      chapters: 'Western Chapter',
      joinDate: '06/20/2022',
      projectGroups: [
        'Department of Education - Director',
        'Project Wisdom - Lead',
        'Mentorship Program - Senior Advisor'
      ],
      tags: ['New York University', 'Instagram'],
      contacts: {
        email: 'michael.kim@gmail.com',
        phone: '(212) 555-2324',
        instagram: '@michael.teaches'
      }
    },
    {
      name: 'Emily Wong',
      rank: ['Mother-in-Training', 'Counselor'],
      chapters: 'Northern Chapter',
      joinDate: '09/10/2022',
      projectGroups: [
        'Department of Wellness - Director',
        'Project Harmony - Lead',
        'Counseling Initiative - Coordinator'
      ],
      tags: ['Stuyvesant High School', 'Instagram'],
      contacts: {
        email: 'emily.wong@gmail.com',
        phone: '(646) 555-2526',
        instagram: '@emily.counsels'
      }
    },
    {
      name: 'David Liu',
      rank: ['Son', 'Developer'],
      chapters: 'Southern Chapter',
      joinDate: '01/05/2023',
      projectGroups: [
        'Department of Innovation - Lead',
        'Project Future - Architect',
        'Tech Initiative - Coordinator'
      ],
      tags: ['New York University', 'Son', 'Instagram'],
      contacts: {
        email: 'david.liu@gmail.com',
        phone: '(917) 555-2728',
        instagram: '@david.innovates'
      }
    },
    {
      name: 'Rachel Park',
      rank: ['Daughter', 'Researcher'],
      chapters: 'Central Chapter',
      joinDate: '11/30/2022',
      projectGroups: [
        'Department of Research - Director',
        'Project Discovery - Lead',
        'Analytics Team - Coordinator'
      ],
      tags: ['Stuyvesant High School', 'Daughter'],
      contacts: {
        email: 'rachel.park@gmail.com',
        phone: '(718) 555-2930',
        instagram: '@rachel.discovers'
      }
    }
  ];

  // Get the most common tags
  const getPopularTags = (): string[] => {
    const tagCount = new Map<string, number>();
    rosterData.forEach(member => {
      member.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  };

  // Toggle tag selection
  const toggleTag = (tag: string): void => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const toggleRow = (name: string): void => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  // Filter data based on search query and selected tags
  const filteredData = useMemo(() => {
    return rosterData.filter(member => {
      // Text search filter
      const matchesSearch = !searchQuery ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.rank.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.chapters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.joinDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.projectGroups.join(' ').toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTags = selectedTags.size === 0 ||
        member.tags.some(tag => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags, rosterData]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // If currentPage is out of range due to filtering, reset it to 1
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Roster</h1>
        <div className={styles.searchSection}>
          <div className={styles.tagsContainer}>
            <div className={styles.tagsRows}>
              <div className={styles.tagRow}>
                {getPopularTags().slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`${styles.filterTag} ${selectedTags.has(tag) ? styles.filterTagSelected : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className={styles.tagRow}>
                {getPopularTags().slice(4, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`${styles.filterTag} ${selectedTags.has(tag) ? styles.filterTagSelected : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <button className={styles.moreTagsButton}>
              More Tags
            </button>
          </div>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search Bar"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page on new search
              }}
            />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableRowHeader}>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>
                <div className={styles.headerWithIcon}>
                  Rank
                  <ArrowDown size={16} className={styles.headerIcon} />
                </div>
              </th>
              <th className={styles.tableHeader}>Chapters</th>
              <th className={styles.tableHeader}>
                <div className={styles.headerWithIcon}>
                  Join Date
                  <ArrowDown size={16} className={styles.headerIcon} />
                </div>
              </th>
              <th className={styles.tableHeader}>Project Groups & Roles</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((member) => (
              <React.Fragment key={member.name}>
                <tr className={`${styles.tableRow} ${expandedRows.has(member.name) ? styles.hasExpandedContent : ''}`}>
                  <td className={styles.tableCell}>{member.name}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.rankGroupsList}>
                      {expandedRows.has(member.name) ? (
                        member.rank.map((r, i) => (
                          <div key={i}>{r}</div>
                        ))
                      ) : (
                        member.rank[0]
                      )}
                    </div>
                  </td>
                  <td className={styles.tableCell}>{member.chapters}</td>
                  <td className={styles.tableCell}>{member.joinDate}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.projectGroupCell}>
                      <div className={styles.projectGroupsList}>
                        {expandedRows.has(member.name) ? (
                          member.projectGroups.map((group, i) => (
                            <div key={i}>{group}</div>
                          ))
                        ) : (
                          member.projectGroups[0]
                        )}
                      </div>
                      <button
                        onClick={() => toggleRow(member.name)}
                        className={styles.expandButton}
                      >
                        {expandedRows.has(member.name) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(member.name) && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={5}>
                      <div className={styles.expandedContent}>
                        <div className={styles.expandedGrid}>
                          <div className={styles.expandedSection}>
                            <h3>Tags</h3>
                            <div className={styles.tagsList}>
                              {member.tags.map((tag, i) => (
                                <span key={i} className={styles.tag}>{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.expandedSection}>
                            <h3>Contacts</h3>
                            <div className={styles.contactsList}>
                              <div>E-Mail: {member.contacts.email}</div>
                              <div>Phone Number: {member.contacts.phone}</div>
                              <div>Instagram: {member.contacts.instagram}</div>
                            </div>
                          </div>
                          <div className={`${styles.expandedSection} ${styles.profileSection}`}>
                            <div className={styles.viewProfile}>
                              <span>View Full Profile Here</span>
                              <ArrowRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {filteredData.length > itemsPerPage && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
