import { formatDate } from 'date-fns/format';
import { customAlphabet } from 'nanoid';

// Constants for better maintainability and configuration
const ID_CONFIG = {
    SEGMENT_LENGTH: 5,
    SAFE_ALPHABET: '23456789ABCDEFHJKLMNPQRSTUVWXYZ',
    DELIMITER: '-',
    TIME_SEPARATOR: ':',
} as const;

/**
 * Generates a cryptographically secure random string
 * @param length Number of characters to generate
 * @returns Random string of specified length
 * @throws Error if length is invalid
 */
function generateSecureRandomString(length: number): string {
    if (length <= 0) throw new Error('Length must be positive');
    if (!Number.isInteger(length)) throw new Error('Length must be an integer');

    const nanoid = customAlphabet(ID_CONFIG.SAFE_ALPHABET, length);
    return nanoid();
}

/**
 * Gets current time in MMSS format with padding
 * @returns Formatted time string
 */
function getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(':', '');
}

/**
 * Generates a time-based unique identifier with improved uniqueness and readability
 * Format: DDD:MMSS-XXXX-YYYY
 * where:
 * - DDD is the 3-letter uppercase day of week
 * - MMSS is the current time (minutes and seconds)
 * - XXXX and YYYY are random alphanumeric strings using unambiguous characters
 * 
 * Features:
 * - Cryptographically secure random generation
 * - Unambiguous character set (no 0/O, 1/I confusion)
 * - Consistent formatting
 * - Error handling
 * - Time zone aware
 * 
 * Example output: "MON:2359-H3KL-9DXT"
 * 
 * @returns {string} A unique time-based identifier
 * @throws Error if generation fails
 */
export function genTimeBasedId(): string {
    try {
        const segments = {
            day: formatDate(new Date(), 'eee').toUpperCase(),
            time: getFormattedTime(),
            left: generateSecureRandomString(ID_CONFIG.SEGMENT_LENGTH),
            right: generateSecureRandomString(ID_CONFIG.SEGMENT_LENGTH)
        };

        // Validate all segments are present and non-empty
        Object.entries(segments).forEach(([key, value]) => {
            if (!value) throw new Error(`Failed to generate ${key} segment`);
        });

        return `${segments.day}${ID_CONFIG.TIME_SEPARATOR}${segments.time}${ID_CONFIG.DELIMITER}${segments.left}${ID_CONFIG.DELIMITER}${segments.right}`;
    } catch (error) {
        const err = error as { message: string }
        // Log error or handle it according to your needs
        throw new Error(`Failed to generate time-based ID: ${err.message}`);
    }
}

/**
 * Validates a time-based ID format
 * @param id The ID to validate
 * @returns boolean indicating if the ID is valid
 */
export function isValidTimeBasedId(id: string): boolean {
    const pattern = new RegExp(
        `^[A-Z]{3}${ID_CONFIG.TIME_SEPARATOR}\\d{4}${ID_CONFIG.DELIMITER}[${ID_CONFIG.SAFE_ALPHABET}]{${ID_CONFIG.SEGMENT_LENGTH}}${ID_CONFIG.DELIMITER}[${ID_CONFIG.SAFE_ALPHABET}]{${ID_CONFIG.SEGMENT_LENGTH}}$`
    );
    return pattern.test(id);
}