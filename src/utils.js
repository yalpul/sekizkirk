import sha1 from "sha1";

export function scheduleHash(schedule) {
    const inputString = JSON.stringify(schedule);
    return sha1(inputString);
}

export function findCandidateCourseSections(
    courses,
    courseSlots
    // sectionChecks
) {
    const candidateCourseSections = [];
    courses.forEach((course, courseIndex) => {
        // each course has its own array of sections
        const sections = courseSlots[course.code];
        candidateCourseSections[courseIndex] = sections
            .map((section, sectionIndex) => {
                const [, sectionSlots, constraints] = section;

                if (sectionSlots.length === 0) {
                    // slots data not avaliable
                    return null;
                }
                //  else if (
                //     sectionChecks[course.code] &&
                //     sectionChecks[course.code][sectionIndex] === false
                // ) {
                //     // this section omitted by the user
                //     return null;
                // } else if (deptCheck && dept !== null) {
                //     //  dept constraint applied
                //     try {
                //         const [[deptConstraint]] = constraints;
                //         if (
                //             deptConstraint !== "ALL" &&
                //             deptConstraint !== dept.title
                //         ) {
                //             return null;
                //         }
                //     } catch (err) {
                //         // constraint data not avaliable
                //         // don't apply to this section.
                //         // TODO: change this behavior?
                //     }
                // } else if (surnameCheck && firstTwoLetters.length === 2) {
                //     // surname constraint applied
                //     try {
                //         const [[_, surStart, surEnd]] = constraints;
                //         const letters = firstTwoLetters.toUpperCase();
                //         if (!(surStart <= letters && letters <= surEnd)) {
                //             return null;
                //         }
                //     } catch (err) {
                //         // constraint data not avaliable
                //         // don't apply to this section.
                //         // TODO: change this behavior?
                //     }
                // }
                return [course, sectionIndex];
            })
            .filter((slots) => slots !== null);
    });
    // sort courses as their section number, ascending order
    candidateCourseSections.sort((a, b) => a.length - b.length);

    return candidateCourseSections;
}
