export default function urlParser(url: string) {
  return url
    .slice(1)
    .split('&')
    .reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      return { ...acc, [key]: value };
    }, {});
}
