
const Enum = require("enum");

const payment_type = Object.freeze({
    once:"التبرع لمرة واحدة",
    month: "اقتطاع شهري",
    yearly: "اقتطاع سنوي",
  });

exports.payment_type = payment_type;
