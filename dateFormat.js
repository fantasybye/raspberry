/**
 * Created by 千月 on 2017/4/24.
 */
exports.getNowFormatDate = function () {
  const date = new Date();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  return `${date.getFullYear()}-${month}-${strDate}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
