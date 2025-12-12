/**
 * Date utility functions
 */

/**
 * Calculate days left until a deadline
 */
export const calculateDaysLeft = (deadline: string | Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(deadline);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
};

/**
 * Format deadline for display
 */
export const formatDeadline = (deadline: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(deadline);

    const defaultOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options || defaultOptions);
};

/**
 * Check if deadline has passed
 */
export const isDeadlinePassed = (deadline: string | Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(deadline);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate < today;
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 days")
 */
export const formatRelativeTime = (date: string | Date): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;

    return formatDeadline(date);
};
