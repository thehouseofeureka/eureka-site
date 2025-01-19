'use client'
import React, { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css'
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';
import { Search, ChevronDown, ArrowDown, ChevronUp, ArrowRight } from 'lucide-react';
import { getRosterView, RosterMember } from '@/lib/kv';

export default function Roster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [rosterData, setRosterData] = useState<RosterMember[]>([]);
  const [, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const members = await getRosterView();
        setRosterData(members);
      } catch (error) {
        console.error('Failed to load roster:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, []);

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
            {/* <button className={styles.moreTagsButton}>
              See All Tags
            </button> */}
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
                              {Object.entries(member.contacts).map(([platform, value]) => {
                                if (!value) return null; // Skip empty values
                                const label = platform.charAt(0).toUpperCase() + platform.slice(1);
                                return (
                                  <div key={platform}>
                                    {label}: {value}
                                  </div>
                                );
                              })}
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
