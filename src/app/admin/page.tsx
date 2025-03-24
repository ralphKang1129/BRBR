'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import DebugStorage from '../components/DebugStorage';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/admin');
      return;
    }

    // 관리자가 아닌 사용자는 홈으로 리디렉션
    if (!isAdmin) {
      router.push('/');
    }

    setIsLoading(false);
  }, [isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 통계 데이터 (실제로는 API에서 가져옴)
  const stats = [
    { name: '사용자 수', value: '32' },
    { name: '등록된 체육관', value: '12' },
    { name: '총 예약 건수', value: '286' },
    { name: '총 매출', value: '₩3,720,000' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">관리자 대시보드</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            서비스 전반적인 통계와 관리 기능에 접근할 수 있습니다.
          </p>
        </div>

        {/* 디버그 컴포넌트 */}
        <DebugStorage />

        {/* 통계 카드 */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</dd>
              </div>
            </div>
          ))}
        </div>

        {/* 기능 카드 */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 사용자 관리 카드 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">사용자 관리</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    사용자 계정 관리 및 권한 설정
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/users"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  사용자 목록 보기
                </Link>
              </div>
            </div>
          </div>

          {/* 체육관 관리 카드 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">체육관 관리</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    체육관 정보 관리 및 승인 처리
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/gyms"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  체육관 목록 보기
                </Link>
              </div>
            </div>
          </div>

          {/* 시스템 설정 카드 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">시스템 설정</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    서비스 설정 및 환경 구성
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/settings"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  설정 관리
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 