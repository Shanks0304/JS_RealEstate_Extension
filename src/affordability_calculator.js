// Calculates property affordability based on user financial data and market trends.



function calculateAffordability(propertyPrice, userFinancialData, currentRates, propertyTaxes) {
    let monthlyMortgage = (propertyPrice * currentRates) / 12;
    let totalMonthlyCost = monthlyMortgage + propertyTaxes;



    return {
        affordable: totalMonthlyCost <= userFinancialData.monthlyIncome * 0.3,
        monthlyCost: totalMonthlyCost
    };
}



function compareWithMarket(propertyPrice, localMarketData) {
    let averagePrice = localMarketData.averagePrice;
    return propertyPrice <= averagePrice ? "Under-priced" : "Over-priced";
}