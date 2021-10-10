/**
* Gets the position description of a rectangle given two opposite corner
* points. This position description is used to style a rectangle div's
* properties of top, left, width, height
* @param {*} p0
* @param {*} p1
* @param {*} bounds
* @returns {Object} Position containing x, y, width, height
*/
export const twoPointsToPosition = (p0, p1) => {
 // Ensure positions are within the given bounds
 const p0Bounded = {
   x: Math.min(Math.max(p0.x, 0), 100),
   y: Math.min(Math.max(p0.y, 0), 100),
 };
 const p1Bounded = {
   x: Math.min(Math.max(p1.x, 0), 100),
   y: Math.min(Math.max(p1.y, 0), 100),
 };

 return {
   x: Math.min(p0Bounded.x, p1Bounded.x),
   y: Math.min(p0Bounded.y, p1Bounded.y),
   width: Math.abs(p1Bounded.x - p0Bounded.x),
   height: Math.abs(p1Bounded.y - p0Bounded.y),
 };
};