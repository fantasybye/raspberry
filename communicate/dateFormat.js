/**
 * Created by 千月 on 2017/4/24.
 */
exports.getNowFormatDate = function () {
  const now = new Date();
  let year = now.getFullYear();
  let month = format(now.getMonth() + 1);
  let date = format(now.getDate());
  let hours = format(now.getHours());
  let minutes = format(now.getMinutes());
  let seconds = format(now.getSeconds());
  return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
}

function format(num) {
  return (num >= 0 && num <= 9)
    ? `0${num}`
    : `${num}`;
}