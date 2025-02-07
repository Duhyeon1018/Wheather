// src/components/header/FortuneRecommendation.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentWeatherQuery } from '../../services/WeatherApi.js';
import { FortuneModal } from './FortuneModal';

/* ───────────────────────
 * 1. 띠(12간지) 정보
 * ─────────────────────── */
const zodiacTraits = {
  '쥐': {
    personality: '영리하고 빠른 판단력, 사교적, 기회 포착 능력',
    fortune: '금전 감각이 뛰어나지만 변동성이 있음. 인간관계가 넓지만 스트레스 관리 필요',
  },
  '소': {
    personality: '성실하고 인내심 강함, 고집 셈, 신뢰받는 성격',
    fortune: '안정적인 재물운, 느리지만 꾸준히 성장. 건강은 지나친 피로 주의',
  },
  '호랑이': {
    personality: '용맹하고 리더십 강함, 도전적, 감정 기복 있음',
    fortune: '도전적인 기질로 재물운 기복이 있음. 직업적 성공 가능성이 크지만 대인관계 충돌 주의',
  },
  '토끼': {
    personality: '온화하고 배려심 깊음, 예술적 감각, 조용하지만 지혜로움',
    fortune: '재물운은 안정적이지만 소극적일 수 있음. 인간관계가 원만하지만 지나친 배려로 손해 볼 가능성 있음',
  },
  '용': {
    personality: '카리스마 있고 야망이 큼, 자신감 넘침',
    fortune: '재물운이 크지만 기복이 심함. 리더십 강하지만 독선적 태도 조심',
  },
  '뱀': {
    personality: '직관력 뛰어남, 신비로운 분위기, 분석적 사고',
    fortune: '투자 감각이 뛰어나지만 대인관계에서 오해를 받을 수 있음. 건강은 신경계 질환 주의',
  },
  '말': {
    personality: '자유롭고 활동적, 독립심 강함, 충동적',
    fortune: '재물운은 좋지만 관리가 필요함. 건강운은 좋지만 과로 주의',
  },
  '양': {
    personality: '온화하고 감성적, 예술적 기질, 조용한 성향',
    fortune: '재물운은 안정적이지만 기회가 적을 수 있음. 인간관계가 원만하지만 감정 기복 주의',
  },
  '원숭이': {
    personality: '영리하고 유머러스함, 창의적, 재치 있음',
    fortune: '재물운이 좋지만 변동성이 큼. 대인관계에서 신뢰를 얻는 것이 중요',
  },
  '닭': {
    personality: '꼼꼼하고 계획적, 완벽주의 성향',
    fortune: '철저한 계획으로 재물운이 좋음. 다만 너무 예민한 태도는 인간관계에서 마이너스가 될 수 있음',
  },
  '개': {
    personality: '충성심 강하고 정의로움, 신의가 있음',
    fortune: '재물운은 중간 수준이지만 인간관계에서 신뢰를 얻어 성공 가능성이 큼',
  },
  '돼지': {
    personality: '솔직하고 관대함, 낙천적',
    fortune: '돈을 잘 벌지만 쉽게 소비하는 경향. 건강운은 좋지만 지나친 방심 주의',
  },
};

/* ───────────────────────
 * 2. MBTI 정보
 * ─────────────────────── */
const mbtiInfo = {
  ENTP: {
    trait: '창의적, 말재주 좋음, 즉흥적',
    fortune: '기발한 아이디어로 직업적 성공 가능성이 높음. 연애에서는 자유로운 스타일이지만 장기적 관계 유지가 어려울 수 있음',
  },
  ENTJ: {
    trait: '리더십 강함, 야망이 큼, 목표 지향적',
    fortune: '강한 추진력으로 직업운이 좋지만, 대인관계에서 지나친 독단성을 주의하세요',
  },
  ENFP: {
    trait: '감성적, 에너지가 넘침, 창의적',
    fortune: '자유로운 환경에서 성공 가능성이 큼. 연애운이 강하지만 변덕스러울 수 있음',
  },
  ENFJ: {
    trait: '사교적, 타인 배려 잘함, 카리스마 있음',
    fortune: '타인을 돕는 일에서 직업적 성취 가능. 연애에서는 헌신적이지만 부담을 주지 않도록 유의하세요',
  },
  ESTP: {
    trait: '현실적, 즉흥적, 활동적',
    fortune: '실전 감각이 뛰어나 재물운이 좋지만 충동적 지출에 주의해야 합니다',
  },
  ESTJ: {
    trait: '조직적, 현실주의자, 신뢰받는 리더',
    fortune: '철저한 계획으로 안정적인 직업운이 있으나 융통성이 부족할 수 있습니다',
  },
  ESFP: {
    trait: '사교적, 감각적, 즉흥적',
    fortune: '즐거운 분위기를 잘 이끄는 성격으로, 엔터테인먼트·예술 분야에서 두각을 나타낼 수 있습니다',
  },
  ESFJ: {
    trait: '친절하고 배려심 많음, 감성적',
    fortune: '인간관계를 중시하며, 서비스업·교육업에서 크게 빛을 발할 수 있습니다',
  },
  INTP: {
    trait: '논리적, 독창적, 내성적',
    fortune: '연구나 학문적인 분야에 적합하며, 연애에서는 감정 표현을 더 신경 써 보세요',
  },
  INTJ: {
    trait: '전략적, 독립적, 목표 지향적',
    fortune: '장기적 관점에서 계획을 세우면 성공 확률이 높습니다. 감정적 교류를 간과하지 마세요',
  },
  INFP: {
    trait: '감성적, 이상주의적, 내면적 성찰',
    fortune: '예술적 감각이 뛰어나며 창작 분야에서 성공 가능성. 현실적인 금전 관리가 필요합니다',
  },
  INFJ: {
    trait: '직관적, 이상주의적, 신비로운 분위기',
    fortune: '사람들에게 영감과 도움을 주지만, 내면적 갈등에 빠지지 않도록 주의하세요',
  },
  ISTP: {
    trait: '분석적, 독립적, 실용적',
    fortune: '공학·기술 분야에서 두각을 나타내며, 상황 해결 능력이 뛰어납니다',
  },
  ISTJ: {
    trait: '책임감 강함, 신중함, 현실적',
    fortune: '안정적인 직업과 재물운을 기대할 수 있으나, 지나친 원칙주의에 빠지지 않도록 주의하세요',
  },
  ISFP: {
    trait: '감각적, 조용하지만 개성이 강함',
    fortune: '예술 감각이 탁월하고 자유로운 환경에서 잠재력을 극대화할 수 있습니다',
  },
  ISFJ: {
    trait: '조용하지만 헌신적, 책임감 강함',
    fortune: '사람들과의 신뢰를 기반으로 일에서 높은 성취감을 얻을 수 있습니다',
  },
};

/* ───────────────────────
 * 3. 연애운 (6가지)
 * ─────────────────────── */
const loveFortuneList = [
  {
    label: '💖 최고의 연애운',
    message: '오늘은 사랑 에너지가 최고조! 싱글이라면 운명적인 만남이, 연애 중이라면 더욱 깊어진 관계를 기대해 보세요.',
  },
  {
    label: '💓 관계 발전 기회',
    message: '연인과 한 걸음 더 가까워질 수 있는 순간이 다가옵니다. 서로 솔직한 대화를 나눠보는 건 어떨까요?',
  },
  {
    label: '💛 평범한 연애운',
    message: '크게 좋지도 나쁘지도 않은, 평온한 연애운이에요. 편안한 마음으로 사람들을 대하면 좋은 인연이 이어질 수 있어요.',
  },
  {
    label: '💔 불안정한 연애운',
    message: '감정 기복이나 오해가 생길 수 있으니, 부드러운 대화로 풀어나가는 노력이 필요합니다.',
  },
  {
    label: '💙 혼자만의 시간 추천',
    message: '자신을 먼저 돌봐야 할 때! 사랑도 좋지만, 오늘은 스스로를 챙기는 일이 우선입니다.',
  },
  {
    label: '🖤 이별 & 거리두기',
    message: '갈등이 깊어질 수 있는 시기입니다. 이성적인 대화가 중요하며, 상황에 따라 잠시 거리를 두는 것도 방법입니다.',
  },
];

/* ───────────────────────
 * 4. 재물운 (6가지)
 * ─────────────────────── */
const moneyFortuneList = [
  {
    label: '💰 최고의 재물운',
    message: '갑작스러운 수익 상승이나 좋은 기회가 찾아올 수 있어요. 적극적으로 움직여 보면 어떨까요?',
  },
  {
    label: '📈 안정적인 재물운',
    message: '오르지도 내리지도 않는, 무난한 흐름이에요. 차근차근 저축하며 재정적인 안전망을 쌓기 좋아요.',
  },
  {
    label: '🏦 저축 & 계획 추천',
    message: '오늘은 수입을 늘리기보다는 미래 대비 계획에 집중해 보세요. 작은 절약 습관이 큰 도움이 됩니다.',
  },
  {
    label: '💸 지출 증가 주의',
    message: '충동 구매나 예상치 못한 비용이 생길 수 있어요. 한번 더 신중하게 생각해 보는 게 좋아요!',
  },
  {
    label: '⚠️ 위험한 투자 주의',
    message: '투자나 지출에 실패 확률이 높으니 무리한 시도는 금물! 꼼꼼한 계획을 세우세요.',
  },
  {
    label: '🚨 큰 손실 위험',
    message: '사기나 과소비 같은 커다란 금전 낭비 가능성이 보입니다. 중요한 결정은 잠시 미루는 편이 안전해요.',
  },
];

/* ───────────────────────
 * 5. 날씨 한글 변환
 * ─────────────────────── */
const weatherKor = {
  clear: '맑음',
  clouds: '구름',
  rain: '비',
  snow: '눈',
  thunderstorm: '천둥번개',
  mist: '안개',
  default: '기타',
};

/* ───────────────────────
 * 6. 날씨 영향 정보
 * ─────────────────────── */
const weatherInfluence = {
  clear: {
    text: '화창한 하늘이 기분까지 밝게 만들어 주는 하루예요.',
    energy: '활기차고 창조적인',
    advice: '새로운 도전을 시작하거나 목표를 세워 보시는 건 어떨까요? 자신감이 샘솟을 거예요!',
  },
  clouds: {
    text: '구름 낀 날씨가 오히려 차분한 집중력을 선사합니다.',
    energy: '침착하고 신중한',
    advice: '복잡한 고민을 정리하고, 내면에 몰입해 보는 시간을 가져보세요.',
  },
  rain: {
    text: '비 내리는 풍경이 세상을 차분하게 적셔 주는 날입니다.',
    energy: '감성적이고 직관적인',
    advice: '가벼운 감정 정리가 필요하다면 차 한 잔과 함께 여유를 즐겨보세요.',
  },
  snow: {
    text: '눈이 내려 세상이 고요해지는 분위기예요.',
    energy: '차분하고 결단력 있는',
    advice: '새로운 계획을 세우거나 집중이 필요한 작업을 하기에 좋은 날입니다.',
  },
  thunderstorm: {
    text: '천둥번개로 다이내믹한 에너지가 감도는 날이네요.',
    energy: '역동적이고 강한 추진력',
    advice: '위험도 있지만 기회도 많습니다. 과감한 도전 전에 꼭 신중한 판단을 해보세요.',
  },
  mist: {
    text: '안개가 가득해 시야가 흐릿하지만, 상상력은 풍부해집니다.',
    energy: '신비롭고 탐구적인',
    advice: '여러 가능성을 열어두고, 직관적인 결정을 내리는 것도 나쁘지 않아요.',
  },
  default: {
    text: '날씨 상태가 조화롭게 유지되고 있습니다.',
    energy: '안정적이고 조화로운',
    advice: '평온한 분위기 속에서 꾸준히 노력하면 좋은 결과가 있을 거예요.',
  },
};

/* ───────────────────────
 * 7. 컴포넌트 시작
 * ─────────────────────── */
export default function FortuneRecommendation({ onClose }) {
  // 위치, 날씨 API 정보
  const { lat, lng } = useSelector((state) => state.geolocation.geolocation);
  const { data: weatherData, isSuccess } = useGetCurrentWeatherQuery({ lat, lng });

  // 로그인 사용자 정보 (auth.user)
  const currentUser = useSelector((state) => state.auth.user);

  // 컴포넌트 상태
  const [fortune, setFortune] = useState('');
  const [error, setError] = useState('');
  const [showFortuneModal, setShowFortuneModal] = useState(false);

  /* ─────────────────────
   * 띠 계산 함수
   * ───────────────────── */
  const getZodiacAnimal = (year) => {
    const zodiacAnimals = [
      '원숭이', '닭', '개', '돼지', '쥐',
      '소', '호랑이', '토끼', '용', '뱀',
      '말', '양',
    ];
    const baseYear = 2016; // 원숭이띠 기준
    const index = (year - baseYear) % 12;
    return zodiacAnimals[(index + 12) % 12];
  };

  /* ─────────────────────
   * 유효성 검사
   * ───────────────────── */
  const validateUserData = useCallback(() => {
    if (!currentUser) {
      setError('사용자 정보가 존재하지 않습니다.');
      return false;
    }
    if (!currentUser.mbti || !currentUser.birthdate || !currentUser.gender) {
      setError('필요한 사용자 정보(mbti, birthdate, gender)가 부족합니다.');
      return false;
    }
    const birth = new Date(currentUser.birthdate);
    if (isNaN(birth.getTime())) {
      setError('사용자 생년월일 정보가 올바르지 않습니다.');
      return false;
    }
    return true;
  }, [currentUser]);

  /* ─────────────────────
   * 연애운·재물운 랜덤 선택 함수
   * ───────────────────── */
  const getRandomLoveFortune = () => {
    const randomIndex = Math.floor(Math.random() * loveFortuneList.length);
    return loveFortuneList[randomIndex];
  };

  const getRandomMoneyFortune = () => {
    const randomIndex = Math.floor(Math.random() * moneyFortuneList.length);
    return moneyFortuneList[randomIndex];
  };

  /* ─────────────────────
   * 운세 계산 함수
   * (하나의 문단으로 통합해 말투를 부드럽게)
   * ───────────────────── */
  const calculateFortune = useCallback(() => {
    if (!validateUserData() || !isSuccess || !weatherData) return;

    try {
      const birthDate = new Date(currentUser.birthdate);
      const birthYear = birthDate.getFullYear();
      const zodiac = getZodiacAnimal(birthYear);                // 띠
      const mbtiKey = (currentUser.mbti || '').toUpperCase();   // MBTI

      // 띠 정보 찾기
      const zodiacData = zodiacTraits[zodiac] || {
        personality: '정보 없음',
        fortune: '데이터가 없습니다.',
      };

      // MBTI 정보 찾기
      const mbtiData = mbtiInfo[mbtiKey] || {
        trait: '정보 없음',
        fortune: '알 수 없는 유형입니다.',
      };

      // 날씨 정보
      const weatherMainEn = weatherData.weather[0].main.toLowerCase();  // 예: "clear"
      const weatherMainKor = weatherKor[weatherMainEn] || weatherKor.default;  // 한글 변환
      const weatherObj = weatherInfluence[weatherMainEn] || weatherInfluence.default;
      const temp = Math.round(weatherData.main.temp);

      // 시간대
      const currentHour = new Date().getHours();
      const timeOfDay =
        currentHour >= 5 && currentHour < 12
          ? '아침'
          : currentHour >= 12 && currentHour < 18
            ? '오후'
            : currentHour >= 18 && currentHour < 22
              ? '저녁'
              : '밤';

      // 연애운 / 재물운 랜덤 선정
      const todayLove = getRandomLoveFortune();
      const todayMoney = getRandomMoneyFortune();

      // 부드러운 말투의 최종 운세 문구
      const fortuneText = `
[${new Date().toLocaleDateString()} ${timeOfDay}]

오늘은 '${zodiac}'띠 특유의 “${zodiacData.personality}”의 면모가 더욱 활약할 것 같아요. 
MBTI: ${currentUser.mbti}(${mbtiData.trait}) 성향도 함께 작용해서, 
당신의 하루에 톡톡 튀는 에너지를 선사할 전망입니다. 

날씨는 '${weatherMainKor}'(약 ${temp}℃)로, ${weatherObj.text} 
덕분에 '${weatherObj.energy}' 기운이 감돌고 있네요. 
"${weatherObj.advice}" 

연애운: ${todayLove.label}  
"${todayLove.message}" 

재물운: ${todayMoney.label}  
"${todayMoney.message}" 

그리고 ${mbtiData.fortune} 
또한, '${zodiacData.fortune}'에 대해 참고하시면 
오늘 하루에 더욱 알찬 선택을 하실 수 있을 듯합니다.

행동 하나하나에 배려와 자신감을 담아보세요. 
당신의 하루가 더욱 반짝이길 응원합니다!
`;

      setFortune(fortuneText.trim());
      setShowFortuneModal(true);
    } catch (err) {
      console.error('운세 계산 중 오류 발생:', err);
      setError('운세 계산 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }, [currentUser, isSuccess, weatherData, validateUserData]);

  // currentUser 변경 시 자동 실행
  useEffect(() => {
    if (currentUser) {
      calculateFortune();
    }
  }, [currentUser, calculateFortune]);

  // 모달 닫기
  const handleFortuneModalClose = () => {
    setShowFortuneModal(false);
    onClose();
  };

  // 렌더링
  return (
    <div className="fixed inset-0 z-50">
      {showFortuneModal && fortune && (
        <FortuneModal fortune={fortune} onClose={handleFortuneModalClose} />
      )}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded text-black">
            <p className="mb-4">{error}</p>
            <button
              onClick={onClose}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
