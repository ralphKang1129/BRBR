'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup, getUsers } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    form: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 지우기
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({ ...errors, form: '' });

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 