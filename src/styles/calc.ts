interface VariableMap {
  [key: string]: number;
}

export class CalcExpression {
  
  private expression = '';
  private currentIndex: number = 0;
  private variables: VariableMap = {};

  constructor(expression: string, initialVariables: VariableMap = {}) {
    this.expression = expression.trim();
    this.expression = this.expression.replace(/%/g, " * (p / 100)");
    this.expression = this.expression.replace(/vw/g, " * (vw / 100)");
    this.expression = this.expression.replace(/vh/g, " * (vh / 100)");
    if (this.expression.startsWith('calc(')) {
      this.expression = this.expression.substring(5, this.expression.length - 1);
    }
    this.variables = { ...initialVariables };
    this.resolveInnerCalc();
  }

  private resolveInnerCalc() {
    if (this.expression.indexOf('calc') >= 0) {
      this.expression.match(/calc\([^\c)]*\)/g)?.map(m => {
        this.expression = this.expression.replace(m, new CalcExpression(m, this.variables).evaluate() + "");
      })
    }
  }
  
  private peek(): string | null {
    if (this.currentIndex < this.expression.length) {
      return this.expression[this.currentIndex];
    }
    return null;
  }

  private consume(): string | null {
    const char = this.peek();
    if (char !== null) {
      this.currentIndex++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (this.peek() !== null && /\s/.test(this.peek()!)) {
      this.consume();
    }
  }

  private parseNumber(): number {
    let numberStr = "";
    let decimalSeen = false;
    while (this.peek() !== null && (/\d/.test(this.peek()!) || (this.peek() === "." && !decimalSeen))) {
      if (this.peek() === ".") {
        decimalSeen = true;
      }
      numberStr += this.consume();
    }
    if (this.peek() === 'p') {
      this.consume();
      this.consume();
    }
    if (numberStr.length === 0) {
      throw new Error(`Expected a number but found: ${this.peek()}`);
    }
    return parseFloat(numberStr);
  }

  private parseVariable(): number {
    let variableName = "";
    while (this.peek() !== null && /[a-zA-Z0-9_]/.test(this.peek()!) && (variableName.length > 0 || /[a-zA-Z_]/.test(this.peek()!))) {
      variableName += this.consume();
    }
    if (variableName.length === 0) {
      throw new Error(`Expected a variable but found: ${this.peek()}`);
    }
    if (!(variableName in this.variables)) {
      throw new Error(`Undefined variable: ${variableName}`);
    }
    return this.variables[variableName];
  }

  private parseFactor(): number {
    this.skipWhitespace();
    const char = this.peek();

    if (char === "(") {
      this.consume();
      const result = this.parseExpression();
      this.skipWhitespace();
      if (this.consume() !== ")") {
        throw new Error("Expected ')'");
      }
      return result;
    } else if (char === "-") {
      this.consume();
      return -this.parseFactor();
    } else if (/\d/.test(char!)) {
      return this.parseNumber();
    } else if (/[a-zA-Z_]/.test(char!)) {
      return this.parseVariable();
    }

    throw new Error(`Unexpected token: ${char}`);
  }

  private parseTerm(): number {
    let left = this.parseFactor();
    this.skipWhitespace();
    while (this.peek() === "*" || this.peek() === "/") {
      const operator = this.consume();
      const right = this.parseFactor();
      if (operator === "*") {
        left *= right;
      } else if (operator === "/") {
        if (right === 0) {
          throw new Error("Division by zero");
        }
        left /= right;
      }
      this.skipWhitespace();
    }
    return left;
  }

  private parseExponent(): number {
    let base = this.parseTerm();
    this.skipWhitespace();
    while (this.peek() === "^") {
      this.consume();
      const exponent = this.parseFactor();
      base = Math.pow(base, exponent);
      this.skipWhitespace();
    }
    return base;
  }

  private parseExpression(): number {
    let left = this.parseExponent();
    this.skipWhitespace();
    while (this.peek() === "+" || this.peek() === "-") {
      const operator = this.consume();
      const right = this.parseExponent();
      if (operator === "+") {
        left += right;
      } else if (operator === "-") {
        left -= right;
      }
      this.skipWhitespace();
    }
    return left;
  }

  evaluate(variables?: any): number {
    this.variables = {
      ...this.variables,
      ...(variables || {})
    };
    this.currentIndex = 0;
    const result = this.parseExpression();
    this.skipWhitespace();
    if (this.peek() !== null) {
      throw new Error(`Unexpected end of expression: ${this.peek()}`);
    }
    return result;
  }

  setVariable(variableName: string, value: number): void {
    this.variables[variableName] = value;
  }

  getVariables(): VariableMap {
    return { ...this.variables };
  }
}