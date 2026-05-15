import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParams } from '../navigation/types';
import { colors } from '../utils/colors';
import { ms, s, vs } from '../utils/scale';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function VerifyCodeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { phoneNumber, scanner } = route.params as { 
    phoneNumber: string;
    scanner: any;
  };
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = useCallback((text: string, index: number) => {
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = text;
      return newCode;
    });

    // Auto-focus sur le champ suivant
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback((e: any, index: number) => {
    // Retour arrière
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);

  const handleVerify = useCallback(async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code complet');
      return;
    }
  
    setLoading(true);
  
    try {
      // Vérifier que scanner existe
      if (!scanner) {
        Alert.alert('Erreur', 'Données du scanner manquantes');
        setLoading(false);
        return;
      }

      // Vérifier le PIN code
      const scannerPinCode = scanner.pinCode || '123456'; // Par défaut 123456 si pas de PIN
      
      if (fullCode === scannerPinCode) {
        // Nettoyer l'objet scanner pour le stockage
        const cleanScanner = {
          id: scanner.id,
          nom: scanner.nom,
          email: scanner.email,
          phoneNumber: scanner.phoneNumber,
          role: scanner.role,
          isActive: scanner.isActive,
          eventAssigned: scanner.eventAssigned,
        };
  
        console.log('Sauvegarde du scanner nettoyé:', cleanScanner);
        
        // Sauvegarder les infos du scanner en local
        await AsyncStorage.setItem('scanner', JSON.stringify(cleanScanner));
        await AsyncStorage.setItem('phoneNumber', phoneNumber);
        
        navigation.replace('Scanner');
      } else {
        Alert.alert('Erreur', 'Code PIN incorrect');
        // Réinitialiser les champs
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      Alert.alert('Erreur', 'Erreur lors de la vérification: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [code, scanner, phoneNumber, navigation]);

  const handleResend = useCallback(() => {
    Alert.alert(
      'Code PIN oublié ?', 
      'Contactez votre administrateur ou votre organisateur pour réunitialiser votre Code PIN',
      [{ text: 'OK' }]
    );
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const buttonStyle = useMemo(() => [
    styles.button, 
    loading && styles.buttonDisabled
  ], [loading]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Code PIN</Text>
        <Text style={styles.subtitle}>
          Entre ton code PIN à 6 chiffres
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={buttonStyle}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Vérifier</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={styles.resendText}>Code PIN oublié ?</Text>
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
  backButton: {
    paddingHorizontal: s(20),
    paddingTop: vs(50),
    paddingBottom: vs(20),
  },
  backText: {
    color: colors.muted,
    fontSize: ms(16),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: s(30),
    paddingBottom: vs(100),
  },
  title: {
    fontSize: ms(28),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: vs(12),
  },
  subtitle: {
    fontSize: ms(14),
    color: colors.muted,
    textAlign: 'center',
    marginBottom: vs(12),
  },
  devHint: {
    fontSize: ms(12),
    color: colors.gold,
    textAlign: 'center',
    marginBottom: vs(28),
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(30),
  },
  codeInput: {
    width: s(50),
    height: vs(60),
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: s(12),
    fontSize: ms(24),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: vs(16),
    borderRadius: s(12),
    alignItems: 'center',
    marginBottom: vs(20),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.bg,
    fontSize: ms(16),
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    color: colors.gold,
    fontSize: ms(14),
  },
});
