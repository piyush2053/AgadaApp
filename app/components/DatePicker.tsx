// components/DatePicker.tsx
// Custom inline Day/Month/Year picker — no external dependency

import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function buildRange(from: number, to: number): number[] {
  const arr: number[] = [];
  for (let i = from; i <= to; i++) arr.push(i);
  return arr;
}

// ─── Single column wheel ───────────────────────────────────────
type WheelProps = {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width?: number;
};

function Wheel({ items, selectedIndex, onSelect, width = 90 }: WheelProps) {
  const scrollRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    // Scroll to selected on mount / when selectedIndex changes externally
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 50);
  }, [selectedIndex]);

  const handleScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    onSelect(clamped);
    // Snap exactly
    scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
  };

  return (
    <View style={[styles.wheelContainer, { width }]}>
      {/* Selection highlight */}
      <View style={styles.selectionHighlight} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        style={{ height: PICKER_HEIGHT }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        scrollEventThrottle={16}
      >
        {items.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <TouchableOpacity
              key={i}
              style={styles.wheelItem}
              onPress={() => {
                onSelect(i);
                scrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
              }}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.wheelItemText,
                  isSelected && styles.wheelItemTextSelected,
                  i === selectedIndex - 1 || i === selectedIndex + 1
                    ? styles.wheelItemTextNear
                    : null,
                  (i < selectedIndex - 2 || i > selectedIndex + 2)
                    ? styles.wheelItemTextFar
                    : null,
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Top + bottom gradient fade overlay */}
      <View style={styles.fadeTop} pointerEvents="none" />
      <View style={styles.fadeBottom} pointerEvents="none" />
    </View>
  );
}

// ─── Main DatePicker component ────────────────────────────────
type DatePickerProps = {
  label?: string;
  value: string; // "DD/MM/YYYY"
  onChange: (formatted: string) => void;
};

export default function DatePicker({ label, value, onChange }: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Parse current value
  const parseValue = () => {
    const parts = value?.split("/");
    const today = new Date();
    const day = parseInt(parts?.[0]) || today.getDate();
    const month = parseInt(parts?.[1]) || today.getMonth() + 1;
    const year = parseInt(parts?.[2]) || today.getFullYear();
    return { day, month, year };
  };

  const initial = parseValue();
  const [tempDay, setTempDay] = useState(initial.day);
  const [tempMonth, setTempMonth] = useState(initial.month);
  const [tempYear, setTempYear] = useState(initial.year);

  const currentYear = new Date().getFullYear();
  const years = buildRange(currentYear - 10, currentYear + 2);
  const daysInMonth = getDaysInMonth(tempMonth, tempYear);
  const days = buildRange(1, daysInMonth);

  // If selected day exceeds days in new month, clamp
  useEffect(() => {
    if (tempDay > daysInMonth) setTempDay(daysInMonth);
  }, [tempMonth, tempYear]);

  const openPicker = () => {
    const p = parseValue();
    setTempDay(p.day);
    setTempMonth(p.month);
    setTempYear(p.year);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    const d = String(tempDay).padStart(2, "0");
    const m = String(tempMonth).padStart(2, "0");
    onChange(`${d}/${m}/${tempYear}`);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Format display string
  const displayDate = () => {
    if (!value) return "Select date";
    const parts = value.split("/");
    if (parts.length === 3) {
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]) - 1;
      const y = parseInt(parts[2]);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        return `${d} ${MONTHS[m]} ${y}`;
      }
    }
    return value;
  };

  const dayItems = days.map((d) => String(d).padStart(2, "0"));
  const monthItems = MONTHS.map((m) => m.slice(0, 3));
  const yearItems = years.map(String);

  const dayIndex = Math.max(0, days.indexOf(tempDay));
  const monthIndex = Math.max(0, tempMonth - 1);
  const yearIndex = Math.max(0, years.indexOf(tempYear));

  return (
    <View>
      {/* Trigger field */}
      <TouchableOpacity style={styles.trigger} onPress={openPicker} activeOpacity={0.7}>
        <MaterialIcons name="calendar-today" size={18} color="#C45E3D" />
        <Text style={[styles.triggerText, !value && styles.triggerPlaceholder]}>
          {displayDate()}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Modal picker */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sheet}
            onPress={() => {}} // prevent propagation
          >
            {/* Sheet header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <MaterialIcons name="event" size={20} color="#C45E3D" />
                <Text style={styles.sheetTitle}>Select Date</Text>
              </View>
              <View style={styles.previewBadge}>
                <Text style={styles.previewText}>
                  {String(tempDay).padStart(2, "0")} {MONTHS[tempMonth - 1].slice(0, 3)} {tempYear}
                </Text>
              </View>
            </View>

            {/* Column labels */}
            <View style={styles.columnLabels}>
              <Text style={[styles.colLabel, { width: 64 }]}>Day</Text>
              <Text style={[styles.colLabel, { flex: 1 }]}>Month</Text>
              <Text style={[styles.colLabel, { width: 74 }]}>Year</Text>
            </View>

            {/* Wheels row */}
            <View style={styles.wheelsRow}>
              <Wheel
                items={dayItems}
                selectedIndex={dayIndex}
                onSelect={(i) => setTempDay(days[i])}
                width={64}
              />
              <View style={styles.wheelDivider} />
              <Wheel
                items={monthItems}
                selectedIndex={monthIndex}
                onSelect={(i) => setTempMonth(i + 1)}
                width={undefined}
              />
              <View style={styles.wheelDivider} />
              <Wheel
                items={yearItems}
                selectedIndex={yearIndex}
                onSelect={(i) => setTempYear(years[i])}
                width={74}
              />
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const W = Dimensions.get("window").width;

const styles = StyleSheet.create({
  // Trigger
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  triggerPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "400",
  },

  // Modal backdrop
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  // Bottom sheet
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },

  // Drag handle
  sheetHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  sheetTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
  },
  previewBadge: {
    backgroundColor: "#FFF4EE",
    borderWidth: 1.5,
    borderColor: "#C45E3D",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  previewText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#C45E3D",
  },

  // Column labels
  columnLabels: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 4,
    alignItems: "center",
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9CA3AF",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Wheels
  wheelsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  wheelDivider: {
    width: 1,
    height: PICKER_HEIGHT * 0.6,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  wheelContainer: {
    position: "relative",
    overflow: "hidden",
    height: PICKER_HEIGHT,
  },
  selectionHighlight: {
    position: "absolute",
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: "#FFF4EE",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FDEAD7",
    zIndex: 0,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  wheelItemText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  wheelItemTextSelected: {
    fontSize: 18,
    fontWeight: "800",
    color: "#C45E3D",
  },
  wheelItemTextNear: {
    color: "#6B7280",
    fontWeight: "500",
    fontSize: 15,
  },
  wheelItemTextFar: {
    color: "#D1D5DB",
    fontSize: 13,
  },
  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    //background: "transparent",
    // React Native gradient via backgroundColor with opacity trick
    backgroundColor: "rgba(255,255,255,0.82)",
    pointerEvents: "none",
    zIndex: 2,
  },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: "rgba(255,255,255,0.82)",
    pointerEvents: "none",
    zIndex: 2,
  },

  // Buttons
  btnRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C45E3D",
    shadowColor: "#C45E3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});