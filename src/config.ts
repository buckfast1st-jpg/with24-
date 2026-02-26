// 홈페이지 관리자용 설정 파일
// 이 파일의 내용만 수정하면 웹사이트의 이미지와 텍스트가 자동으로 변경됩니다.

export const siteConfig = {
  // 1. 로고 이미지 설정
  // 구글 드라이브 링크나 이미지 호스팅 주소를 여기에 넣으세요.
  logoUrl: "https://drive.google.com/uc?export=view&id=0B8PILBr0jXq2bW5ROS1UQTdRb0U&resourcekey=0-VTKSFfOfFqes8TUoVOZVXw",
  
  // 2. 외부 지원 사업 (사랑의 밥차 등) 이미지
  supportProjectImage: "https://images.unsplash.com/photo-1593113514676-5f8004f1f256?auto=format&fit=crop&q=80&w=1000",

  // 3. 활동사진 갤러리 설정
  // 새로운 사진을 추가하거나 기존 사진을 변경하려면 아래 목록을 수정하세요.
  // url: 이미지 주소, title: 사진에 마우스를 올렸을 때 나타나는 제목
  galleryPhotos: [
    { 
      url: "https://images.unsplash.com/photo-1593113514676-5f8004f1f256?auto=format&fit=crop&q=80&w=800", 
      title: "사랑의 밥차 봉사활동" 
    },
    { 
      url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800", 
      title: "어르신 경로잔치" 
    },
    { 
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", 
      title: "환경보호 캠페인" 
    },
    { 
      url: "https://images.unsplash.com/photo-1583224964978-225ddb3ea43f?auto=format&fit=crop&q=80&w=800", 
      title: "다문화가족 김장 나눔" 
    },
    { 
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800", 
      title: "효 나눔 봉사단" 
    },
    { 
      url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", 
      title: "산하시설 단합대회" 
    }
  ]
};
