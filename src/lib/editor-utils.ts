
// Save cursor position as an offset relative to the start of a specific node
export const getCaretOffset = (element: HTMLElement): number => {
  let caretOffset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
};

// Restore cursor position based on text offset
export const setCaretPosition = (element: HTMLElement, offset: number) => {
  const selection = window.getSelection();
  const range = document.createRange();
  let currentOffset = 0;
  let found = false;

  const traverse = (node: Node) => {
    if (found) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLength = node.nodeValue?.length || 0;
      if (currentOffset + nodeLength >= offset) {
        range.setStart(node, offset - currentOffset);
        range.setEnd(node, offset - currentOffset);
        found = true;
      } else {
        currentOffset += nodeLength;
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i]);
      }
    }
  };

  traverse(element);

  if (found && selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};


/**
 * MARKDOWN PARSER
 * Wraps tokens in 'md-token' class for conditional hiding.
 */
export const parseLine = (text: string): string => {
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 1. Headers (e.g. # Hello)
  if (/^#{1,6}\s/.test(html)) {
    const match = html.match(/^(#{1,6})(\s)(.*)/);
    if (match) {
      const level = match[1].length;
      const sizeClass =
        level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl';
      // Tokens: The hashes and the space
      return `<span class="${sizeClass} font-bold text-primary md-token">${match[1]}</span><span class="md-token">${match[2]}</span><span class="${sizeClass} font-bold text-foreground">${match[3]}</span>`;
    }
  }

  // 2. Blockquotes (> Quote)
  if (/^&gt;\s/.test(html)) {
    return `<span class="text-muted-foreground border-l-4 border-muted-foreground/50 pl-2 inline-block w-full">${html.substring(5)}</span>`;
  }

  // 3. List Items (- Item)
  if (/^-\s/.test(html)) {
    return `<span class="text-accent font-bold">- </span><span>${html.substring(
      2
    )}</span>`;
  }

  // 4. Inline Formatting

  // Code (`code`)
  html = html.replace(
    /`([^`]+)`/g,
    '<span class="md-token text-accent font-mono">`</span><span class="font-mono text-accent bg-muted rounded px-1">$1</span><span class="md-token text-accent font-mono">`</span>'
  );

  // Bold (**bold**)
  html = html.replace(
    /(\*\*)(.*?)\1/g,
    '<span class="md-token text-primary">**</span><span class="font-bold text-primary-foreground bg-primary/80 rounded-sm px-1">$2</span><span class="md-token text-primary">**</span>'
  );

  // Italic (*italic*)
  html = html.replace(
    /(\*)(.*?)\1/g,
    '<span class="md-token text-accent">*</span><span class="italic text-accent-foreground bg-accent/20 rounded-sm px-1">$2</span><span class="md-token text-accent">*</span>'
  );

  // WikiLinks ([[Link]])
  html = html.replace(
    /\[\[(.*?)\]\]/g,
    '<span class="md-token text-primary opacity-80">[[</span><span class="text-primary font-semibold underline decoration-primary/50 underline-offset-2 cursor-pointer">$1</span><span class="md-token text-primary opacity-80">]]</span>'
  );

  return html;
};
