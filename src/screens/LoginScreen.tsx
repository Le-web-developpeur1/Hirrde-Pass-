import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { s, vs, ms } from '../utils/scale';
import { colors } from '../utils/colors';
import { getScannerByPhone } from '../firebase/users';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Erreur', 'Le numéro doit commencer par + (ex: +224626058033)');
      return;
    }
  
    setLoading(true);
  
    try {
      // Vérifier si le scanner existe dans Firestore
      const scanner = await getScannerByPhone(phoneNumber);
      
      if (!scanner) {
        Alert.alert('Erreur', 'Ce numéro n\'est pas enregistré. Contacte un administrateur.');
        setLoading(false);
        return;
      }
      
      // Vérifier si le scanner est actif
      if (scanner.hasOwnProperty('isActive') && !scanner.isActive) {
        Alert.alert('Erreur', 'Ton compte a été désactivé.');
        setLoading(false);
        return;
      }
  
      console.log('Scanner trouvé:', scanner); // Pour debug
  
      // Passer à l'écran de vérification avec les infos du scanner
      navigation.navigate('VerifyCode', {
        phoneNumber,
        scanner, // Passer l'objet scanner complet
      });
    } catch (error: any) {
      console.error('Erreur complète:', error);
      Alert.alert('Erreur', 'Erreur lors de la vérification du numéro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Hirr<Text style={styles.titleGold}>dé</Text>
        </Text>
        <Text style={styles.subtitle}>Scanner de tickets</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+224626058033"
            placeholderTextColor={colors.muted}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>Format international requis</Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.buttonText}>Recevoir le code</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: s(30),
  },
  title: {
    fontSize: ms(48),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  titleGold: {
    color: colors.gold,
  },
  subtitle: {
    fontSize: ms(14),
    color: colors.muted,
    textAlign: 'center',
    marginBottom: vs(60),
  },
  form: {
    gap: vs(16),
  },
  label: {
    fontSize: ms(14),
    fontWeight: '500',
    color: colors.text,
    marginBottom: vs(8),
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: s(12),
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    fontSize: ms(16),
    color: colors.text,
  },
  hint: {
    fontSize: ms(12),
    color: colors.muted,
    marginTop: vs(-8),
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: vs(16),
    borderRadius: s(12),
    alignItems: 'center',
    marginTop: vs(16),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.bg,
    fontSize: ms(16),
    fontWeight: '600',
  },
});
