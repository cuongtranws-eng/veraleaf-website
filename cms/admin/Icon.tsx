/** Small leaf mark in the admin navigation / breadcrumb. */
export function Icon() {
  return (
    <svg className="vl-admin-icon" viewBox="0 0 32 32" width="28" height="28" aria-label="VeraLeaf" role="img">
      <defs>
        <linearGradient id="vlLeaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#3f9d3a" />
          <stop offset="1" stopColor="#b9e769" />
        </linearGradient>
      </defs>
      <path d="M28 4C15 4 6 11 6 22c0 2 .2 3.6.6 5C19 26 28 17 28 4Z" fill="url(#vlLeaf)" />
      <path d="M7 27c4-7 9-12 16-17" stroke="#0b140f" strokeOpacity=".55" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
