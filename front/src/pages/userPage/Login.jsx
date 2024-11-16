import React, { useState } from 'react'
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SlArrowLeft } from "react-icons/sl";
import {CommonButton, Flx, Input, IntroLayout } from '../../components/element';
import { userLogin } from '../../api/users';
import { useMutation } from 'react-query';

function Login() {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        userId:'',
        password:''
    });

    const onChangeInputHandler = (e) => {
        setInput({...input, [e.target.id]: e.target.value})
    };

    const mutation = useMutation(userLogin, {
        onSuccess: (response) => {
            localStorage.setItem("refresh_token", response.headers['access_token']);
            sessionStorage.setItem("access_token", response.headers['refresh_token']);
            sessionStorage.setItem("userId", response.data.data.userId);
            sessionStorage.setItem("usernickname", response.data.data.nickname);
            sessionStorage.setItem("userAddress1depth", response.data.data.address.region1depthName);
            sessionStorage.setItem("userAddress2depth", response.data.data.address.region2depthName);
            sessionStorage.setItem("userAddress3depth", response.data.data.address.region3depthName);
            sessionStorage.setItem("userAddressX", response.data.data.address.x);
            sessionStorage.setItem("userAddressY", response.data.data.address.y);
            
            navigate("/BoardList");
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // 로그인 버튼 클릭 이벤트핸들러
    const onSubmitLoginHandler = (e) => {
        e.preventDefault()
        const userInfo = {
            userId:input.userId,
            password:input.password
        };
        mutation.mutate(userInfo);
        setInput({userId:'',password:''});
    };
    
  return (
    <IntroLayout>
        <Backbutton type='button' onClick={() => navigate(-1)}><SlArrowLeft /></Backbutton>
        <h1 style={{marginTop:"40px",marginBottom:"0px"}}>로그인</h1>
        <StForm onSubmit={onSubmitLoginHandler}>
            <div>
                <Flx>
                    <label htmlFor='userId'>아이디</label>
                    <Input type="text" value={input.id} id='userId' onChange={onChangeInputHandler}/>
                </Flx>
                
                <Flx>
                    <label htmlFor='password'>패스워드</label>
                    <Input type="password" value={input.pw} id='password' onChange={onChangeInputHandler}/>
                </Flx>
            </div>
        
            <CommonButton size='large'>로그인</CommonButton>
        </StForm>
    </IntroLayout>
  )
}

export default Login;

const Backbutton = styled.button`
    position:relative;
    top:20px;
    left:0;
    border:none;
    background-color:transparent;
    font-size:22px;
    color:#777;
`
const StForm = styled.form`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:calc(100vh - 220px);
    padding-top:30px;

    & label{
        display:inline-block;
        width:65px;
        line-height:43px;
        font-weight:500;
    }
    & input{
        display:inline-block;
        width:calc(100% - 65px);
        margin-bottom:15px;
    }
`

