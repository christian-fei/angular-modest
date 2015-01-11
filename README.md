angular-modest
==============

[![Circle CI](https://circleci.com/gh/christian-fei/angular-modest.svg?style=shield)](https://circleci.com/gh/christian-fei/angular-modest)
![Coverage](https://rawgit.com/christian-fei/angular-modest/master/coverage.svg)

Modest Angular module for handling nested REST resources.

With great 'inspiration' from:
- [Angular Resource](https://github.com/angular/bower-angular-resource)
- [Angular nested resource](https://github.com/roypeled/angular-nested-resource)









# Installation

TBA










# Module components

Requires the `modest` module to be installed

# Factory

## `Resource`

A factory that gives you the ability to create RESTful resources mapped to a JavaScript object.

**Supports deeply nested resources.**


## API

### Constructor

`new Resource(url, defaultParams)`

Returns an instance of `Resource`

#### Arguments

|       Param         |       Type       |                  Description                                                   |
|:--------------------|:-----------------|:-------------------------------------------------------------------------------|
| url                 | string           | A parametrized URL template with parameters prefixed by : as in /user/:username|
| defaultParams (opt) | Object | int     | Default values for the parametrized URL template.                              |

## Instance methods

### getResourceUrl

`resource.getResourceUrl()`

Returns the resource url for the current instance


### getResourceFor

`resource.getResourceFor(params)`

Returns an instance of the nested `Resource`

#### Arguments

|       Param         |       Type       |                  Description                                                   |
|:--------------------|:-----------------|:-------------------------------------------------------------------------------|
| params              | Object           | Default values for the parametrized URL template.                              |


### get

`resource.get(params)`

Return an $http object to interact with, making a request to the desired resource.

|       Param         |       Type       |                  Description                                                   |
|:--------------------|:-----------------|:-------------------------------------------------------------------------------|
| params              | Object           | Default values for the parametrized URL template.                              |





## Examples

See the `tests` for more detailed information and use cases.

```javascript
var user = new Resource( '/users/:userId' );
expect( user.getResourceUrl() ).to.equal( '/users/:userId' );

var user = new Resource( '/users/:userId', {userId:1} );
expect( user.getResourceUrl() ).to.equal( '/users/1' );

var user = new Resource( '/users/:userId', {userId:1} );
user.get() // returns $http with GET request made to /users/1

var user = new Resource( '/users/:userId' );
user.get({userId:2}) // returns $http with GET request made to /users/2
user.get(2) // returns $http with GET request made to /users/2


var userBooks = new Resource( '/users/:userId/books/:bookId' );
userBooks.get({userId:1,bookId:1}); // returns $http with GET request made to /users/1/books/1

var users = new Resource( '/users/:userId' );
users.get() // returns $http with GET request made to /users/ 



// nested resources
var user1 = new Resource( '/users/:userId/books/:bookId', {userId:1} );
user1.get({bookId:1}); // returns $http with GET request made to /users/1/books/1
user1.books.get({bookId:1}); // returns $http with GET request made to /users/1/books/1
user1.books.get(1); // returns $http with GET request made to /users/1/books/1

```







# How to contribute

To setup the environment

```
npm install
bower install

......

npm test
```

The best way to get your changes merged back into core is as follows:

1. Clone down your fork
2. Create a thoughtfully named topic branch to contain your change
3. Hack away
4. Add tests and make sure everything still passes by running `npm test`
5. If you are adding new functionality, document it in the README
6. Do not change the version number, we will do that on our end
7. If necessary, rebase your commits into logical chunks, without errors
8. Push the branch up to GitHub
9. Send a pull request for your branch
