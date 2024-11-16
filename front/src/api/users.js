import axios from 'axios';
import { instance } from './axios';

// 회원가입
export const userSignup = (userInfo) => {
    return instance.post('/api/member/signup', userInfo)
    .then((response) => {
        alert('회원가입 성공');
        return response;
    })
    .catch((error) => {
        alert(error.response.data.responseMessage)
        // throw error;
    })
};
// 아이디 중복 조회
export const getIdChk = (userId) => {
    return instance.get(`/api/member/checkId?id=${userId}`)
    .then((response) => {
        if(response.status === 200){
            alert('사용할 수 있는 아이디입니다.')
        }
        return response;
    })
    .catch((error) => {
        if(error.response.status === 409){
            alert('이미 가입한 아이디 입니다.')
        }
        return error;
    })
}

// 주소 유효성 확인
export const getAddressChk = (region1depthName,region2depthName,region3depthName) => {
    return instance.post(`api/map/address`,{
        'region1depthName':region1depthName,
        'region2depthName':region2depthName,
        'region3depthName':region3depthName
    })
    .then((response) => {
        if(response.status === 200){
            alert('유효한 주소입니다.')
        }
        return response;
    })
    .catch((error) => {
        if(error.response.status === 404){
            alert('유효하지 않은 주소입니다.')
        }
    })
}
  
// 로그인
export const userLogin = (userInfo) => {
    return instance.post('/api/member/login', userInfo)
    .then((response) => {
        console.log(response);
        return response;
    })
    .catch((error) => {
        alert(error.response.data.responseMessage)
        // throw error;
    })
};

// 로그아웃
export const userLogout = () => {
    return instance.get('/api/member/logout')
    .then((response) => {
        localStorage.clear();
        sessionStorage.clear();
        alert('로그아웃 성공')
        return response;
    })
    .catch((error) => {
        alert(error.response.data.responseMessage)
        // throw error;
    })
};




