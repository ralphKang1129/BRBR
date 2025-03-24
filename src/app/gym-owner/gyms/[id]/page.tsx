'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';

// 코트 정보 타입
interface Court {
  id: string;
  name: string;
  isAvailable: boolean;
  pricePerHour: number;
  description?: string;
}

// 체육관 정보 타입
interface Gym {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl?: string;
  isVerified: boolean;
  courts: Court[];
}

export default function GymDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isGymOwner } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [gym, setGym] = useState<Gym | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddCourtMode, setIsAddCourtMode] = useState(false);
  const [editedGym, setEditedGym] = useState<Gym | null>(null);
  const [newCourt, setNewCourt] = useState<Omit<Court, 'id'>>({
    name: '',
    isAvailable: true,
    pricePerHour: 10000,
    description: '',
  });

  // 가상의 체육관 상세 데이터 (실제로는 API에서 가져옴)
  const mockGymData: Gym = {
    id: params.id,
    name: params.id === '1' ? '스마일 배드민턴장' : '그린 스포츠 센터',
    address: params.id === '1' 
      ? '서울시 강남구 테헤란로 123' 
      : '서울시 서초구 서초대로 456',
    description: params.id === '1'
      ? '최신 시설을 갖춘 배드민턴 전용 체육관입니다. 쾌적한 환경과 편리한 시설로 최고의 경험을 제공합니다.'
      : '다양한 스포츠를 즐길 수 있는 복합 스포츠 센터입니다. 배드민턴, 탁구, 농구 등 여러 종목을 한 곳에서 즐기세요.',
    imageUrl: params.id === '1'
      ? 'https://via.placeholder.com/800x400?text=Smile+Badminton'
      : 'https://via.placeholder.com/800x400?text=Green+Sports+Center',
    isVerified: true,
    courts: params.id === '1'
      ? [
          { id: '101', name: 'A-1 코트', isAvailable: true, pricePerHour: 20000, description: '프리미엄 코트, 국제 규격' },
          { id: '102', name: 'A-2 코트', isAvailable: true, pricePerHour: 20000, description: '프리미엄 코트, 국제 규격' },
          { id: '103', name: 'A-3 코트', isAvailable: false, pricePerHour: 15000, description: '스탠다드 코트' },
          { id: '104', name: 'B-1 코트', isAvailable: true, pricePerHour: 15000, description: '스탠다드 코트' },
        ]
      : [
          { id: '201', name: 'B-1 코트', isAvailable: true, pricePerHour: 25000, description: 'VIP 코트, 국제 규격' },
          { id: '202', name: 'B-2 코트', isAvailable: true, pricePerHour: 25000, description: 'VIP 코트, 국제 규격' },
          { id: '203', name: 'C-1 코트', isAvailable: true, pricePerHour: 18000, description: '일반 코트' },
        ]
  };

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/gym-owner/gyms/${params.id}`);
      return;
    }

    // 체육관 대관자가 아닌 사용자는 홈으로 리디렉션
    if (!isGymOwner) {
      router.push('/');
      return;
    }

    // 체육관 데이터 로드 (실제로는 API 호출)
    const loadGymData = async () => {
      try {
        // API 호출 대신 목업 데이터 사용
        setGym(mockGymData);
        setEditedGym(mockGymData);
      } catch (error) {
        console.error('Failed to load gym data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGymData();
  }, [isAuthenticated, isGymOwner, router, params.id]);

  // 체육관 정보 수정
  const handleSaveGym = () => {
    if (!editedGym) return;
    // 실제로는 API 호출로 저장
    setGym(editedGym);
    setIsEditMode(false);
  };

  // 코트 정보 수정
  const handleUpdateCourt = (courtId: string, isAvailable: boolean) => {
    if (!gym) return;
    
    // 실제로는 API 호출로 저장
    const updatedCourts = gym.courts.map(court => 
      court.id === courtId ? { ...court, isAvailable } : court
    );
    
    setGym({ ...gym, courts: updatedCourts });
    if (editedGym) {
      setEditedGym({ ...editedGym, courts: updatedCourts });
    }
  };

  // 새 코트 추가
  const handleAddCourt = () => {
    if (!gym || !editedGym) return;
    
    const newCourtWithId: Court = {
      ...newCourt,
      id: `${gym.id}-${Date.now()}`, // 임시 ID 생성 (실제로는 서버에서 생성)
    };
    
    const updatedCourts = [...gym.courts, newCourtWithId];
    setGym({ ...gym, courts: updatedCourts });
    setEditedGym({ ...editedGym, courts: updatedCourts });
    setIsAddCourtMode(false);
    setNewCourt({
      name: '',
      isAvailable: true,
      pricePerHour: 10000,
      description: '',
    });
  };

  // 코트 삭제
  const handleDeleteCourt = (courtId: string) => {
    if (!gym || !editedGym) return;
    
    // 실제로는 API 호출로 삭제
    const updatedCourts = gym.courts.filter(court => court.id !== courtId);
    setGym({ ...gym, courts: updatedCourts });
    setEditedGym({ ...editedGym, courts: updatedCourts });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">체육관을 찾을 수 없습니다</h1>
            <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
              요청하신 체육관 정보를 찾을 수 없습니다.
            </p>
            <div className="mt-5">
              <Link
                href="/gym-owner/gyms"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                체육관 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? '체육관 정보 수정' : gym.name}
            </h1>
            {!isEditMode && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                체육관 정보 및 코트를 관리할 수 있습니다.
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {!isEditMode ? (
              <>
                <button
                  onClick={() => setIsEditMode(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  정보 수정
                </button>
                <Link
                  href="/gym-owner/gyms"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  목록으로
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveGym}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    setEditedGym(gym);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>

        {/* 체육관 기본 정보 */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">체육관 정보</h3>
            {gym.isVerified && (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                인증됨
              </span>
            )}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {isEditMode && editedGym ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gym-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      체육관 이름
                    </label>
                    <input
                      type="text"
                      id="gym-name"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedGym.name}
                      onChange={(e) => setEditedGym({ ...editedGym, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="gym-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      주소
                    </label>
                    <input
                      type="text"
                      id="gym-address"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedGym.address}
                      onChange={(e) => setEditedGym({ ...editedGym, address: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="gym-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      설명
                    </label>
                    <textarea
                      id="gym-description"
                      rows={3}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedGym.description}
                      onChange={(e) => setEditedGym({ ...editedGym, description: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="gym-image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      이미지 URL
                    </label>
                    <input
                      type="text"
                      id="gym-image"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={editedGym.imageUrl || ''}
                      onChange={(e) => setEditedGym({ ...editedGym, imageUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {gym.imageUrl && (
                  <div className="w-full h-64 overflow-hidden">
                    <img
                      src={gym.imageUrl}
                      alt={gym.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <dl>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">체육관 이름</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">{gym.name}</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">주소</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">{gym.address}</dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">설명</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">{gym.description}</dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">코트 수</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">{gym.courts.length}개</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* 코트 관리 */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">코트 관리</h3>
            <button
              onClick={() => setIsAddCourtMode(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              코트 추가
            </button>
          </div>
          
          {/* 코트 추가 폼 */}
          {isAddCourtMode && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="court-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    코트 이름
                  </label>
                  <input
                    type="text"
                    id="court-name"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newCourt.name}
                    onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="court-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    시간당 가격 (원)
                  </label>
                  <input
                    type="number"
                    id="court-price"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newCourt.pricePerHour}
                    onChange={(e) => setNewCourt({ ...newCourt, pricePerHour: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label htmlFor="court-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    상태
                  </label>
                  <select
                    id="court-status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={newCourt.isAvailable ? 'available' : 'unavailable'}
                    onChange={(e) => setNewCourt({ ...newCourt, isAvailable: e.target.value === 'available' })}
                  >
                    <option value="available">사용 가능</option>
                    <option value="unavailable">사용 불가</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label htmlFor="court-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    설명 (선택사항)
                  </label>
                  <input
                    type="text"
                    id="court-description"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={newCourt.description || ''}
                    onChange={(e) => setNewCourt({ ...newCourt, description: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddCourtMode(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddCourt}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    disabled={!newCourt.name.trim()}
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 코트 목록 */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    코트 이름
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    설명
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    시간당 가격
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {gym.courts.map((court) => (
                  <tr key={court.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {court.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {court.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {court.pricePerHour.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        court.isAvailable 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {court.isAvailable ? '사용 가능' : '사용 불가'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {court.isAvailable ? (
                        <button
                          onClick={() => handleUpdateCourt(court.id, false)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-3"
                        >
                          비활성화
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateCourt(court.id, true)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                        >
                          활성화
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCourt(court.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        삭제
                      </button>
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