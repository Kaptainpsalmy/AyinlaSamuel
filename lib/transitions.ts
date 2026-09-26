/**
 * Shared view-transition names. Both sides of a morph must use the exact same
 * name, so they are built in one place. Safe to import from server and client.
 */

/** Project card cover <-> first image of the case-study gallery. */
export const coverTransitionName = (slug: string) => `project-cover-${slug}`;
