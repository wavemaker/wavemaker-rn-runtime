import * as React from 'react';
import Fallback from './components/error-fallback/error-fallback.component';
import appModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';

interface ErrorBoundaryState {
  hasError: boolean;
  info?: any;
  error?: any;
}

interface ErrorBoundaryProps {
  currentPage?: any;
  children: React.ReactNode;
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
    if(error && appModalService.modalsOpened.length > 0){
      appModalService.modalsOpened.pop();
      (appModalService as any).showLastModal();
    }
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return <Fallback error={this.state?.error} info={this.state?.info} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}
