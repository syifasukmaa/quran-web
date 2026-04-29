export const animations = {
  fadeUp: {
    initial: {
      opacity: '0',
      transform: 'translateY(40px)', // lebih jauh
    },
    enter: {
      opacity: '1',
      transform: 'translateY(0)',
    },
  },
  fadeDown: {
    initial: {
      opacity: '0',
      transform: 'translateY(-60px)',
    },
    enter: {
      opacity: '1',
      transform: 'translateY(0)',
    },
  },

  scaleIn: {
    initial: {
      opacity: '0',
      transform: 'scale(0.95)',
    },
    enter: {
      opacity: '1',
      transform: 'scale(1)',
    },
  },

  slideLeft: {
    initial: {
      opacity: '0',
      transform: 'translateX(30px)',
    },
    enter: {
      opacity: '1',
      transform: 'translateX(0)',
    },
  },
};
