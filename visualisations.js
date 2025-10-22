// Australian Cost of Living Visualisations

// 1. Earnings by State and Gender Bar Chart with Filters
const earningsByStateGender = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Weekly Earnings by State and Gender",
    "data": {
        "url": "data/earnings_data.csv",
        "format": {
            "type": "dsv",
            "delimiter": "\t"
        }
    },
    "transform": [
        {
            "calculate": "replace(datum.weekly_earnings, ',', '')",
            "as": "weekly_earnings_clean"
        },
        {
            "calculate": "toNumber(datum.weekly_earnings_clean)",
            "as": "weekly_earnings_numeric"
        },
        {
            "filter": "datum.state != 'AUSTRALIA'"
        }
    ],
    "params": [
        {
            "name": "gender_select",
            "value": ["person", "male", "female"],
            "bind": {
                "input": "select",
                "options": ["person", "male", "female"],
                "labels": ["All Persons", "Males", "Females"],
                "name": "Gender: ",
                "select": true
            }
        },
        {
            "name": "state_select",
            "value": ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"],
            "bind": {
                "input": "select",
                "options": ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"],
                "name": "States: ",
                "select": true
            }
        }
    ],
    "transform": [
        {
            "calculate": "replace(datum.weekly_earnings, ',', '')",
            "as": "weekly_earnings_clean"
        },
        {
            "calculate": "toNumber(datum.weekly_earnings_clean)",
            "as": "weekly_earnings_numeric"
        },
        {
            "filter": "datum.state != 'AUSTRALIA'"
        },
        {
            "filter": {"param": "gender_select"}
        },
        {
            "filter": {"param": "state_select"}
        }
    ],
    "mark": "bar",
    "encoding": {
        "x": {
            "field": "state",
            "type": "nominal",
            "title": "State/Territory",
            "axis": {"labelAngle": 0},
            "sort": "-y"
        },
        "y": {
            "field": "weekly_earnings_numeric",
            "type": "quantitative",
            "title": "Weekly Earnings ($)"
        },
        "color": {
            "field": "gender",
            "type": "nominal",
            "title": "Gender",
            "scale": {
                "domain": ["person", "male", "female"],
                "range": ["#3498db", "#2ecc71", "#e74c3c"]
            }
        },
        // Use xOffset for side-by-side bars instead of column
        "xOffset": {
            "field": "gender",
            "type": "nominal"
        },
        "tooltip": [
            {"field": "state", "type": "nominal", "title": "State"},
            {"field": "gender", "type": "nominal", "title": "Gender"},
            {"field": "weekly_earnings_numeric", "type": "quantitative", "title": "Weekly Earnings", "format": "$.2f"}
        ]
    },
    "config": {
        "axis": {
            "labelFontSize": 12,
            "titleFontSize": 14
        },
        "legend": {
            "labelFontSize": 12,
            "titleFontSize": 14
        },
        "view": {"stroke": null}
    }
};

// 2. Weekly Wage Allocation Pie Chart
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

// 3. Simplified Cost of Living Map (without TopoJSON)
const costOfLivingMap = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 500,
    "title": "Cost of Living Index by Capital City",
    "data": {"url": "data/city_cpi_comparison_with_coords.csv"},
    "transform": [
        {
            "calculate": "datum.city == 'National_Average' ? 0 : 1",
            "as": "is_national"
        }
    ],
    "mark": {"type": "circle", "tooltip": {"content": "data"}},
    "encoding": {
        "longitude": {
            "field": "longitude",
            "type": "quantitative",
            "scale": {"domain": [110, 155]}
        },
        "latitude": {
            "field": "latitude", 
            "type": "quantitative",
            "scale": {"domain": [-45, -10]}
        },
        "size": {
            "field": "population_weight",
            "type": "quantitative",
            "title": "Population Weight",
            "scale": {"range": [50, 300]}
        },
        "color": {
            "field": "cpi_index",
            "type": "quantitative",
            "title": "CPI Index",
            "scale": {"scheme": "reds"}
        },
        "tooltip": [
            {"field": "city", "type": "nominal", "title": "City"},
            {"field": "cpi_index", "type": "quantitative", "title": "CPI Index", "format": ".1f"},
            {"field": "annual_change", "type": "quantitative", "title": "Annual Change", "format": ".1%"},
            {"field": "population_weight", "type": "quantitative", "title": "Population Weight", "format": ".0f"}
        ]
    },
    "config": {"view": {"stroke": null}}
};

// 4. Inflation Trends
const inflationTrends = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Inflation Trends Over Time",
    "data": {
        "url": "data/inflation_data.csv",
        "format": {
            "type": "dsv",
            "delimiter": "\t"  // Specify tab delimiter
        }
    },
    "transform": [
        // Convert quarter strings to proper dates
        {
            "calculate": "replace(datum.year_quarter, '-Q', '-')",
            "as": "quarter_clean"
        },
        {
            "calculate": "datetime(year(datum.quarter_clean), (quarter(datum.quarter_clean)-1)*3 + 1, 1)",
            "as": "date"
        }
    ],
    "layer": [
        {
            "mark": {
                "type": "line", 
                "stroke": "#e74c3c", 
                "strokeWidth": 3,
                "point": true
            },
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "title": "Year Quarter",
                    "axis": {"labelAngle": -45}
                },
                "y": {
                    "field": "all_groups_cpi",
                    "type": "quantitative",
                    "title": "Inflation Rate (%)",
                    "scale": {"domain": [-2, 10]}
                },
                "tooltip": [
                    {"field": "year_quarter", "type": "nominal", "title": "Quarter"},
                    {"field": "all_groups_cpi", "type": "quantitative", "title": "CPI Inflation", "format": ".1f"},
                    {"field": "trimmed_mean", "type": "quantitative", "title": "Trimmed Mean", "format": ".1f"}
                ]
            }
        },
        {
            "mark": {
                "type": "line", 
                "stroke": "#3498db", 
                "strokeWidth": 2, 
                "strokeDash": [5, 5],
                "point": true
            },
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "title": "Year Quarter"
                },
                "y": {
                    "field": "trimmed_mean",
                    "type": "quantitative",
                    "title": "Inflation Rate (%)"
                },
                "tooltip": [
                    {"field": "year_quarter", "type": "nominal", "title": "Quarter"},
                    {"field": "trimmed_mean", "type": "quantitative", "title": "Trimmed Mean", "format": ".1f"}
                ]
            }
        }
    ]
};

// 5. Earnings vs Spending Comparison
const earningsSpendingComparison = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Weekly Earnings vs Essential Spending by State",
    "data": {"url": "data/earnings_data.csv"},
    "transform": [
        {"filter": "datum.gender == 'person'"},
        {"filter": "datum.state != 'AUSTRALIA'"},
        {
            "calculate": "replace(datum.weekly_earnings, ',', '')",
            "as": "weekly_earnings_clean"
        },
        {
            "calculate": "toNumber(datum.weekly_earnings_clean)",
            "as": "weekly_earnings_numeric"
        }
    ],
    "layer": [
        {
            "mark": "bar",
            "encoding": {
                "x": {
                    "field": "state",
                    "type": "nominal",
                    "title": "State/Territory",
                    "sort": "-y"
                },
                "y": {
                    "field": "weekly_earnings_numeric",
                    "type": "quantitative",
                    "title": "Weekly Amount ($)",
                    "scale": {"domain": [1700, 2300]}
                },
                "color": {
                    "value": "#3498db"
                },
                "tooltip": [
                    {"field": "state", "type": "nominal", "title": "State"},
                    {"field": "weekly_earnings_numeric", "type": "quantitative", "title": "Weekly Earnings", "format": "$.2f"}
                ]
            }
        },
        {
            "data": {"url": "data/state_total_spending.csv"},
            "transform": [
                {"filter": "datum.state != 'AUSTRALIA'"},
                {
                    "calculate": "replace(datum.spending_2023_adj, ',', '')",
                    "as": "spending_clean"
                },
                {
                    "calculate": "toNumber(datum.spending_clean) / 4",
                    "as": "weekly_spending"
                }
            ],
            "mark": {"type": "point", "filled": true, "size": 100, "color": "#e74c3c"},
            "encoding": {
                "x": {"field": "state", "type": "nominal"},
                "y": {
                    "field": "weekly_spending",
                    "type": "quantitative",
                    "title": "Weekly Amount ($)"
                },
                "tooltip": [
                    {"field": "state", "type": "nominal", "title": "State"},
                    {"field": "weekly_spending", "type": "quantitative", "title": "Weekly Spending", "format": "$.2f"}
                ]
            }
        }
    ]
};

// 6. Living Cost Indexes (using CSV instead of Excel)
const livingCostIndexes = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Living Cost Indexes by Household Type",
    "data": {"url": "data/living_cost_indexes.csv"},
    "transform": [
        {"fold": ["employee_index", "pensioner_index", "self_funded_index"], "as": ["household_type", "index_value"]},
        {"calculate": "datum.household_type == 'employee_index' ? 'Employee' : datum.household_type == 'pensioner_index' ? 'Pensioner' : 'Self-Funded'", "as": "household_type_label"},
        {
            "calculate": "datum.year_quarter + '-01'",
            "as": "parsed_date"
        }
    ],
    "mark": "line",
    "encoding": {
        "x": {
            "field": "parsed_date",
            "type": "temporal",
            "title": "Year Quarter",
            "axis": {"labelAngle": -45}
        },
        "y": {
            "field": "index_value",
            "type": "quantitative",
            "title": "Living Cost Index"
        },
        "color": {
            "field": "household_type_label",
            "type": "nominal",
            "title": "Household Type",
            "scale": {"scheme": "set2"}
        },
        "tooltip": [
            {"field": "year_quarter", "type": "nominal", "title": "Quarter"},
            {"field": "household_type_label", "type": "nominal", "title": "Household Type"},
            {"field": "index_value", "type": "quantitative", "title": "Index Value", "format": ".1f"}
        ]
    }
};

// 7. Spending Composition Over Time
const spendingComposition = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "data": {"url": "data/spending_categories_national.csv"},
    "title": "Household Spending Composition Over Time",
    "transform": [
        {"fold": ["percentage_1984", "percentage_2009", "percentage_2015", "percentage_2023_est"], "as": ["year", "percentage"]},
        {"calculate": "datum.year == 'percentage_1984' ? 1984 : datum.year == 'percentage_2009' ? 2009 : datum.year == 'percentage_2015' ? 2015 : 2023", "as": "year_value"}
    ],
    "mark": "area",
    "encoding": {
        "x": {
            "field": "year_value",
            "type": "quantitative",
            "title": "Year",
            "axis": {"tickCount": 4}
        },
        "y": {
            "field": "percentage",
            "type": "quantitative",
            "title": "Percentage of Spending",
            "stack": "normalize"
        },
        "color": {
            "field": "category",
            "type": "nominal",
            "title": "Spending Category",
            "scale": {"scheme": "category20"}
        },
        "tooltip": [
            {"field": "category", "type": "nominal", "title": "Category"},
            {"field": "year_value", "type": "quantitative", "title": "Year"},
            {"field": "percentage", "type": "quantitative", "title": "Percentage", "format": ".1%"}
        ]
    }
};

// 8. Cost Pressures Heatmap (using CSV instead of Excel)
const costPressures = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Cost Pressures by Category and Household Type",
    "data": {"url": "data/cost_pressures.csv"}, // You'll need to convert the Excel to CSV
    "transform": [
        {"fold": ["employee_pressure", "pensioner_pressure", "self_funded_pressure"], "as": ["household_type", "pressure_level"]},
        {"calculate": "datum.household_type == 'employee_pressure' ? 'Employee' : datum.household_type == 'pensioner_pressure' ? 'Pensioner' : 'Self-Funded'", "as": "household_type_label"},
        {"calculate": "datum.pressure_level == 'Very High' ? 4 : datum.pressure_level == 'High' ? 3 : datum.pressure_level == 'Medium' ? 2 : 1", "as": "pressure_score"}
    ],
    "mark": "rect",
    "encoding": {
        "x": {
            "field": "household_type_label",
            "type": "nominal",
            "title": "Household Type"
        },
        "y": {
            "field": "category",
            "type": "nominal",
            "title": "Spending Category",
            "sort": "-x"
        },
        "color": {
            "field": "pressure_score",
            "type": "quantitative",
            "title": "Pressure Level",
            "scale": {"scheme": "reds"},
            "legend": null
        },
        "tooltip": [
            {"field": "category", "type": "nominal", "title": "Category"},
            {"field": "household_type_label", "type": "nominal", "title": "Household Type"},
            {"field": "pressure_level", "type": "nominal", "title": "Pressure Level"},
            {"field": "primary_driver", "type": "nominal", "title": "Primary Driver"}
        ]
    }
};

// 9. Category Inflation Bar Chart
const categoryInflation = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "data": {"url": "data/category_inflation.csv"},
    "title": "Current Inflation by Spending Category",
    "transform": [
        {"calculate": "datum.annual_change / 100", "as": "annual_change_percent"}
    ],
    "mark": "bar",
    "encoding": {
        "x": {
            "field": "annual_change_percent",
            "type": "quantitative",
            "title": "Annual Change (%)",
            "axis": {"format": ".1%"}
        },
        "y": {
            "field": "category",
            "type": "nominal",
            "title": "Spending Category",
            "sort": "-x"
        },
        "color": {
            "field": "annual_change_percent",
            "type": "quantitative",
            "scale": {"scheme": "redblue", "domainMid": 0},
            "legend": {"title": "Annual Change"}
        },
        "tooltip": [
            {"field": "category", "type": "nominal", "title": "Category"},
            {"field": "annual_change_percent", "type": "quantitative", "title": "Annual Change", "format": ".1%"},
            {"field": "quarterly_change", "type": "quantitative", "title": "Quarterly Change", "format": ".1%"},
            {"field": "weight", "type": "quantitative", "title": "Weight in CPI", "format": ".1f"}
        ]
    }
};

// Embed all visualizations

vegaEmbed('#earnings_by_gender', earningsByStateGender)
  .then(function(result) {
    console.log("Earnings by gender chart loaded.");
  })
  .catch(console.error);

vegaEmbed("#weekly_wage_allocation", weeklyWageAllocation)
  .then(function(result) {
    // Chart rendered successfully
    console.log("Weekly wage allocation chart loaded.");
  })
  .catch(console.error);
  
vegaEmbed('#earnings_by_gender', earningsByStateGender)
  .then(function(result) {
    console.log("Earnings by gender chart loaded.");
  })
  .catch(console.error);
vegaEmbed("#weekly_wage_allocation", weeklyWageAllocation)
  .then(function(result) {
    console.log("Weekly wage allocation chart loaded.");
  })
  .catch(console.error);
  
vegaEmbed('#cost_of_living_map', costOfLivingMap)
  .then(function(result) {
    console.log("Cost of living map loaded.");
  })
  .catch(console.error);

vegaEmbed('#inflation_trends', inflationTrends)
  .then(function(result) {
    console.log("Inflation trends chart loaded.");
  })
  .catch(console.error);

vegaEmbed('#earnings_spending_comparison', earningsSpendingComparison)
  .then(function(result) {
    console.log("Earnings vs spending chart loaded.");
  })
  .catch(console.error);

vegaEmbed('#living_cost_indexes', livingCostIndexes)
  .then(function(result) {
    console.log("Living cost indexes chart loaded.");
  })
  .catch(console.error);

vegaEmbed('#spending_composition', spendingComposition)
  .then(function(result) {
    console.log("Spending composition chart loaded.");
  })
  .catch(console.error);

vegaEmbed('#cost_pressures', costPressures)
  .then(function(result) {
    console.log("Cost pressures chart loaded.");
  })
  .catch(console.error);

vegaEmbed('#category_inflation', categoryInflation)
  .then(function(result) {
    console.log("Category inflation chart loaded.");
  })
  .catch(console.error);


console.log("All visualizations loaded successfully!");