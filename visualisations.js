// Australian Cost of Living Visualisations

// 1. Earnings by State and Gender Bar Chart with Filters
const earningsByStateGender = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Weekly Earnings by State and Gender",
    "data": {"url": "data/earnings_data.csv"},
    "transform": [
        {
            "calculate": "replace(datum.weekly_earnings, ',', '')",
            "as": "weekly_earnings_clean"
        },
        {
            "filter": "datum.state != 'AUSTRALIA'"
        }
    ],
    "params": [
        {
            "name": "gender_select",
            "value": "person",
            "bind": {
                "input": "select",
                "options": ["person", "male", "female"],
                "labels": ["All Persons", "Males", "Females"],
                "name": "Gender: "
            }
        },
        {
            "name": "state_select",
            "value": ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"],
            "bind": {
                "input": "select",
                "options": ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"],
                "name": "State: ",
                "select": "checkbox"
            }
        }
    ],
    "mark": "bar",
    "encoding": {
        "x": {
            "field": "state",
            "type": "nominal",
            "title": "State/Territory",
            "sort": "-y",
            "axis": {"labelAngle": 0}
        },
        "y": {
            "field": "weekly_earnings_clean",
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
            },
            "legend": {
                "title": "Gender",
                "symbolType": "circle"
            }
        },
        "tooltip": [
            {"field": "state", "type": "nominal", "title": "State"},
            {"field": "gender", "type": "nominal", "title": "Gender"},
            {"field": "weekly_earnings_clean", "type": "quantitative", "title": "Weekly Earnings", "format": "$.2f"}
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
        }
    }
};

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

// 2. Simplified Cost of Living Map (without TopoJSON)
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

// 3. Inflation Trends
const inflationTrends = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "data": {"url": "data/inflation_data.csv"},
    "title": "Inflation Trends Over Time",
    "encoding": {
        "x": {
            "field": "year_quarter",
            "type": "temporal",
            "title": "Year Quarter",
            "axis": {"labelAngle": -45}
        }
    },
    "layer": [
        {
            "mark": {"type": "line", "stroke": "#e74c3c", "strokeWidth": 3},
            "encoding": {
                "y": {
                    "field": "all_groups_cpi",
                    "type": "quantitative",
                    "title": "Inflation Rate (%)",
                    "scale": {"domain": [-2, 10]}
                },
                "tooltip": [
                    {"field": "year_quarter", "type": "temporal", "title": "Quarter"},
                    {"field": "all_groups_cpi", "type": "quantitative", "title": "CPI Inflation", "format": ".1%"},
                    {"field": "trimmed_mean", "type": "quantitative", "title": "Trimmed Mean", "format": ".1%"}
                ]
            }
        },
        {
            "mark": {"type": "line", "stroke": "#3498db", "strokeWidth": 2, "strokeDash": [5, 5]},
            "encoding": {
                "y": {
                    "field": "trimmed_mean",
                    "type": "quantitative",
                    "title": "Inflation Rate (%)"
                }
            }
        }
    ]
};

// 4. Earnings vs Spending Comparison
const earningsSpendingComparison = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Weekly Earnings vs Essential Spending by State",
    "data": {"url": "data/earnings_data.csv"},
    "transform": [
        {"filter": "datum.gender == 'person'"},
        {"filter": "datum.state != 'AUSTRALIA'"}
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
                    "field": "weekly_earnings",
                    "type": "quantitative",
                    "title": "Weekly Amount ($)",
                    "scale": {"domain": [1700, 2300]}
                },
                "color": {
                    "value": "#3498db"
                },
                "tooltip": [
                    {"field": "state", "type": "nominal", "title": "State"},
                    {"field": "weekly_earnings", "type": "quantitative", "title": "Weekly Earnings", "format": "$.2f"}
                ]
            }
        },
        {
            "data": {"url": "data/state_total_spending.csv"},
            "transform": [
                {"filter": "datum.state != 'AUSTRALIA'"},
                {"calculate": "datum.spending_2023_adj / 4", "as": "weekly_spending"}
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

// 5. Living Cost Indexes (using CSV instead of Excel)
const livingCostIndexes = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": "container",
    "height": 400,
    "title": "Living Cost Indexes by Household Type",
    "data": {"url": "data/living_cost_indexes.csv"}, // You'll need to convert the Excel to CSV
    "transform": [
        {"fold": ["employee_index", "pensioner_index", "self_funded_index"], "as": ["household_type", "index_value"]},
        {"calculate": "datum.household_type == 'employee_index' ? 'Employee' : datum.household_type == 'pensioner_index' ? 'Pensioner' : 'Self-Funded'", "as": "household_type_label"}
    ],
    "encoding": {
        "x": {
            "field": "year_quarter",
            "type": "temporal",
            "title": "Year Quarter",
            "axis": {"labelAngle": -45}
        },
        "color": {
            "field": "household_type_label",
            "type": "nominal",
            "title": "Household Type",
            "scale": {"scheme": "set2"}
        }
    },
    "layer": [
        {
            "mark": "line",
            "encoding": {
                "y": {
                    "field": "index_value",
                    "type": "quantitative",
                    "title": "Living Cost Index"
                }
            }
        },
        {
            "mark": {"type": "point", "size": 50},
            "encoding": {
                "y": {
                    "field": "index_value",
                    "type": "quantitative"
                },
                "tooltip": [
                    {"field": "year_quarter", "type": "temporal", "title": "Quarter"},
                    {"field": "household_type_label", "type": "nominal", "title": "Household Type"},
                    {"field": "index_value", "type": "quantitative", "title": "Index Value", "format": ".1f"}
                ]
            }
        }
    ]
};

// 6. Spending Composition Over Time
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

// 7. Cost Pressures Heatmap (using CSV instead of Excel)
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

// 8. Category Inflation Bar Chart
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
vegaEmbed("#weekly_wage_allocation", weeklyWageAllocation)
  .then(function(result) {
    // Chart rendered successfully
    console.log("Weekly wage allocation chart loaded.");
  })
  .catch(console.error);
  
vegaEmbed('#cost_of_living_map', costOfLivingMap);
vegaEmbed('#inflation_trends', inflationTrends);
vegaEmbed('#earnings_spending_comparison', earningsSpendingComparison);
vegaEmbed('#living_cost_indexes', livingCostIndexes);
vegaEmbed('#spending_composition', spendingComposition);
vegaEmbed('#cost_pressures', costPressures);
vegaEmbed('#category_inflation', categoryInflation);

console.log("All visualizations loaded successfully!");