import { useIntersectionObserver } from '@vueuse/core';
import { animations } from './animations';

export default {
  mounted(el: HTMLElement, binding: { value?: any }) {
    const type = binding.value?.type || 'fadeUp';
    const delay = binding.value?.delay || 0;
    const duration = binding.value?.duration || 600;

    const anim = animations[type as keyof typeof animations];

    let triggered = false;

    // ✅ LANGSUNG set initial (biar ga kedip)
    Object.assign(el.style, anim.initial);

    // force repaint (biar browser ngeh state awal)
    el.offsetHeight;

    // baru kasih transition
    el.style.transition = `
    opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,
    transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms
  `;

    useIntersectionObserver(
      el,
      ([{ isIntersecting }]: any) => {
        if (isIntersecting && !triggered) {
          triggered = true;

          Object.assign(el.style, anim.enter);
        }
      },
      {
        threshold: 0.2,
        immediate: true,
      },
    );
  },
};
