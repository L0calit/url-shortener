URL Shortener Microservice
=========================

 I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
 
 If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
 
 When I visit that shortened URL, it will redirect me to my original link.

Example for creation : 
-------------------------

https://url-shortener-project.glitch.me//new/https://www.google.com

https://url-shortener-project.glitch.me//new/http://foo.com:80

# Output :
{ "original_url":"http://foo.com:80", "short_url":"https://url-shortener-project.glitch.me/8170" }

Example usage : 
-------------------------

https://url-shortener-project.glitch.me/2871