const SLIMES = {
  base: {
    name: 'base',
    id: 0,
    type: '',
    stats: {
      atk: 0,
      spd: 0,
    },
    skills: [
      
    ]
  },
  
  naruto:{
    name: 'naruto',
    id: 1,
  }
};


const STATUS = {
  stun: {
    name: 'stun',
    turns: 1,
    buff: [ ],
    debuff: [ ]
  }
}

const TYPES = {
  normal: {
    name: 'normal',
    weakTo: [ ],
    resistTo: [ ],
  },
  fire: {
    name: 'fire',
    weakTo: [ 'water' ],
    resistTo: [ 'grass' ],
  },
  water: {
    name: 'water',
    weakTo: [ 'grass' ],
    resistTo: [ 'fire' ],
  },
  grass: {
    name: 'grass',
    weakTo: [ 'fire' ],
    resistTo: [ 'water' ],
  },
  dark: {
    name: 'dark',
    weakTo: [ 'light' ],
    resistTo: [ 'water' ],
  },
  light: {
    name: 'light',
    weakTo: [ 'dark' ],
    resistTo: [ 'fire' ],
  },
}

const SKILLS = {
  whack: {
    name: 'whack',
    type: TYPES.normal,
    dmg: 10,
    heal: 0,
    status: 0,
    buff: 0,
    debuff: 0
  }
}