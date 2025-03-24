'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { isAuthenticated, isAdmin, isGymOwner, user } = useAuth();
  
  // 로그인하지 않은 경우의 기본 네비게이션
  if (!isAuthenticated) {
    return (
      <nav className="flex items-center">
        <ul className="flex space-x-8 mr-4">
          <li><Link href="/courts" className="text-gray-600 hover:text-blue-600">코트 찾기</Link></li>
          <li><Link href="/about" className="text-gray-600 hover:text-blue-600">서비스 소개</Link></li>
        </ul>
      </nav>
    );
  }
  
  // 관리자 네비게이션
  if (isAdmin) {
    return (
      <nav className="flex items-center">
        <ul className="flex space-x-8 mr-4">
          <li><Link href="/admin" className="text-gray-600 hover:text-blue-600">대시보드</Link></li>
          <li><Link href="/admin/users" className="text-gray-600 hover:text-blue-600">사용자 관리</Link></li>
          <li><Link href="/admin/gyms" className="text-gray-600 hover:text-blue-600">체육관 관리</Link></li>
          <li><Link href="/admin/bookings" className="text-gray-600 hover:text-blue-600">예약 관리</Link></li>
          <li><Link href="/admin/statistics" className="text-gray-600 hover:text-blue-600">통계</Link></li>
        </ul>
      </nav>
    );
  }
  
  // 체육관 소유자 네비게이션
  if (isGymOwner) {
    return (
      <nav className="flex items-center">
        <ul className="flex space-x-8 mr-4">
          <li><Link href="/gym-owner" className="text-gray-600 hover:text-blue-600">대시보드</Link></li>
          <li><Link href="/gym-owner/gyms" className="text-gray-600 hover:text-blue-600">내 체육관</Link></li>
          <li><Link href="/gym-owner/bookings" className="text-gray-600 hover:text-blue-600">예약 관리</Link></li>
          <li><Link href="/gym-owner/revenue" className="text-gray-600 hover:text-blue-600">매출 관리</Link></li>
        </ul>
      </nav>
    );
  }
  
  // 일반 사용자(체육관 이용자) 네비게이션
  return (
    <nav className="flex items-center">
      <ul className="flex space-x-8 mr-4">
        <li><Link href="/gym-user" className="text-gray-600 hover:text-blue-600">홈</Link></li>
        <li><Link href="/courts" className="text-gray-600 hover:text-blue-600">코트 찾기</Link></li>
        <li><Link href="/my-bookings" className="text-gray-600 hover:text-blue-600">내 예약</Link></li>
        <li><Link href="/favorites" className="text-gray-600 hover:text-blue-600">찜한 체육관</Link></li>
      </ul>
    </nav>
  );
} 