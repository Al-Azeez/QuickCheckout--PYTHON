import React from 'react';

/**
 * Procedural SVG Barcode Generator for EAN-13 / Code-128 aesthetic.
 * Converts digits into crisp, scannable-looking black & white bars.
 */
export const BarcodeVisual = ({ barcode = '8901030383701', height = 48, className = '' }) => {
  const code = String(barcode).replace(/\D/g, '') || '8901030383701';

  // Generate deterministic bar widths from string hash/digits
  const bars = [];
  let currentPos = 4;

  // Leading quiet zone & guard pattern
  bars.push({ x: currentPos, w: 2, h: height });
  currentPos += 4;
  bars.push({ x: currentPos, w: 2, h: height });
  currentPos += 4;

  for (let i = 0; i < code.length; i++) {
    const d = parseInt(code[i], 10) || 1;
    const w1 = (d % 3) + 1.2;
    const w2 = ((d * 2) % 3) + 1.2;
    
    bars.push({ x: currentPos, w: w1, h: height - 10 });
    currentPos += w1 + 2;

    bars.push({ x: currentPos, w: w2, h: height - 10 });
    currentPos += w2 + 3;
  }

  // Trailing guard pattern
  currentPos += 2;
  bars.push({ x: currentPos, w: 2, h: height });
  currentPos += 4;
  bars.push({ x: currentPos, w: 2, h: height });
  currentPos += 6;

  return (
    <div className={`inline-flex flex-col items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs ${className}`}>
      <svg
        width={Math.min(currentPos, 220)}
        height={height}
        viewBox={`0 0 ${currentPos} ${height}`}
        className="w-full h-auto"
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.w}
            height={bar.h}
            fill="#0F172A"
          />
        ))}
      </svg>
      <span className="font-mono text-[11px] tracking-[0.25em] text-slate-700 mt-1 font-semibold select-all">
        {code}
      </span>
    </div>
  );
};

export default BarcodeVisual;
