import React from 'react';
import { View, Pressable } from 'react-native';
import Text from '../../../components/text';
import { Ionicons } from '@expo/vector-icons';
import styles, { COLORS } from '../style-sheet';

function formatPrice(value) {
  return '\u20B9' + value.toLocaleString('en-IN');
}

function PlanCard({ plan, onBuy, onToggle, selected }) {
  return (
    <Pressable
      style={[styles.planCard, selected && styles.planCardSelected]}
      onPress={() => onToggle(plan)}
    >
      <View style={styles.cardHeaderRow}>
        <View style={{ flex: 1 }} />
        <View style={[styles.checkBoxBox, selected && styles.checkBoxBoxSelected]}>
          {selected ? <Ionicons name="checkmark" size={18} color={COLORS.white} /> : null}
        </View>
      </View>

      <View style={styles.durationRow}>
        <Text style={styles.durationLabel} variant="extraBold">{plan.label}</Text>
        {plan.badge ? (
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}  variant="bold">{plan.badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceMain} variant="black">{formatPrice(plan.price)}</Text>
        <Text style={styles.priceUnit} variant="medium">{'/ ' + plan.duration}</Text>
      </View>

      {plan.rackRate && plan.rackRate > plan.price ? (
        <Text style={[styles.subPrice, { textDecorationLine: 'line-through', color: '#999' }]} variant="regular">
          {formatPrice(plan.rackRate)}
        </Text>
      ) : null}

      {plan.secondary ? <Text style={styles.subPrice}  variant="regular">{plan.secondary}</Text> : null}

      <Pressable
        style={styles.buyButtonFull}
        onPress={(event) => {
          event?.stopPropagation?.();
          onBuy(plan);
        }}
      >
        <Text style={styles.buyButtonFullText} variant="bold">
          {selected ? 'Selected' : 'Buy plan'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default PlanCard;