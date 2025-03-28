'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday, parseISO, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { 
  TimeSlot, 
  Court, 
  Booking, 
  SelectedTimeRange,
  MOCK_COURTS, 
  MOCK_BOOKINGS,
  PAYMENT_METHODS,
  saveBooking
} from '@/types';

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const ReservationClient = ({ params }: Props) => {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState<SelectedTimeRange[]>([]);
  const [currentRange, setCurrentRange] = useState<SelectedTimeRange | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [court, setCourt] = useState<Court | undefined>(undefined);
  const [isCourtLoading, setIsCourtLoading] = useState(true);
  const [courtId, setCourtId] = useState<string>('');
  
  // 컴포넌트 마운트 시 params에서 id 추출
  useEffect(() => {
    if (params && typeof params === 'object' && 'id' in params) {
      setCourtId(params.id as string);
    }
  }, [params]);
  
  // 코트 정보 로드
  useEffect(() => {
    if (!courtId) return;
    
    const foundCourt = MOCK_COURTS.find((c: Court) => c.id === courtId);
    setCourt(foundCourt);
    setIsCourtLoading(false);
  }, [courtId]);
  
  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">예약 페이지</h1>
          <p className="mt-2 text-gray-600">코트 ID: {courtId}</p>
        </div>
        
        {isCourtLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : court ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{court.name}</h2>
            <p className="text-gray-600">{court.location}</p>
            <p className="mt-2">가격: {court.price}원/시간</p>
          </div>
        ) : (
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg">
            코트 정보를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationClient; 