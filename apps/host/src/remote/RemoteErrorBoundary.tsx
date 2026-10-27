import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  name: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** 리모트 하나의 로딩·렌더 실패가 호스트 전체로 번지지 않게 막는다. */
export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[remote:${this.props.name}]`, error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ padding: 16, border: '1px solid #fca5a5', borderRadius: 8, background: '#fef2f2' }}>
        <strong>{this.props.name}을(를) 불러오지 못했습니다.</strong>
        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{this.state.error.message}</p>
      </div>
    );
  }
}
