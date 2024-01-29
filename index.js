const Validator = require("./src/Validator");

const parsed = Validator.set("35111xxxxx").parse();

if (parsed.valid) {
  console.log(parsed);
}
