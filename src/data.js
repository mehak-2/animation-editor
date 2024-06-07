export const data = {
  basic: [
    {
      name: 'rise',
      animations: [
        {
          opacity: 0,
          transform: 'translate(var(--translate), calc(var(--translate) + 100px))'
        },
        {
          opacity: 1,
          transform: 'translate(var(--translate), calc(var(--translate) + 0px))'
        }
      ]
    },
    {
      name: 'rotate-center',
      animations: [
        {
          transform: 'rotate(0)'
        },
        {
          transform: 'rotate(360deg)'
        }
      ]
    },
    {
      name: 'rotate-90-tr-ccw',
      animations: [
        {
          transform: 'rotate(0)',
          'transform-origin': 'top right'
        },
        {
          transform: 'rotate(-90deg)',
          'transform-origin': 'top right'
        }
      ]
    },    
    {
      name: 'flip-vertical',
animations: [
        {
          transform: 'rotateY(0)'
        },
        {
          opacity: 1,
          transform: 'rotateY(180deg)'
        }
      ]
    },
    {
      name: 'focus-in-contract',
      animations: [
        {
          'letter-spacing': '1em',
          filter: 'blur(12px)',
          opacity: '0'
        },
        {
          filter: 'blur(0)',
          opacity: '1'
        }
      ]
    },
    {
      name: 'flip-diagonal-tr',
      animations: [
        {
          transform: 'rotate3d(1,1,0,0deg)'
        },
        {
          opacity: 1,
          transform: 'rotate3d(1,1,0,180deg)'
        }
      ]
    }
  ],
  heartIt: [
    {
      name: 'heart-it',
      animations: [
        {
          'stroke-opacity': 0,
          transform: 'translate(var(--translate), calc(var(--translate) + 100px))'
        },
        {
          'stroke-opacity': 1,
          color: 'green',
          transform: 'translate(var(--translate), calc(var(--translate) + 0px))'
        }
      ]
    }
  ],
  heartbeat: [
    {
      name: 'heartbeat',
      animations: [
        {
          transform: 'translate(var(--translate), var(--translate)) scale(1)',
          'transform-origin': 'center center',
          'animation-timing-function': 'ease-out'
        },
        {
          transform: 'translate(var(--translate), var(--translate)) scale(1)',
          'animation-timing-function': 'ease-out'
        }
      ]
    }
  ],
  scaleupbr: [
    {
      name: 'scale-up-br',
      animations: [
        {
          transform: 'translate(-50%, -50%) scale(0.5)',
          'transform-origin': '100% 100%'
        },
        {
          transform: 'translate(-50%, -50%) scale(1)',
          'transform-origin': '100% 100%'
        }
      ]
    }
  ],
};
