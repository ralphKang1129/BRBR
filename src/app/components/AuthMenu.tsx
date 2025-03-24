'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AuthMenu() {
  const { user, isAuthenticated, isAdmin, isGymOwner, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  // 로그인하지 않은 경우 로그인/회원가입 버튼 표시
  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
        <Link 
          href="/auth/login" 
          className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          로그인
        </Link>
        <Link
          href="/auth/signup"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          회원가입
        </Link>
      </div>
    );
  }

  // 사용자 역할에 따라 다른 배지 색상 적용
  const getBadgeColor = () => {
    if (isAdmin) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    if (isGymOwner) return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
  };

  // 사용자 역할 텍스트
  const getUserRoleText = () => {
    if (isAdmin) return '관리자';
    if (isGymOwner) return '체육관 소유자';
    return '일반 사용자';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="mr-1">{user?.name || '사용자'}</span>
        <span className={`ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor()}`}>
          {getUserRoleText()}
        </span>
        <svg
          className={`h-5 w-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
            <div>{user?.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
            <div className={`mt-1 text-xs ${getBadgeColor().split(' ').slice(1, 3).join(' ')}`}>
              {getUserRoleText()}
            </div>
          </div>

          {/* 관리자 전용 메뉴 항목 */}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                관리자 대시보드
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                사용자 관리
              </Link>
              <Link
                href="/admin/gyms"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                체육관 관리
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            </>
          )}

          {/* 체육관 소유자 전용 메뉴 항목 */}
          {isGymOwner && (
            <>
              <Link
                href="/gym-owner"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                체육관 대시보드
              </Link>
              <Link
                href="/gym-owner/gyms"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                내 체육관 관리
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            </>
          )}

          {/* 일반 사용자 메뉴 항목 */}
          {!isAdmin && !isGymOwner && (
            <>
              <Link
                href="/my-bookings"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                내 예약
              </Link>
              <Link
                href="/favorites"
                className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                찜한 체육관
              </Link>
              <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            </>
          )}

          {/* 공통 메뉴 항목 */}
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            onClick={() => setIsMenuOpen(false)}
          >
            프로필 설정
          </Link>
          
          <Link
            href="/debug"
            className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            onClick={() => setIsMenuOpen(false)}
          >
            디버그
          </Link>
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
} 