import React from 'react';

export interface ToastOptions {
    content: React.ReactNode;
    onClick?: () => void;
    onClose?: () => void;
    text: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'loading';
    placement: string;
    duration: Number;
    name: string;
    styles: any;
}

export interface ToastService {
    showToast: (options: ToastOptions) => void;
    hideToast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastService>(null as any);

export const ToastProvider = ToastContext.Provider;
export const ToastConsumer = ToastContext.Consumer;