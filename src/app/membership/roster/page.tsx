'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css'
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';
import { Search, ChevronDown, ArrowDown, ChevronUp, ArrowRight, ArrowUp } from 'lucide-react';
import { getRosterView, RosterMember } from '@/lib/kv';

export default function Roster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [rosterData, setRosterData] = useState<RosterMember[]>([]);
  const [, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Get all unique tags
  const getAllTags = (): string[] => {
    const uniqueTags = new Set<string>();
    rosterData.forEach(member => {
      member.tags.forEach(tag => {
        uniqueTags.add(tag);
      });
    });

    // Convert Set to Array and sort alphabetically
    return Array.from(uniqueTags).sort();
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

  // Filter and sort data based on search query, selected tags, and sort direction
  const filteredData = useMemo(() => {
    const filtered = rosterData.filter(member => {
      // Text search filter
      const matchesSearch = !searchQuery ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.rank.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.chapters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.joinDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.projectGroups.join(' ').toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTags = selectedTags.size === 0 ||
        Array.from(selectedTags).every(tag => member.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    // Sort by join date
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.joinDate);
      const dateB = new Date(b.joinDate);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }, [searchQuery, selectedTags, rosterData, sortDirection]);

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

  // Get all tags for the tag bank
  const allTags = getAllTags();

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Roster</h1>
        <div className={styles.searchSection}>
          <div className={styles.tagsContainer}>
            <div className={styles.tagsRows}>
              {/* Display all tags in the tag bank with appropriate styling */}
              <div className={styles.allTagsContainer}>
                {allTags.map((tag) => (
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
                </div>
              </th>
              <th className={styles.tableHeader}>Chapters</th>
              <th className={styles.tableHeader}>
                <div
                  className={`${styles.headerWithIcon} ${styles.sortableHeader}`}
                  onClick={toggleSortDirection}
                  style={{ cursor: 'pointer' }}
                >
                  Join Date
                  {sortDirection === 'desc' ? (
                    <ArrowDown size={16} className={styles.headerIcon} />
                  ) : (
                    <ArrowUp size={16} className={styles.headerIcon} />
                  )}
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
                              {['Email', 'Instagram', 'WeChat', 'Line', 'Discord', 'WhatsApp', 'LinkedIn', 'KakaoTalk'].map((platform) => {
                                const value = member.contacts[platform.toLowerCase() as keyof typeof member.contacts];
                                if (!value) return null; // Skip platforms with no value
                                return (
                                  <div key={platform}>
                                    {platform}: {value}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className={`${styles.expandedSection} ${styles.profileSection}`}>
                            <Link
                              href={`/account/user/${member.name.toLowerCase().replace(/\s+/g, '_')}`}
                              className={styles.viewProfile}
                            >
                              <span>View Full Profile Here</span>
                              <ArrowRight size={16} />
                            </Link>
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
          <div className={styles.paginationContainer}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
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