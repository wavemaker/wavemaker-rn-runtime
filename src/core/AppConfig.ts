import React from 'react';

export default interface AppConfig {
    url: string,
    loadApp: boolean,
    refresh: () => void,
    currentPage?: any,
    pages?: any[],
    app: any
}