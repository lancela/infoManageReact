const baseURL = 'http://134.175.154.93:8099';
const pageSize = 6;
function parseDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return year + '-' + formatNum(month) + '-' + formatNum(day) + ' ' + formatNum(hours) + ':' + formatNum(minutes) + ':' + formatNum(seconds);
}
function formatNum(num) {
  return num > 10 ? num : ('0' + num);
}
export default {
  baseURL,
  pageSize,
  parseDate
}
