'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function DebugPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [storage, setStorage] = useState<{
    localStorage: Record<string, any>;
    sessionStorage: Record<string, any>;
  }>({
    localStorage: {},
    sessionStorage: {}
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 로컬 스토리지와 세션 스토리지 데이터 가져오기
        const localUsers = localStorage.getItem('users');
        const localCurrentUser = localStorage.getItem('currentUser');
        const sessionCurrentUser = sessionStorage.getItem('currentUser');
        
        setStorage({
          localStorage: {
            users: localUsers ? JSON.parse(localUsers) : null,
            currentUser: localCurrentUser ? JSON.parse(localCurrentUser) : null,
          },
          sessionStorage: {
            currentUser: sessionCurrentUser ? JSON.parse(sessionCurrentUser) : null,
          }
        });
      } catch (error) {
        console.error('스토리지 데이터 읽기 오류:', error);
      }
    }
  }, []);

  const clearStorage = () => {
    if (window.confirm('모든 스토리지 데이터를 삭제하시겠습니까? 로그아웃됩니다.')) {
      localStorage.clear();
      sessionStorage.clear();
      logout();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">디버그 페이지</h1>
            <div className="flex space-x-2">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                홈으로 돌아가기
              </Link>
              <button
                onClick={clearStorage}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                스토리지 초기화
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">인증 상태</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">로그인 상태:</span>
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '로그인됨' : '로그인되지 않음'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">관리자 권한:</span>
                  <span className={isAdmin ? 'text-green-600' : 'text-gray-600'}>
                    {isAdmin ? '있음' : '없음'}
                  </span>
                </div>
                {user && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">사용자 ID:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">이름:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">이메일:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">사용자 타입:</span>
                      <span className="text-gray-900 dark:text-gray-100">{user.userType}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">로그인 테스트</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 mb-1">관리자로 로그인:</span>
                  <div className="flex space-x-2">
                    <Link
                      href="/auth/login?email=admin&password=admin"
                      className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm"
                    >
                      관리자 로그인
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 mb-1">테스트 계정:</span>
                  <div className="flex space-x-2">
                    <Link
                      href="/auth/login"
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
                    >
                      로그인 페이지
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-sm"
                    >
                      회원가입
                    </Link>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400 mb-1">로그아웃:</span>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm w-fit"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">스토리지 정보</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Local Storage:</h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-80">
                {JSON.stringify(storage.localStorage, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Session Storage:</h3>
              <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs overflow-auto max-h-80">
                {JSON.stringify(storage.sessionStorage, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 