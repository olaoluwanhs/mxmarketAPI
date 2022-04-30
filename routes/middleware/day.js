// ✅ Check if date is more than 30 days AGO
function isMoreThan30DaysAgo(date) {
  //                   days  hours min  sec  ms
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const timestampThirtyDaysAgo = new Date().getTime() - thirtyDaysInMs;

  if (timestampThirtyDaysAgo > date) {
    console.log("date is more than 30 days into the past");

    return true;
  } else {
    console.log("date is NOT more than 30 days into the past");

    return false;
  }
}

module.exports = { isMoreThan30DaysAgo };
