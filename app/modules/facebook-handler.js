var facebookHandler = new function() {

	this.loadSdk = function(){
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = 'http://connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
	}

    this.init = function(){
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '141443656045564', // need to change for state
                cookie     : true,
                xfbml      : true,
                version    : 'v2.0'
            });
        };
    }

	this.checkUserConnection = function(){
		FB.api('/me', response => console.log(response));
	}

	this.login = function(){
		return new Promise(function(resolve, reject){
			FB.login(function(response){

				if (response.status === 'connected' || response.status === "unknown") {
					resolve({logged: true, response: response})
				} else if (response.status === 'not_authorized') {
					console.log('not_authorized', response.status)
					reject({logged: false})
				} else {
					console.log('please log into fb')
					reject({logged: false})
				}
			});
		})
	}


}

module.exports = facebookHandler;
