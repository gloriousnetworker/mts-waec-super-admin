// ─────────────────────────────────────────────────────────────────────────────
// Super Admin Style Constants
// All colours use the brand token system defined in tailwind.config.js
// Brand primary: #1F2A49 (deep navy)  |  Gold: #FFB300  |  Danger: #EF4444
// ─────────────────────────────────────────────────────────────────────────────

// ─── Login Page ──────────────────────────────────────────────────────────────
export const loginContainer =
  'fixed inset-0 flex items-center justify-center overflow-hidden';
export const loginContent =
  'w-full max-w-md px-6 py-10';
export const loginLogo =
  'text-5xl leading-none font-bold tracking-tight text-white text-center mb-2 font-playfair';
export const loginTitle =
  'text-2xl leading-tight font-semibold tracking-tight text-white text-center mb-2 font-playfair';
export const loginSubtitle =
  'text-xs text-white/50 text-center mb-8';
export const loginForm =
  'space-y-5 mb-6';
export const loginLabel =
  'block mb-2 text-2xs tracking-widest font-medium text-white/60 uppercase';
export const loginInput =
  'input-underline';
export const loginPasswordWrapper =
  'relative';
export const loginPasswordToggle =
  'absolute right-0 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer hover:text-white/70 transition-colors p-2 min-h-[44px] flex items-center';
export const loginRememberRow =
  'flex items-center justify-between mb-6';
export const loginCheckboxLabel =
  'flex items-center gap-2 cursor-pointer';
export const loginCheckbox =
  'w-4 h-4 border border-white/20 rounded cursor-pointer accent-white';
export const loginCheckboxText =
  'text-xs text-white/50';
export const loginForgotPassword =
  'text-xs font-medium text-white/60 hover:text-white transition-colors cursor-pointer';
export const loginButton =
  'w-full py-3.5 bg-white text-brand-primary text-sm leading-none font-semibold rounded-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
export const loginDivider =
  'flex items-center my-5';
export const loginDividerLine =
  'flex-1 h-px bg-white/[0.08]';
export const loginDividerText =
  'px-4 text-2xs font-medium text-white/30 tracking-widest';
export const loginFeatures =
  'mt-2 grid grid-cols-4 gap-2 mb-6';
export const loginFeatureItem =
  'text-center py-2.5 px-1.5 bg-white/[0.04] border border-white/[0.07] rounded-xl';
export const loginFeatureIcon =
  'text-lg mb-1';
export const loginFeatureText =
  'text-2xs text-white/40';

// ─── Splash Screen ────────────────────────────────────────────────────────────
export const splashContainer =
  'fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden';
export const splashContent =
  'text-center px-8 w-full max-w-sm relative z-10';
export const splashLogo =
  'text-2xl font-bold tracking-tight text-white mb-1.5 font-playfair';
export const splashSubtitle =
  'text-xs text-white/50';
export const splashProgressBar =
  'w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-3';
export const splashProgressFill =
  'h-full bg-white rounded-full transition-all duration-300 ease-out';
export const splashProgressText =
  'text-2xs text-white/30';

// ─── Dashboard Shell ──────────────────────────────────────────────────────────
export const dashboardContainer =
  'min-h-screen bg-surface-muted flex flex-col fixed inset-0 overflow-hidden';
export const dashboardMain =
  'flex flex-1 overflow-hidden';
export const dashboardContent =
  'flex-1 overflow-y-auto bg-surface-muted';
export const dashboardInner =
  'p-4 sm:p-6 max-w-7xl mx-auto';
export const dashboardLoading =
  'fixed inset-0 z-50 flex items-center justify-center bg-white';
export const dashboardLoadingInner =
  'text-center';
export const dashboardLoadingSpinner =
  'spinner mx-auto mb-4';
export const dashboardLoadingText =
  'text-sm text-content-secondary';

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const navbarContainer =
  'fixed top-0 left-0 right-0 lg:sticky z-40 bg-white border-b border-border shadow-card pt-safe';
export const navbarInner =
  'px-4 sm:px-6';
export const navbarContent =
  'flex items-center justify-between h-16';
export const navbarLeft =
  'flex items-center gap-3';
// Hamburger visible on ALL screen sizes (no lg:hidden)
export const navbarMenuButton =
  'p-2 text-content-secondary hover:text-brand-primary hover:bg-surface-subtle rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center';
export const navbarLogo =
  'flex items-center gap-2.5';
export const navbarLogoImage =
  'w-9 h-9 object-contain';
export const navbarLogoText =
  'text-lg font-bold tracking-tight text-brand-primary font-playfair hidden sm:block';
export const navbarLogoSubtext =
  'text-2xs text-content-muted hidden sm:block';
export const navbarRight =
  'flex items-center gap-2';
export const navbarProfileButton =
  'flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-surface-subtle transition-colors min-h-[44px]';
export const navbarProfileAvatar =
  'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-primary-dk';
export const navbarProfileAvatarText =
  'text-white text-xs font-semibold';
export const navbarProfileInfo =
  'hidden lg:block text-left';
export const navbarProfileName =
  'text-xs font-semibold text-content-primary';
export const navbarProfileRole =
  'text-2xs text-content-muted mt-0.5';
// Dropdown controlled by React state only (no group-hover conflicts)
export const navbarDropdown =
  'absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-card-lg z-50';
export const navbarDropdownHeader =
  'p-4 border-b border-border';
export const navbarDropdownHeaderName =
  'font-semibold text-content-primary text-sm';
export const navbarDropdownHeaderEmail =
  'text-2xs text-content-muted mt-0.5';
export const navbarDropdownMenu =
  'p-2';
export const navbarDropdownItem =
  'w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-sm text-content-secondary hover:bg-surface-subtle hover:text-content-primary rounded-lg transition-colors min-h-[44px]';
export const navbarDropdownItemDanger =
  'w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors min-h-[44px]';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export const sidebarContainer =
  'fixed inset-y-0 lg:top-16 left-0 z-50 lg:z-30 w-64 bg-white border-r border-border flex flex-col';
export const sidebarOverlay =
  'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm';
export const sidebarHeader =
  'flex items-center gap-3 px-5 py-4 bg-brand-navy flex-shrink-0';
export const sidebarHeaderLogo =
  'w-9 h-9 object-contain flex-shrink-0';
export const sidebarHeaderTitle =
  'text-base font-bold tracking-tight text-white font-playfair';
export const sidebarHeaderSubtitle =
  'text-2xs text-white/50 mt-0.5';
export const sidebarNavGroup =
  'px-3 pt-5 pb-1';
export const sidebarNavGroupLabel =
  'px-2 mb-2 text-2xs font-semibold uppercase tracking-widest text-content-muted';
export const sidebarNav =
  'flex-1 overflow-y-auto pb-4 hide-scrollbar';
export const sidebarNavItem =
  'nav-item';
export const sidebarNavItemActive =
  'nav-item-active';
export const sidebarNavItemInactive =
  'nav-item-inactive';
export const sidebarNavItemIcon =
  'flex-shrink-0';
export const sidebarNavItemLabel =
  'font-medium text-sm flex-1';
export const sidebarNavItemBadge =
  'ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-danger text-white text-2xs font-bold';
export const sidebarFooter =
  'px-3 pb-4 pt-3 border-t border-border flex-shrink-0';
export const sidebarLogout =
  'nav-item text-danger hover:bg-danger-light hover:text-danger-dark w-full min-h-[44px]';
export const sidebarHelpCard =
  'mt-3 p-3 bg-brand-primary-lt rounded-xl border border-brand-primary/10';
export const sidebarHelpTitle =
  'text-2xs text-content-secondary mb-1 font-medium';
export const sidebarHelpButton =
  'text-2xs font-semibold text-brand-primary hover:underline';

// ─── Modals ───────────────────────────────────────────────────────────────────
export const modalOverlay =
  'modal-overlay';
export const modalContainer =
  'modal-container p-6 w-full mx-4 max-w-md';
export const modalContainerLg =
  'modal-container p-6 w-full mx-4 max-w-2xl';
export const modalTitle =
  'text-xl font-bold tracking-tight text-content-primary mb-1 font-playfair';
export const modalSubtitle =
  'text-sm text-content-secondary mb-5';
export const modalActions =
  'flex gap-3 mt-6';
export const modalButtonSecondary =
  'btn-secondary flex-1';
export const modalButtonPrimary =
  'btn-primary flex-1';
export const modalButtonDanger =
  'btn-danger flex-1';

// ─── Page Header ──────────────────────────────────────────────────────────────
export const pageHeader =
  'mb-6';
export const pageTitle =
  'section-title';
export const pageSubtitle =
  'section-subtitle';

// ─── Stat Cards ───────────────────────────────────────────────────────────────
export const statCardGrid =
  'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6';
export const statCard =
  'stat-card';
export const statCardLight =
  'stat-card-light';
export const statCardIconBox =
  'w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3';
export const statCardValue =
  'text-2xl font-bold text-white font-playfair';
export const statCardLabel =
  'text-xs text-white/70 mt-1';
export const statCardChange =
  'text-2xs text-white/60 mt-2 font-medium';

// ─── Data Tables ──────────────────────────────────────────────────────────────
export const tableWrapper =
  'table-wrapper';
export const tableHeaderRow =
  'border-b border-border';
export const tableHeaderCell =
  'table-header-cell';
export const tableRow =
  'table-row';
export const tableCell =
  'table-cell';

// ─── Form Elements ────────────────────────────────────────────────────────────
export const formGroup =
  'space-y-1.5';
export const formLabel =
  'block text-xs font-semibold text-content-secondary uppercase tracking-wider';
export const formInput =
  'input-field';
export const formSelect =
  'input-field appearance-none cursor-pointer';
export const formTextarea =
  'input-field resize-none';
export const formError =
  'text-2xs text-danger mt-1';
export const formHint =
  'text-2xs text-content-muted mt-1';

// ─── Content Sections ─────────────────────────────────────────────────────────
export const sectionCard =
  'card p-5 sm:p-6';
export const sectionHeader =
  'flex items-center justify-between mb-5';
export const sectionTitle =
  'text-lg font-bold text-content-primary font-playfair';

// ─── Empty States ─────────────────────────────────────────────────────────────
export const emptyState =
  'flex flex-col items-center justify-center py-16 px-6 text-center';
export const emptyStateIcon =
  'w-14 h-14 rounded-2xl bg-surface-subtle flex items-center justify-center mb-4 text-content-muted';
export const emptyStateTitle =
  'text-base font-semibold text-content-primary mb-1 font-playfair';
export const emptyStateText =
  'text-sm text-content-secondary';

// ─── Search & Filter Bar ──────────────────────────────────────────────────────
export const searchBar =
  'flex flex-col sm:flex-row gap-3 mb-5';
export const searchInputWrapper =
  'relative flex-1';
export const searchInputIcon =
  'absolute left-3 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none';
export const searchInput =
  'input-field pl-9 text-sm';
export const filterSelect =
  'input-field text-sm w-full sm:w-40';

// ─── Action Buttons (inline, table rows) ─────────────────────────────────────
export const actionButtonEdit =
  'p-2 text-content-muted hover:text-brand-primary hover:bg-brand-primary-lt rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center';
export const actionButtonDanger =
  'p-2 text-content-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center';

// ─── Pagination ───────────────────────────────────────────────────────────────
export const pagination =
  'flex items-center justify-between pt-4 border-t border-border px-4 pb-4';
export const paginationText =
  'text-xs text-content-muted';
export const paginationButtons =
  'flex items-center gap-1';
export const paginationButton =
  'px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-content-secondary hover:border-brand-primary hover:text-brand-primary transition-colors min-h-[36px]';
export const paginationButtonActive =
  'px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-primary text-white min-h-[36px]';

// ─── Modal text (alias) ────────────────────────────────────────────────────────
export const modalText =
  'text-sm text-content-secondary mb-5';

// ─── Page containers (shared across all dashboard pages) ─────────────────────
export const examsContainer =
  'p-4 sm:p-6 max-w-7xl mx-auto';
export const examsHeader =
  'mb-6';
export const examsTitle =
  'text-2xl font-bold tracking-tight text-content-primary font-playfair';
export const examsSubtitle =
  'text-sm text-content-secondary mt-1';

// ─── Stat cards (used across Schools, Support, Admins, etc.) ─────────────────
export const superAdminStatCard =
  'card p-5';
export const superAdminStatValue =
  'text-3xl font-bold text-content-primary font-playfair';
export const superAdminStatLabel =
  'text-sm text-content-secondary mt-1';
export const superAdminStatChange =
  'text-xs text-success mt-1 font-medium';

// ─── Home page ────────────────────────────────────────────────────────────────
export const homeContainer =
  'p-4 sm:p-6 max-w-7xl mx-auto';
export const homeHeader =
  'mb-6';
export const homeTitle =
  'text-2xl font-bold tracking-tight text-content-primary font-playfair';
export const homeSubtitle =
  'text-sm text-content-secondary mt-1';
export const homeStatCard =
  'card p-5';
export const homeStatCardTop =
  'flex items-center justify-between mb-2';
export const homeStatCardIcon =
  'w-9 h-9 rounded-lg bg-brand-primary-lt flex items-center justify-center text-brand-primary';
export const homeStatCardValue =
  'text-2xl font-bold text-content-primary font-playfair';
export const homeStatCardLabel =
  'text-sm text-content-secondary';
export const homeActionsGrid =
  'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8';
export const homeActionButton =
  'card p-4 flex flex-col items-start gap-2 border hover:shadow-card-md transition-all duration-200 text-left min-h-[44px]';
export const homeActionIcon =
  'w-9 h-9 rounded-lg flex items-center justify-center text-xl';
export const homeActionTitle =
  'text-sm font-semibold text-content-primary';
export const homeContentGrid =
  'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8';
export const homeCard =
  'card p-5 sm:p-6';
export const homeCardTitle =
  'text-lg font-bold text-content-primary font-playfair mb-4';
export const homeSubjectGrid =
  'space-y-2';
export const homeSubjectButton =
  'w-full text-left p-3 rounded-xl hover:bg-surface-subtle transition-colors min-h-[44px]';
export const homeSubjectInner =
  'flex items-center gap-3';
export const homeSubjectIcon =
  'w-9 h-9 rounded-lg bg-brand-primary-lt flex items-center justify-center text-brand-primary flex-shrink-0';
export const homeSubjectName =
  'text-sm font-semibold text-content-primary';
export const homeSubjectCount =
  'text-xs text-content-muted';
export const homeBanner =
  'card p-6 bg-gradient-to-r from-brand-primary to-brand-accent text-white';
export const homeBannerContent =
  'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6';
export const homeBannerTitle =
  'text-xl font-bold font-playfair';
export const homeBannerText =
  'text-sm text-white/70 mt-1';
export const homeBannerActions =
  'flex gap-3 flex-shrink-0';
export const homeBannerButtonPrimary =
  'px-4 py-2 bg-white text-brand-primary text-sm font-semibold rounded-lg min-h-[44px] flex items-center hover:bg-white/90 transition-colors';
export const homeBannerButtonSecondary =
  'px-4 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg min-h-[44px] flex items-center hover:bg-white/20 transition-colors';
export const homeBannerStats =
  'grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/20';
export const homeBannerStatItem =
  'text-center';
export const homeBannerStatValue =
  'text-2xl font-bold font-playfair';
export const homeBannerStatLabel =
  'text-xs text-white/60 mt-1';
