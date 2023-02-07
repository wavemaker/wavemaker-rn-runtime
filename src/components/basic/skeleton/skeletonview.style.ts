import { AllStyle } from "@wavemaker/app-rn-runtime/styles/theme";

export type SkeletonviewStyles = {
    skeletonView: AllStyle;
    animatedView: AllStyle;
    gradient: AllStyle;
    gradientColors: string[];
};

export const SkeletonStyles: SkeletonviewStyles = {
    skeletonView: {
        backgroundColor: '#EFEFEF',
        minHeight: 20,
        minWidth: 80,
        overflow: 'hidden',
        borderRadius: 4
    },
    animatedView: {
        width: 60,
        backgroundColor: '#EFEFEF',
        height: '100%',
        margin: 0, padding: 0,
        zIndex: 999,
    },
    gradient: {
        width: '100%',
        padding: 0,
        margin: 0,
        height: '100%',
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
        shadowOpacity: 0.4,
        opacity: 0.6,
    },
    gradientColors: ['#AEAEAE00', 'rgba(255, 255, 255, 1)', '#AEAEAE00']
}