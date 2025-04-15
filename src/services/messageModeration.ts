import {Filter} from 'bad-words';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

class MessageModerationService {
  private filter: Filter;

  constructor() {
    this.filter = new Filter();
    // Add custom words to the filter if needed
    this.filter.addWords(
        // Original words from your code
        'bvc', 'fugger', 'rand', 'randi', 'idiot', 'mf', 'customBadWord2',
      
        // English profanity
        'damn', 'jerk', 'asshole', 'bitch', 'shit', 'fuck', 'cunt', 'dick', 'bastard',
      
        // Indian languages (transliterated; use cautiously)
        'chutiya', 'chutia', 'bhenchod', 'madarchod', 'gandu','gand','bkld', 'harami', // Hindi
        'kutta', 'sala', 'sali', 'bevakoof', // Common slang
        'poda', 'patti', 'thevidiya', 'kameena', // Tamil
        'donga', 'bevarsi', 'gudda', // Telugu
        'chhele', 'boka', // Bengali slang
        'kameez', // Punjabi slang
      
        // Foreign languages
        'merde', 'connard', 'salope', // French
        'mierda', 'estúpido', 'cabrón', 'puta', // Spanish
        'scheisse', 'arschloch', 'idiotisch', // German
        'stronzo', 'cazzo', // Italian
        'baka', 'kuso', // Japanese
        'baboso', 'pendejo', // Latin American Spanish
        'kanker', 'kut', // Dutch
        'suka', 'blyat', // Russian
      
        // Additional variations for evasion (e.g., Indian slang)
        'chootiya', 'chootia', 'bhanchod', 'madrchod', 'gaandu', 'randii'
      );
  }

  private normalizeText(text: string): string {
    // Convert to lowercase and remove extra spaces
    let normalized = text.toLowerCase().trim();
    // Remove repeated characters (more than 2 consecutive same characters)
    normalized = normalized.replace(/([a-z])\1{2,}/g, '$1$1');
    // Remove common character substitutions
    const substitutions: { [key: string]: string } = {
      '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
      '7': 't', '@': 'a', '$': 's', '!': 'i'
    };
    for (const [substitute, original] of Object.entries(substitutions)) {
      normalized = normalized.replace(new RegExp(substitute, 'g'), original);
    }
    return normalized;
  }

  validateMessage(text: string): ValidationResult {
    // Check for empty or whitespace-only messages
    if (!text || !text.trim()) {
      return {
        isValid: false,
        message: 'Message cannot be empty'
      };
    }

    // Check message length
    if (text.length > 500) {
      return {
        isValid: false,
        message: 'Message is too long (maximum 500 characters)'
      };
    }

    // Normalize text to catch evasion attempts
    const normalizedText = this.normalizeText(text);

    // Check for profanity in both original and normalized text
    try {
      if (this.filter.isProfane(text) || this.filter.isProfane(normalizedText)) {
        return {
          isValid: false,
          message: 'Message contains inappropriate language'
        };
      }
    } catch (error) {
      console.error('Error checking profanity:', error);
    }

    // Check for spam patterns (repeated characters)
    if (/([a-zA-Z])\1{4,}/.test(text)) {
      return {
        isValid: false,
        message: 'Message contains spam patterns'
      };
    }

    return { isValid: true };
  }

  cleanMessage(text: string): string {
    try {
      return this.filter.clean(text);
    } catch (error) {
      console.error('Error cleaning message:', error);
      return text;
    }
  }
}

export const messageModeration = new MessageModerationService();