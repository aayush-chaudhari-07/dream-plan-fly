//#region node_modules/.nitro/vite/services/ssr/assets/card-validator-xwWfFn-e.js
var DEMO_TEST_CARDS = {
	SUCCESS: "4000000000000002",
	DECLINED: "4000000000000005",
	INSUFFICIENT_FUNDS: "4000000000000007",
	PENDING: "4000000000000009"
};
var DEMO_TEST_UPIS = {
	SUCCESS: "success@upi",
	SMARTTRIP: "demo@smarttrip",
	FAIL: "fail@upi"
};
/**
* Check if a card number is one of our explicitly permitted demo cards.
*/
function isAllowedDemoCard(rawCardNumber) {
	const cleaned = rawCardNumber.replace(/[\s-]/g, "");
	return Object.values(DEMO_TEST_CARDS).includes(cleaned);
}
/**
* Standard Luhn check to detect genuine credit cards.
*/
function passesLuhnCheck(cardNumber) {
	let sum = 0;
	let alternate = false;
	for (let i = cardNumber.length - 1; i >= 0; i--) {
		let n = parseInt(cardNumber.charAt(i), 10);
		if (isNaN(n)) return false;
		if (alternate) {
			n *= 2;
			if (n > 9) n = n % 10 + 1;
		}
		sum += n;
		alternate = !alternate;
	}
	return sum % 10 === 0;
}
/**
* Detect if input appears to be a real, live payment card.
* Throws a security error refusing real card processing in Demo Mode.
*/
function validateDemoCardSafety(rawCardNumber) {
	const cleaned = rawCardNumber.replace(/[\s-]/g, "");
	if (isAllowedDemoCard(cleaned)) return;
	if (/^\d{13,19}$/.test(cleaned) && (passesLuhnCheck(cleaned) || /^(4|5|3|6|8)/.test(cleaned))) throw new Error("Demo Mode: Real credit or debit card numbers are not accepted for your security. Please use one of the provided Test Card numbers.");
}
//#endregion
export { DEMO_TEST_UPIS as n, validateDemoCardSafety as r, DEMO_TEST_CARDS as t };
