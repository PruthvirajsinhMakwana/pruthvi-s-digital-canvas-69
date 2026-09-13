# Clean Services and Portfolio Structure

## Goal
Make the Services page easy to scan: show real work first, automatically organize links, remove repeated content, and keep visibility/category controls in Admin.

## Changes
1. Move “Explore My Portfolio” directly below the page introduction, before the service list.
2. Simplify portfolio cards and add compact category filters only when multiple categories exist.
3. Auto-detect portfolio type and link source from the title, icon, and URL (website, design, video, marketing, other; Google Drive, Behance, YouTube, GitHub, or external link).
4. Sort portfolio samples by the Admin order and ignore hidden, empty, or duplicate links.
5. Clean the service list by removing duplicate default/custom entries and honoring Admin visibility and order.
6. Expand the Admin service category selector so each service can be explicitly placed under Websites, Design, Video, Marketing & SEO, IT Support, or Esports; older entries will still be auto-detected.
7. Keep only one simple “See Plans” action at the bottom of the Services page and remove repeated portfolio/pricing content from the service grid.
8. Verify the page at desktop and mobile widths, links, filters, and the current build status.

## Technical details
- Existing settings storage remains unchanged; new category values are stored in the same settings JSON.
- No new database table or public content is added.
- Existing visibility toggles and drag ordering remain the source of truth.
