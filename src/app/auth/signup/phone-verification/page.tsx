'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserType } from '../../../contexts/AuthContext';

export default function PhoneVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get('userType') as UserType;
  
  // 사용자 타입이 없으면 첫 단계로 리디렉션
  useEffect(() => {
    if (!userType || (userType !== 'GYM_OWNER' && userType !== 'GYM_USER')) {
      router.push('/auth/signup');
    }
  }, [userType, router]);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  
  // 타이머 처리
  useEffect(() => {
    if (codeSent && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCodeSent(false);
      setError('인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.');
    }
  }, [codeSent, timeLeft]);
  
  // 전화번호 형식 변경 (하이픈 추가)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };
  
  // 전화번호 유효성 검사
  const isValidPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11 && numbers.startsWith('010');
  };
  
  // 인증번호 전송 처리
  const handleSendVerificationCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }
    
    setError('');
    setIsSendingCode(true);
    
    try {
      // 실제 환경에서는 서버에 인증번호 발송 요청
      // 여기서는 임의로 성공했다고 가정
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연 (API 호출 시뮬레이션)
      
      setCodeSent(true);
      setTimeLeft(180); // 3분 설정
      setIsSendingCode(false);
    } catch (error) {
      setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
      setIsSendingCode(false);
    }
  };
  
  // 인증번호 확인 처리
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.');
      return;
    }
    
    setError('');
    setIsVerifying(true);
    
    try {
      // 실제 환경에서는 서버에 인증번호 검증 요청
      // 여기서는 임의로 123456이 올바른 코드라고 가정
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연 (API 호출 시뮬레이션)
      
      if (verificationCode === '123456') {
        setVerified(true);
      } else {
        setError('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
      }
      setIsVerifying(false);
    } catch (error) {
      setError('인증 과정에서 오류가 발생했습니다. 다시 시도해주세요.');
      setIsVerifying(false);
    }
  };
  
  // 다음 단계로 진행
  const handleNextStep = () => {
    // 선택한 사용자 타입과 인증된 전화번호를 쿼리 파라미터로 전달
    const phoneNumberClean = phoneNumber.replace(/-/g, '');
    router.push(`/auth/signup/user-info?userType=${userType}&phone=${phoneNumberClean}`);
  };
  
  // 타이머 형식화 (분:초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (!userType) {
    return <div>리디렉션 중...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">휴대폰 인증</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          단계 2/4: 휴대폰 인증을 통해 본인확인을 해주세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {verified ? (
            <div className="mb-4 p-3 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2">휴대폰 인증이 완료되었습니다.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  휴대폰 번호
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                    disabled={codeSent}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || codeSent || !isValidPhoneNumber(phoneNumber)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${
                      isSendingCode || codeSent || !isValidPhoneNumber(phoneNumber)
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isSendingCode ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : codeSent ? '재전송' : '인증번호 전송'}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  휴대폰 번호는 로그인 및 비밀번호 찾기에 사용됩니다.
                </p>
              </div>

              {codeSent && (
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      인증번호
                    </label>
                    <span className="text-sm text-red-500">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6자리 인증번호"
                      maxLength={6}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={isVerifying || verificationCode.length !== 6 || !codeSent}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white ${
                        isVerifying || verificationCode.length !== 6 || !codeSent
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                    >
                      {isVerifying ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : '확인'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    인증번호 6자리를 입력해주세요. (테스트용 인증번호: 123456)
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <Link
              href="/auth/signup"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              이전 단계로
            </Link>
            <button
              onClick={handleNextStep}
              disabled={!verified}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !verified
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
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
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mx-auto">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">가입 유형 선택</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                    <span className="text-white text-sm font-medium">2</span>
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
                <div className="h-0.5 bg-blue-600 absolute left-0 top-1/2 transform -translate-y-1/2 w-[37.5%]"></div>
                <div className="h-0.5 bg-gray-300 dark:bg-gray-600 absolute left-[37.5%] top-1/2 transform -translate-y-1/2 w-[62.5%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 