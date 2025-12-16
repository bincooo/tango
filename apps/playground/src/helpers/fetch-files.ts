import ky from 'ky';

const httpClient = ky.create({
  prefixUrl: 'http://127.0.0.1:8080',
  retry: 3,
});

export const readFiles = async () => {
  const result: any = await httpClient.get('tool/file/readFiles').json();
  if (result.code !== 200) {
    throw new Error(result.msg);
  }
  return result.data;
};

export const saveFile = async (filename: string, code: string) => {
  const result: any = await httpClient
    .post('tool/file/saveFile', {
      json: { filename, code },
    })
    .json();
  if (result.code !== 200) {
    throw new Error(result.msg);
  }
};
