'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { MyBooking, MOCK_MY_BOOKINGS } from '@/types';

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 상태에 따른 필터링
  const filteredBookings = MOCK_MY_BOOKINGS.filter(booking => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  // 예약 상태에 따른 스타일 및 텍스트
  const getStatusBadge = (status: MyBooking['status']) => {
    switch(status) {
      case 'confirmed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">확정</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">대기중</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">취소됨</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'yyyy년 M월 d일 (EEE)', { locale: ko });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">내 예약 관리</h1>

        {/* 필터 */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              확정
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'pending'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                statusFilter === 'cancelled'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              취소됨
            </button>
          </div>
        </div>

        {/* 예약 목록 */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">예약 내역이 없습니다.</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    {/* 코트 이미지 */}
                    <div className="sm:w-48 sm:h-32 flex-shrink-0 mb-4 sm:mb-0">
                      <div className="relative h-32 w-full sm:w-48">
                        <Image
                          src={booking.courtImageUrl}
                          alt={booking.courtName}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>

                    {/* 예약 정보 */}
                    <div className="sm:ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">{booking.courtName}</h2>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>
                            {formatDate(booking.date)}, {booking.startHour}:00 - {booking.endHour}:00
                          </span>
                        </div>
                        <div className="flex items-center mb-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{booking.courtLocation}</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>예약일: {format(parseISO(booking.createdAt), 'yyyy.MM.dd')}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-lg font-medium text-gray-900">
                          {booking.price.toLocaleString()}원
                        </div>

                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <button className="bg-red-50 text-red-700 px-3 py-1 text-sm rounded-md hover:bg-red-100">
                              취소하기
                            </button>
                          )}
                          <Link 
                            href={`/courts/${booking.courtId}/reservation`}
                            className="bg-blue-50 text-blue-700 px-3 py-1 text-sm rounded-md hover:bg-blue-100"
                          >
                            코트 상세
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 