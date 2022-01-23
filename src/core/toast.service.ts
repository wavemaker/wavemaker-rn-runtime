import React from 'react';

export interface ToastOptions {
    elevationIndex: any;
    content?: React.ReactNode;
    onClick?: () => void;
    onClose?: () => void;
    text: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'loading';
    placement: string;
    duration?: number;
    name: string;
    styles: any;
    hideOnClick?: boolean;
}

export interface ToastService {
    showToast: (options: ToastOptions) => void;
    hideToast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastService>(null as any);

export const ToastProvider = ToastContext.Provider;
export const ToastConsumer = ToastContext.Consumer;
