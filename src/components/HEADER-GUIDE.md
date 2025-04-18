# Header Component Guide (`HEADER-GUIDE.md`)

This guide explains the functionality and debugging tips for the `Header.tsx` component in this project.

## Core Functionality

1.  **Sticky Positioning:** The header uses `position: fixed` and Tailwind classes (`z-[999] fixed top-0 ...`) to remain visible at the top of the viewport during scroll.
2.  **Dynamic Links:** It determines which set of navigation links to display (`homeLinks` or `estimateLinks` from `lib/data.ts`) based on the current `pathname` using `next/navigation`'s `usePathname`.
3.  **Styling:** Uses `clsx` for conditional styling based on active state and link type (e.g., the "Consultation" button).

## Active Section Highlighting

1.  **Context:** Uses `useActiveSectionContext` (`src/context/active-section-context.tsx`) to get and set the `activeSection` state.
2.  **Detection:** The `useSectionInView` hook (`src/lib/hooks.ts`) is implemented on relevant page sections (`src/app/page.tsx`, `src/app/estimate/page.tsx`). This hook uses `react-intersection-observer` to detect when a section scrolls into view (based on a threshold, default is 0.5 or 50% visibility).
3.  **Update:** When a section enters the viewport threshold, `useSectionInView` calls `setActiveSection` from the context, updating the global state.
4.  **Header Reaction:** The `Header` component reads `activeSection` from the context. It uses this state to apply active styling (e.g., text weight) and render the animated indicator bubble.

## Smooth Scrolling

1.  **Click Handler:** The `handleSmoothScrollClick` function in `Header.tsx` handles clicks on navigation links.
2.  **State Update:** It first calls `handleLinkClickState` to immediately update the `activeSection` state (making the link appear active instantly).
3.  **Scrolling:** It prevents the default link behavior (`event.preventDefault()`) and uses the browser's native `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` to smoothly scroll the corresponding section (`id` matching the link's `hash`) to the top of the viewport.

## Indicator Bubble Animation

1.  **Component:** A `motion.span` element is conditionally rendered _inside_ the active link's `li` element (`{isActive && (...) }`).
2.  **`layoutId`:** This `motion.span` has `layoutId="activeSection"`. This key prop tells `framer-motion` to automatically animate the span's position and size changes when it appears under a _different_ parent link due to an `activeSection` state change.
3.  **Transition:** The `transition` prop on the `motion.span` defines the animation physics (e.g., `type: 'spring'`).
4.  **Styling:** The `motion.span` provides the visual background highlight (e.g., `bg-blue-100`). For the special "Consultation" link, the span's background is set to `bg-transparent` via `clsx` to allow the link's own blue background to show through.

## Debugging the Indicator Bubble Animation (Quick Guide)

If the bubble blinks, stalls, or doesn't transition smoothly **during scroll** (but works on click):

1.  **Check the _Last_ Tracked Section:** The most common cause is the target section being the _very last_ section on the page that uses the `useSectionInView` hook. The animation needs a subsequent tracked section to transition _from_ when the penultimate section becomes inactive.

    - **Fix:** Ensure there's _another_ section tracked by `useSectionInView` placed _after_ the problematic target section in the page's component structure. In this project, the "Contact" (blue CTA) was initially last, causing the freeze. Tracking the `<Contact />` form section (as "Email") _after_ it resolved the issue.

2.  **Verify `useSectionInView` Refs:** Double-check in the page component (`page.tsx`) that the `ref` obtained from `useSectionInView('SectionName')` is correctly attached to the corresponding `<motion.section ref={...}>`. A missing or misplaced ref means the section won't update the active state on scroll.

3.  **Check `Header.tsx` Logic:**

    - Ensure the `motion.span` with `layoutId="activeSection"` is conditionally rendered based _only_ on `isActive`. Previous issues involved extra conditions (`!isContactLink`) that prevented the span from rendering under "Consultation", breaking the animation target.
    - Ensure the `clsx` styling logic for the `Link` itself doesn't apply styles (especially backgrounds) when `isActive` that conflict with or obscure the animated `motion.span` underneath. The span should generally be responsible for the active background.

4.  **Inspect Context State:** Use React DevTools to monitor the `activeSection` state provided by `ActiveSectionContextProvider`. Observe how it changes during scrolling near the problematic transition. Does it update correctly? Does it briefly become `null` or flicker? This can pinpoint if the state update itself is delayed or inconsistent.

5.  **Consider Thresholds (Less Likely):** While adjusting the `threshold` in `useSectionInView` (e.g., `useSectionInView('Contact', 0.3)`) can sometimes help bridge small gaps, it didn't fix the "last item" problem in this case and might introduce other inconsistencies. Treat this as a secondary option if the above steps fail.
