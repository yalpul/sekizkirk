# HTML Mail Render Microservice for `Sekizkirk`

This service returns rendered html string to be used in emails for given request.

Accepts `POST` to the `/`, `post body` should formed as:

```JSON
{
  "data": [
    {
      "name":"<displayNameForSlot>",
      "slot": {"hourInex" : <indexOfTheHour>, "dayIndex: <indexOfTheDay>},
      "courseIndex": <indexOftheCourse>
    },
    ....
  ]
}
```

Returns a JSON response as:

```JSON
{
  "data": "<Rendered HTML string in minified form>"
}
```
