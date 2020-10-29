import fs from 'fs';

function imgToBase64(filePath: string): string {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'base64');
  }
  return '';
}

// eslint-disable-next-line import/prefer-default-export
export { imgToBase64 };
