import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles, { COLORS } from '../style-sheet';

function PlanCard({ plan, onBuy, onToggle, selected }) {
  return (
    <Pressable
      style={[styles.planCard, selected && styles.planCardSelected]}
      onPress={() => onToggle(plan)}
    >
      <View style={styles.cardHeaderRow}>
  <View style={{flex:1}} />
  <View style={[styles.checkBoxBox, selected && styles.checkBoxBoxSelected]}>
    {selected ? <Ionicons name="checkmark" size={18} color={COLORS.white} /> : null}
  </View>
</View>
<View style={styles.durationRow}>
  <Text style={styles.durationLabel}>{plan.label}</Text>
  {plan.badge ? (
    <View style={styles.popularBadge}>
      <Text style={styles.popularBadgeText}>{plan.badge}</Text>
    </View>
  ) : null}
</View>

      <View style={styles.priceRow}>
        <Text style={styles.priceMain}>{`₹${plan.price.toLocaleString('en-IN')}`}</Text>
        <Text style={styles.priceUnit}>{`/ ${plan.duration}`}</Text>
      </View>

      {plan.secondary ? <Text style={styles.subPrice}>{plan.secondary}</Text> : null}

      <Pressable
        style={styles.buyButtonFull}
        onPress={(event) => {
          event?.stopPropagation?.();
          onBuy(plan);
        }}
      >
        <Text style={styles.buyButtonFullText}>
          {selected ? 'Selected':'Buy plan'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default PlanCard;
