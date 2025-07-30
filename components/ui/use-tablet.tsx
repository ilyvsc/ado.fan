import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${DESKTOP_BREAKPOINT - 1}px)`
    );
    const onChange = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    onChange(); // Set initial value
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}