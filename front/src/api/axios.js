import axios from "axios";

// 요청을 보낼 서버를 지정
export const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true, 
});

// request interceptor
instance.interceptors.request.use(
    function (config) {
      const accessToken = sessionStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (accessToken && refreshToken) {
        config.headers['Access_token'] = `${accessToken}`;
        config.headers['Refresh_token'] = `${refreshToken}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
);

const refresh = async (config) => {
    // const expireAt = sessionStorage.getItem('expireAt');
    // let token = sessionStorage.getItem("access_token");
    // console.log('만료확인');

    // if(mockComponent(expireAt).diff(moment()) < 0){
    //     const res = tokenInstance.post('/api/member/logout');
        
    // }
}

