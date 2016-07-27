const googleHandler = new (function() {

	this.loadSdk = () => {
        const apiUrl = 'https://apis.google.com/js/platform.js?onload=onLoadCallback';
        let script = document.createElement('script');
        let async = script.setAttribute('async', "true");
        let defer = script.setAttribute('defer', "true");
        let src = script.setAttribute('src', apiUrl)
        document.body.insertBefore(script, document.querySelector('[name=react]'))
	}

    this.init = () => {

        gapi.load('auth2', function() {
            let auth2 = gapi.auth2.init({
                client_id: '449144847900-bs5snfnipj05suk3djrjcge5o5atrnr5.apps.googleusercontent.com'
                // fetch_basic_profile: true,
                // scope: 'profile'
            });
            console.log('auth2', auth2);

          // Sign the user in, and then retrieve their ID.
          auth2.signIn().then(function() {
              console.log('ekhm');
            console.log(auth2.currentUser.get().getId());
          });

        });



    }

    this.test = () => {

    }


	this.checkUserConnection = () => {

	}

	this.login = () => new Promise((resolve, reject) => {

    })


});

export default googleHandler;
