// App.info({
//   name: 'MyApp',
//   description: 'This is a navigation app for Brandeis University',
//   version: '0.0.1'
// });
// App.icons({
//   'iphone': 'resources/icons/icon-1.jpg',
//   'iphone_2x': 'resources/icons/icon-1.jpg'
// });
// App.launchScreens({
//   'iphone': 'resources/splash/icon-1.jpg',
//   'iphone_2x': 'resources/splash/icon-1.jpg',
//   'iphone5': 'resources/splash/icon-1.jpg'
// });

App.accessRule('http://leiner.cs-i.brandeis.edu:4200/*');
App.accessRule('localhost:3000/*');
App.accessRule('*.google.com');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');