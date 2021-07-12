import React from 'react';

export interface ModalOptions {
    content: React.ReactNode;
    modalStyle?: any;
    centered?: boolean,
    onClose?: () => void;
}

export interface ModalService {
    showModal: (options: ModalOptions) => void;
    hideModal: (options: ModalOptions) => void;
}

const ModalContext = React.createContext<ModalService>(null as any);

export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;