import axios from 'axios';
import { instance, tokenInstance } from './axios';

// * 게시글 작성
export const submitBoard = (boardFormData) => {
  return instance.post(`/api/board`, boardFormData)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 게시글 리스트 조회
export const getBoards = (setPage) => {
  return instance.get(`/api/board?page=${setPage.page}&size=${setPage.size}&sort=${setPage.sort[0]}`)
  .then((response) => {
    console.log('axois', response.data.data.responseDtos)
    return response.data.data.responseDtos;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 게시글 상세 조회
export const getBoardDetail = (currentBoardId) => {
  return instance.get(`/api/board/${currentBoardId}`)
  .then((response) => {
    return response.data.data;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 게시글 수정
export const setEditBoard = (boardEditData) => {
  const { boardId, ...editData } = boardEditData;
  return instance.put(`/api/board/${boardId}`, editData)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 게시글 삭제
export const setDeleteBoard = (currentBoardId) => {
  return instance.delete(`/api/board/${currentBoardId}`)
  // TODO 실패 시 http status 코드에 따라 다른 alert msg 띄우기
  .then((response) => {
    return response;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 게시글 찜하기
export const setLikeStatus = (currentBoardId) => {
  return instance.post(`/api/like/${currentBoardId}`)
  .then((response) => {
    return response.data.responseMessage;
  })
  .catch((error) => {
    console.error(error.response.data);
  })
}

// * 내 게시글 조회
export const getMyBoard = () => {
    return instance.get('/api/myBoard')
    .then((response) => {
        // console.log(response)
        return response.data.data;
    })
    .catch((error) => {
        console.log(error)
        // return error;
    })
};

// 마이페이지 : 찜목록 조회
export const getMylikeBoard = () => {
    return instance.get('/api/like')
    .then((response) => {
        // console.log(response);
        return response.data.data;
    })
    .catch((error) => {
        console.log(error);
    })
};

// 상세페이지 이동
export const getDetailBoard = ({boardId, access_token}) => {
    return instance.get(`/api/board/${boardId}`)
    .then((response) => {
        // console.log(response);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
    })
};

// 마이페이지 : 거래 완료
export const putBoardSoldout = (boardId) => {
    return instance.put(`/api/board/sell/${boardId}`)
    .then((response) => {
        console.log('거래완료 요청 실행');
        return response;
    })
    .catch((error) => {
        console.log(error);
    })
};

// 마이페이지 : 게시글 삭제
export const deleteBoard = (boardId) => {
    return instance.delete(`/api/board/${boardId}`)
    .then((response) => {
        // console.log(response);
        return response.data;
    })
    .catch((error) => {
        console.log(error);
    })
};