import { StyleSheet, Platform } from 'react-native';

export const settingsStyles = StyleSheet.create({
  // Settings Screen Styles
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    gap: 24, // Increased gap between sections
  },

  // Common Section Styles
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8, // Added vertical margin
  },
  sectionHeader: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sectionContent: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // URL Settings Styles
  urlContainer: {
    gap: 12,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  urlInput: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Theme Settings Styles
  themeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  themeButton: {
    width: 150,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Token Settings Styles
  tokenContainer: {
    gap: 16,
  },
  tokenBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  tokenText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },

  // Language Settings Styles
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    marginTop: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  languageButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#0055CC',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#fff',
  },

  // Common Button Styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  saveButton: {
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Picker Styles
  pickerContainer: {
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
    }),
  },
  picker: {
    ...Platform.select({
      android: {
        backgroundColor: 'transparent',
      },
      ios: {
        backgroundColor: 'transparent',
      },
    }),
  },
  pickerItemIOS: {
    fontSize: 16,
    height: 120,
  },

  // WebView Styles
  webview: {
    flex: 1,
    height: 0,
  },
  hiddenInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },
});
