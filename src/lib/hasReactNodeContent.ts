
import { ReactNode, isValidElement } from 'react';

/**
 * Recursively checks if a ReactNode contains any non-empty string or valid content.
 * @param node The ReactNode to check.
 * @returns True if there's meaningful content, otherwise false.
 */
export function hasReactNodeContent(node: ReactNode): boolean {
  if (typeof node === 'string' || typeof node === 'number') {
    return node.toString().trim().length > 0;
  }

  if (Array.isArray(node)) {
    return node.some(hasReactNodeContent);
  }

  if (isValidElement(node)) {
    return hasReactNodeContent(node.props.children);
  }

  return false;
}
