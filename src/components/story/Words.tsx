import React from 'react';

/**
 * Splits a headline into words that rise into place when the chapter becomes
 * active (see `.w` in globals.css). Wrap a phrase in *asterisks* to set it in
 * the accent colour. Renders plain, readable text without JavaScript.
 */
export function Words({ text }: { text: string }) {
  let index = 0;
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean);

  return (
    <>
      {parts.map((part, p) => {
        const accent = part.startsWith('*') && part.endsWith('*');
        const words = (accent ? part.slice(1, -1) : part).split(/(\s+)/);
        const content = words.map((word, w) =>
          /^\s+$/.test(word) || word === '' ? (
            word
          ) : (
            <span className="w" key={w}>
              <span style={{ '--i': index++ } as React.CSSProperties}>{word}</span>
            </span>
          )
        );
        return accent ? <em key={p}>{content}</em> : <React.Fragment key={p}>{content}</React.Fragment>;
      })}
    </>
  );
}
