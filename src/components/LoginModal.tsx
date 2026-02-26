import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }: { onLogin: (pwd: string) => void, onClose: () => void }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">관리자 로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="비밀번호를 입력하세요 (기본: admin)"
              autoFocus
            />
          </div>
          <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
