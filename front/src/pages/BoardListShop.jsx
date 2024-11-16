import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Image, StatusButton } from '../components/element';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getBoards } from '../api/boards';

function BoardListShop() {
  const [boardData, setBoardData] = useState([]);
  const { shopName } = useParams(); // URL 파라미터로 상점명 가져오기
  const navigate = useNavigate();

  // 페이지가 마운트될 때 게시글 리스트를 조회하도록 설정
  useEffect(() => {
    getBoardList();
  }, [shopName]); // shopName이 변경될 때마다 다시 조회

  // 게시글 리스트 조회
  const getBoardList = () => {
    const setPage = {
      page: 0,
      size: 100,
      sort: ["createdAt,DESC"],
    };
    getBoardListMutation.mutate(setPage);
  };

  // 게시글 리스트 조회 useMutation
  const getBoardListMutation = useMutation(getBoards, {
    onSuccess: (response) => {
      // 상점명(shopName)과 일치하는 게시글만 필터링
      const filteredData = response.filter((board) => board.nickname === shopName);
      setBoardData(filteredData);
    },
  });

  // 상세 페이지로 이동
  const setPageChange = (boardId) => {
    navigate(`/BoardDetail/${boardId}`);
  };

  return (
    <Layout>
      <Title>{shopName}의 상품 목록</Title>

      {/* 게시물 리스트 섹션 */}
      <ListSection>
        {boardData.map((board) => (
          <ListOneDiv onClick={() => setPageChange(board.id)} key={board.id}>
            <Image
              width="130px"
              height="130px"
              borderradius="10px"
              src={board.image}
              alt="상품 이미지"
            />
            <ListInfoDiv>
              <ListTitleH1>{board.title}</ListTitleH1>
              <ListDetailH3>
                <span>{board.nickname}</span> {/* 상점명(사장님의 닉네임) */}
              </ListDetailH3>
              <ListPriceH2>
                {board.status && <StatusButton color="black">거래완료</StatusButton>}
                {Number(board.price).toLocaleString()}원
              </ListPriceH2>
            </ListInfoDiv>
          </ListOneDiv>
        ))}
      </ListSection>
    </Layout>
  );
}

export default BoardListShop;

// 스타일 정의
const Title = styled.h1`
  text-align: center;
  margin: 20px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const ListOneDiv = styled.div`
  padding: 15px 5px;
  display: flex;
  border-bottom: 1px solid lightgrey;
  cursor: pointer;
`;

const ListInfoDiv = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ListTitleH1 = styled.h1`
  font-size: 18px;
  font-weight: 500;
  margin: 0;
`;

const ListPriceH2 = styled.h2`
  margin: 0;
  & span {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
`;

const ListDetailH3 = styled.h3`
  margin: 10px 0 7px 0;
  font-size: 15px;
  font-weight: 300;
  color: grey;
`;
