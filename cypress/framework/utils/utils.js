
/**
 * Generate random number
 * @param {*} min 
 * @param {*} max 
 */
export const random_num = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}