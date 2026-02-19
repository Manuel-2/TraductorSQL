class Analyzer {
  static analyzeLexicaly(lines) {
    let identifiers = [];
    let constants = [];
    let constantsValueCounter = 400;
    let identifiersValueCounter = 300;

    lines.forEach((line, lineIndex) => {
      let tokens = line.match(/'[^']*'|\d+|[A-Za-z_]\w*/g) || [];

      const stringRegex = /^'[^']*'$/;
      const numberRegex = /^\d+$/;

      tokens.forEach(token => {
        let tokenLower = token.toLowerCase();

        if (stringRegex.test(token) || numberRegex.test(token)) {
          constantsValueCounter++;
          constants.push({
            token: token,
            value: constantsValueCounter,
            line: lineIndex + 1,
          });
        }
        else if (!keywords[tokenLower]) {
          identifiersValueCounter++;
          identifiers.push({
            token: token,
            value: identifiersValueCounter,
            line: lineIndex + 1,
          });
        }
      });
    });


    let a = {
      status: "Correct",
      message: "Lexicamente Correcto :)",
      data: { 
        identifiers,
        constants
      }
    }
    return [identifiers, constants];
  }
}
