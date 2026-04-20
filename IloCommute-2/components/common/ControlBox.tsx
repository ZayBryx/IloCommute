import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {useTheme} from '@/context/ThemeContext'
import { darkTheme, lightTheme } from '@/constants/theme';
import { ControlBoxProps } from '@/types';
  
const ControlBox = ({title, icon, isActive, onPress, setShowMapControl}: ControlBoxProps) => {
    const handlePress = () => {
      onPress();
      setShowMapControl(false);
    };

    const {isDarkMode} = useTheme();
    const theme = isDarkMode ? darkTheme : lightTheme;
    
  
    const styles = StyleSheet.create({
      controlBox: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.cardBackground,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginBottom: 12,
      },
      activeBox: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
      },
      controlText: {
        fontSize: 16,
        color: theme.colors.primary,
      },
      activeText: {
        color: theme.colors.buttonText,
      }
    })
  
    return (
      <TouchableOpacity 
        style={[styles.controlBox, isActive && styles.activeBox]} 
        onPress={handlePress}
      >
        {icon}
        <Text style={[styles.controlText, isActive && styles.activeText]}>{title}</Text>
      </TouchableOpacity>
    );
  }
  
export default ControlBox
  