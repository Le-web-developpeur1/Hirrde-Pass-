import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { getTicketStats, validateTicket } from '../firebase/tickets';
import { RootStackParams } from '../navigation/types';
import { colors } from '../utils/colors';
import { ms, s, vs } from '../utils/scale';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function ScannerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanner, setScanner] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, scanned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const loadData = async () => {
    try {
      // Charger les infos du scanner
      const scannerData = await AsyncStorage.getItem('scanner');
      if (scannerData) {
        setScanner(JSON.parse(scannerData));
      }

      // Charger les stats
      await loadStats();
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const ticketStats = await getTicketStats();
      setStats(ticketStats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: any) => {
    if (scanned) return;
  
    setScanned(true);
    Vibration.vibrate(100);
  
    console.log('QR Code scanné:', data);
  
    try {
      let ticketId = data;
      
      try {
        const parsed = JSON.parse(data);
        if (parsed.ticketId) {
          ticketId = parsed.ticketId;
        }
      } catch (e) {
        // Si ce n'est pas du JSON, continuer avec data tel quel
        // Si c'est une URL, extraire l'ID
        if (data.includes('ticket/')) {
          ticketId = data.split('ticket/')[1];
        } else if (data.includes('tickets/')) {
          ticketId = data.split('tickets/')[1];
        }
      }
  
      console.log('ID du ticket extrait:', ticketId);
  
      // Valider le ticket
      const result = await validateTicket(ticketId, scanner?.id);
  
      // Recharger les stats
      await loadStats();
  
      Alert.alert(
        '✅ Ticket validé',
        `Numéro: ${result?.ticket?.numeroUnique || result?.ticket?.serialNumber || ticketId || 'N/A'}\nStatut: Validé avec succès`,
        [
          {
            text: 'Scanner un autre',
            onPress: () => setScanned(false),
          },
        ]
      );
    } catch (error: any) {
        // Gérer le cas du ticket déjà validé différemment
        if (error.message === 'TICKET_ALREADY_VALIDATED') {
          Alert.alert(
            '⚠️ Déjà scanné',
            'Ce billet a déjà été validé précédemment',
            [
              {
                text: 'OK',
                onPress: () => setScanned(false),
              },
            ]
          );
          return; 
        }
      
        
        let errorMessage = 'Une erreur est survenue';
        
        if (error.message === 'TICKET_NOT_FOUND') {
          errorMessage = '❌ Billet introuvable';
        } else if (error.message === 'INVALID_QR_CODE') {
          errorMessage = '❌ QR Code invalide';
        } else {
          errorMessage = error.message || 'Erreur inconnue';
        }
        
        Alert.alert('Erreur', errorMessage, [
          {
            text: 'Réessayer',
            onPress: () => setScanned(false),
          },
        ]);
      }
  };
  


  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('scanner');
            await AsyncStorage.removeItem('phoneNumber');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Chargement...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>
            Accès à la caméra requis pour scanner les tickets
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Autoriser la caméra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec stats */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Scanner un ticket</Text>
            {scanner && (
              <Text style={styles.scannerName}>{scanner.nom || scanner.name}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total tickets</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.gold }]}>
              {stats.scanned}
            </Text>
            <Text style={styles.statLabel}>Scannés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {stats.total - stats.scanned}
            </Text>
            <Text style={styles.statLabel}>Restants</Text>
          </View>
        </View>
      </View>

      {/* Caméra */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashOn}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        
        {/* Overlay en position absolue */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.instruction}>
            Placez le QR code dans le cadre
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => setFlashOn(!flashOn)}
        >
          <Text style={styles.flashText}>{flashOn ? '🔦' : '💡'}</Text>
        </TouchableOpacity>

        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanText}>Scanner un autre</Text>
          </TouchableOpacity>
        )}
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
    alignItems: 'center',
    paddingHorizontal: s(30),
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: s(20),
    paddingTop: vs(50),
    paddingBottom: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  title: {
    fontSize: ms(20),
    fontWeight: 'bold',
    color: colors.text,
  },
  scannerName: {
    fontSize: ms(12),
    color: colors.muted,
    marginTop: vs(4),
  },
  logoutText: {
    color: colors.danger,
    fontSize: ms(14),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: s(12),
    borderRadius: s(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: vs(4),
  },
  statLabel: {
    fontSize: ms(10),
    color: colors.muted,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: s(250),
    height: s(250),
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: s(30),
    height: s(30),
    borderColor: colors.gold,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instruction: {
    color: colors.text,
    fontSize: ms(16),
    marginTop: vs(30),
    textAlign: 'center',
  },
  footer: {
    padding: s(20),
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  flashButton: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  flashText: {
    fontSize: ms(28),
  },
  rescanButton: {
    backgroundColor: colors.gold,
    paddingVertical: vs(14),
    paddingHorizontal: s(40),
    borderRadius: s(12),
  },
  rescanText: {
    color: colors.bg,
    fontSize: ms(16),
    fontWeight: '600',
  },
  text: {
    color: colors.text,
    fontSize: ms(16),
    textAlign: 'center',
    marginBottom: vs(20),
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: vs(16),
    paddingHorizontal: s(40),
    borderRadius: s(12),
  },
  buttonText: {
    color: colors.bg,
    fontSize: ms(16),
    fontWeight: '600',
  },
});
