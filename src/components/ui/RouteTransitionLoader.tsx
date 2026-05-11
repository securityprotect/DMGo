'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const first = useRef(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(true);
    const id = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(id);
  }, [routeKey]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <div className="absolute inset-0 bg-background/45 backdrop-blur-[2px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="loader-orbit">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

