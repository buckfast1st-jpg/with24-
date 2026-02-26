import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Users, Leaf, Calendar, Utensils, ArrowRight, Phone, Mail, MapPin, Printer, Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { defaultConfig } from './config';
import LoginModal from './components/LoginModal';
import AdminModal from './components/AdminModal';

const Logo = ({ url, name }: { url: string, name: string }) => (
  <div className="flex items-center gap-3">
    <img 
      src={url} 
      alt="로고" 
      className="h-12 w-auto object-contain" 
      referrerPolicy="no-referrer"
    />
    <span className="font-bold text-lg tracking-tight text-gray-900 hidden sm:block leading-tight">
      {name.split(' ').map((part, i) => (
        <React.Fragment key={i}>
          {i === 0 ? part : <span className="text-sm text-green-600">{part}</span>}
          {i === 0 && <br/>}
        </React.Fragment>
      ))}
    </span>
  </div>
);

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('donate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Site Data State (loads from localStorage or defaultConfig)
  const [siteData, setSiteData] = useState(() => {
    const saved = localStorage.getItem('siteConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const handleAdminLogin = (password: string) => {
    if (password === 'admin' || password === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSaveConfig = (newConfig: any) => {
    setSiteData(newConfig);
    localStorage.setItem('siteConfig', JSON.stringify(newConfig));
    setShowAdminModal(false);
  };

  const handleResetConfig = () => {
    if (window.confirm('모든 설정을 기본값으로 초기화하시겠습니까? (저장되지 않은 변경사항은 사라집니다)')) {
      setSiteData(defaultConfig);
      localStorage.removeItem('siteConfig');
      setShowAdminModal(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, formName: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("신청유형", formName);

    try {
      const response = await fetch("https://formspree.io/f/mojnrdvl", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        alert(`${formName}이(가) 성공적으로 접수되었습니다. 감사합니다!`);
        form.reset();
      } else {
        alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: "환경보호사업",
      period: "3월 ~ 12월",
      desc: "일회용품 및 플라스틱 사용 증가로 인한 환경 파괴의 심각성을 알리고, 일상생활 속 환경보호 실천 방법을 공유합니다.",
      icon: <Leaf className="w-6 h-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "경로잔치 어울림 한마당",
      period: "5월 (가정의 달)",
      desc: "문화생활 기회가 적은 어르신들에게 정서적 지원을 제공하고 경로효친 사상을 고취합니다.",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "다문화가족 김장 나눔",
      period: "11월 ~ 12월",
      desc: "다문화가정 여성들이 한국의 김장 문화를 체험하고, 직접 담근 김치를 소외된 이웃에게 나누며 보시의 정신을 실천합니다.",
      icon: <Heart className="w-6 h-6 text-red-500" />,
      color: "bg-red-50"
    },
    {
      title: "효(孝) 나눔 봉사단",
      period: "3월 ~ 12월",
      desc: "경로효친 사상을 계승하고, 생활 속 나눔 문화를 정착시키기 위한 봉사단을 운영합니다. (무료 급식 봉사 등)",
      icon: <Users className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50"
    },
    {
      title: "기타 화합 사업",
      period: "연중",
      desc: "산하시설 간 조직력 강화 및 건강한 조직문화 형성을 위한 단합대회 및 연말 송구영신 사업을 진행합니다.",
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-200">
      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Logo url={siteData.logoUrl} name={siteData.companyInfo.name} />
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">재단소개</a>
              <a href="#projects" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">주요사업</a>
              <a href="#gallery" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">활동사진</a>
              <a href="#participate" onClick={() => setActiveFormTab('volunteer')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">자원봉사</a>
              <a href="#participate" onClick={() => setActiveFormTab('donate')} className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">후원안내</a>
              <a href="#participate" onClick={() => setActiveFormTab('donate')} className="bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md inline-block text-center">
                후원하기
              </a>
              
              {/* Admin Controls */}
              <div className="pl-4 border-l border-gray-200 flex items-center gap-3">
                {isAdmin ? (
                  <>
                    <button onClick={() => setShowAdminModal(true)} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      <Settings className="w-4 h-4" /> 관리자
                    </button>
                    <button onClick={() => setIsAdmin(false)} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      <LogOut className="w-4 h-4" /> 로그아웃
                    </button>
                  </>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
                    Admin
                  </button>
                )}
              </div>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-4 border-b">재단소개</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-4 border-b">주요사업</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium p-4 border-b">활동사진</a>
            <a href="#participate" onClick={() => { setMobileMenuOpen(false); setActiveFormTab('volunteer'); }} className="text-lg font-medium p-4 border-b">자원봉사</a>
            <a href="#participate" onClick={() => { setMobileMenuOpen(false); setActiveFormTab('donate'); }} className="text-lg font-medium p-4 border-b">후원안내</a>
            <a href="#participate" onClick={() => { setMobileMenuOpen(false); setActiveFormTab('donate'); }} className="bg-green-600 text-white p-4 rounded-xl text-lg font-semibold mt-4 text-center block">
              후원하기
            </a>
            <div className="pt-4 flex justify-center">
              {isAdmin ? (
                <div className="flex gap-4">
                  <button onClick={() => { setShowAdminModal(true); setMobileMenuOpen(false); }} className="flex items-center gap-1 text-sm font-bold text-blue-600">
                    <Settings className="w-4 h-4" /> 관리자 설정
                  </button>
                  <button onClick={() => { setIsAdmin(false); setMobileMenuOpen(false); }} className="flex items-center gap-1 text-sm font-medium text-gray-500">
                    <LogOut className="w-4 h-4" /> 로그아웃
                  </button>
                </div>
              ) : (
                <button onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }} className="text-sm font-medium text-gray-400">
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-gray-100">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-200/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 text-green-800 text-sm font-semibold tracking-wider mb-6 shadow-sm">
              대한불교천태종복지재단 부산지부
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              다하는 마음 <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">더 밝은 내일</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
              부처님의 자비 사상을 바탕으로, 소외된 이웃과 함께하며 <br className="hidden md:block"/>건강하고 행복한 지역사회 공동체를 만들어갑니다.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#projects" className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                사업 둘러보기
              </a>
              <a href="#participate" onClick={() => setActiveFormTab('volunteer')} className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold rounded-full text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                함께하기 <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">부산지부 중점 사업</h2>
            <p className="text-lg text-gray-600">지역사회와 함께 성장하고 나누는 다양한 복지 사업을 전개합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${project.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {project.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm font-medium text-green-600 mb-4 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {project.period}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {project.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* External Support Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6 w-fit">
                <Utensils className="w-4 h-4" /> 외부 지원 사업
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">사랑의 밥차 운영</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                지역 내 저소득 어르신 및 주민들에게 무료 급식을 제공하여 소외감을 해소하고 실질적인 나눔을 실천합니다. 지역 자원 연계를 통한 복지 네트워크 시스템을 구축하고 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-4xl font-extrabold text-gray-900 mb-1">30<span className="text-xl text-gray-500 font-medium">회</span></p>
                  <p className="text-sm text-gray-500 font-medium">연간 운영 횟수</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-gray-900 mb-1">7,500<span className="text-xl text-gray-500 font-medium">명</span></p>
                  <p className="text-sm text-gray-500 font-medium">연간 지원 대상</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 운영 기간: 3월 ~ 12월
              </p>
            </div>
            <div className="lg:w-1/2 bg-gray-200 relative min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-400 mix-blend-multiply opacity-20 z-10"></div>
              <img 
                src={siteData.supportProjectImage} 
                alt="사랑의 밥차" 
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">함께하는 발자취</h2>
            <p className="text-lg text-gray-600">이웃과 함께 나누며 만들어간 따뜻한 활동의 순간들입니다.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.galleryPhotos.map((photo: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="participate" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">함께 만들어가는 기적</h2>
            <p className="text-lg text-gray-600">
              여러분의 따뜻한 손길이 소외된 이웃에게는 큰 희망이 됩니다.<br className="hidden sm:block"/>
              후원과 자원봉사로 더 밝은 내일을 함께 만들어주세요.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex flex-col sm:flex-row border-b border-gray-100">
              <button 
                onClick={() => setActiveFormTab('donate')}
                className={`flex-1 py-5 text-lg font-bold text-center transition-colors flex items-center justify-center gap-2 ${activeFormTab === 'donate' ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <Heart className="w-5 h-5" /> 정기 후원 신청
              </button>
              <button 
                onClick={() => setActiveFormTab('volunteer')}
                className={`flex-1 py-5 text-lg font-bold text-center transition-colors flex items-center justify-center gap-2 ${activeFormTab === 'volunteer' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
              >
                <Users className="w-5 h-5" /> 자원봉사 신청
              </button>
            </div>

            <div className="p-8 md:p-12">
              {activeFormTab === 'donate' ? (
                <form className="space-y-6" onSubmit={(e) => handleFormSubmit(e, '정기 후원 신청')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">이름 (또는 단체명)</label>
                      <input type="text" name="이름_단체명" placeholder="홍길동" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
                      <input type="tel" name="연락처" placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">월 정기 후원금액</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['10,000원', '30,000원', '50,000원', '직접입력'].map((amount, i) => (
                        <label key={i} className="relative cursor-pointer">
                          <input type="radio" name="후원금액" value={amount} className="peer sr-only" defaultChecked={i === 0} />
                          <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-medium transition-all">
                            {amount}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">결제 수단</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['신용카드', '계좌이체', '휴대폰결제'].map((method, i) => (
                        <label key={i} className="relative cursor-pointer">
                          <input type="radio" name="결제수단" value={method} className="peer sr-only" defaultChecked={i === 0} />
                          <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-medium transition-all">
                            {method}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="개인정보동의" value="동의함" className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" required />
                      <span className="text-sm text-gray-600">개인정보 수집 및 이용에 동의합니다. (필수)</span>
                    </label>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70">
                    {isSubmitting ? '처리 중...' : '정기 후원 신청하기'}
                  </button>
                </form>
              ) : (
                <form className="space-y-6" onSubmit={(e) => handleFormSubmit(e, '자원봉사 신청')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                      <input type="text" name="이름" placeholder="홍길동" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
                      <input type="tel" name="연락처" placeholder="010-0000-0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">희망 봉사 분야</label>
                    <select name="희망봉사분야" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
                      <option value="사랑의 밥차">사랑의 밥차 (무료 급식 지원)</option>
                      <option value="경로잔치">경로잔치 어울림 한마당 지원</option>
                      <option value="김장 나눔">다문화가족 김장 나눔 지원</option>
                      <option value="효 나눔 봉사단">효(孝) 나눔 봉사단 활동</option>
                      <option value="기타">기타 (상담 후 결정)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">참여 가능 요일</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['평일', '주말', '무관'].map((day, i) => (
                        <label key={i} className="relative cursor-pointer">
                          <input type="radio" name="참여가능요일" value={day} className="peer sr-only" defaultChecked={i === 2} />
                          <div className="w-full text-center px-4 py-3 rounded-xl border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-medium transition-all">
                            {day}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">남기실 말씀 (선택)</label>
                    <textarea name="남기실말씀" rows={3} placeholder="봉사 관련 문의사항이나 간단한 소개를 적어주세요." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="개인정보동의" value="동의함" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                      <span className="text-sm text-gray-600">개인정보 수집 및 이용에 동의합니다. (필수)</span>
                    </label>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-70">
                    {isSubmitting ? '처리 중...' : '자원봉사 신청하기'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-2xl inline-flex">
                <img 
                  src={siteData.logoUrl} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-lg tracking-tight text-gray-900 pr-2 leading-tight">
                  {siteData.companyInfo.name.split(' ').map((part: string, i: number) => (
                    <React.Fragment key={i}>
                      {i === 0 ? part : <span className="text-sm text-green-600">{part}</span>}
                      {i === 0 && <br/>}
                    </React.Fragment>
                  ))}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                부처님의 자비 사상을 바탕으로, 소외된 이웃과 함께하며 건강하고 행복한 지역사회 공동체를 만들어갑니다.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">연락처</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <span>{siteData.companyInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>{siteData.companyInfo.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Printer className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>{siteData.companyInfo.fax}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                  <span>{siteData.companyInfo.email}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {siteData.companyInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && <LoginModal onLogin={handleAdminLogin} onClose={() => setShowLoginModal(false)} />}
      {showAdminModal && <AdminModal config={siteData} onSave={handleSaveConfig} onClose={() => setShowAdminModal(false)} onReset={handleResetConfig} />}
    </div>
  );
}
