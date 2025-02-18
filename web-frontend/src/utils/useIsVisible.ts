import { useState, useEffect } from 'react';

export default function useIsVisible(
  ref: React.RefObject<HTMLElement>,
  index: number,
) {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    // Create an IntersectionObserver to observe the ref's visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.99,
      },
    );

    // Start observing the element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup the observer when the component unmounts or ref changes
    return () => {
      observer.disconnect();
    };
  }, [index, ref]);

  return isIntersecting;
}
