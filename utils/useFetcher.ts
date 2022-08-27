import NProgress from 'nprogress';

function useFetcher() {
  return async (url: string) => {
    NProgress.start();

    const res = await fetch(url);

    const json = await res.json();

    NProgress.done();

    return json;
  };
}

export default useFetcher;
