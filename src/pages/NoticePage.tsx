import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, Megaphone, ArrowLeft, Search, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoticePage({ notices }: { notices: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const filteredNotices = notices.filter(notice => 
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setSelectedNotice(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            목록으로 돌아가기
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              {selectedNotice.important && (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">중요</span>
              )}
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Calendar className="w-4 h-4" /> {selectedNotice.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {selectedNotice.title}
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>

            {selectedNotice.attachment && (
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> 첨부파일
                </h3>
                <a 
                  href={selectedNotice.attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition-all shadow-sm group"
                >
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  {selectedNotice.attachment.name}
                </a>
              </div>
            )}
            
            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                사회복지법인 대한불교천태종복지재단 부산지부
              </div>
              <button 
                onClick={() => window.print()}
                className="text-sm font-medium text-green-600 hover:underline"
              >
                인쇄하기
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4"
          >
            <Megaphone className="w-4 h-4" /> 공지사항
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">새로운 소식</h1>
          <p className="text-lg text-gray-600">부산지부의 다양한 활동과 안내사항을 전해드립니다.</p>
        </div>

        <div className="mb-10 relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="제목이나 내용으로 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedNotice(notice)}
                  className="p-6 md:p-8 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {notice.important && (
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">중요</span>
                      )}
                      <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {notice.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {notice.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold text-sm">
                    자세히 보기 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center">
                <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> 메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
