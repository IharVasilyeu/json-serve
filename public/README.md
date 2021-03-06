# Main Info 
When doing requests, it's good to know that:

- If you make POST, PUT, PATCH or DELETE requests, changes will be automatically and safely saved to `db.json` using [lowdb](https://github.com/typicode/lowdb).
- Your request body JSON should be object enclosed, just like the GET output. (for example `{"name": "Foobar"}`)
- Id values are not mutable. Any `id` value in the body of your PUT or PATCH request will be ignored. Only a value set in a POST request will be respected, but only if not already taken.
- A POST, PUT or PATCH request should include a `Content-Type: application/json` header to use the JSON in the request body. Otherwise it will return a 2XX status code, but without changes being made to the data. 

## Entities

- Users - [/users](/users) or [user object](/users/1)
- Tasks - [/tasks](/tasks) or [task object](/tasks/1)
- Reviews requests - [/reviewRequest](/reviewRequest) or [reviewRequest object](/reviewRequest/1) (if there is nothing on id 1, try another)
- Cross check sessions - [/crossCheckSessions](/crossCheckSessions) or [crossCheckSessions object](/crossCheckSessions/1) (if there is nothing on id 1, try another)
- Reviews - [/reviews](/reviews) or [review object](/reviews/1) (if there is nothing on id 1, try another)
- Disputes - [/disputes](/disputes) or [dispute object](/disputes/1) (if there is nothing on id 1, try another)

### Query Example

#### Note 
##### Use URL parameters to build more complex and rational queries. They are described below example requests.

#### GET
```
fetch(`https://x-check-json-server.herokuapp.com/users/your-github-name`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(res => res.json())
    .then(result => console.log(result))
    .catch(err => console.log(err))

Response: {roles: Array(2), id: "your-github-name"}
```

#### POST
```
fetch(`https://x-check-json-server.herokuapp.com/users`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: "your-github-name",
        roles: ["author", "student", "supervisor", "course_manager"]
    })
})
    .then(res => res.json())
    .then(result => console.log(result))
    .catch(err => console.log(err))

Response: {id: "your-github-name", roles: Array(4)} 
```

#### PUT
```
fetch(`https://x-check-json-server.herokuapp.com/users/your-github-name`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        roles: ["author", "student"]
    })
})
    .then(res => res.json())
    .then(result => console.log(result))
    .catch(err => console.log(err))

Response: {roles: Array(2), id: "your-github-name"}
```

#### DELETE
```
fetch(`https://x-check-json-server.herokuapp.com/users/your-github-name`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(res => res.json())
    .then(result => console.log(result))
    .catch(err => console.log(err))

Response: {}. If try GET https://x-check-json-server.herokuapp.com/users/your-github-name, then you get 404 not found
```

## Routes

Based on the previous `db.json` file, here are all the default routes. You can also add [other routes](#add-custom-routes) using `--routes`.

### Plural routes

```
GET    /posts
GET    /posts/1
POST   /posts
PUT    /posts/1
PATCH  /posts/1
DELETE /posts/1
```

### Singular routes

```
GET    /profile
POST   /profile
PUT    /profile
PATCH  /profile
```

### Filter

Use `.` to access deep properties

```
GET /posts?title=json-server&author=typicode
GET /posts?id=1&id=2
GET /comments?author.name=typicode
```

### Paginate

Use `_page` and optionally `_limit` to paginate returned data.

In the `Link` header you'll get `first`, `prev`, `next` and `last` links.


```
GET /posts?_page=7
GET /posts?_page=7&_limit=20
```

_10 items are returned by default_

### Sort

Add `_sort` and `_order` (ascending order by default)

```
GET /posts?_sort=views&_order=asc
GET /posts/1/comments?_sort=votes&_order=asc
```

For multiple fields, use the following format:

```
GET /posts?_sort=user,views&_order=desc,asc
```

### Slice

Add `_start` and `_end` or `_limit` (an `X-Total-Count` header is included in the response)

```
GET /posts?_start=20&_end=30
GET /posts/1/comments?_start=20&_end=30
GET /posts/1/comments?_start=20&_limit=10
```

_Works exactly as [Array.slice](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) (i.e. `_start` is inclusive and `_end` exclusive)_

### Operators

Add `_gte` or `_lte` for getting a range

```
GET /posts?views_gte=10&views_lte=20
```

Add `_ne` to exclude a value

```
GET /posts?id_ne=1
```

Add `_like` to filter (RegExp supported)

```
GET /posts?title_like=server
```

### Full-text search

Add `q`

```
GET /posts?q=internet
```

### Relationships

To include children resources, add `_embed`

```
GET /posts?_embed=comments
GET /posts/1?_embed=comments
```

To include parent resource, add `_expand`

```
GET /comments?_expand=post
GET /comments/1?_expand=post
```

To get or create nested resources (by default one level, [add custom routes](#add-custom-routes) for more)

```
GET  /posts/1/comments
POST /posts/1/comments
```

### Database

```
GET /db
```

### Homepage

Returns default index file or serves `./public` directory

```
GET /
```