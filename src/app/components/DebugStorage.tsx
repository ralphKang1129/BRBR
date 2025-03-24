'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DebugStorage() {
  const { isAdmin } = useAuth();
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 로컬 스토리지에서 사용자 및 인증 관련 데이터 가져오기
        const users = localStorage.getItem('users');
        const currentUser = localStorage.getItem('currentUser');
        
        setStorageData({
          users: users ? JSON.parse(users) : null,
          currentUser: currentUser ? JSON.parse(currentUser) : null,
        });
      } catch (error) {
        console.error('Error reading localStorage:', error);
        setError('로컬 스토리지 데이터를 읽는 중 오류가 발생했습니다.');
      }
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 my-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        디버그 정보 (관리자 전용)
      </h2>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-700 dark:text-red-400 mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-1">현재 로그인한 사용자:</h3>
          <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md text-xs overflow-auto max-h-40">
            {storageData.currentUser ? JSON.stringify(storageData.currentUser, null, 2) : '로그인된 사용자 없음'}
          </pre>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-1">등록된 사용자 목록:</h3>
          <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md text-xs overflow-auto max-h-60">
            {storageData.users ? JSON.stringify(storageData.users, null, 2) : '등록된 사용자 없음'}
          </pre>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => {
            if (window.confirm('로컬 스토리지를 초기화하시겠습니까? 모든 사용자 데이터가 삭제됩니다.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          로컬 스토리지 초기화
        </button>
      </div>
    </div>
  );
} 