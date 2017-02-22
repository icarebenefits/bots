/**
 * Function compare number with custom operators
 * @param {Number} number1
 * @param {String} operator - operator to compare
 * @param {Number} number2
 * @return {Boolean} result when compare number1 with number2
 */

export const compareNumber = (number1, operator, number2) => {
  switch (operator) {
    case 'eq': {
      return {result: number1 === number2};
    }
    case 'lt': {
      return {result: number1 < number2};
    }
    default: {
      return {message: 'Unsupported operator'};
    }
  }
};

/**
 * Function use to compare the condition of a specific type
 * @param {String} condition -
 */
// export default compare = ({conditions, type, operator}) => {
//
// };