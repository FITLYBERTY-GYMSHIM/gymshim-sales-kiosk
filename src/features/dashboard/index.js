import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Header from '../../components/header';
import EnquiryPopup from "./modals/enquiry-form";   // ← new popup
import BannerAds from './components/banner-ads';
import SplashScreenAds from './components/splash-screen-ads';
import styles, { COLORS } from './style-sheet';
import PlanCard from './components/plan-card';

const MEMBERSHIP_CATEGORIES = [
  {
    id: 'gym-workout', title: 'Gym Workout', subtitle: 'Access to all gym equipment', icon: 'dumbbell',
    plans: [
      { id: 'gw-annual',  label: 'ANNUAL',    duration: 'year',     price: 11999, secondary: '₹ 1,000 / month',  badge: 'Popular' },
      { id: 'gw-6m',     label: '6 MONTHS',  duration: '6 months', price: 6999,  secondary: '₹ 1,167 / month' },
      { id: 'gw-3m',     label: '3 MONTHS',  duration: '3 months', price: 3999,  secondary: '₹ 1,333 / month' },
      { id: 'gw-monthly',label: 'MONTHLY',   duration: 'month',    price: 1499,  secondary: 'Flexible, cancel anytime' },
    ],
  },
  {
    id: 'personal-training', title: 'Personal Training', subtitle: '1-on-1 sessions with a certified trainer', icon: 'run',
    plans: [
      { id: 'pt-annual',  label: 'ANNUAL',   duration: 'year',     price: 35999, secondary: '₹ 3,000 / month',  badge: 'Popular' },
      { id: 'pt-6m',     label: '6 MONTHS', duration: '6 months', price: 18999, secondary: '₹ 3,167 / month' },
      { id: 'pt-3m',     label: '3 MONTHS', duration: '3 months', price: 9999,  secondary: '₹ 3,333 / month' },
      { id: 'pt-monthly',label: 'MONTHLY',  duration: 'month',    price: 3199,  secondary: 'Flexible, cancel anytime' },
    ],
  },
  {
    id: 'group-exercise', title: 'Group Exercise', subtitle: 'Yoga, Zumba, Bootcamp & more', icon: 'account-group',
    plans: [
      { id: 'ge-annual',  label: 'ANNUAL',   duration: 'year',     price: 14999, secondary: '₹ 1,250 / month',  badge: 'Popular' },
      { id: 'ge-6m',     label: '6 MONTHS', duration: '6 months', price: 7999,  secondary: '₹ 1,331 / month' },
      { id: 'ge-3m',     label: '3 MONTHS', duration: '3 months', price: 4299,  secondary: '₹ 1,433 / month' },
      { id: 'ge-monthly',label: 'MONTHLY',  duration: 'month',    price: 1699,  secondary: 'Flexible, cancel anytime' },
    ],
  },
  {
    id: 'liberty-membership', title: 'Liberty Membership', subtitle: 'Full access — gym + classes + PT', icon: 'crown',
    plans: [
      { id: 'lm-annual',  label: 'ANNUAL',   duration: 'year',     price: 49599, secondary: '₹ 4,133 / month',  badge: 'Popular' },
      { id: 'lm-6m',     label: '6 MONTHS', duration: '6 months', price: 26999, secondary: '₹ 4,500 / month' },
      { id: 'lm-3m',     label: '3 MONTHS', duration: '3 months', price: 14499, secondary: '₹ 4,833 / month' },
      { id: 'lm-monthly',label: 'MONTHLY',  duration: 'month',    price: 5499,  secondary: 'Flexible, cancel anytime' },
    ],
  },
];

function formatPrice(v) { return `₹${v.toLocaleString('en-IN')}`; }
const ALL_PLANS = MEMBERSHIP_CATEGORIES.flatMap(c => c.plans);

function CategorySection({ category, onBuyPlan, onTogglePlan, selectedPlanMap }) {
  return (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <MaterialCommunityIcons name={category.icon} size={18} color={COLORS.primary} />
        <View style={styles.categoryHeaderText}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
        </View>
      </View>
      <View style={styles.plansGrid}>
        {category.plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} onBuy={onBuyPlan} onToggle={onTogglePlan} selected={Boolean(selectedPlanMap[plan.id])} />
        ))}
      </View>
    </View>
  );
}

function TopMembershipsStrip({ categories, onSelectCategory, onSeeAll }) {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionHeaderAccent} />
          <Text style={styles.sectionHeaderTitle}>TOP MEMBERSHIPS</Text>
        </View>
        <TouchableOpacity onPress={onSeeAll}><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripContent}>
        {categories.map(cat => {
          const f = cat.plans[0];
          return (
            <TouchableOpacity key={cat.id} style={styles.stripCard} onPress={() => onSelectCategory(cat.id)} activeOpacity={0.85}>
              {f.badge ? <View style={styles.stripBadge}><Text style={styles.stripBadgeText}>{f.badge}</Text></View> : null}
              <Text style={styles.stripCardTitle}>{cat.title}</Text>
              <Text style={styles.stripCardPlan}>{f.label} Plan</Text>
              <Text style={styles.stripCardPrice}>{formatPrice(f.price)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function Dashboard({ navigation }) {
  const [showSplash,      setShowSplash]      = useState(true);
  const [selectedPlanMap, setSelectedPlanMap] = useState({});
  const [enquiryVisible,  setEnquiryVisible]  = useState(false); // ← popup state

  const togglePlanSelection = plan => setSelectedPlanMap(prev => ({ ...prev, [plan.id]: !prev[plan.id] }));
  const handleBuyPlan       = plan => console.log('Buy plan tapped', plan.id);

  const selectedPlans      = ALL_PLANS.filter(p => selectedPlanMap[p.id]);
  const selectedPlansCount = selectedPlans.length;
  const selectedTotal      = selectedPlans.reduce((s, p) => s + p.price, 0);

  return (
    <SafeAreaView style={styles.screen}>

      <View style={styles.heroShell}>
        <Header title="PULSE FITNESS" subtitle="Pune's Premier Fitness Studio" />
        <BannerAds />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TopMembershipsStrip categories={MEMBERSHIP_CATEGORIES} onSelectCategory={() => {}} onSeeAll={() => {}} />
        {MEMBERSHIP_CATEGORIES.map(cat => (
          <CategorySection key={cat.id} category={cat} onBuyPlan={handleBuyPlan} onTogglePlan={togglePlanSelection} selectedPlanMap={selectedPlanMap} />
        ))}
      </ScrollView>

      {selectedPlansCount > 0 && (
        <View style={styles.selectionSummaryBar}>
          <View>
            <Text style={styles.selectionSummaryCount}>{selectedPlansCount} plans selected</Text>
            <Text style={styles.selectionSummaryTotal}>{formatPrice(selectedTotal)}</Text>
          </View>
          <TouchableOpacity style={styles.selectionSummaryNextButton} activeOpacity={0.85}>
            <Text style={styles.selectionSummaryNextText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FAB */}
      <View style={styles.fab}>
        <TouchableOpacity onPress={() => setEnquiryVisible(true)} activeOpacity={0.85} style={styles.fabButton}>
          <Ionicons name="add" size={28} color={COLORS.white} />
          <Text style={styles.fabText}>ADD ENQUIRY</Text>
        </TouchableOpacity>
      </View>

      {/* Enquiry Popup */}
      <EnquiryPopup visible={enquiryVisible} onClose={() => setEnquiryVisible(false)} />

      <SplashScreenAds visible={showSplash} onDismiss={() => setShowSplash(false)} />
    </SafeAreaView>
  );
}