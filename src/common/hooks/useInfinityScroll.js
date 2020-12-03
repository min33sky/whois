import { useEffect } from 'react';

/**
 * 인피니트 스크롤링 Hook
 *
 * @param {object} param
 * @param {HTMLElement=} param.root 가시성을 확일할 때 사용되는 target의 조상 요소. null일땐, Browser의 Viewport
 * @param {import('react').RefObject} param.target 리랜더링 기준이 되는 DOM
 * @param {() => void} param.onInterSect 랜더링 콜백 함수
 * @param {number=} param.threshold target이 root와 교차되는 비율
 * @param {string=} param.rootMargin root가 가진 여백
 */
export const useInfinityScroll = ({
  root = null,
  target,
  onInterSect,
  threshold = 1.0, // 완전히 교차되어야 함
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
