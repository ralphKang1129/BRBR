'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserType, useAuth } from '../../../contexts/AuthContext';

export default function UserInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getUsers } = useAuth();
  
  const userType = searchParams.get('userType') as UserType;
  const phone = searchParams.get('phone');
  
  // 이전 단계 데이터가 없으면 첫 단계로 리디렉션
  useEffect(() => {
    if (!userType || !phone || (userType !== 'GYM_OWNER' && userType !== 'GYM_USER')) {
      router.push('/auth/signup');
    }
  }, [userType, phone, router]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    form: ''
  });
  
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 이메일 중복 확인
  const checkEmailDuplicate = () => {
    // admin은 중복 체크에서 제외
    if (formData.email === 'admin') {
      return false;
    }
    
    // 이메일 형식 확인
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      return false; // 이메일이 유효하지 않으면 중복 체크 건너뛰기
    }

    const users = getUsers();
    return users.some(user => user.email === formData.email);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 시 해당 필드의 에러 지우기
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleEmailBlur = () => {
    // admin은 유효성 검사에서 제외
    if (formData.email === 'admin') {
      return;
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      return; // 이메일이 유효하지 않으면 중복 체크 건너뛰기
    }

    setIsCheckingEmail(true);
    
    // 약간의 지연 효과를 주어 사용자 경험 향상
    setTimeout(() => {
      const isDuplicate = checkEmailDuplicate();
      if (isDuplicate) {
        setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다' }));
      }
      setIsCheckingEmail(false);
    }, 500);
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    // 이메일 유효성 검사 (admin 계정은 예외 처리)
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
      valid = false;
    } else if (formData.email !== 'admin' && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
      valid = false;
    } else if (checkEmailDuplicate()) {
      newErrors.email = '이미 사용 중인 이메일입니다';
      valid = false;
    }

    // 비밀번호 유효성 검사
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
      valid = false;
    }

    // 비밀번호 확인 일치 검사
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      valid = false;
    }

    // 이름 유효성 검사
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  
  const handleNextStep = () => {
    if (!validate()) return;
    
    // 사용자 타입이 체육관 대관자인 경우에만 추가 정보 입력 단계로 이동
    if (userType === 'GYM_OWNER') {
      const queryParams = new URLSearchParams({
        userType,
        phone: phone || '',
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      
      router.push(`/auth/signup/gym-info?${queryParams.toString()}`);
    } else {
      // 체육관 사용자의 경우 회원가입 처리 진행
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors(prev => ({ ...prev, form: '' }));
    
    try {
      // 회원가입 완료 페이지로 이동
      // 실제로는 회원가입 API 호출 후 이동
      const queryParams = new URLSearchParams({
        userType,
        phone: phone || '',
        email: formData.email,
        name: formData.name
      });
      
      router.push(`/auth/signup/complete?${queryParams.toString()}`);
    } catch (error: any) {
      console.error('Error:', error);
      setErrors(prev => ({
        ...prev,
        form: error?.message || '오류가 발생했습니다. 다시 시도해주세요.',
      }));
      setIsLoading(false);
    }
  };
  
  if (!userType || !phone) {
    return <div>리디렉션 중...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">기본 정보 입력</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          단계 3/4: 회원 가입에 필요한 기본 정보를 입력해주세요
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이메일
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="example@email.com"
                />
                {isCheckingEmail && (
                  <div className="absolute right-3 top-2">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
                {formData.email === 'admin' && !errors.email && (
                  <p className="mt-1 text-sm text-blue-600">관리자 계정으로 등록됩니다</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="8자 이상 입력하세요"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호 확인
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="비밀번호를 다시 입력해주세요"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이름
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="이름을 입력해주세요"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-8">
              <Link
                href={`/auth/signup/phone-verification?userType=${userType}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                이전 단계로
              </Link>
              <button
                onClick={handleNextStep}
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '처리 중...' : userType === 'GYM_OWNER' ? '다음 단계' : '가입 완료'}
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
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                    <span className="text-white text-sm font-medium">3</span>
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
                <div className="h-0.5 bg-blue-600 absolute left-0 top-1/2 transform -translate-y-1/2 w-[62.5%]"></div>
                <div className="h-0.5 bg-gray-300 dark:bg-gray-600 absolute left-[62.5%] top-1/2 transform -translate-y-1/2 w-[37.5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 