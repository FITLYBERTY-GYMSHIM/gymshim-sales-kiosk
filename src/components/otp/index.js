import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import styles from './style-sheet';

// Illustration assets used on each screen
import otpNumberVector from '../../assets/otp-number-vector-img.svg';
import otpCodeVector from '../../assets/otp-code-vector-img.svg';

// ---- CONFIG -----------------------------------------------------
const PHONE_LENGTH = 10;
const OTP_LENGTH = 6;
const COUNTRY_CODE = '+91';

// ---- PLACEHOLDER API CALLS ---------------------------------------
// Backend isn't ready yet. These functions are stubbed so the
// senior dev (or whoever owns the API layer) can drop the real
// fetch/axios calls in here later without touching the UI code.

const sendOtpApi = async (phoneNumber) => {
  // TODO: replace with real call
  // return api.post('/send-otp', { phone: COUNTRY_CODE + phoneNumber });
  console.log('[stub] POST /send-otp ->', COUNTRY_CODE + phoneNumber);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
};

const verifyOtpApi = async (phoneNumber, otp) => {
  // TODO: replace with real call
  // return api.post('/verify-otp', { phone: COUNTRY_CODE + phoneNumber, otp });
  console.log('[stub] POST /verify-otp ->', COUNTRY_CODE + phoneNumber, otp);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, token: 'dummy.jwt.token' }), 800)
  );
};

// -------------------------------------------------------------------

const OtpModal = ({ visible, onClose, onVerified }) => {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef([]);

  const RESEND_TIMER = 30;
  const timerRef = useRef(null);

  useEffect(() => {
    if (step === 'otp') {
      // Reset timer when OTP screen opens
      setTimer(RESEND_TIMER);
      setCanResend(false);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const isPhoneValid = phoneNumber.length === PHONE_LENGTH;
  const isOtpComplete = otpDigits.every((d) => d !== '');

  const resetState = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    setLoading(false);
    setTimer(RESEND_TIMER);
    setCanResend(false);
  };

  const handleClose = () => {
    resetState();
    onClose && onClose();
  };

  // ---- Screen 1: Send OTP ----
  const handleSendCode = async () => {
    if (!isPhoneValid) return;
    setError('');
    setLoading(true);
    try {
      const res = await sendOtpApi(phoneNumber);
      if (res.success) {
        setStep('otp');
      } else {
        setError('Failed to send code. Please try again.');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Screen 2: OTP digit handling ----
  const handleOtpChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '');
    const updated = [...otpDigits];
    updated[index] = digit.slice(-1);
    setOtpDigits(updated);

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (!isOtpComplete) return;
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtpApi(phoneNumber, otpDigits.join(''));
      if (res.success) {
        // TODO: store JWT (AsyncStorage / SecureStore / context)
        onVerified && onVerified(res.token);
        handleClose();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (e) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setTimer(30);
    setCanResend(false);

    clearInterval(timerRef.current);         // stop old countdown if any
    timerRef.current = setInterval(() => {   // start new countdown
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    await sendOtpApi(phoneNumber);           // API call runs in parallel
  };

  const maskedPhone = phoneNumber
    ? `${COUNTRY_CODE} ${phoneNumber.slice(0, 5)}xxxxx`
    : '';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            {step === 'otp' ? (
              <TouchableOpacity onPress={() => setStep('phone')} style={styles.iconButton}>
                <Text style={styles.iconText}>{'←'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.iconButton} />
            )}
            <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
              <Text style={styles.iconText}>{'✕'}</Text>
            </TouchableOpacity>
          </View>

          {step === 'phone' ? (
            <>
              <Image source={otpNumberVector} style={styles.illustration} resizeMode="contain" />
              <Text style={styles.title}>Enter Phone Number</Text>
              <Text style={styles.subtitle}>
                Enter your mobile number to verify and continue.
              </Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.flagIcon}>🇮🇳</Text>
                  <Text style={styles.countryCodeText}>{COUNTRY_CODE}</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="00000 00000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={PHONE_LENGTH}
                  value={phoneNumber}
                  onChangeText={(t) => setPhoneNumber(t.replace(/[^0-9]/g, ''))}
                />
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.primaryButton, !isPhoneValid && styles.primaryButtonDisabled]}
                disabled={!isPhoneValid || loading}
                onPress={handleSendCode}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Send Code</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>
                By continuing, you agree to our Terms and Privacy.
              </Text>
            </>
          ) : (
            <>
              <Image source={otpCodeVector} style={styles.illustration} resizeMode="contain" />
              <Text style={styles.title}>Enter OTP Code</Text>
              <Text style={styles.subtitle}>
                Sent to <Text style={styles.phoneNumber}>{maskedPhone}</Text>{' '}
                <Text style={styles.linkText} onPress={() => setStep('phone')}>
                  Edit
                </Text>
              </Text>

              <View style={styles.otpRow}>
                {otpDigits.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpInputRefs.current[index] = ref)}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  />
                ))}
              </View>

              <View style={styles.resendRow}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.linkText}>Resend Code</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>Resend code in 00:{timer < 10 ? `0${timer}` : timer}</Text>
                )}
              </View>

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.primaryButton, !isOtpComplete && styles.primaryButtonDisabled]}
                disabled={!isOtpComplete || loading}
                onPress={handleVerifyCode}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify Code</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>
                By clicking verify, you agree to our Terms and Privacy Policy.
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;