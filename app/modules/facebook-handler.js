const facebookHandler = new (function() {

	this.loadSdk = () => {
        (((d, s, id) => {
            let js;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s);js.id = id;
            js.src = 'http://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk'));
	}

    this.init = () => {
        window.fbAsyncInit = () => {
            FB.init({
                appId      : '141443656045564', // need to change for state
                cookie     : true,
                xfbml      : true,
                version    : 'v2.0'
            });
        };
    }

	this.checkUserConnection = () => {
		FB.api('/me', response => console.log(response));
	}

	this.login = () => new Promise((resolve, reject) => {
        FB.login(response => {

            if (response.status === 'connected' || response.status === "unknown") {
                resolve({logged: true, response})
            } else if (response.status === 'not_authorized') {
                console.log('not_authorized', response.status)
                reject({logged: false})
            } else {
                console.log('please log into fb')
                reject({logged: false})
            }
        });
    })


});

export default facebookHandler;
