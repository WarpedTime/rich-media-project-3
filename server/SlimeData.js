const SLIMES = {
  base: {
    name: 'base',
    id: 0,
  },
  
  naruto:{
    name: 'naruto',
    id: 1,
  }
};

const getTotal = () => {
  const keys = Object.keys(SLIMES);
  return keys.length;
}

const getById = (id) => {
  const keys = Object.keys(SLIMES);
  for(let i = 0; i< keys.length; i++){
    if(SLIMES[keys[i]].id === id) return SLIMES[keys[i]];
  }
  return 'Slime';
}

module.exports.SLIMES = SLIMES;
module.exports.total = getTotal;
module.exports.GetById = getById;