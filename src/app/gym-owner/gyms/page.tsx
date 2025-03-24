'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface Gym {
  id: string;
  name: string;
  address: string;
  description: string;
  courtCount: number;
  isVerified: boolean;
  createdAt: string;
  imageUrl?: string;
}

export default function GymOwnerGymsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isGymOwner } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // 가상의 체육관 데이터 생성 (실제로는 API에서 가져옴)
  const mockGyms: Gym[] = [
    {
      id: '1',
      name: '스마일 배드민턴장',
      address: '서울시 강남구 테헤란로 123',
      description: '쾌적한 환경의 배드민턴 전용 체육관입니다.',
      courtCount: 8,
      isVerified: true,
      createdAt: '2023-01-15T09:00:00Z',
      imageUrl: 'https://via.placeholder.com/300x200?text=Smile+Badminton'
    },
    {
      id: '2',
      name: '그린 스포츠 센터',
      address: '서울시 송파구 올림픽로 456',
      description: '다양한 스포츠 시설을 갖춘 종합 체육관입니다.',
      courtCount: 4,
      isVerified: false,
      createdAt: '2023-03-20T09:00:00Z',
      imageUrl: 'https://via.placeholder.com/300x200?text=Green+Sports'
    }
  ];

  useEffect(() => {
    // 인증 로딩이 완료될 때까지 대기
    if (isLoading) return;
    
    // 로딩이 완료되고, 인증되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/gym-owner/gyms');
      return;
    }

    // 로딩이 완료되고, 체육관 대관자가 아닌 사용자는 홈으로 리디렉션
    if (!isGymOwner) {
      router.push('/');
      return;
    }

    // 체육관 데이터 로드 (실제로는 API 호출)
    const loadGyms = async () => {
      try {
        // API 호출 대신 목업 데이터 사용
        setGyms(mockGyms);
      } catch (error) {
        console.error('Failed to load gyms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGyms();
  }, [isLoading, isAuthenticated, isGymOwner, router]);

  // 새 체육관 등록 폼
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    courtCount: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'courtCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 새 체육관 추가 로직 (실제로는 API 호출)
    const newGym: Gym = {
      id: Date.now().toString(),
      ...formData,
      isVerified: false,
      createdAt: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/300x200?text=New+Gym'
    };
    
    setGyms(prev => [newGym, ...prev]);
    setFormData({ name: '', address: '', description: '', courtCount: 1 });
    setShowAddForm(false);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">내 체육관 관리</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              체육관 정보를 관리하고 코트를 등록할 수 있습니다.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/gym-owner"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              대시보드로 돌아가기
            </Link>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              새 체육관 등록
            </button>
          </div>
        </div>

        {/* 새 체육관 등록 폼 */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">새 체육관 등록</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      체육관 이름
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="체육관 이름을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="courtCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      코트 수
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="courtCount"
                        id="courtCount"
                        required
                        min="1"
                        max="100"
                        value={formData.courtCount}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      주소
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="체육관 주소를 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      설명
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="체육관에 대한 설명을 입력하세요"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 체육관 목록 */}
        {gyms.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">등록된 체육관이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">새 체육관을 등록해주세요.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                새 체육관 등록
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {gyms.map((gym) => (
              <div key={gym.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={gym.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={gym.name}
                  />
                </div>
                <div className="px-4 py-5 sm:p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        {gym.name}
                        {gym.isVerified ? (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            승인됨
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                            승인 대기중
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {gym.address}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      코트 {gym.courtCount}개
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {gym.description}
                  </p>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    등록일: {new Date(gym.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
                  <div className="flex justify-between">
                    <Link
                      href={`/gym-owner/gyms/${gym.id}/courts`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      코트 관리
                    </Link>
                    <Link
                      href={`/gym-owner/gyms/${gym.id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      정보 수정
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 