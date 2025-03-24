'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { MyBooking, PaymentMethod, MOCK_MY_BOOKINGS, PAYMENT_METHODS } from '@/types';
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MyBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [bookings, setBookings] = useState<MyBooking[]>(MOCK_MY_BOOKINGS);

  // 예약 상태별 필터링
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy년 M월 d일 (EEE)', { locale: ko });
    } catch (error) {
      return dateString;
    }
  };

  // 결제수단 이름 가져오기
  const getPaymentMethodName = (methodId: string) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    return method ? `${method.icon} ${method.name}` : methodId;
  };

  // 예약 취소 처리
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('예약을 취소하시겠습니까? 취소 수수료가 발생할 수 있습니다.')) {
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      );
      setBookings(updatedBookings);
    }
  };

  // 뱃지 색상 결정
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '예약 확정';
      case 'pending':
        return '대기중';
      case 'cancelled':
        return '취소됨';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">내 예약</h1>
        
        {/* 탭 필터 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'confirmed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              예약 확정
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'pending'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                activeTab === 'cancelled'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              취소됨
            </button>
          </div>
          
          {/* 예약 목록 */}
          <div className="divide-y divide-gray-200">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.courtName}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{booking.gymName}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">날짜 및 시간</p>
                          <p className="text-base text-gray-900">
                            {formatDate(booking.date)} {booking.startHour}:00 - {booking.endHour}:00
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">결제 정보</p>
                          <p className="text-base text-gray-900">
                            {getPaymentMethodName(booking.paymentMethod || 'card')}
                            <span className="ml-2 text-sm text-gray-500">
                              {booking.paymentId && `(${booking.paymentId.substring(0, 8)}...)`}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">예약 번호</p>
                          <p className="text-base text-gray-900">{booking.id.substring(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">예약일</p>
                          <p className="text-base text-gray-900">
                            {booking.createdAt ? formatDate(booking.createdAt) : '정보 없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end justify-between h-full">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">결제 금액</p>
                        <p className="text-xl font-bold text-gray-900">
                          {booking.price.toLocaleString()}원
                        </p>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            예약 취소
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/courts/${booking.courtId}`)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        >
                          코트 보기
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">예약 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 예약 요약 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">예약 요약</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800">총 예약 건수</p>
              <p className="text-2xl font-bold text-blue-900">
                {bookings.filter(b => b.status !== 'cancelled').length}건
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800">확정된 예약</p>
              <p className="text-2xl font-bold text-green-900">
                {bookings.filter(b => b.status === 'confirmed').length}건
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-800">대기중인 예약</p>
              <p className="text-2xl font-bold text-yellow-900">
                {bookings.filter(b => b.status === 'pending').length}건
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 