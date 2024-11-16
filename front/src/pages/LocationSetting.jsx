import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { postMapRange } from '../api/map';
import { Layout } from '../components/element';

const { kakao } = window;

function LocationSetting() {
    // map값 저장해두기   
    const [mapState, setMapState] = useState(null);
    const [mapRange, setMapRange] = useState(0);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const navigate = useNavigate();

    const mutate = useMutation();

    const mapRangeMutation = useMutation(postMapRange,{
        onSuccess: (response) => {
            console.log(response);
        }
    });
    
    const handleSearch = (event) => {
        if (event.key === "Enter") {
          navigate(`/BoardListShop/${searchTerm}`);
        }
      };

    useEffect(()=> {
        const Container = document.getElementById('map');
        // const container = containerRef.current; // Container 변수 참조
        // 사용자 회원가입 시 입력한 주소
        const X = parseFloat(sessionStorage.getItem('userAddressX'));
        const Y = parseFloat(sessionStorage.getItem('userAddressY'));

        console.log(X,Y);

        const options = {
            // 기준 좌표 : 회원가입할 때 받아논 주소 좌표 입력하기
            center: new kakao.maps.LatLng(Y, X),
            level:2
        };
        // 지도 생성
        const map = new kakao.maps.Map(Container, options);
        setMapState(map);

        // 지금 위치 마커 생성
        var markerPosition  = new kakao.maps.LatLng(Y, X); 
        var marker = new kakao.maps.Marker({
            map,
            position: markerPosition
        });
        marker.setMap(map);

         // 마커 클릭 이벤트 리스너 추가
         kakao.maps.event.addListener(marker, 'click', () => {
            navigate(`/BoardListShop/${searchTerm}`); // 원하는 경로로 이동
        });       

        // 지도 위에 주변 동네 원형 영역 표시하기
        var circle = new kakao.maps.Circle({
            center : new kakao.maps.LatLng(Y, X),  // 원의 중심좌표 입니다 
            radius: 100, // 미터 단위의 원의 반지름입니다 
            strokeWeight: 1, // 선의 두께입니다 
            strokeColor: '#75B8FA', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            // strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#CFE7FF', // 채우기 색깔입니다
            fillOpacity: 0.5  // 채우기 불투명도 입니다
        }); 
        // 초기 원형 영역 값
        circle.setMap(map);

        // 내 동네 설정에서 버튼 클릭시 mapLevel조정
        const buttons = document.querySelectorAll('.map-level-button');
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                // 모든 버튼에서 checked 클래스 제거
                buttons.forEach((btn) => {
                    btn.classList.remove('checked');
                });
                // 해당 버튼에만 checked 클래스 추가
                e.target.classList.add('checked');

                const mapLevel = parseInt(button.dataset.level);
                const mapRadius = parseInt(button.dataset.radius);

                map.setLevel(mapLevel);
                circle.setRadius(mapRadius);
                circle.setMap(map);
                // 지도의 영역 범위 보내기
                // console.log(button.dataset.size)
                setMapRange(button.dataset.size)
                mapRangeMutation.mutate(button.dataset.size);
            });
        });

    },[mapRange]);

    // const mapRangeSet = (size) => {
    //     setMapRange(size);
    //     mapRangeMutation.mutate(size);
    // }
  return (
    <Layout>
        {/* 검색 바 */}
        <SearchBar>
            <input 
            type="text"
            placeholder="상점명 입력"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch} // Enter 키 눌렀을 때 검색
            />
        </SearchBar>
        <h1 style={{fontSize:"25px"}}>동네 지도</h1>
        <MapArea>
            <div id='map' style={{width:"100%",height:"500px"}}></div>
        </MapArea>
        <MapController>
            <h2 >범위 설정</h2>
            <p className='mytown'>{sessionStorage.getItem("userAddress3depth")}</p>
            <Controller>
                <p>가까운 동네</p>
                <button 
                    type='button' 
                    id='m500' 
                    className="map-level-button checked" 
                    data-level="3" 
                    data-size="0" 
                    data-radius="250"
                    // onClick={() => mapRangeSet(0)}
                    ></button>
                <button 
                    type='button' 
                    id='m1000' 
                    className="map-level-button" 
                    data-level="4"  
                    data-size="1" 
                    data-radius="500"
                    // onClick={() => mapRangeSet(1)}
                    ></button>
                <button 
                    type='button' 
                    id='m1500' 
                    className="map-level-button" 
                    data-level="5"  
                    data-size="2" 
                    data-radius="750"
                    // onClick={() => mapRangeSet(2)}
                    ></button>
                <button 
                    type='button' 
                    id='m2000' 
                    className="map-level-button" 
                    data-level="6"  
                    data-size="3" 
                    data-radius="1000"
                    // onClick={() => mapRangeSet(3)}
                    ></button>
                <p>먼 동네</p>
            </Controller>
        </MapController>
    </Layout>
  )
}

export default LocationSetting;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 8px;
  width: 90%;
  max-width: 500px; /* 검색 바와 카테고리 섹션의 너비를 같게 설정 */

  input {
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    &:focus {
      border-color: #5ca771;
      box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.2);
    }
    &::placeholder {
      color: #aaa;
      font-size: 14px;
    }
  }
`;

const MapArea = styled.section`
`
const MapController = styled.section`
    & .mytown{
        display:inline-block;
        background-color:#14AD6D;
        margin:0;
        padding:7px 20px;
        color:#fff;
        border-radius:10px;
    }

`
const Controller = styled.section`
    position:relative;
    width:100%;
    height:10px;
    margin:40px 0;
    background-color:#ccc;
    border-radius:10px;
    & p{
        position:absolute;
        top:10px;
    }
    & p:first-of-type{
        left:0;
    }
    & p:last-of-type{
        right:0;
    }
    & button{
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        width:30px;
        height:30px;
        border-radius:18px;
        border:none;
        background-color:#ccc;
        transition:.4s;
    }
    & button.checked{
        width:30px;
        height:30px;
        background-color:#14AD6D;
    }
    & #m500{
        left:0;
    }
    & #m1000{
        left:32%;
    }
    & #m1500{
        left:64%;
    }
    & #m2000{
        right:0;
    }
    
`
