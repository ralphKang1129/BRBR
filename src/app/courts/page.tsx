'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CurrencyYenIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Court, MOCK_COURTS } from '@/types';

// 시설 아이콘 컴포넌트
const FacilityIcon: React.FC<{ facility: string }> = ({ facility }) => {
  return (
    <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
      {facility}
    </div>
  );
};

export default function CourtsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('전체');
  const [selectedPriceRange, setSelectedPriceRange] = useState('전체');
  const router = useRouter();

  // 검색 및 필터링 로직
  const filteredCourts = MOCK_COURTS.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === '전체' || court.location === selectedLocation;
    const matchesPriceRange = selectedPriceRange === '전체' ||
      (selectedPriceRange === '~20000' && court.price <= 20000) ||
      (selectedPriceRange === '20000~30000' && court.price > 20000 && court.price <= 30000) ||
      (selectedPriceRange === '30000~' && court.price > 30000);

    return matchesSearch && matchesLocation && matchesPriceRange;
  });

  // 위치 및 가격 필터 옵션
  const locations = Array.from(new Set(MOCK_COURTS.map(court => court.location)));
  const priceRanges = ['전체', '~20000', '20000~30000', '30000~'];

  // 예약 페이지로 이동
  const handleReservation = (courtId: string) => {
    router.push(`/courts/${courtId}/reservation`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 섹션 */}
        <div className="sticky top-0 z-10 bg-gray-50 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 입력 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="코트 이름 또는 지역으로 검색"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* 필터 드롭다운 */}
            <div className="flex gap-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="전체">모든 지역</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="전체">모든 가격대</option>
                {priceRanges.slice(1).map(range => (
                  <option key={range} value={range}>
                    {range === '~20000' ? '2만원 이하' :
                     range === '20000~30000' ? '2만원~3만원' :
                     '3만원 이상'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 코트 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map(court => (
            <div
              key={court.id}
              onClick={() => handleReservation(court.id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              {/* 이미지 */}
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={court.imageUrl}
                  alt={court.name}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 코트 정보 */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                      <span className="ml-1">{court.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <CurrencyYenIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="ml-1">{court.price.toLocaleString()}원/시간</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                    <span className="ml-1">{court.availableTime}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-600">{court.rating}</span>
                      <span className="mx-1 text-gray-400">·</span>
                      <span className="text-sm text-gray-600">리뷰 {court.reviewCount}개</span>
                    </div>
                  </div>
                </div>

                {/* 시설 아이콘 */}
                <div className="mt-4 flex items-center gap-2">
                  {court.facilities.slice(0, 3).map((facility, index) => (
                    <FacilityIcon key={index} facility={facility} />
                  ))}
                  {court.facilities.length > 3 && (
                    <span className="text-xs text-gray-500">+{court.facilities.length - 3}개</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 