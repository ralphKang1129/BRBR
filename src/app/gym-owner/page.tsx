'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function GymOwnerDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isGymOwner } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // 인증 로딩이 완료될 때까지 대기
    if (isLoading) return;

    // 로딩이 완료되고, 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/gym-owner');
      return;
    }

    // 로딩이 완료되고, 체육관 대관자가 아닌 사용자는 홈으로 리디렉션
    if (!isGymOwner) {
      router.push('/');
      return;
    }

    // 모든 검증이 완료되면 페이지 로딩 상태 해제
    setPageLoading(false);
  }, [isLoading, isAuthenticated, isGymOwner, router]);

  if (pageLoading || isLoading) {
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
            체육관 대관자 대시보드
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            안녕하세요, {user?.name}님! 체육관 관리 및 예약 현황을 확인하세요.
          </p>
        </div>

        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {/* 체육관 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">내 체육관 관리</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  체육관 정보를 등록하고 관리할 수 있습니다. 코트, 가격, 운영 시간 등을 설정하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/gym-owner/gyms" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                체육관 관리하기
              </Link>
            </div>
          </div>

          {/* 예약 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">예약 현황</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  체육관의 예약 현황을 확인하고 관리할 수 있습니다. 일정을 확인하고 예약을 처리하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/gym-owner/bookings" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                예약 확인하기
              </Link>
            </div>
          </div>

          {/* 매출 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-6 flex-1">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">매출 관리</h3>
              </div>
              <div className="mt-4">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  체육관의 매출 현황을 확인할 수 있습니다. 월별, 주별 수익 추이를 분석하세요.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <Link href="/gym-owner/revenue" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                매출 확인하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 