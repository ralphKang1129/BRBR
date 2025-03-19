'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    form: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

  // 사용자 정보가 로드되면 폼 데이터 초기화
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 에러 및 성공 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSuccessMessage('');
  };

  const validateProfileForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
      valid = false;
    }

    if (formData.phone && !/^\d{11}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      valid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요';
      valid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다';
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      // 실제로는 API를 호출하여 프로필 업데이트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
      setErrors(prev => ({
        ...prev,
        form: '프로필 업데이트에 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      // 실제로는 API를 호출하여 비밀번호 업데이트
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 후 폼 리셋
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('비밀번호 변경 에러:', error);
      setErrors(prev => ({
        ...prev,
        form: '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">내 프로필</h1>
          <p className="mt-1 text-sm text-gray-500">
            계정 정보 및 개인 설정을 관리할 수 있습니다.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* 탭 네비게이션 */}
          <nav className="bg-gray-50 px-4 py-3 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              기본 정보
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`ml-4 px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'password'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              비밀번호 변경
            </button>
          </nav>

          <div className="px-4 py-5 sm:p-6">
            {/* 성공 메시지 */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                {successMessage}
              </div>
            )}
            
            {/* 에러 메시지 */}
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                {errors.form}
              </div>
            )}

            {/* 프로필 정보 폼 */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled
                      value={formData.email}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none bg-gray-100 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    전화번호 (선택)
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01012345678"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? '저장 중...' : '변경사항 저장'}
                  </button>
                </div>
              </form>
            )}

            {/* 비밀번호 변경 폼 */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    현재 비밀번호
                  </label>
                  <div className="mt-1">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    새 비밀번호
                  </label>
                  <div className="mt-1">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="8자 이상 입력하세요"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    새 비밀번호 확인
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="pt-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? '변경 중...' : '비밀번호 변경'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 