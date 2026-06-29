import React, { useState } from 'react';
import Text from '../../components/text';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Membershipbilling from './modals/membership-billing';
// ASSUMPTION: src/components/header exports a default component that accepts
// `title` / `subtitle` props. Adjust this import + the props below to match
// whatever your real Header component actually expects.
import Header from '../../components/header';
import BannerAds from './components/banner-ads';
import SplashScreenAds from './components/splash-screen-ads';
import styles, { COLORS } from './style-sheet';
import PlanCard from './components/plan-card';
import useMemberships from './helper/useMemberships';

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
        {category.plans.map(function (plan) {
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              onBuy={onBuyPlan}
              onToggle={onTogglePlan}
              selected={Boolean(selectedPlanMap[plan.id])}
            />
          );
        })}
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
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripContent}
      >
        {categories.map(function (cat) {
          var featured = cat.plans[0];
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.stripCard}
              onPress={function () { onSelectCategory(cat.id); }}
              activeOpacity={0.85}
            >
              {featured.badge ? (
                <View style={styles.stripBadge}>
                  <Text style={styles.stripBadgeText}>{featured.badge}</Text>
                </View>
              ) : null}
              <Text style={styles.stripCardTitle}>{cat.title}</Text>
              <Text style={styles.stripCardPlan}>{featured.label}</Text>
              <Text style={styles.stripCardPrice}>{formatPrice(featured.price)}</Text>
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

  var membershipData = useMemberships();
  var categories = membershipData.categories;
  var loading = membershipData.loading;
  var error = membershipData.error;
  var refetch = membershipData.refetch;

  function togglePlanSelection(plan) {
    setSelectedPlanMap(function (prev) {
      var next = Object.assign({}, prev);
      next[plan.id] = !next[plan.id];
      return next;
    });
  }
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

  // Loading state
  if (loading && !refreshing) {
    return <LoadingState />;
  }

  // Error state
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
      <SplashScreenAds visible={showSplash} onDismiss={() => setShowSplash(false)} />
        <Membershipbilling 
          visible={showBilling}
          onClose={() => setShowBilling(false)}
          selectedPlans={selectedPlans}
        />
    </SafeAreaView>
  );
}