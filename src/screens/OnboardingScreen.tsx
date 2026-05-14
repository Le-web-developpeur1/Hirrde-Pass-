import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParams } from '../navigation/types';
import { colors } from './../utils/colors';
import { ms, s, vs } from './../utils/scale';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Bienvenue sur Hirrdé',
    description: 'Scannez et validez les tickets en toute simplicité',
    icon: '🎫',
  },
  {
    id: '2',
    title: 'Scan rapide',
    description: 'Scannez les QR codes des tickets en quelques secondes',
    icon: '📱',
  },
  {
    id: '3',
    title: 'Suivi en temps réel',
    description: 'Suivez les entrées et validations en direct',
    icon: '⚡',
  },
];

export default function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  skipButton: {
    position: 'absolute',
    top: vs(50),
    right: s(20),
    zIndex: 10,
    padding: s(10),
  },
  skipText: {
    color: colors.muted,
    fontSize: ms(14),
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(40),
  },
  icon: {
    fontSize: ms(100),
    marginBottom: vs(40),
  },
  title: {
    fontSize: ms(28),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: vs(16),
  },
  description: {
    fontSize: ms(16),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: ms(24),
  },
  footer: {
    paddingHorizontal: s(40),
    paddingBottom: vs(50),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(30),
  },
  dot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: colors.border,
    marginHorizontal: s(4),
  },
  activeDot: {
    width: s(24),
    backgroundColor: colors.gold,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: vs(16),
    borderRadius: s(12),
    alignItems: 'center',
  },
  buttonText: {
    color: colors.bg,
    fontSize: ms(16),
    fontWeight: '600',
  },
});
