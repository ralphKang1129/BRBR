'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

// 예약 상태 타입
type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'COMPLETED';

// 예약 정보 타입
interface Booking {
  id: string;
  gymId: string;
  gymName: string;
  courtId: string;
  courtName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  createdAt: string;
}

export default function GymOwnerBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isGymOwner } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<{
    gymId: string | null;
    date: string | null;
    status: BookingStatus | 'ALL';
  }>({
    gymId: null,
    date: null,
    status: 'ALL',
  });

  // 가상의 체육관 목록 (실제로는 API에서 가져옴)
  const mockGyms = [
    { id: '1', name: '스마일 배드민턴장' },
    { id: '2', name: '그린 스포츠 센터' },
  ];

  // 가상의 예약 데이터 (실제로는 API에서 가져옴)
  const mockBookings: Booking[] = [
    {
      id: '1',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      courtId: '101',
      courtName: 'A-1 코트',
      userId: 'user1',
      userName: '김철수',
      userEmail: 'user1@example.com',
      userPhone: '010-1234-5678',
      date: '2024-03-25',
      startTime: '10:00',
      endTime: '12:00',
      status: 'CONFIRMED',
      totalAmount: 20000,
      paymentStatus: 'PAID',
      createdAt: '2024-03-20T14:30:00Z',
    },
    {
      id: '2',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      courtId: '102',
      courtName: 'A-2 코트',
      userId: 'user2',
      userName: '이영희',
      userEmail: 'user2@example.com',
      userPhone: '010-9876-5432',
      date: '2024-03-25',
      startTime: '14:00',
      endTime: '16:00',
      status: 'PENDING',
      totalAmount: 20000,
      paymentStatus: 'UNPAID',
      createdAt: '2024-03-24T09:15:00Z',
    },
    {
      id: '3',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      courtId: '201',
      courtName: 'B-1 코트',
      userId: 'user3',
      userName: '박지민',
      userEmail: 'user3@example.com',
      userPhone: '010-5555-7777',
      date: '2024-03-26',
      startTime: '18:00',
      endTime: '20:00',
      status: 'CONFIRMED',
      totalAmount: 25000,
      paymentStatus: 'PAID',
      createdAt: '2024-03-23T16:45:00Z',
    },
    {
      id: '4',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      courtId: '103',
      courtName: 'A-3 코트',
      userId: 'user4',
      userName: '정민수',
      userEmail: 'user4@example.com',
      userPhone: '010-3333-4444',
      date: '2024-03-24',
      startTime: '16:00',
      endTime: '18:00',
      status: 'COMPLETED',
      totalAmount: 20000,
      paymentStatus: 'PAID',
      createdAt: '2024-03-23T10:20:00Z',
    },
    {
      id: '5',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      courtId: '202',
      courtName: 'B-2 코트',
      userId: 'user5',
      userName: '최수진',
      userEmail: 'user5@example.com',
      userPhone: '010-1111-2222',
      date: '2024-03-26',
      startTime: '10:00',
      endTime: '12:00',
      status: 'CANCELLED',
      totalAmount: 25000,
      paymentStatus: 'REFUNDED',
      createdAt: '2024-03-22T08:30:00Z',
    },
  ];

  useEffect(() => {
    // 인증 로딩이 완료될 때까지 대기
    if (isLoading) return;
    
    // 로딩이 완료되고, 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/gym-owner/bookings');
      return;
    }

    // 로딩이 완료되고, 체육관 대관자가 아닌 사용자는 홈으로 리디렉션
    if (!isGymOwner) {
      router.push('/');
      return;
    }

    // 예약 데이터 로드 (실제로는 API 호출)
    const loadBookings = async () => {
      try {
        // API 호출 대신 목업 데이터 사용
        setBookings(mockBookings);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadBookings();
  }, [isLoading, isAuthenticated, isGymOwner, router]);

  // 예약 상태별 색상 클래스 반환
  const getStatusColorClass = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // 결제 상태별 색상 클래스 반환
  const getPaymentStatusColorClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'REFUNDED':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // 필터링된 예약 목록
  const filteredBookings = bookings.filter((booking) => {
    // 체육관 필터
    if (filter.gymId && booking.gymId !== filter.gymId) {
      return false;
    }
    
    // 날짜 필터
    if (filter.date && booking.date !== filter.date) {
      return false;
    }
    
    // 상태 필터
    if (filter.status !== 'ALL' && booking.status !== filter.status) {
      return false;
    }
    
    return true;
  });

  // 예약 상태 변경 처리
  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    // 실제로는 API 호출로 상태 변경
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  if (pageLoading || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">예약 관리</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              체육관의 예약 현황을 확인하고 관리할 수 있습니다.
            </p>
          </div>
          <Link
            href="/gym-owner"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            대시보드로 돌아가기
          </Link>
        </div>

        {/* 필터 */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">예약 필터</h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="gym-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  체육관
                </label>
                <select
                  id="gym-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter.gymId || ''}
                  onChange={(e) => setFilter({ ...filter, gymId: e.target.value || null })}
                >
                  <option value="">모든 체육관</option>
                  {mockGyms.map((gym) => (
                    <option key={gym.id} value={gym.id}>
                      {gym.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  날짜
                </label>
                <input
                  type="date"
                  id="date-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter.date || ''}
                  onChange={(e) => setFilter({ ...filter, date: e.target.value || null })}
                />
              </div>
              
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  상태
                </label>
                <select
                  id="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value as BookingStatus | 'ALL' })}
                >
                  <option value="ALL">모든 상태</option>
                  <option value="CONFIRMED">확정</option>
                  <option value="PENDING">대기중</option>
                  <option value="CANCELLED">취소됨</option>
                  <option value="COMPLETED">완료됨</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 예약 목록 */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">예약 내역이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              선택한 필터에 맞는 예약이 없습니다. 다른 필터를 선택해보세요.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    체육관 / 코트
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    예약자
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    날짜 / 시간
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    결제
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.gymName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.courtName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.userName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.userEmail}</div>
                      {booking.userPhone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{booking.userPhone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{booking.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.startTime} ~ {booking.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(booking.status)}`}>
                        {booking.status === 'CONFIRMED' && '확정'}
                        {booking.status === 'PENDING' && '대기중'}
                        {booking.status === 'CANCELLED' && '취소됨'}
                        {booking.status === 'COMPLETED' && '완료됨'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {booking.totalAmount.toLocaleString()}원
                      </div>
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColorClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus === 'PAID' && '결제완료'}
                        {booking.paymentStatus === 'UNPAID' && '미결제'}
                        {booking.paymentStatus === 'REFUNDED' && '환불됨'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'PENDING' && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            거절
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && !['COMPLETED', 'CANCELLED'].includes(booking.status) && (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            완료
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            취소
                          </button>
                        </div>
                      )}
                      <Link
                        href={`/gym-owner/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 