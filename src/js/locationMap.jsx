import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KakaoMap from './kakaoMap';
import '../css/LocationScreen.css';

// 기본
const LocationMap = (props) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();
  const effectRan = useRef(false); 
  const [kakaoId, setKakaoId] = useState('');
  const [name, setName] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));

  const { onSetUserInfo, onSetTrainNumber } = props;

  // 로그아웃
  const Logout = () => {
    const kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout?client_id=ce1dc31ea67a76ebff209bb8dff8992e&logout_redirect_uri=http://15.164.219.39:8079/oauth/logout";
    window.location.href = kakaoLogoutUrl;
  };

  useEffect(() => {
    // kakaoId, userName 추출
    if (effectRan.current) return; 
    let url = new URL(window.location.href).searchParams;
    const id = url.get("kakaoId");
    const userName = url.get("userName");

    // 로그인 후 redirect 화면일때 
    if (id && userName) {
      setKakaoId(id);
      setName(userName);
      onSetUserInfo(id, userName);

      console.log("로그인 성공");
      console.log("아이디 : " + id + " 이름 : " + userName);
      
    } else if (user) {
      // 세션 상태 확인
      setKakaoId(user.userId);
      setName(user.userName);
      onSetUserInfo(user.userId, user.userName);
      console.log("아이디 : " + user.userId + " 이름 : " + user.userName);

    }else {
      // 유저 정보가 없으면 로그인 페이지로 리디렉션
      navigate('/login');
    }

    effectRan.current = true;

  }, [onSetUserInfo, user, navigate]);

  return (
    <div className="container">
      {/* 메뉴 스크린 생성 */}
      <div className="menu-container">
        <div className="menu-screen">
          <h1 className="menu-title" style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>GreenBoogie</h1>
          {user && user.userName ? (
            <h2 className="menu-id" style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>{user.userName} 님</h2>
          ) : null}
          <button className="menu-button" onClick={() => navigate('/trainMap')} style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>실시간탑승정보</button>
          <button className="menu-button" onClick={() => navigate('/riding')} style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>승차정보</button>
          <button className="menu-button" onClick={() => navigate('/yolo')} style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }}>사진정보</button>
          <button className="menu-button" style={{ fontFamily: 'IBM Plex Sans KR, sans-serif' }} onClick={Logout}>로그아웃</button>
        </div>
      </div>

      {/* 카카오맵 생성 */}
      <KakaoMap onSetTrainNumber={onSetTrainNumber} mapRef={mapRef} markerRef={markerRef} userName={name} userId={kakaoId}></KakaoMap>
    </div>
  );
};

export default LocationMap;
