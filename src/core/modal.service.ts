import React from 'react';

export interface ModalOptions {
    name?: string;
    content: React.ReactNode;
    modalStyle?: any;
    contentStyle?: any;
    centered?: boolean,
    onClose?: () => void;
    onOpen?: () => void;
    isModal?: boolean;
    animation: string;
}

export interface ModalService {
    refresh: () => void;
    showModal: (options: ModalOptions) => void;
    hideModal: (options: ModalOptions) => void;
}

const ModalContext = React.createContext<ModalService>(null as any);

export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;
