# Scraper Microservice for `Sekizkirk`

## Query Format and Its Response

This service returns the data for courses and sections for given request.

Accepts `GET` to the `/`, `query` should formed as:

```
/q?<course_id>=<section>&<course_id>=<section>...
```
Any number of course-section pairs can be given, example:
```
/q?5710111=1&5710213=2
```

Returns a JSON response as:

```
[
    <response_for_course_1>,
    <response_for_course_2>,
    ...
]
```

where `response_for_course_n` is defined as
```
[<actual_section>, <slots>, <title>]
```
where `actual_section` is the real section number, not the index,
`slots` is the slot data of the section, day and hour indexed format,
`title` is the title of the course such as `CENG111`, `MATH119`


## Behavior

Scraper periodically scrapes data from OIBS.
This period can be given as `--period` flag, with a default of 1 week.
It updates the file `data.json` in its cache folder.
If there is a change in course slots data, it sends a request to `notify` service.

