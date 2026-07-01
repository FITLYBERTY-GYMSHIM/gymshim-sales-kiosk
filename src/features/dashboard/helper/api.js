const API_BASE_URL = 'https://gymshim.in/api';
// ---- Constants ------------------------------------------------------------
// import { membershipPlans } from '../../../data/membershipPlans';


const ICON_MAP = {
  GymWorkout: 'dumbbell',
  PersonalTraining: 'run',
  GroupEx: 'account-group',
  LybertyMembership: 'crown',
};

const CATEGORY_NAME_MAP = {
  GymWorkout: 'Gym Workout',
  PersonalTraining: 'Personal Training',
  GroupEx: 'Group Exercise',
  LybertyMembership: 'Liberty Membership',
};



function calculateDurationLabel(duration, durationType) {
  const type = durationType.toLowerCase();
  if (type === 'day') {
    if (duration >= 365) return Math.round(duration / 365) + ' Year';
    if (duration >= 30) return Math.round(duration / 30) + ' Months';
    return duration + ' Days';
  }
  if (type === 'month') {
    if (duration >= 12) return Math.round(duration / 12) + ' Year';
    return duration + ' Months';
  }
  if (type === 'year') {
    return duration + ' Year' + (duration > 1 ? 's' : '');
  }
  return duration + ' ' + durationType;
}

function calculateDurationUnit(duration, durationType) {
  const type = durationType.toLowerCase();
  if (type === 'day') {
    if (duration >= 365) return 'year';
    if (duration >= 30) return 'months';
    return 'days';
  }
  if (type === 'month') {
    if (duration >= 12) return 'year';
    return 'months';
  }
  if (type === 'year') return 'year';
  return durationType.toLowerCase();
}

function calculateSecondaryText(duration, durationType, basePrice, sessions) {
  if (sessions > 0) {
    return sessions + ' sessions included';
  }

  const type = durationType.toLowerCase();
  let totalMonths = 1;

  if (type === 'day') {
    totalMonths = Math.max(1, Math.round(duration / 30));
  } else if (type === 'month') {
    totalMonths = duration;
  } else if (type === 'year') {
    totalMonths = duration * 12;
  }

  if (totalMonths <= 0) totalMonths = 1;
  const monthly = Math.round(basePrice / totalMonths);
  return '\u20B9 ' + monthly.toLocaleString('en-IN') + ' / month';
}



export function transformMembershipData(rawPlans) {
  const grouped = {};

  rawPlans.forEach(function (plan) {
    var type = plan.type;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(plan);
  });

  var categories = Object.keys(grouped).map(function (type) {
    var plans = grouped[type].map(function (plan) {
      var pkg = plan.packages && plan.packages[0];
      var basePrice = pkg ? pkg.basePrice : 0;
      var rackRate = pkg ? pkg.rackRate : 0;
      var duration = pkg ? pkg.duration : 0;
      var durationType = pkg ? pkg.durationType : 'Month';
      var sessions = pkg ? pkg.sessions : 0;

      return {
        id: plan._id,
        label: plan.name || calculateDurationLabel(duration, durationType),
        price: rackRate,
        rackRate: rackRate,
        duration: calculateDurationUnit(duration, durationType),
        durationLabel: calculateDurationLabel(duration, durationType),
        secondary: calculateSecondaryText(duration, durationType, basePrice, sessions),
        badge: null,
      };
    });

    
    if (plans.length > 0) {
      var maxPrice = Math.max.apply(null, plans.map(function (p) { return p.price; }));
      var popularPlan = plans.find(function (p) { return p.price === maxPrice; });
      if (popularPlan) {
        popularPlan.badge = 'Popular';
      }
    }

    
    plans.sort(function (a, b) {
      if (a.badge === 'Popular' && b.badge !== 'Popular') return -1;
      if (a.badge !== 'Popular' && b.badge === 'Popular') return 1;
      return a.price - b.price;
    });

    var allActivities = [];
    grouped[type].forEach(function (plan) {
      if (plan.activities && plan.activities.length > 0) {
        plan.activities.forEach(function (a) {
          if (allActivities.indexOf(a) === -1) allActivities.push(a);
        });
      }
    });
    var subtitle = allActivities.length > 0 ? allActivities.join(', ') : 'Membership plans';

    return {
      id: type.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2'),
      title: CATEGORY_NAME_MAP[type] || type,
      subtitle: subtitle,
      icon: ICON_MAP[type] || 'card-membership',
      plans: plans,
    };
  });

  return categories;
}


export const fetchTrainers = async (branchId) => {
  const snapshot = await getDocs(collection(db, "branches", branchId, "trainers"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addTrainer = async (branchId, trainerData) => {
  return await addDoc(collection(db, "branches", branchId, "trainers"), {
    ...trainerData,
    createdAt: new Date().toISOString(),
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    totalRatings: 0,
    rating: 0,
  });
};


// ---- API call 

export async function fetchMembershipPlans() {
  const response = await fetch(`${API_BASE_URL}/sales-kiosk-membership-plans`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}


const BASE_URL = 'http://localhost:3000';


// export async function fetchMembershipPlans() {

//   return membershipPlans;
// }


// const BASE_URL = 'http://localhost:3005'; 

export const submitEnquiry = async (payload) => {
  const response = await fetch(`${BASE_URL}/enquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || 'Server error');
  }

  return json;
};

  export async function fetchBranchEmployees() {
  const response = await fetch('https://gymshim.in/api/getBranchEmployees');

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  const data = await response.json();
  const rawEmployees = data.employees || [];

  return rawEmployees.map((emp) => ({
    id: emp._id,
    name: emp.name || 'Unnamed',
    phone: emp.phone || '',
    email: emp.email || '',
    role: emp.role || 'Trainer',
    specialization: emp.specialization || '',
  }));
}

