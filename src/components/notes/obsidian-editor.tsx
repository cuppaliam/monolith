'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  getCaretOffset,
  setCaretPosition,
  parseLine,
} from '@/lib/editor-utils';

const ObsidianEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const activeBlockRef = useRef<HTMLElement | null>(null);

  // Set initial content and parse it line-by-line
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = `<div># Welcome to Monolith Notes</div><div><br></div><div>This is a **concept demo** of a live formatting editor.</div><div><br></div><div>- Tokens (like **) are hidden until you click the line.</div><div>- No overlays, just DOM manipulation.</div><div>- **Bold** and *Italic* works inline.</div><div><br></div><div>Try typing a [[WikiLink]] or a quote:</div><div><br></div><div>&gt; Simplicity is the ultimate sophistication.</div><div><br></div><div>You can also use \`code blocks\` inline.</div>`;

      // Parse initial content line by line
      const lines = editorRef.current.childNodes;
      lines.forEach((line) => {
        if (line.nodeType === Node.ELEMENT_NODE) {
          const text = line.textContent || '';
          const newHTML = parseLine(text);
          if ((line as HTMLElement).innerHTML !== newHTML) {
            (line as HTMLElement).innerHTML = newHTML;
          }
        }
      });
    }
  }, []);

  // Handle Selection Change to toggle "Active Line" state
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || !editorRef.current) return;

      const anchorNode = selection.anchorNode;
      if (!anchorNode) return;

      // Find the line block (div)
      let block: Node | null =
        anchorNode.nodeType === Node.TEXT_NODE
          ? anchorNode.parentNode
          : anchorNode;
          
      // Traverse up until we find a direct child of the editor
      while (block && block.parentNode !== editorRef.current) {
        block = block.parentNode;
      }

      if (block instanceof HTMLElement && block !== activeBlockRef.current) {
        // Remove active class from previous block
        if (activeBlockRef.current) {
          activeBlockRef.current.classList.remove('active-line');
          // Re-parse the old line to hide tokens
          const oldText = activeBlockRef.current.textContent || '';
          activeBlockRef.current.innerHTML = parseLine(oldText);
        }

        // Add active class to new block
        block.classList.add('active-line');
        // Re-parse the new active line to show tokens
        const newText = block.textContent || '';
        block.innerHTML = parseLine(newText);
        
        activeBlockRef.current = block;
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let block: Node | null = range.commonAncestorContainer;

    // Traverse up to find the direct child of the editor (the line)
    while (block && block.parentNode !== editorRef.current) {
      block = block.parentNode;
    }

    if (block && block.nodeType === Node.ELEMENT_NODE) {
      const el = block as HTMLElement;
      const savedOffset = getCaretOffset(el);
      const textContent = el.textContent || '';
      const newHTML = parseLine(textContent);

      if (el.innerHTML !== newHTML) {
        el.innerHTML = newHTML;
        setCaretPosition(el, savedOffset);
      }

      // Ensure current block is marked active during input
      if (!el.classList.contains('active-line')) {
        el.classList.add('active-line');
        activeBlockRef.current = el;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Basic Enter handling - relies on browser default behavior and selectionchange
    if (e.key === 'Enter') {
      // Allow default behavior
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <style jsx>{`
        /* Hide markdown tokens by default */
        :global(.md-token) {
          display: none;
        }
        /* Show markdown tokens when the line is active (being edited) */
        :global(.active-line .md-token) {
          display: inline;
        }
      `}</style>

      {/* Editor Surface */}
      <div
        className="flex-1 overflow-y-auto cursor-text"
        onClick={() => editorRef.current?.focus()}
      >
        <div className="max-w-3xl mx-auto pt-8 pb-32 px-4 sm:px-8 min-h-full">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="outline-none text-foreground font-sans text-lg leading-relaxed whitespace-pre-wrap selection:bg-primary/30 empty:before:content-['Type_something...'] empty:before:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default ObsidianEditor;
