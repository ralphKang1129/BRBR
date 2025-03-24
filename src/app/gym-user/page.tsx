'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

export default function GymUserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isGymOwner } = useAuth();
  
  const isGymUser = isAuthenticated && !isGymOwner && !user?.isAdmin;

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/gym-user');
      return;
    }

    // 체육관 사용자가 아닌 사용자는 홈으로 리디렉션
    if (isGymOwner || user?.isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isGymOwner, user, router]);

  if (!isAuthenticated || !isGymUser) {
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
            배드민턴 코트 예약
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            안녕하세요, {user?.name}님! 배드민턴 코트를 쉽고 빠르게 예약하세요.
          </p>
        </div>

        {/* 주요 기능 섹션 */}
        <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
          {/* 코트 찾기 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="flex-shrink-0 h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="배드민턴 코트"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">코트 찾기</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                위치, 가격, 시설 등 다양한 조건으로 원하는 배드민턴 코트를 찾아보세요.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/courts" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                코트 찾기
              </Link>
            </div>
          </div>

          {/* 예약 확인 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="flex-shrink-0 h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="예약 확인"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">내 예약 확인</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                예약한 코트 정보와 일정을 확인하고 필요에 따라 예약을 관리하세요.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/my-bookings" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                예약 확인하기
              </Link>
            </div>
          </div>

          {/* 프로필 관리 카드 */}
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="flex-shrink-0 h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1562088287-bde35a1ea917?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="프로필 관리"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">프로필 관리</h3>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                개인 정보와 결제 수단을 관리하고 예약 이력을 확인하세요.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Link href="/profile" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md">
                프로필 관리하기
              </Link>
            </div>
          </div>
        </div>

        {/* 추천 코트 섹션 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">추천 배드민턴 코트</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 예시 추천 코트들 - 실제로는 API에서 가져온 데이터로 렌더링 */}
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 relative">
                  <Image 
                    src={`https://source.unsplash.com/random/800x600?badminton&sig=${idx}`}
                    alt={`추천 코트 ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">스포츠 센터 {idx + 1}호점</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">서울시 강남구</p>
                  <div className="mt-2 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">4.8/5 (24 리뷰)</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">￦15,000/시간</span>
                    <Link href={`/courts/${idx + 1}`} className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 