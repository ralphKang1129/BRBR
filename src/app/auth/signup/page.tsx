'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserType } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const [selectedUserType, setSelectedUserType] = useState<UserType>('GYM_USER');
  
  // 사용자 타입 설명 텍스트
  const userTypeDescriptions = {
    GYM_OWNER: '체육관을 가지고 있어서 등록하고 싶은 분',
    GYM_USER: '체육관을 예약하고 사용하고 싶은 분',
  };

  // 사용자 타입 변경 핸들러
  const handleUserTypeChange = (userType: UserType) => {
    setSelectedUserType(userType);
  };

  // 다음 단계로 진행
  const handleNextStep = () => {
    // 선택한 사용자 타입을 쿼리 파라미터로 전달
    router.push(`/auth/signup/phone-verification?userType=${selectedUserType}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">회원가입</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          단계 1/4: 가입 유형 선택
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              가입 유형을 선택해주세요
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 
                  ${selectedUserType === 'GYM_USER' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'}`}
                onClick={() => handleUserTypeChange('GYM_USER')}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center 
                    ${selectedUserType === 'GYM_USER' 
                      ? 'border-blue-500' 
                      : 'border-gray-400 dark:border-gray-500'}`}
                  >
                    {selectedUserType === 'GYM_USER' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">체육관 사용자</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {userTypeDescriptions.GYM_USER}
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 
                  ${selectedUserType === 'GYM_OWNER' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'}`}
                onClick={() => handleUserTypeChange('GYM_OWNER')}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                    ${selectedUserType === 'GYM_OWNER' 
                      ? 'border-blue-500' 
                      : 'border-gray-400 dark:border-gray-500'}`}
                  >
                    {selectedUserType === 'GYM_OWNER' && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">체육관 대관자</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {userTypeDescriptions.GYM_OWNER}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              로그인 페이지로 돌아가기
            </Link>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              다음 단계
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  회원가입 진행 순서
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                    <span className="text-white text-sm font-medium">1</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">가입 유형 선택</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mx-auto">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">2</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">휴대폰 인증</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mx-auto">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">3</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">기본 정보</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mx-auto">
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">4</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">추가 정보</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between mt-2">
                <div className="h-0.5 bg-blue-600 absolute left-0 top-1/2 transform -translate-y-1/2 w-[12.5%]"></div>
                <div className="h-0.5 bg-gray-300 dark:bg-gray-600 absolute left-[12.5%] top-1/2 transform -translate-y-1/2 w-[87.5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 