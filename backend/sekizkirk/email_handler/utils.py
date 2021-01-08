from django.core.validators import validate_email


def form_validator(data):
    """
    Raises exceptions if form data is not valid.
    If valid return, fields.
    """
    mail_addr = data["email"]
    schedule = data["schedule"]
    notify = data["notify"]

    # raises exception for caller if email is not valid
    validate_email(mail_addr)

    # notify should be boolean type
    assert type(notify) == bool

    # schedule should be dict
    assert type(schedule) == dict

    for key, val in schedule.items():
        assert type(key) == str
        assert len(key) == 7
        assert type(val) == int

        for ch in key:
            assert ch.isdigit() == True

    return (mail_addr, schedule, notify)