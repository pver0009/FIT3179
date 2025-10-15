// Australian Cost of Living Visualisations

// 1. Weekly Wage Allocation Pie Chart
const weeklyWageAllocation = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "How the Average Weekly Wage is Allocated",
    "data": {"url": "data/spending_categories_national.csv"},
    "transform": [
        {"filter": "datum.percentage_2023_est > 0"},
        {"calculate": "datum.percentage_2023_est / 100 * 2010", "as": "weekly_amount"},
        {"calculate": "datum.category == 'Current housing costs' ? 'Housing' : datum.category", "as": "short_category"}
    ],
    "mark": {"type": "arc", "innerRadius": 50, "tooltip": true},
    "encoding": {
        "theta": {
            "field": "weekly_amount",
            "type": "quantitative",
            "title": "Weekly Amount ($)"
        },
        "color": {
            "field": "short_category",
            "type": "nominal",
            "title": "Spending Category",
            "scale": {"scheme": "category20"},
            "legend": {
                "orient": "right",
                "title": "Spending Categories"
            }
        },
        "tooltip": [
            {"field": "short_category", "type": "nominal", "title": "Category"},
            {"field": "weekly_amount", "type": "quantitative", "title": "Weekly Amount", "format": "$.2f"},
            {"field": "percentage_2023_est", "type": "quantitative", "title": "Percentage", "format": ".1%"}
        ]
    },
    "view": {"stroke": null}
};


// Embed all visualizations
vegaEmbed("#weekly_wage_allocation", weeklyWageAllocation)
  .then(function(result) {
    // Chart rendered successfully
    console.log("Weekly wage allocation chart loaded.");
  })
  .catch(console.error);

console.log("All visualizations loaded successfully!");