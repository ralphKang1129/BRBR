'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

// 매출 항목 타입
interface RevenueItem {
  id: string;
  gymId: string;
  gymName: string;
  date: string;
  amount: number;
  bookingCount: number;
  paymentMethod: string;
  status: 'SETTLED' | 'PENDING';
}

// 월별 매출 요약 타입
interface MonthlySummary {
  month: string; // 'YYYY-MM' 형식
  totalAmount: number;
  bookingCount: number;
  settledAmount: number;
  pendingAmount: number;
}

export default function GymOwnerRevenuePage() {
  const router = useRouter();
  const { user, isAuthenticated, isGymOwner } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGym, setSelectedGym] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // monthly, weekly, daily
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);

  // 가상의 체육관 목록 (실제로는 API에서 가져옴)
  const mockGyms = [
    { id: '1', name: '스마일 배드민턴장' },
    { id: '2', name: '그린 스포츠 센터' },
  ];

  // 가상의 매출 데이터 (실제로는 API에서 가져옴)
  const mockRevenueData: RevenueItem[] = [
    {
      id: '1',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      date: '2024-03-25',
      amount: 120000,
      bookingCount: 6,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '2',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      date: '2024-03-24',
      amount: 80000,
      bookingCount: 4,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '3',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      date: '2024-03-23',
      amount: 100000,
      bookingCount: 5,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '4',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      date: '2024-03-25',
      amount: 150000,
      bookingCount: 6,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '5',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      date: '2024-03-24',
      amount: 125000,
      bookingCount: 5,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '6',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      date: '2024-03-23',
      amount: 100000,
      bookingCount: 4,
      paymentMethod: '신용카드',
      status: 'PENDING',
    },
    {
      id: '7',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      date: '2024-03-22',
      amount: 60000,
      bookingCount: 3,
      paymentMethod: '신용카드',
      status: 'PENDING',
    },
    {
      id: '8',
      gymId: '1',
      gymName: '스마일 배드민턴장',
      date: '2024-02-28',
      amount: 80000,
      bookingCount: 4,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '9',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      date: '2024-02-28',
      amount: 100000,
      bookingCount: 4,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
    {
      id: '10',
      gymId: '2',
      gymName: '그린 스포츠 센터',
      date: '2024-02-27',
      amount: 75000,
      bookingCount: 3,
      paymentMethod: '신용카드',
      status: 'SETTLED',
    },
  ];

  // 월별 매출 요약 데이터 계산
  const calculateMonthlySummary = (data: RevenueItem[]) => {
    const summary: { [key: string]: MonthlySummary } = {};
    
    data.forEach(item => {
      const month = item.date.substring(0, 7); // 'YYYY-MM' 형식 추출
      
      if (!summary[month]) {
        summary[month] = {
          month,
          totalAmount: 0,
          bookingCount: 0,
          settledAmount: 0,
          pendingAmount: 0,
        };
      }
      
      summary[month].totalAmount += item.amount;
      summary[month].bookingCount += item.bookingCount;
      
      if (item.status === 'SETTLED') {
        summary[month].settledAmount += item.amount;
      } else {
        summary[month].pendingAmount += item.amount;
      }
    });
    
    return Object.values(summary).sort((a, b) => b.month.localeCompare(a.month));
  };

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/gym-owner/revenue');
      return;
    }

    // 체육관 대관자가 아닌 사용자는 홈으로 리디렉션
    if (!isGymOwner) {
      router.push('/');
      return;
    }

    // 매출 데이터 로드 (실제로는 API 호출)
    const loadRevenueData = async () => {
      try {
        // API 호출 대신 목업 데이터 사용
        setRevenueData(mockRevenueData);
        setMonthlySummary(calculateMonthlySummary(mockRevenueData));
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRevenueData();
  }, [isAuthenticated, isGymOwner, router]);

  // 필터링된 매출 데이터
  const filteredRevenueData = revenueData.filter(item => {
    if (selectedGym && item.gymId !== selectedGym) {
      return false;
    }
    return true;
  });

  // 총 매출 계산
  const totalRevenue = filteredRevenueData.reduce((total, item) => total + item.amount, 0);
  
  // 정산 완료된 매출 계산
  const settledRevenue = filteredRevenueData
    .filter(item => item.status === 'SETTLED')
    .reduce((total, item) => total + item.amount, 0);
  
  // 정산 대기 중인 매출 계산
  const pendingRevenue = filteredRevenueData
    .filter(item => item.status === 'PENDING')
    .reduce((total, item) => total + item.amount, 0);

  if (isLoading) {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">매출 관리</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              체육관의 매출 현황을 확인하고 관리할 수 있습니다.
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
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">매출 필터</h3>
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
                  value={selectedGym || ''}
                  onChange={(e) => setSelectedGym(e.target.value || null)}
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
                <label htmlFor="period-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  기간 단위
                </label>
                <select
                  id="period-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="monthly">월별</option>
                  <option value="weekly">주별</option>
                  <option value="daily">일별</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 매출 요약 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                총 매출
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {totalRevenue.toLocaleString()}원
              </dd>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                정산 완료
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-400">
                {settledRevenue.toLocaleString()}원
              </dd>
              <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {((settledRevenue / totalRevenue) * 100).toFixed(1)}%
              </dd>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                정산 대기
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-yellow-600 dark:text-yellow-400">
                {pendingRevenue.toLocaleString()}원
              </dd>
              <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {((pendingRevenue / totalRevenue) * 100).toFixed(1)}%
              </dd>
            </div>
          </div>
        </div>

        {/* 월별 매출 요약 */}
        {selectedPeriod === 'monthly' && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">월별 매출 요약</h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      월
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      총 매출
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      예약 건수
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      정산 완료
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      정산 대기
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {monthlySummary.map((month) => (
                    <tr key={month.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {month.totalAmount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {month.bookingCount}건
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                        {month.settledAmount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                        {month.pendingAmount.toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 일별 매출 목록 */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">일별 매출 목록</h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    날짜
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    체육관
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    예약 건수
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    매출
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    결제 방법
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    정산 상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRevenueData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.gymName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.bookingCount}건
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'SETTLED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {item.status === 'SETTLED' ? '정산 완료' : '정산 대기'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 