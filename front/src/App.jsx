// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main, Login, SignUp, MyPage, Intro, BoardList, BoardListShop, Search, BoardDetail, BoardWrite, 
        LocationSetting, SignUpChoice, SignUpCustomer, Settings, MyPageCustomer, ReserveNotice } from './pages/index';
import { RecoilRoot } from 'recoil';
import $ from 'jquery';

const queryClient = new QueryClient();

function MapComponent() {
  const mapElement = useRef(null);
  const [markerList, setMarkerList] = useState([]);
  const [infowindowList, setInfowindowList] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [searchMarker, setSearchMarker] = useState(null);

  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);

    const data = [
      {
        title: "서울",
        content: "서울 충무로 대한극장",
        date: "2024-11-10",
        lat: 37.561206,
        lng: 126.994780
      },
      {
        title: "서울",
        content: "서울 충무로 매일경제",
        date: "2024-11-10",
        lat: 37.561532,
        lng: 126.993272
      },
      {
        title: "서울",
        content: "서울 충무로 동국대학교 정보문화관",
        date: "2024-11-10",
        lat: 37.559571,
        lng: 126.998624
      },
      {
        title: "서울",
        content: "서울 충무로 동국대학교 cj인재원",
        date: "2024-11-10",
        lat: 37.559286,
        lng: 126.995225
      }
    ];

    data.forEach((target) => {
      const latlng = new naver.maps.LatLng(target.lat, target.lng);
      const marker = new naver.maps.Marker({
        map: map,
        position: latlng,
        icon: {
          content: "<div class='marker'></div>",
          anchor: new naver.maps.Point(12, 12)
        }
      });

      const context = `<div class='infowindow_wrap'>
        <div class='infowindow_title'>${target.content}</div>
        <div class='infowindow_date'>${target.date}</div>
      </div>`;

      const infowindow = new naver.maps.InfoWindow({
        content: context,
        backgroundColor: "#00ff0000",
        borderColor: "#00ff0000",
        anchorSize: new naver.maps.Size(0, 0)
      });

      naver.maps.Event.addListener(marker, "click", () => {
        closeAllInfowindows();
        if (infowindow.getMap()) {
          infowindow.close();
        } else {
          infowindow.open(map, marker);
        }
      });

      setMarkerList((prev) => [...prev, marker]);
      setInfowindowList((prev) => [...prev, infowindow]);
    });

    function closeAllInfowindows() {
      infowindowList.forEach((infowindow) => infowindow.close());
    }

    $("#current").click(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const latlng = new naver.maps.LatLng(lat, lng);

          if (currentMarker) {
            currentMarker.setMap(null);
          }

          const newMarker = new naver.maps.Marker({
            map: map,
            position: latlng,
            icon: {
              content:
                '<img class="pulse" draggable="false" unselectable="on" src="https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png">',
              anchor: new naver.maps.Point(11, 11)
            }
          });

          setCurrentMarker(newMarker);
          map.setLevel(3);
          map.panTo(latlng);
        });
      } else {
        alert("위치정보 사용 불가능");
      }
    });

    let ps = new kakao.maps.services.Places();

    function searchLocation() {
      let content = $("#search_input").val();
      ps.keywordSearch(content, placeSearchCB);
    }

    $("#search_input").on("keydown", function (e) {
      if (e.keyCode === 13) {
        searchLocation();
      }
    });

    $("#search_button").on("click", function () {
      searchLocation();
    });

    function placeSearchCB(data, status) {
      if (status === kakao.maps.services.Status.OK) {
        let target = data[0];
        const lat = target.y;
        const lng = target.x;
        const latlng = new naver.maps.LatLng(lat, lng);

        if (searchMarker) {
          searchMarker.setMap(null);
        }

        const newSearchMarker = new naver.maps.Marker({
          position: latlng,
          map: map
        });

        setSearchMarker(newSearchMarker);
        map.setLevel(3);
        map.panTo(latlng);
      } else {
        alert("검색결과가 없습니다.");
      }
    }
  }, []);

  return (
    <div>
      <div id="navbar">지도검색서비스</div>
      <div id="infoBox">
        <div id="infoTitle">현재날짜</div>
        <div id="infoContent">2024.11.10</div>
      </div>
      <div id="search">
        <input id="search_input" placeholder="목적지를 입력해주세요" />
        <button id="search_button">검색</button>
      </div>
      <div id="current">현재 위치</div>
      <div id="map" ref={mapElement} style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyPageCustomer" element={<MyPageCustomer />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignUpChoice" element={<SignUpChoice />} />
          <Route path="/SignUpCustomer" element={<SignUpCustomer />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/BoardList" element={<BoardList />} />
          <Route path="/BoardListShop" element={<BoardListShop />} />
          <Route path="/LocationSetting" element={<LocationSetting />} />
          <Route path="/BoardDetail/:id" element={<BoardDetail />} />
          <Route path="/BoardWrite" element={<BoardWrite />} />
          <Route path="/ReserveNotice" element={<ReserveNotice />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;