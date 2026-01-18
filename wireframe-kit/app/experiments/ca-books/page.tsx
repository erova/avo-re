"use client";

/**
 * CA Books — Wireframe Kit
 * Simplified grayscale wireframe demonstrating a books list with search, filter, and detail panel.
 * NOTE: simplified for wireframe kit — no external dependencies, no animation libs
 */

import React, { useState, useMemo } from "react";
import { Card } from "../../../wireframe-primitives/Card";
import { Button } from "../../../wireframe-primitives/Button";
import { Input } from "../../../wireframe-primitives/Input";
import { Divider } from "../../../wireframe-primitives/Divider";

// ─────────────────────────────────────────────────────────────
// Mock Data (local to this file)
// ─────────────────────────────────────────────────────────────

type BookStatus = "Published" | "Pending" | "Draft";

type Book = {
  id: string;
  title: string;
  status: BookStatus;
  owner: string;
  updatedAt: string;
  meetingDate: string;
  tags: string[];
  org: string;
};

const BOOKS: Book[] = [
  { id: "b1", title: "Q1 Board Meeting Materials", status: "Published", owner: "Sarah Chen", updatedAt: "Jan 15, 2026", meetingDate: "Feb 12, 2026", tags: ["Board", "Q1"], org: "Board of Directors" },
  { id: "b2", title: "Audit Committee Review", status: "Pending", owner: "Michael Park", updatedAt: "Jan 14, 2026", meetingDate: "Feb 10, 2026", tags: ["Audit", "Compliance"], org: "Audit Committee" },
  { id: "b3", title: "Annual Strategy Offsite", status: "Draft", owner: "Lisa Wong", updatedAt: "Jan 13, 2026", meetingDate: "Mar 1, 2026", tags: ["Strategy", "Annual"], org: "Board of Directors" },
  { id: "b4", title: "Compensation Committee Q1", status: "Published", owner: "David Kim", updatedAt: "Jan 12, 2026", meetingDate: "Feb 8, 2026", tags: ["Compensation", "Q1"], org: "Compensation Committee" },
  { id: "b5", title: "Risk Committee Update", status: "Pending", owner: "Emma Johnson", updatedAt: "Jan 11, 2026", meetingDate: "Feb 15, 2026", tags: ["Risk", "Quarterly"], org: "Risk Committee" },
  { id: "b6", title: "Governance Review 2026", status: "Draft", owner: "James Lee", updatedAt: "Jan 10, 2026", meetingDate: "Feb 20, 2026", tags: ["Governance", "Annual"], org: "Board of Directors" },
  { id: "b7", title: "Finance Committee Monthly", status: "Published", owner: "Rachel Green", updatedAt: "Jan 9, 2026", meetingDate: "Jan 25, 2026", tags: ["Finance", "Monthly"], org: "Finance Committee" },
  { id: "b8", title: "Technology Committee Q4 Review", status: "Published", owner: "Alex Rivera", updatedAt: "Jan 8, 2026", meetingDate: "Jan 20, 2026", tags: ["Technology", "Q4"], org: "Technology Committee" },
  { id: "b9", title: "ESG Report Preparation", status: "Pending", owner: "Priya Shah", updatedAt: "Jan 7, 2026", meetingDate: "Feb 28, 2026", tags: ["ESG", "Report"], org: "Board of Directors" },
  { id: "b10", title: "Board Retreat Planning", status: "Draft", owner: "Daniel Kim", updatedAt: "Jan 6, 2026", meetingDate: "Mar 15, 2026", tags: ["Retreat", "Planning"], org: "Board of Directors" },
  { id: "b11", title: "Nominating Committee Review", status: "Published", owner: "Sofia Patel", updatedAt: "Jan 5, 2026", meetingDate: "Jan 18, 2026", tags: ["Nominating", "Review"], org: "Nominating Committee" },
  { id: "b12", title: "Cybersecurity Briefing", status: "Pending", owner: "Morgan Lee", updatedAt: "Jan 4, 2026", meetingDate: "Feb 5, 2026", tags: ["Security", "Briefing"], org: "Risk Committee" },
];

const STATUS_OPTIONS: Array<BookStatus | "All"> = ["All", "Published", "Pending", "Draft"];

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function CaBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookStatus | "All">("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // NOTE: simplified filtering — in production would use more sophisticated search
  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "All" || book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Group by org
  const groupedBooks = useMemo(() => {
    const groups: Record<string, Book[]> = {};
    filteredBooks.forEach((book) => {
      if (!groups[book.org]) groups[book.org] = [];
      groups[book.org].push(book);
    });
    return groups;
  }, [filteredBooks]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-100)" }}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <span style={styles.navLabel}>Wireframe</span>
          <span style={styles.navTitle}>CA Books</span>
        </div>
        <div style={styles.navLinks}>
          <a href="/experiments/ca-books" style={styles.navLinkActive}>Books</a>
          <a href="/experiments/ca-bookbuilder" style={styles.navLink}>Book Builder</a>
        </div>
      </nav>

      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <Card>
            <div style={styles.sidebarHeader}>
              <div style={styles.orgIcon} />
              <div>
                <p style={styles.orgName}>Acme Corporation</p>
                <p style={styles.orgSub}>Board Portal</p>
              </div>
            </div>
            <Divider />
            <nav style={styles.sidebarNav}>
              <div style={styles.sidebarItemActive}>Books</div>
              <div style={styles.sidebarItem}>Resource Center</div>
              <Divider />
              <div style={styles.sidebarItem}>Minutes</div>
              <div style={styles.sidebarItem}>Data Room</div>
              <div style={styles.sidebarItem}>Questionnaires</div>
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Books</h1>
            <div style={styles.headerActions}>
              <Button>Create book</Button>
              <Button>Add announcement</Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card style={{ marginTop: "var(--space-4)" }}>
            <div style={styles.filterRow}>
              <div style={{ flex: 1, maxWidth: "320px" }}>
                <Input
                  placeholder="Search books, owners, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={styles.statusTabs}>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    style={{
                      ...styles.statusTab,
                      ...(statusFilter === status ? styles.statusTabActive : {}),
                    }}
                  >
                    {status}
                    {status !== "All" && (
                      <span style={styles.statusCount}>
                        {BOOKS.filter((b) => b.status === status).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Books List */}
          <div style={{ marginTop: "var(--space-4)" }}>
            {Object.entries(groupedBooks).map(([org, books]) => (
              <Card key={org} style={{ marginBottom: "var(--space-4)" }}>
                <div style={styles.groupHeader}>
                  <span style={styles.groupTitle}>{org}</span>
                  <span style={styles.groupCount}>{books.length} books</span>
                </div>
                <Divider />
                {books.map((book, idx) => (
                  <React.Fragment key={book.id}>
                    {idx > 0 && <Divider />}
                    <div
                      style={{
                        ...styles.bookRow,
                        background: selectedBook?.id === book.id ? "var(--color-gray-50)" : "transparent",
                      }}
                    >
                      <button
                        style={styles.bookMain}
                        onClick={() => setSelectedBook(book)}
                      >
                        <div style={styles.bookIcon}>📕</div>
                        <div style={styles.bookInfo}>
                          <p style={styles.bookTitle}>{book.title}</p>
                          <div style={styles.bookMeta}>
                            <span style={getStatusStyle(book.status)}>{book.status}</span>
                            <span style={styles.metaDot}>·</span>
                            <span>Meeting: {book.meetingDate}</span>
                            <span style={styles.metaDot}>·</span>
                            <span>{book.owner}</span>
                          </div>
                        </div>
                      </button>
                      <div style={styles.bookActions}>
                        <Button>Open</Button>
                        <div style={{ position: "relative" }}>
                          <Button onClick={() => setMenuOpen(menuOpen === book.id ? null : book.id)}>
                            ⋮
                          </Button>
                          {/* NOTE: simplified menu — in production would be a proper dropdown */}
                          {menuOpen === book.id && (
                            <>
                              <div
                                style={styles.menuBackdrop}
                                onClick={() => setMenuOpen(null)}
                              />
                              <div style={styles.menu}>
                                <button style={styles.menuItem} onClick={() => { setSelectedBook(book); setMenuOpen(null); }}>View details</button>
                                <button style={styles.menuItem}>Export to PDF</button>
                                <button style={styles.menuItem}>Send to Data Room</button>
                                <Divider />
                                <button style={styles.menuItem}>Archive</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </Card>
            ))}

            {filteredBooks.length === 0 && (
              <Card>
                <div style={styles.emptyState}>
                  <p style={styles.emptyTitle}>No books found</p>
                  <p style={styles.emptyText}>Try adjusting your search or filters.</p>
                </div>
              </Card>
            )}
          </div>

          <p style={styles.footerNote}>
            Wireframe note: This is a simplified grayscale prototype for UX exploration.
          </p>
        </main>

        {/* Detail Panel (slides in when a book is selected) */}
        {selectedBook && (
          <>
            {/* NOTE: simplified panel — in production would use proper animation */}
            <div style={styles.panelBackdrop} onClick={() => setSelectedBook(null)} />
            <aside style={styles.detailPanel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.panelLabel}>Book Details</p>
                  <p style={styles.panelTitle}>{selectedBook.title}</p>
                </div>
                <Button onClick={() => setSelectedBook(null)}>Close</Button>
              </div>

              <Divider />

              <div style={styles.panelContent}>
                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Status</p>
                  <span style={getStatusStyle(selectedBook.status)}>{selectedBook.status}</span>
                </div>

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Owner</p>
                  <p style={styles.detailValue}>{selectedBook.owner}</p>
                </div>

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Meeting Date</p>
                  <p style={styles.detailValue}>{selectedBook.meetingDate}</p>
                </div>

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Last Updated</p>
                  <p style={styles.detailValue}>{selectedBook.updatedAt}</p>
                </div>

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Organization</p>
                  <p style={styles.detailValue}>{selectedBook.org}</p>
                </div>

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Tags</p>
                  <div style={styles.tagList}>
                    {selectedBook.tags.map((tag) => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <Divider />

                <div style={styles.detailSection}>
                  <p style={styles.detailLabel}>Actions</p>
                  <div style={styles.actionList}>
                    <Button data-variant="primary">Open Book</Button>
                    <Button>Export to PDF</Button>
                    <Button>Send to Data Room</Button>
                    <Button>Archive</Button>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helper: Status styling
// ─────────────────────────────────────────────────────────────

function getStatusStyle(status: BookStatus): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-2)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--color-gray-200)",
  };

  switch (status) {
    case "Published":
      return { ...base, background: "var(--color-gray-100)", color: "var(--color-gray-700)" };
    case "Pending":
      return { ...base, background: "var(--color-gray-50)", color: "var(--color-gray-600)" };
    case "Draft":
      return { ...base, background: "var(--color-white)", color: "var(--color-gray-500)" };
    default:
      return base;
  }
}

// ─────────────────────────────────────────────────────────────
// Inline Styles
// ─────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-6)", borderBottom: "1px solid var(--color-gray-200)", background: "var(--color-white)" },
  navInner: { display: "flex", alignItems: "center", gap: "var(--space-3)" },
  navLabel: { fontSize: "var(--text-xs)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-400)" },
  navTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  navLinks: { display: "flex", gap: "var(--space-2)" },
  navLink: { padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-gray-600)", textDecoration: "none", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-200)" },
  navLinkActive: { padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-gray-900)", textDecoration: "none", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-300)", background: "var(--color-white)" },

  layout: { display: "flex", gap: "var(--space-6)", maxWidth: "1400px", margin: "0 auto", padding: "var(--space-6)" },

  sidebar: { width: "240px", flexShrink: 0 },
  sidebarHeader: { display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)" },
  orgIcon: { width: "32px", height: "32px", borderRadius: "var(--radius-md)", background: "var(--color-gray-200)" },
  orgName: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  orgSub: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },
  sidebarNav: { padding: "var(--space-2)" },
  sidebarItem: { padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-gray-600)", borderRadius: "var(--radius-lg)", cursor: "pointer" },
  sidebarItemActive: { padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)", background: "var(--color-gray-100)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-200)" },

  main: { flex: 1, minWidth: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  pageTitle: { fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-gray-900)" },
  headerActions: { display: "flex", gap: "var(--space-2)" },

  filterRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" },
  statusTabs: { display: "flex", gap: "var(--space-1)" },
  statusTab: { padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-gray-600)", background: "transparent", border: "1px solid transparent", borderRadius: "var(--radius-lg)", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-1)" },
  statusTabActive: { fontWeight: 600, color: "var(--color-gray-900)", background: "var(--color-gray-100)", border: "1px solid var(--color-gray-200)" },
  statusCount: { fontSize: "var(--text-xs)", color: "var(--color-gray-400)" },

  groupHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-4)" },
  groupTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)" },
  groupCount: { fontSize: "var(--text-xs)", color: "var(--color-gray-500)" },

  bookRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-4)" },
  bookMain: { display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1, minWidth: 0, textAlign: "left", background: "none", border: "none", cursor: "pointer" },
  bookIcon: { width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-gray-100)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-gray-200)", fontSize: "var(--text-lg)" },
  bookInfo: { minWidth: 0 },
  bookTitle: { fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-gray-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  bookMeta: { display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-gray-500)", flexWrap: "wrap" },
  metaDot: { color: "var(--color-gray-300)" },
  bookActions: { display: "flex", gap: "var(--space-2)", flexShrink: 0 },

  menuBackdrop: { position: "fixed", inset: 0, zIndex: 40 },
  menu: { position: "absolute", right: 0, top: "100%", marginTop: "var(--space-1)", width: "200px", background: "var(--color-white)", border: "1px solid var(--color-gray-200)", borderRadius: "var(--radius-lg)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 50, padding: "var(--space-2)" },
  menuItem: { display: "block", width: "100%", padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-gray-700)", textAlign: "left", background: "none", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer" },

  emptyState: { padding: "var(--space-10)", textAlign: "center" },
  emptyTitle: { fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-gray-900)" },
  emptyText: { fontSize: "var(--text-sm)", color: "var(--color-gray-500)", marginTop: "var(--space-2)" },

  panelBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 40 },
  detailPanel: { position: "fixed", right: 0, top: 0, bottom: 0, width: "420px", maxWidth: "100vw", background: "var(--color-white)", borderLeft: "1px solid var(--color-gray-200)", boxShadow: "-4px 0 24px rgba(0,0,0,0.1)", zIndex: 50, display: "flex", flexDirection: "column" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "var(--space-4)" },
  panelLabel: { fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-500)" },
  panelTitle: { fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-gray-900)", marginTop: "var(--space-1)" },
  panelContent: { flex: 1, overflow: "auto", padding: "var(--space-4)" },

  detailSection: { marginBottom: "var(--space-4)" },
  detailLabel: { fontSize: "var(--text-xs)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gray-500)", marginBottom: "var(--space-1)" },
  detailValue: { fontSize: "var(--text-sm)", color: "var(--color-gray-800)" },

  tagList: { display: "flex", flexWrap: "wrap", gap: "var(--space-1)" },
  tag: { padding: "var(--space-1) var(--space-2)", fontSize: "var(--text-xs)", color: "var(--color-gray-600)", background: "var(--color-gray-100)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-200)" },

  actionList: { display: "flex", flexDirection: "column", gap: "var(--space-2)" },

  footerNote: { marginTop: "var(--space-10)", fontSize: "var(--text-xs)", color: "var(--color-gray-400)", textAlign: "center" },
};
