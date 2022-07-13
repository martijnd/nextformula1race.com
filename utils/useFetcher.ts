// @ts-ignore
const useFetcher = () => (...args) => fetch(...args).then((res) => res.json());

export default useFetcher;
