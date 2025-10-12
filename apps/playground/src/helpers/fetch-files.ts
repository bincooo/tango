export const readFiles = async () => {
  const resp = await fetch('http://127.0.0.1:8080/tool/file/readFiles');
  if (!resp.ok) {
    throw new Error('请求失败');
  }

  const result = await resp.json();
  if (result.code !== 200) {
    throw new Error(result.msg);
  }

  return result.data;
};
