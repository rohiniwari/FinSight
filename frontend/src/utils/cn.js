/**
 * cn — className utility (mirrors shadcn/ui convention)
 * Merges class strings, filtering falsy values.
 * Drop-in for clsx + tailwind-merge without extra deps.
 */
export function cn(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
