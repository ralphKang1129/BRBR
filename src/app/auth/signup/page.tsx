'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserType } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup, getUsers } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    userType: 'GYM_USER' as UserType, // 기본값은 체육관사용자
    // 체육관 대관자 관련 필드 추가
    gymAddress: '',
    businessLicenseImage: null as File | null,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    userType: '',
    gymAddress: '',
    businessLicenseImage: '',
    form: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>('GYM_USER');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 사용자 타입 설명 텍스트
  const userTypeDescriptions = {
    GYM_OWNER: '체육관을 가지고 있어서 등록하고 싶은 분',
    GYM_USER: '체육관을 예약하고 사용하고 싶은 분',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // 사용자 타입 변경 핸들러
  const handleUserTypeChange = (userType: UserType) => {
    setSelectedUserType(userType);
    setFormData(prev => ({ ...prev, userType }));
    if (errors.userType) {
      setErrors(prev => ({ ...prev, userType: '' }));
    }
  };

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

    // 전화번호 유효성 검사 (선택적)
    if (formData.phone && !/^\d{11}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다';
      valid = false;
    }

    // 체육관 대관자인 경우 추가 필드 검증
    if (selectedUserType === 'GYM_OWNER') {
      if (!formData.gymAddress) {
        newErrors.gymAddress = '체육관 주소를 입력해주세요';
        valid = false;
      }
      
      if (!formData.businessLicenseImage) {
        newErrors.businessLicenseImage = '사업자 등록증을 첨부해주세요';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({ ...errors, form: '' });

    try {
      // 체육관 대관자인 경우 사업자 등록증 이미지를 Base64로 변환
      let businessLicenseBase64 = '';
      if (formData.userType === 'GYM_OWNER' && formData.businessLicenseImage) {
        businessLicenseBase64 = await convertFileToBase64(formData.businessLicenseImage);
      }
      
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        // 추가 정보를 AuthContext에 전달하기 위해 확장합니다
        // 실제 구현에서는 AuthContext의 signup 함수와 User 인터페이스도 수정해야 합니다
        gymAddress: formData.gymAddress,
        businessLicenseImage: businessLicenseBase64,
      });
      
      // 회원가입 성공 후 홈페이지로 이동
      router.push('/');
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

  // 파일을 Base64 문자열로 변환하는 함수
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">회원가입</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.form && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              {errors.form}
            </div>
          )}
          
          {/* 사용자 유형 선택 */}
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                아이디 또는 이메일
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="아이디 또는 이메일을 입력하세요"
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
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                전화번호 (선택)
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="01012345678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* 체육관 대관자일 경우 추가 필드 */}
            {selectedUserType === 'GYM_OWNER' && (
              <>
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
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? '회원가입 중...' : '회원가입'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                로그인 하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 