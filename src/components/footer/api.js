const FAKE_NETWORK_DELAY = 700; // ms

let _planners = [
  {
    id: '1',
    plannerName: 'Planner Name',
    trainerName: 'Trainer Name',
    trainerType: 'Personal Trainer',
    days: 6,
    levels: ['Intermediate', 'Beginner'],
    trainerAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
    dayPlans: [],
  },
];

let _nextId = 2;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function getPlanners() {
  await delay(FAKE_NETWORK_DELAY);

  return [..._planners];
}


export async function createPlanner(payload) {
  await delay(FAKE_NETWORK_DELAY);

  if (!payload.plannerName || !payload.trainerName) {
    throw new Error('Planner name and trainer name are required.');
  }

  const newPlanner = {
    id: String(_nextId++),
    plannerName: payload.plannerName,
    trainerName: payload.trainerName,
    trainerType: payload.trainerType || 'Personal Trainer',
   
    days: payload.dayPlans ? payload.dayPlans.length : payload.days || 1,
   
    levels: payload.levels && payload.levels.length > 0 ? payload.levels : ['Custom'],
    trainerAvatar:
      payload.photoUri ||
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
    
    dayPlans: payload.dayPlans || [],
  };

  _planners = [..._planners, newPlanner];
  return newPlanner;
}


export async function deletePlanner(id) {
  await delay(FAKE_NETWORK_DELAY);
  _planners = _planners.filter((p) => p.id !== id);
  return { success: true };
}