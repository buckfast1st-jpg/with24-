import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminModal({ config, onSave, onClose, onReset }: any) {
  const [editConfig, setEditConfig] = useState(config);
  const [activeTab, setActiveTab] = useState('info');

  const handleInfoChange = (field: string, value: string) => {
    setEditConfig({
      ...editConfig,
      companyInfo: { ...editConfig.companyInfo, [field]: value }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'gallery' | 'supportProject', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'logo') {
        setEditConfig({ ...editConfig, logoUrl: base64String });
      } else if (target === 'supportProject') {
        setEditConfig({ ...editConfig, supportProjectImage: base64String });
      } else if (target === 'gallery' && typeof index === 'number') {
        const newGallery = [...editConfig.galleryPhotos];
        newGallery[index].url = base64String;
        setEditConfig({ ...editConfig, galleryPhotos: newGallery });
      }
    };
    reader.readAsDataURL(file);
  };

  const addGalleryPhoto = () => {
    setEditConfig({
      ...editConfig,
      galleryPhotos: [...editConfig.galleryPhotos, { url: 'https://images.unsplash.com/photo-1593113514676-5f8004f1f256?auto=format&fit=crop&q=80&w=800', title: '새로운 활동사진' }]
    });
  };

  const removeGalleryPhoto = (index: number) => {
    const newGallery = editConfig.galleryPhotos.filter((_: any, i: number) => i !== index);
    setEditConfig({ ...editConfig, galleryPhotos: newGallery });
  };

  const updateGalleryTitle = (index: number, title: string) => {
    const newGallery = [...editConfig.galleryPhotos];
    newGallery[index].title = title;
    setEditConfig({ ...editConfig, galleryPhotos: newGallery });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">홈페이지 관리자 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex border-b border-gray-100 shrink-0">
          <button 
            className={`flex-1 py-4 font-semibold ${activeTab === 'info' ? 'text-green-600 border-b-2 border-green-600 bg-white' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('info')}
          >
            기본 정보 & 로고
          </button>
          <button 
            className={`flex-1 py-4 font-semibold ${activeTab === 'gallery' ? 'text-green-600 border-b-2 border-green-600 bg-white' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('gallery')}
          >
            갤러리 관리
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
          {activeTab === 'info' && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> 로고 이미지</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
                    <img src={editConfig.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지 업로드 (권장: PNG, 가로형)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> 외부 지원 사업 이미지</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="w-48 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
                    <img src={editConfig.supportProjectImage} alt="Support Project Preview" className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지 업로드 (권장: 가로형 고화질)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'supportProject')}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">기관 정보 (푸터 노출)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">기관명</label>
                    <input type="text" value={editConfig.companyInfo.name} onChange={(e) => handleInfoChange('name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input type="text" value={editConfig.companyInfo.address} onChange={(e) => handleInfoChange('address', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                      <input type="text" value={editConfig.companyInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">팩스</label>
                      <input type="text" value={editConfig.companyInfo.fax} onChange={(e) => handleInfoChange('fax', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input type="email" value={editConfig.companyInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">활동사진 목록 ({editConfig.galleryPhotos.length}개)</h3>
                <button onClick={addGalleryPhoto} className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition-colors">
                  <Plus className="w-4 h-4" /> 사진 추가
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editConfig.galleryPhotos.map((photo: any, index: number) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4 items-start">
                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative group">
                      <img src={photo.url} alt="preview" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                        <Upload className="w-6 h-6" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery', index)} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">사진 제목</label>
                        <input 
                          type="text" 
                          value={photo.title} 
                          onChange={(e) => updateGalleryTitle(index, e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                      <button onClick={() => removeGalleryPhoto(index)} className="text-red-500 text-sm font-medium flex items-center gap-1 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" /> 삭제하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          <button onClick={onReset} className="px-4 py-2.5 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
            기본값으로 초기화
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors">
              취소
            </button>
            <button onClick={() => onSave(editConfig)} className="px-6 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md">
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
