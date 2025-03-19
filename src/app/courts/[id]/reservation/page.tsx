'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TimeSlot, Court, Booking, MOCK_COURTS, MOCK_BOOKINGS } from '@/types';

// 타입 정의
interface PageProps {
  params: {
    id: string;
  };
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6AM to 10PM

export default function ReservationPage({ params }: PageProps) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  const court = MOCK_COURTS.find((c: Court) => c.id === params.id);
  if (!court) return <div>코트를 찾을 수 없습니다.</div>;

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }), // 월요일부터 시작
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  const isTimeSlotBooked = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return MOCK_BOOKINGS.some(
      booking =>
        booking.courtId === court.id &&
        booking.date === dateStr &&
        hour >= booking.startHour &&
        hour < booking.endHour
    );
  };

  const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleTimeSlotClick = (date: Date, hour: number) => {
    if (isTimeSlotBooked(date, hour)) return;
    setSelectedTimeSlot({ date, hour });
  };

  const getBookingForTimeSlot = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return MOCK_BOOKINGS.find(
      booking =>
        booking.courtId === court.id &&
        booking.date === dateStr &&
        hour >= booking.startHour &&
        hour < booking.endHour
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{court.name} 예약</h1>
          <p className="mt-2 text-gray-600">{court.location} · {court.price.toLocaleString()}원/시간</p>
        </div>

        {/* 캘린더 컨트롤 */}
        <div className="bg-white rounded-t-lg border border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevWeek}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextWeek}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  오늘
                </button>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {format(weekDays[0], 'yyyy년 M월', { locale: ko })}
              </h2>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setView('month')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                월
              </button>
              <button
                onClick={() => setView('week')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                주
              </button>
              <button
                onClick={() => setView('day')}
                className={"px-3 py-1.5 text-sm font-medium rounded transition-colors " + 
                  (view === 'day' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50')}
              >
                일
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="w-20 py-2 pr-4 border-r border-gray-200">
              <div className="text-xs font-medium text-gray-500 text-right">GMT+9</div>
            </div>
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={"py-2 border-r border-gray-200 " + 
                  (isToday(day) ? 'bg-blue-50' : '')}
              >
                <div className="px-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    {format(day, 'EEE', { locale: ko })}
                  </div>
                  <div className={"text-2xl font-semibold " + 
                    (isToday(day) ? 'text-blue-600' : 'text-gray-900')}>
                    {format(day, 'd')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 시간 그리드 */}
          <div className="grid grid-cols-8 relative min-h-[800px]">
            {/* 시간 레이블 */}
            <div className="w-20 border-r border-gray-200">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-200"
                >
                  <div className="text-xs font-medium text-gray-500 text-right pr-4 -mt-2">
                    {hour}:00
                  </div>
                </div>
              ))}
            </div>

            {/* 예약 슬롯 */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200">
                {HOURS.map(hour => {
                  const isBooked = isTimeSlotBooked(day, hour);
                  const booking = getBookingForTimeSlot(day, hour);
                  const isSelected =
                    selectedTimeSlot &&
                    isSameDay(selectedTimeSlot.date, day) &&
                    selectedTimeSlot.hour === hour;
                  const isPast = new Date() > new Date(day.setHours(hour));

                  return (
                    <div
                      key={hour}
                      onClick={() => !isBooked && !isPast && handleTimeSlotClick(day, hour)}
                      className={"h-16 border-b border-gray-200 relative group transition-colors " + 
                        (isPast
                          ? 'bg-gray-50 cursor-not-allowed'
                          : isBooked
                          ? 'bg-blue-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer'
                          : 'hover:bg-blue-50 cursor-pointer')}
                    >
                      {/* 30분 구분선 */}
                      <div className="absolute w-full border-t border-gray-100 top-1/2 pointer-events-none"></div>
                      
                      {isBooked && (
                        <div className="absolute inset-0 p-1">
                          <div className={"h-full rounded px-2 py-1 text-xs " + 
                            (booking?.userName === '김철수' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>
                            <div className="font-medium">{booking?.userName}</div>
                          </div>
                        </div>
                      )}

                      {!isBooked && !isPast && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <div className="text-xs font-medium text-blue-600">
                            클릭하여 예약
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* 현재 시간 표시 */}
            {weekDays.some(day => isToday(day)) && (
              <div 
                className="absolute left-0 right-0 flex items-center z-10 transition-all duration-300"
                style={{
                  top: `${((currentTime.getHours() - 6) * 64) + (currentTime.getMinutes() * 64 / 60)}px`
                }}
              >
                <div className="absolute -left-2 w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                <div className="w-full border-t-2 border-red-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* 예약 버튼 */}
        {selectedTimeSlot && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => alert('예약이 완료되었습니다!')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {format(selectedTimeSlot.date, 'M월 d일', { locale: ko })} {selectedTimeSlot.hour}:00 예약하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 