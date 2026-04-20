import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import axios from 'axios';
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

interface FeedbackForm {
  message: string;
}

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FeedbackForm>({
    defaultValues: {
      message: ''
    }
  });

  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const onSubmit = async (data: FeedbackForm) => {
    try {
      const feedback = await axios.post('/feedback/', {
        star: rating,
        message: data.message
      }, { timeout: 10000 });

      if (feedback.status === 200) {
        setShowThankYouModal(true);
        setTimeout(() => {
          setShowThankYouModal(false);
          router.back();
        }, 2000);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
    },
    routeImage: {
      width: '100%',
      height: 290,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.text,
      marginVertical: 20,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginBottom: 24,
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
      gap: 8,
    },
    messageInput: {
      height: 150,
      textAlignVertical: 'top',
      paddingTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 10,
      backgroundColor: theme.colors.cardBackground,
      color: theme.colors.text,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    submitText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.cardBackground,
      padding: 24,
      borderRadius: 16,
      alignItems: 'center',
      elevation: 5,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.text,
    },
    modalText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/user')}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Image
        source={require('@/assets/image 1.png')}
        style={styles.routeImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>Rate your experience</Text>
      <Text style={styles.description}>
        To improve the quality of our service,{'\n'}
        please leave your review
      </Text>

      {/* Star Rating */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
          >
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={32}
              color={rating >= star ? theme.colors.primary : theme.colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Optional Message */}
      <FormInput
        name="message"
        control={control}
        errors={errors}
        label="Your Message (Optional)"
        placeholder="Tell us more about your experience..."
        multiline
        numberOfLines={4}
        style={styles.messageInput}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          rating === 0 && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit(onSubmit)}
        disabled={rating === 0}
      >
        <Text style={styles.submitText}>Submit Feedback</Text>
      </TouchableOpacity>

      {/* Thank You Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showThankYouModal}
        onRequestClose={() => setShowThankYouModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color={theme.colors.success} />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>
              Your feedback has been submitted successfully
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Feedback;