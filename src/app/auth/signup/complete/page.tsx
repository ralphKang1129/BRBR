'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserType } from '../../../contexts/AuthContext';

export default function SignupCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const userType = searchParams.get('userType') as UserType;
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  
  // 파라미터가 없으면 첫 페이지로 리디렉션
  useEffect(() => {
    if (!userType || !email || !name) {
      router.push('/auth/signup');
    }
  }, [userType, email, name, router]);
  
  if (!userType || !email || !name) {
    return <div>리디렉션 중...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
          <svg className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">회원가입 완료</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {name}님, 가입을 축하합니다!
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              회원가입이 성공적으로 완료되었습니다.
            </p>
            
            {userType === 'GYM_OWNER' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  체육관 대관자 계정은 관리자의 승인 후 체육관 등록이 가능합니다.
                  승인이 완료되면 등록하신 이메일({email})로 안내 메일이 발송됩니다.
                </p>
              </div>
            )}
            
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              이제 로그인하여 서비스를 이용하실 수 있습니다.
            </p>
          </div>
          
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              로그인 페이지로 이동
            </Link>
          </div>
          
          <div className="mt-4">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 