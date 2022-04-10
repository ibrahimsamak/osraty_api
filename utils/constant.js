
const Enum = require("enum");

/**
 * Enumeration of supported donation payment types
 * (one-time, monthly deduction, yearly deduction).
 * @readonly
 * @enum {string}
 */
const payment_type = Object.freeze({
    once:"التبرع لمرة واحدة",
    month: "اقتطاع شهري",
    yearly: "اقتطاع سنوي",
  });

exports.payment_type = payment_type;
