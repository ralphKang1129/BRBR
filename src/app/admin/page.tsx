'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();

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
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            관리자 대시보드
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            안녕하세요, {user?.name}님! 서비스 관리 기능에 접근하세요.
          </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {/* 사용자 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">사용자 관리</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  체육관 대관자와 사용자 계정을 관리하고 권한을 설정하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/admin/users" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                사용자 관리하기
              </Link>
            </div>
          </div>

          {/* 체육관 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">체육관 관리</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  모든 체육관 정보를 확인하고 승인 상태를 관리하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/admin/gyms" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                체육관 관리하기
              </Link>
            </div>
          </div>

          {/* 시스템 설정 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.214 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">시스템 설정</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  서비스 설정, 결제 설정, 알림 설정 등 시스템 설정을 관리하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/admin/settings" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                설정 관리하기
              </Link>
            </div>
          </div>
        </div>

        {/* 통계 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">서비스 통계</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 통계 카드 1 */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 사용자 수</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">1,254</dd>
                  <dd className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      8.2% 증가
                    </span>
                  </dd>
                </dl>
              </div>
            </div>

            {/* 통계 카드 2 */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">등록된 체육관</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">78</dd>
                  <dd className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      12.5% 증가
                    </span>
                  </dd>
                </dl>
              </div>
            </div>

            {/* 통계 카드 3 */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 예약 건수</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">3,127</dd>
                  <dd className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      18.9% 증가
                    </span>
                  </dd>
                </dl>
              </div>
            </div>

            {/* 통계 카드 4 */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">총 매출</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">₩15.4M</dd>
                  <dd className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      23.7% 증가
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 