import React, { useState } from 'react';
import Text from '../../components/text';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Membershipbilling from './modals/membership-billing';
import Header from '../../components/header';
// import Header from '../../components/header';
import EnquiryPopup from "./modals/enquiry-form";   // ← new popup
import BannerAds from './components/banner-ads';
import SplashScreenAds from './components/splash-screen-ads';
import styles, { COLORS } from './style-sheet';
import PlanCard from './components/plan-card';
import useMemberships from './helper/useMemberships';
import GymTrainersScreen from './components/gym-trainers';

// ---- Helpers ---------------------------------------------------------------

function formatPrice(value) {
  return '\u20B9' + value.toLocaleString('en-IN');
}

// ---- Sub components --------------------------------------------------------

function CategorySection({ category, onBuyPlan, onTogglePlan, selectedPlanMap }) {
  return (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <MaterialCommunityIcons name={category.icon} size={18} color={COLORS.primary} />
        <View style={styles.categoryHeaderText}>
          <Text variant="bold">{category.title}</Text>
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

function LoadingState() {
  return (
    <SafeAreaView style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={{ marginTop: 12, color: '#666' }}>Loading memberships...</Text>
    </SafeAreaView>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <SafeAreaView style={[styles.screen, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
      <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#E53935" />
      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
        {error}
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        style={{
          marginTop: 16,
          backgroundColor: COLORS.primary,
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ---- Screen ----------------------------------------------------------------

export default function Dashboard({ navigation }) {
  var [showSplash, setShowSplash] = useState(true);
  var [selectedPlanMap, setSelectedPlanMap] = useState({});
  var [refreshing, setRefreshing] = useState(false);
  var [showBilling, setShowBilling] = useState(false);
  var [showTrainers, setShowTrainers] = useState(false); 

  
  
  const [enquiryVisible,  setEnquiryVisible]  = useState(false); // ← popup state

  const togglePlanSelection = plan => setSelectedPlanMap(prev => ({ ...prev, [plan.id]: !prev[plan.id] }));
  //const handleBuyPlan       = plan => console.log('Buy plan tapped', plan.id);

  //const selectedPlans      = ALL_PLANS.filter(p => selectedPlanMap[p.id]);
  // const selectedPlansCount = selectedPlans.length;
  // const selectedTotal      = selectedPlans.reduce((s, p) => s + p.price, 0);

  var membershipData = useMemberships();
  var categories = membershipData.categories;
  var loading = membershipData.loading;
  var error = membershipData.error;
  var refetch = membershipData.refetch;

  // function togglePlanSelection(plan) {
  //   setSelectedPlanMap(function (prev) {
  //     var next = Object.assign({}, prev);
  //     next[plan.id] = !next[plan.id];
  //     return next;
  //   });
  // }
  function handleTopMembershipPress(categoryId) {
    var category = categories.find(function (cat) { return cat.id === categoryId; });
    if (!category || !category.plans[0]) return;
    var plan = category.plans[0];
    setSelectedPlanMap(function (prev) {
      var next = Object.assign({}, prev);
      next[plan.id] = true;
      return next;
    });
  }

  function handleBuyPlan(plan) {
    console.log('Buy plan tapped', plan.id);
  }

  function handleFabPress() {
    console.log('FAB tapped — open enquiry form');
  }

  async function handleRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  if (loading && !refreshing) {
    return <LoadingState />;
  }

  if (error && categories.length === 0) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  var ALL_PLANS = categories.reduce(function (acc, cat) {
    return acc.concat(cat.plans);
  }, []);
  var selectedPlans = ALL_PLANS.filter(function (plan) { return selectedPlanMap[plan.id]; });
  var selectedPlansCount = selectedPlans.length;
  var selectedTotal = selectedPlans.reduce(function (sum, plan) { return sum + plan.price; }, 0);

  return (
    <SafeAreaView style={styles.screen}>

      <View style={styles.heroShell}>
        <Header title="PULSE FITNESS" subtitle="Pune's Premier Fitness Studio" />
        <BannerAds />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {categories.length > 0 ? (
          <TopMembershipsStrip
            categories={categories}
            onSelectCategory={handleTopMembershipPress}
            onSeeAll={function () { }}
          />
        ) : null}

        {categories.map(function (category) {
          return (
            <CategorySection
              key={category.id}
              category={category}
              onBuyPlan={handleBuyPlan}
              onTogglePlan={togglePlanSelection}
              selectedPlanMap={selectedPlanMap}
            />
          );
        })}

        {/* ── Our Trainers Button ── */}
        <TouchableOpacity
          onPress={() => setShowTrainers(true)}
          style={{
            marginHorizontal: 16,
            marginTop: 8,
            marginBottom: 24,
            backgroundColor: '#E53E36',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E0E0E0',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 12,
          }}
        >
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#EEF4FF', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="people-outline" size={22} color="#005b96" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>Our Trainers</Text>
            <Text style={{ fontSize: 12, color: '#FFFFFF', marginTop: 1 }}>4 certified trainers available</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#005b96" />
        </TouchableOpacity>

      </ScrollView>

      {selectedPlansCount > 0 ? (
        <View style={styles.selectionSummaryBar}>
          <View>
            <Text style={styles.selectionSummaryCount}>{selectedPlansCount} plans selected</Text>
            <Text style={styles.selectionSummaryTotal}>{formatPrice(selectedTotal)}</Text>
          </View>
          <TouchableOpacity style={styles.selectionSummaryNextButton} activeOpacity={0.85}
            onPress={() => setShowBilling(true)}
          >
            <Text style={styles.selectionSummaryNextText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {selectedPlansCount > 0 ? null : (
        <View style={styles.fab}>
          <TouchableOpacity onPress={handleFabPress} activeOpacity={0.85}>
            <Ionicons name="add" size={40} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* <SplashScreenAds visible={showSplash} onDismiss={function () { setShowSplash(false); }} /> */}
          {/* <TouchableOpacity style={styles.selectionSummaryNextButton} activeOpacity={0.85}>
            <Text style={styles.selectionSummaryNextText}>Next</Text>
          </TouchableOpacity>
        </View>
      )} */}

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

      <Membershipbilling
        visible={showBilling}
        onClose={() => setShowBilling(false)}
        selectedPlans={selectedPlans}
      />

      {/* ── Trainers full screen Modal ── */}
      <Modal
        visible={showTrainers}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
      >
        <GymTrainersScreen onClose={() => setShowTrainers(false)} />
      </Modal>

    </SafeAreaView>
  );
}