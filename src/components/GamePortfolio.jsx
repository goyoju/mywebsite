import React, { useState, useEffect, useRef } from 'react';
  
// 메인 포트폴리오 컴포넌트
const GamePortfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  // 스크롤 위치에 따라 활성 섹션 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop - 100;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-white">Your Name</div>
          
          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          
          {/* 데스크탑 메뉴 */}
          <ul className="hidden md:flex space-x-8">
            {['home', 'about', 'projects', 'contact'].map((section) => (
              <li key={section}>
                <button
                  onClick={() => scrollToSection(section)}
                  className={`capitalize text-sm hover:text-blue-400 transition-colors ${
                    activeSection === section ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 모바일 메뉴 */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 p-4">
            <ul className="space-y-4">
              {['home', 'about', 'projects', 'contact'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className={`capitalize block w-full text-left py-2 px-4 hover:bg-gray-700 rounded ${
                      activeSection === section ? 'text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* 홈 섹션 */}
      <section id="home" className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">안녕하세요, <br className="md:hidden" />개발자입니다</h1>
          <p className="text-xl text-gray-400 mb-8">프론트엔드 개발자 & UI/UX 디자이너</p>
          
          <div className="flex justify-center space-x-4 mb-10">
            <button 
              onClick={() => scrollToSection('projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              프로젝트 보기
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-6 py-3 rounded-md transition-colors"
            >
              연락하기
            </button>
          </div>
        </div>
      </section>

      {/* 어바웃 섹션 */}
      <section id="about" className="py-24 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">ABOUT</h2>
          <div className="w-16 h-1 bg-blue-500 mb-8"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-4">
                저는 사용자 중심의 디자인과 깔끔한 코드를 작성하는 것을 좋아하는 프론트엔드 개발자입니다. 
                웹 기술에 대한 열정과 지속적인 학습 의지를 가지고 있습니다.
              </p>
              <p className="text-gray-300 mb-4">
                현재 React, Next.js, TypeScript를 주로 사용하며, UI/UX 디자인에도 관심이 많습니다.
                사용자 경험을 향상시키는 직관적인 인터페이스를 만들기 위해 노력합니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">기술 스택</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">프론트엔드</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>HTML & CSS</li>
                    <li>JavaScript (ES6+)</li>
                    <li>React.js</li>
                    <li>Next.js</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-400 mb-2">도구 & 기타</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>Git & GitHub</li>
                    <li>Figma</li>
                    <li>VS Code</li>
                    <li>RESTful API</li>
                    <li>Node.js</li>
                    <li>Firebase</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section id="projects" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">PROJECTS</h2>
          <div className="w-16 h-1 bg-blue-500 mb-8"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 프로젝트 카드 1 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-lg text-gray-400">프로젝트 이미지</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">포트폴리오 웹사이트</h3>
                <p className="text-gray-400 mb-4">React와 Tailwind CSS를 사용하여 개발한 개인 포트폴리오 사이트입니다.</p>
                <div className="flex flex-wrap text-xs gap-2 mb-4">
                  <span className="bg-gray-700 px-2 py-1 rounded">React</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">Tailwind</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">Responsive</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="text-blue-400 hover:text-blue-300">Demo</a>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Code</a>
                </div>
              </div>
            </div>
            
            {/* 프로젝트 카드 2 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-lg text-gray-400">프로젝트 이미지</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">할 일 관리 앱</h3>
                <p className="text-gray-400 mb-4">React와 Firebase를 활용한 간단한 할 일 관리 애플리케이션입니다.</p>
                <div className="flex flex-wrap text-xs gap-2 mb-4">
                  <span className="bg-gray-700 px-2 py-1 rounded">React</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">Firebase</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">Auth</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="text-blue-400 hover:text-blue-300">Demo</a>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Code</a>
                </div>
              </div>
            </div>
            
            {/* 프로젝트 카드 3 */}
            <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-lg text-gray-400">프로젝트 이미지</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">날씨 앱</h3>
                <p className="text-gray-400 mb-4">Weather API를 사용한 날씨 정보 제공 애플리케이션입니다.</p>
                <div className="flex flex-wrap text-xs gap-2 mb-4">
                  <span className="bg-gray-700 px-2 py-1 rounded">React</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">API</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">Styled Components</span>
                </div>
                <div className="flex space-x-3">
                  <a href="#" className="text-blue-400 hover:text-blue-300">Demo</a>
                  <a href="#" className="text-blue-400 hover:text-blue-300">Code</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 섹션 */}
      <section id="contact" className="py-24 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">CONTACT</h2>
          <div className="w-16 h-1 bg-blue-500 mb-8"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 mb-6">
                프로젝트 협업이나 질문이 있으시면 언제든지 연락해 주세요.
                이메일이나 소셜 미디어를 통해 연락 가능합니다.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-300">
                  <span className="mr-3">📧</span>
                  <span>your.email@example.com</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-3">📱</span>
                  <span>010-1234-5678</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="mr-3">📍</span>
                  <span>서울, 대한민국</span>
                </li>
              </ul>
              
              <div className="mt-8 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  GitHub
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">이름</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">이메일</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">메시지</label>
                  <textarea 
                    id="message"
                    rows="4"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  보내기
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GamePortfolio;