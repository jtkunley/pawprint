export function PawIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <ellipse cx="16" cy="20.5" rx="6" ry="5" />
        <ellipse cx="9" cy="13.5" rx="2.4" ry="3" />
        <ellipse cx="13.5" cy="9" rx="2.4" ry="3" />
        <ellipse cx="18.5" cy="9" rx="2.4" ry="3" />
        <ellipse cx="23" cy="13.5" rx="2.4" ry="3" />
      </g>
    </svg>
  );
}
