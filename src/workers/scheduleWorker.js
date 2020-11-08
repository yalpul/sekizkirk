onmessage = (e) => {
    const {
        allowCollision,
        slotsData,
        candidateCourseSections,
        dontFills,
    } = e.data;

    const schedules = findPossibleSchedules(
        candidateCourseSections,
        allowCollision,
        slotsData,
        dontFills
    );

    postMessage(schedules);
};

const findPossibleSchedules = (
    candidateCourseSections,
    allowCollision,
    slotsData,
    dontFills
) => {
    const validSchedules = [];
    const possibleSchedule = [];
    let lookup = {};

    function modifyLookUp([course, sectionID], action) {
        if (allowCollision[course.code] === true) {
            // course allowed to have collisions,
            // don't modifiy the lookup(allow collisions)
            return;
        }

        const section = slotsData[course.code][sectionID];
        const [, sectionSlots] = section;
        sectionSlots.forEach((slot) => {
            const [day, hour] = slot;
            if (action === "update") {
                lookup[[day, hour]] = 1;
            } else if (action === "delete") {
                delete lookup[[day, hour]];
            }
        });
    }

    function checkCollision(section) {
        possibleSchedule.push([...section]);

        const [course, sectionID] = section;
        const slots = slotsData[course.code][sectionID];
        const [, sectionSlots] = slots;

        // don't fill have the hightes priority,
        // check it first
        for (let slot of sectionSlots) {
            const [day, hour] = slot;

            if (dontFills[hour][day] === true) {
                // slot is on don't fill area
                return false;
            }
        }

        // this course is allowed to have collisions
        // don't check collisions
        if (allowCollision[course.code] === true) {
            return true;
        }

        for (let slot of sectionSlots) {
            const [day, hour] = slot;

            // collison of slots occured
            if (lookup[[day, hour]] === 1) {
                return false;
            }
        }

        // no collisions occured
        return true;
    }

    (function runner(candidateCourseSections) {
        // base case, combination is a valid schedule, save it to the state
        if (candidateCourseSections.length === 0) {
            // sort schedule for consistent hash value
            const sortedPossibleSchedule = [...possibleSchedule];
            sortedPossibleSchedule.sort((a, b) => {
                return parseInt(a[0].code) - parseInt(b[0].code);
            });

            validSchedules.push([...sortedPossibleSchedule]);
            return;
        }

        let courseSections = candidateCourseSections[0];

        if (courseSections.length === 0) {
            // current course lack slots information,
            runner(candidateCourseSections.slice(1));
        }

        courseSections.forEach((section) => {
            if (checkCollision(section)) {
                modifyLookUp(section, "update");
                runner(candidateCourseSections.slice(1));
                modifyLookUp(section, "delete");
            }
            possibleSchedule.pop();
        });
    })(candidateCourseSections);

    return validSchedules;
};
