import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lỗi ứng dụng:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sgk">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Đã xảy ra lỗi hệ thống!</h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Xin lỗi vì sự bất tiện này. Dữ liệu đang được đồng bộ hoặc trình duyệt của bạn chặn truy cập.
              Vui lòng tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-md transition-all active:scale-95"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}