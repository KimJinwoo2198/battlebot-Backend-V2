import { BattlebotUserFlags } from "@/interfaces/users.interface";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export function checkUserFlag(base: number, required: number | keyof typeof BattlebotUserFlags):boolean {
	return checkFlag(base, typeof required === 'number' ? required : BattlebotUserFlags[required])
}

function checkFlag(base: number, required: number) {
	return (base & required) === required
}

export function generateRandomNumber(n: number) {
  let str = ''
  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10)
  }
  return str
}
export function DateTime(time: string|Date) {
  const dt = new Date(time)
  return dt.getFullYear() + "년 " + (dt.getMonth() + 1) + "월 " + dt.getDate()  + "일 "
}