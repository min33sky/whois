import { message } from 'antd';
import axios from 'axios';
import { API_HOST } from './../constant';

/**
 * @typedef {object} ResponseObj 응답 객체
 * @property {boolean} isSuccess 성공 여부
 * @property {object} data 응답 데이터
 * @property {number} resultCode 응답 코드
 * @property {string} resultMessage 응답 메시지
 */
// ? JSDOC에서 =표시는 optional 표시
/**
 * API 호출 함수
 *
 * @param {object} param 요청에 필요한 데이터
 * @param {'get' | 'post' =} param.method 요청 메소드
 * @param {string} param.url API 주소
 * @param {object=} param.params 쿼리 파라미터
 * @param {object=} param.data POST 요청 시 보낼 데이터
 *
 * @returns {Promise<ResponseObj>} 응답 객체
 */
export function callApi({ method = 'get', url, params, data }) {
  return axios({
    url,
    method,
    baseURL: API_HOST,
    params,
    data,
    withCredentials: true,
  }).then(response => {
    const { resultCode, resultMessage, totalCount } = response.data;

    if (resultCode < 0) {
      message.error(resultMessage);
    }

    return {
      isSuccess: resultCode === ResultCode.Success,
      data: response.data.data,
      resultCode,
      resultMessage,
      totalCount,
    };
  });
}

// 응답 코드
export const ResultCode = {
  Success: 0,
  Fail: -1,
};
