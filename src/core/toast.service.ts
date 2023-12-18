import React from 'react';

export interface ToastOptions {
    elevationIndex: number;
    content?: React.ReactNode;
    onClick?: () => void;
    onClose?: () => void;
    text: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'loading';
    placement: string;
    duration?: number;
    name: string;
    styles: any;
    classname: string;
    hideOnClick?: boolean;
}

export interface ToastService {
    showToast: (options: ToastOptions) => void;
    hideToast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastService>(null as any);

export const ToastProvider = ToastContext.Provider;
export const ToastConsumer = ToastContext.Consumer;
