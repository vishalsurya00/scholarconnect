/**
 * Calculate the number of days remaining until a deadline.
 * Returns 0 if deadline is today or in the past.
 * @param {Date|string} deadlineInput - Deadline date string or object
 * @returns {number} Days remaining (integer >= 0)
 */
const getDaysRemaining = (deadlineInput) => {
  if (!deadlineInput) return 0;
  const deadline = new Date(deadlineInput);
  const today = new Date();
  
  // Strip time part for clean calendar day calculation
  deadline.setHours(23, 59, 59, 999);
  
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

module.exports = {
  getDaysRemaining,
};
