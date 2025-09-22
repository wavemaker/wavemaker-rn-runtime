import * as React from 'react';
import Fallback from './components/error-fallback/error-fallback.component';
import appModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';

interface ErrorBoundaryState {
  hasError: boolean;
  info?: any;
  error?: any;
}

interface ErrorBoundaryProps {
  currentPage?: any;
  children: React.ReactNode;
  errorType?: 'render' | 'javascript';
  app?: any;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  componentDidCatch(error: any, info: any) {
    // Trigger user error callback if app instance is available
    let appInstance = this.props.app;
    
    // Fallback: try to get app instance from injector if prop is not available
    if (!appInstance) {
        appInstance = injector.get('APP_INSTANCE');
    }
    
    if (appInstance && appInstance.triggerOnError) {
      try {
        appInstance.triggerOnError(error, info, 'render');
      } catch (e) {
        console.error('Error calling triggerOnError:', e);
      }
    }
    
    if(error && appModalService.modalsOpened.length > 0){
      appModalService.modalsOpened.pop();
      (appModalService as any).showLastModal();
    }
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return <Fallback 
        error={this.state?.error} 
        info={this.state?.info} 
        resetErrorBoundary={this.resetErrorBoundary}
        errorType={this.props.errorType || 'render'}
      />;
    }

    return this.props.children;
  }
}
