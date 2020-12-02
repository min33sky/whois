import { useEffect } from 'react';

/**
 * 인피니트 스크롤링 함수
 *
 * @param {object} param
 * @param {HTMLElement=} param.root
 * @param {import('react').RefObject} param.target 리랜더링 기준이 되는 DOM
 * @param {() => void} param.onInterSect 랜더링 콜백 함수
 * @param {number=} param.threshold
 * @param {string=} param.rootMargin
 * @param {number=} param.page
 */
export const useInfinityScroll = ({
  root = null, // null일 땐, Browser Viewport
  target,
  onInterSect, // 콜백
  threshold = 1.0, // target이 완전히 다 보일 때
  rootMargin = '0px',
}) => {
  useEffect(() => {
    let ref = target.current;

    if (!ref) return;

    let observer = new IntersectionObserver(onInterSect, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [onInterSect, root, rootMargin, target, threshold]);
};
