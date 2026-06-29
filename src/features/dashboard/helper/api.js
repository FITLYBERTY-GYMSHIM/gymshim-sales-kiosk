import { membershipPlans } from '../../../data/membershipPlans';

// ---- Constants ------------------------------------------------------------

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

// ---- Helper functions -----------------------------------------------------

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

// ---- Main functions -------------------------------------------------------

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
        price: basePrice,
        rackRate: rackRate,
        duration: calculateDurationUnit(duration, durationType),
        durationLabel: calculateDurationLabel(duration, durationType),
        secondary: calculateSecondaryText(duration, durationType, basePrice, sessions),
        badge: null,
      };
    });

    // Assign "Popular" badge to highest priced plan
    if (plans.length > 0) {
      var maxPrice = Math.max.apply(null, plans.map(function (p) { return p.price; }));
      var popularPlan = plans.find(function (p) { return p.price === maxPrice; });
      if (popularPlan) {
        popularPlan.badge = 'Popular';
      }
    }

    // Sort plans by price ascending
    plans.sort(function (a, b) {
      if (a.badge === 'Popular' && b.badge !== 'Popular') return -1;
      if (a.badge !== 'Popular' && b.badge === 'Popular') return 1;
      return a.price - b.price;
    });

    var firstPlan = grouped[type][0];
    var subtitle =
      firstPlan.activities && firstPlan.activities.length > 0
        ? firstPlan.activities.join(', ')
        : 'Membership plans';

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

// ---- API call (swap later when real API is ready) -------------------------

export async function fetchMembershipPlans() {
  // TODO: When real API is ready, replace with:
  // const response = await fetch('YOUR_API_URL');
  // const data = await response.json();
  // return data;

  // For now, return dummy data
  return membershipPlans;
}