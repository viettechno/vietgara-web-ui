# Changelog

Versions are git tags (`vX.Y.Z`), following semantic versioning. Apps pin one in `package.json`.

## v0.2.0 — 2026-10-08

- **Collapsible sidebar.** On desktop the sidebar is expanded (256px) or collapsed to an icon rail (64px) with a toggle at its foot; the choice is remembered (`localStorage` key `vietgara.sidebar`, default expanded). A collapsed sidebar (and the tablet rail) opens over the page, without moving the content, when the mouse rests on it for 150 ms or keyboard focus enters it. `AppShell` labels gain `collapse` and `expand`; new `useSidebarCompact()` for content that a collapsed sidebar hides (the wordmark). The sidebar now sits above the header (z-index 35) so its brand is never clipped.

## v0.1.0 — 2026-10-07

First release of the VietGara web design system (v2).

- Tokens: semantic color tokens in light and dark with a contrast test, type scale, radius, shadows, motion.
- Components: Button, IconButton, Field, Input, Textarea, NativeSelect, SearchInput, Checkbox, Radio, Switch, SegmentedControl,
  Dialog, Sheet, DropdownMenu, Popover, Tooltip, Tabs, Badge, Count, Avatar, PlateChip, Money, Panel, PageLayout, PageHeader,
  Breadcrumb, Section, DescriptionList, StickyActionBar, Table, Pagination, StatStrip, Meter, BarChart, Alert, EmptyState,
  Skeleton, Spinner, AppShell (sidebar rail / phone sheet), AccountMenu, CommandPalette, ThemeProvider, UIProvider, toast.
- Gallery app (`npm run dev`).
