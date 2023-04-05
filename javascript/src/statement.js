class CalculatePlayAmount{
    constructor(_audience) {
        this.audience = _audience;
    }

    get amount() {
        throw new Error('하위 클래스에서 처리하도록 했습니다.');
    }

    get volumeCredits() {
        throw new Error('하위 클래스에서 처리하도록 했습니다.');
    }
}

class CalculatePlayAmountForTragedy extends CalculatePlayAmount {
    get amount() {
        return 40000 + (this.audience > 30 ? 1000 * (this.audience - 30) : 0)
    }

    get volumeCredits() {
        return Math.max(this.audience - 30, 0);
    }
}

class CalculatePlayAmountForComedy extends CalculatePlayAmount {
    get amount() {
        return 30000 + (300 * this.audience) + (this.audience > 20 ? 10000 + 500 * (this.audience - 20) : 0);

    }

    get volumeCredits() {
        return Math.max(this.audience - 30, 0) + Math.floor(this.audience / 5);
    }
}

function getPrintStatementByPlayType(_play, _performance) {
    switch (_play.type) {
        case "tragedy":
            return new CalculatePlayAmountForTragedy(_performance.audience);
        case "comedy":
            return new CalculatePlayAmountForComedy(_performance.audience);
        default:
            throw new Error(`unknown type: ${_play.type}`);
    }
}

function createResultStatement(_invoice, _plays, _calculatedObject) {
    let result = `Statement for ${_invoice.customer}\n`;
    result += _calculatedObject.playDescriptionStatement
    result += `Amount owed is ${USDFormatting(_calculatedObject.totalAmount)}\n`;
    result += `You earned ${_calculatedObject.volumeCredits} credits\n`;
    return result;
}

function createCalculatedObject(_performances, _plays) {
    let playDescriptionStatement = '';
    let totalAmount = 0;
    let volumeCredits = 0;

    for (let performance of _performances) {
        const play = _plays[performance.playID];
        let calculator = getPrintStatementByPlayType(play, performance);
        totalAmount += calculator.amount;
        volumeCredits += calculator.volumeCredits;
        playDescriptionStatement += ` ${play.name}: ${USDFormatting(calculator.amount)} (${performance.audience} seats)\n`;
    }

    return {
        volumeCredits,
        totalAmount,
        playDescriptionStatement
    };
}

function USDFormatting(_number) {
    return new Intl.NumberFormat("en-US",
      {
          style: "currency", currency: "USD",
          minimumFractionDigits: 2
      }).format(_number / 100);
}

function statement (invoice, plays) {
    return createResultStatement(invoice, plays, createCalculatedObject(invoice.performances, plays));
}


module.exports = statement;
