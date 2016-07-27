const googleHandler = new (function() {

	this.auth2 = {}

	this.loadSdk = () => {
        const apiUrl = 'https://apis.google.com/js/platform.js';
        let script = document.createElement('script');
        let async = script.setAttribute('async', "true");
        let defer = script.setAttribute('defer', "true");
        let src = script.setAttribute('src', apiUrl)
        document.body.insertBefore(script, document.querySelector('[name=react]'))
	}

	this.init = () => new Promise((resolve, reject) => {
		let self = this;

		gapi.load('auth2', () => {
			const auth2 = gapi.auth2.init({
				client_id: '449144847900-bs5snfnipj05suk3djrjcge5o5atrnr5.apps.googleusercontent.com',
				fetch_basic_profile: true,
				scope: 'profile email'
			});

			self.auth2 = auth2
			resolve()
		});
	});

	this.login = () =>	new Promise((resolve, reject) => {
		let self = this;
		self.auth2.signIn({
			fetch_basic_profile: true,
			scope: 'profile email'
		}).then((response) => {
			resolve({logged: true, response: response})
		})
	});
});

export default googleHandler;
