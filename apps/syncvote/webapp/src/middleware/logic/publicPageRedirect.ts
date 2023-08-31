// in Public Page: attempt('/page_url')
// in Login Page, before trigger login: confirm()
// in Home Page: getRedirectUrl()

const PublicPageRedirect = {
  attempt: (url: string) => {
    localStorage.setItem('redirect_url', url);
    localStorage.setItem('redirect_should_redirect', 'false');
    // console.log('set the next attempt to redirect to', url);
  },
  confirm: () => {
    const url = localStorage.getItem('redirect_url');
    if (url !== null && url !== '') {
      localStorage.setItem('redirect_should_redirect', 'true');
    }
  },
  getRedirectUrl: () => {
    const url = localStorage.getItem('redirect_url');
    const condition =
      localStorage.getItem('redirect_should_redirect') === 'true';
    // localStorage.setItem('redirect_url', '');
    // localStorage.setItem('redirect_should_redirect', 'false');
    if (url && condition) {
      // console.log('redirect to', url);
      return url;
    }
    // console.log('do not redirect');
    return false;
  },
};

export default PublicPageRedirect;
