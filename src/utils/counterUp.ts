// lib/counterUp.ts
export function initCounterUp(
  selector = ".counter",
  duration = 2000,
  threshold = 0.8 // only start when 80% visible
) {
  const counters = document.querySelectorAll<HTMLElement>(selector);
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // ✅ start only when at least threshold portion is visible
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          const el = entry.target as HTMLElement;
          const end = parseInt(el.innerText.replace(/,/g, ""), 10);
          animate(el, end, duration);
          observer.unobserve(el); // animate once
        }
      });
    },
    {
      threshold: buildThresholdList(20), // smoother detection
      rootMargin: "0px 0px -10% 0px", // wait until section fully enters
    }
  );

  counters.forEach((el) => observer.observe(el));

  function animate(el: HTMLElement, end: number, duration: number) {
    const start = 0;
    const startTime = performance.now();

    function update(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * easeOutCubic(progress));
      el.innerText = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.innerText = end.toLocaleString();
    }

    requestAnimationFrame(update);
  }

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  // helper for smoother threshold detection
  function buildThresholdList(steps: number) {
    const thresholds: number[] = [];
    for (let i = 0; i <= steps; i++) {
      thresholds.push(i / steps);
    }
    return thresholds;
  }
}
