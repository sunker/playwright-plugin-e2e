export const grafanaSelectorEngine = () => ({
  // Returns the first element matching given selector in the root's subtree.
  query(root: any, selector: string) {
    if (selector.startsWith('data-testid')) {
      return root.querySelector(`[data-testid="${selector}"]`);
    }

    return root.querySelector(`[aria-label="${selector}"]`);
  },

  // Returns all elements matching given selector in the root's subtree.
  queryAll(root: any, selector: string) {
    if (selector.startsWith('data-testid')) {
      return root.querySelectorAll(`[data-testid="${selector}"]`);
    }

    return root.querySelectorAll(`[aria-label="${selector}"]`);
  },
});
