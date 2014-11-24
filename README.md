A example server using formidable to upload files.

##End Point

###/upload

`POST`

upload file to this end point with `POST` method and content-type of `multipart/form-data`

respond a json object contains file url. e.g.
```json
{
    "url": "http://example.com/file/hash-123456asdfghjkl"
}
```

###/simple/upload

`PUT`

upload file to this end point with `PUT` method. no other format requirement.

respond a json object contains file url. e.g.
```json
{
    "url": "http://example.com/file/hash-123456asdfghjkl"
}
```

###/file/:filename

`GET`

respond a file with given filename.

##Page:

###/

upload a file through web page

###/list

browse uploaded files.