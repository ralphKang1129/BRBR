'use client';

import React, { Suspense } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserType, useAuth, SignupData } from '../../../contexts/AuthContext';

function GymInfoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // URL 파라미터에서 이전 단계 데이터 가져오기
  const userType = searchParams.get('userType') as UserType;
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const password = searchParams.get('password');
  const name = searchParams.get('name');
  
  // 이전 단계 데이터가 없으면 첫 단계로 리디렉션
  useEffect(() => {
    if (!userType || userType !== 'GYM_OWNER' || !phone || !email || !password || !name) {
      router.push('/auth/signup');
    }
  }, [userType, phone, email, password, name, router]);
  
  const [formData, setFormData] = useState({
    gymAddress: '',
    businessLicenseImage: null as File | null,
  });
  
  const [errors, setErrors] = useState({
    gymAddress: '',
    businessLicenseImage: '',
    form: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 시 해당 필드의 에러 지우기
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 파일 크기 제한 (예: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, businessLicenseImage: '파일 크기는 5MB 이하여야 합니다' }));
        return;
      }
      
      // 파일 형식 제한 (이미지만 허용)
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, businessLicenseImage: '이미지 파일만 업로드 가능합니다' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, businessLicenseImage: file }));
      setErrors(prev => ({ ...prev, businessLicenseImage: '' }));
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    // 체육관 주소 검증
    if (!formData.gymAddress) {
      newErrors.gymAddress = '체육관 주소를 입력해주세요';
      valid = false;
    }
    
    // 사업자등록증 검증
    if (!formData.businessLicenseImage) {
      newErrors.businessLicenseImage = '사업자등록증을 첨부해주세요';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  
  // 파일을 Base64 문자열로 변환하는 함수
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, form: '' }));
    
    try {
      // 사업자등록증 이미지를 Base64로 변환
      let businessLicenseBase64 = '';
      if (formData.businessLicenseImage) {
        businessLicenseBase64 = await convertFileToBase64(formData.businessLicenseImage);
      }
      
      // 회원가입 처리
      if (email && password && name && phone) {
        const signupData: SignupData = {
          email,
          password,
          name,
          phone,
          userType: 'GYM_OWNER',
          gymAddress: formData.gymAddress,
          businessLicenseImage: businessLicenseBase64
        };
        
        await signup(signupData);
        
        // 회원가입 완료 페이지로 이동
        const queryParams = new URLSearchParams({
          userType,
          email,
          name
        });
        
        router.push(`/auth/signup/complete?${queryParams.toString()}`);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors(prev => ({
        ...prev,
        form: error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!userType || userType !== 'GYM_OWNER' || !phone || !email || !password || !name) {
    return <div>리디렉션 중...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">체육관 정보 입력</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          단계 4/4: 체육관 대관자 검증을 위한 추가 정보를 입력해주세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md text-sm">
              {errors.form}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="gymAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                체육관 주소
              </label>
              <div className="mt-1">
                <textarea
                  id="gymAddress"
                  name="gymAddress"
                  rows={3}
                  required
                  value={formData.gymAddress}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.gymAddress ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="체육관 주소를 정확히 입력해주세요"
                />
                {errors.gymAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.gymAddress}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                사업자등록증 첨부
              </label>
              <div className="mt-1">
                <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="businessLicenseImage"
                        className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none"
                      >
                        <span>파일 업로드</span>
                        <input
                          id="businessLicenseImage"
                          ref={fileInputRef}
                          name="businessLicenseImage"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">또는 끌어서 놓기</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF 최대 5MB
                    </p>
                  </div>
                </div>
                {formData.businessLicenseImage && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    선택된 파일: {formData.businessLicenseImage.name}
                  </div>
                )}
                {errors.businessLicenseImage && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessLicenseImage}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  * 사업자등록증은 검증 후 승인이 완료되면 체육관을 등록할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Link
                href={`/auth/signup/user-info?userType=${userType}&phone=${phone}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                이전 단계로
              </Link>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '처리 중...' : '가입 완료'}
              </button>
            </div>
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
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mx-auto">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">가입 유형 선택</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mx-auto">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">휴대폰 인증</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mx-auto">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">기본 정보</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                    <span className="text-white text-sm font-medium">4</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">추가 정보</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between mt-2">
                <div className="h-0.5 bg-blue-600 absolute left-0 top-1/2 transform -translate-y-1/2 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GymInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GymInfoForm />
    </Suspense>
  );
} 