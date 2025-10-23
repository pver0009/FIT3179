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
        },
        {
            "calculate": "datum.gender == 'person' ? 'All Persons' : datum.gender == 'male' ? 'Males' : 'Females'",
            "as": "gender_label"
        }
    ],
    "params": [
        {
            "name": "gender_select",
            "value": ["All Persons", "Males", "Females"],
            "bind": {
                "input": "select",
                "options": ["All Persons", "Males", "Females"],
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
        },
        {
            "name": "earnings_range",
            "value": [1700, 2400],
            "bind": {
                "input": "range",
                "min": 1700,
                "max": 2400,
                "step": 50,
                "name": "Earnings Range ($): "
            }
        }
    ],
    "transform": [
        {
            "filter": {"param": "gender_select"}
        },
        {
            "filter": {"param": "state_select"}
        },
        {
            "filter": "datum.weekly_earnings_numeric >= earnings_range[0] && datum.weekly_earnings_numeric <= earnings_range[1]"
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
            "title": "Weekly Earnings ($)",
            "scale": {"domain": [1700, 2400]}
        },
        "color": {
            "field": "gender_label",
            "type": "nominal",
            "title": "Gender",
            "scale": {
                "domain": ["All Persons", "Males", "Females"],
                "range": ["#6f3ce7", "#1b7fc2", "#cc9d2eff"] // Purple, Blue, Teal (no red)
            },
            "legend": {
                "orient": "top",
                "direction": "horizontal",
                "title": "Gender",
                "labelFontSize": 12,
                "titleFontSize": 14
            }
        },
        "xOffset": {
            "field": "gender_label",
            "type": "nominal"
        },
        "tooltip": [
            {"field": "state", "type": "nominal", "title": "State"},
            {"field": "gender_label", "type": "nominal", "title": "Gender"},
            {"field": "weekly_earnings_numeric", "type": "quantitative", "title": "Weekly Earnings", "format": "$.2f"}
        ]
    },
    "config": {
        "axis": {
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
    "layer": [
        {
            "mark": {"type": "arc", "innerRadius": 100, "tooltip": true},
            "encoding": {
                "theta": {
                    "field": "weekly_amount",
                    "type": "quantitative",
                    "title": "Weekly Amount ($)"
                },
                "color": {
                    "field": "short_category",
                    "type": "nominal",
                    "title": "Spending Categories",
                    "scale": {
                        "range": [
                            "#001220ff", // Dark blue - smallest amount
                            "#002138ff",
                            "#002b49ff",
                            "#00385fff", 
                            "#004779ff",
                            "#005b9dff",
                            "#0068b3ff",
                            "#2a6f97",
                            "#106698ff",
                            "#196383ff",
                            "#2c7da0",
                            "#468faf",
                            "#61a5c2",
                            "#89c2d9",
                            "#a9d6e5",  // Light blue - largest amount
                        ]
                    },
                    "sort": {"field": "weekly_amount", "order": "ascending"},
                    "legend": {
                        "orient": "right",
                        "title": "Spending Categories",
                        "labelLimit": 150,
                        "columns": 1,
                        "labelFontSize": 11,
                        "titleFontSize": 12,
                        "symbolSize": 100,
                        "symbolType": "circle"
                    }
                },
                "order": {
                    "field": "weekly_amount",
                    "type": "quantitative",
                    "sort": "ascending"
                },
                "tooltip": [
                    {"field": "short_category", "type": "nominal", "title": "Category"},
                    {"field": "weekly_amount", "type": "quantitative", "title": "Weekly Amount", "format": "$.2f"},
                    {"field": "percentage_2023_est", "type": "quantitative", "title": "Percentage", "format": ".1%"}
                ]
            }
        },
        {
            "mark": {
                "type": "text",
                "align": "center",
                "baseline": "middle",
                "fontSize": 20,
                "fontWeight": "bold",
                "color": "#2c3e50"
            },
            "encoding": {
                "text": {"value": "$2,010.00"}
            }
        },
        {
            "mark": {
                "type": "text",
                "align": "center",
                "baseline": "middle",
                "fontSize": 14,
                "color": "#6c757d",
                "dy": 25
            },
            "encoding": {
                "text": {"value": "Total Weekly Spending"}
            }
        }
    ],
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
        "url": "data/inflation_data.csv"
    },
    "params": [
        {
            "name": "metric_select",
            "value": ["Headline CPI", "Trimmed Mean"],
            "bind": {
                "input": "select",
                "options": ["Headline CPI", "Trimmed Mean"],
                "name": "Show: ",
                "select": true
            }
        },
        {
            "name": "time_period",
            "value": "all",
            "bind": {
                "input": "select",
                "options": ["all", "pre_2020", "2020_2022", "post_2022"],
                "labels": ["All Years (2015-2025)", "Pre-2020 (2015-2019)", "Peak Inflation (2020-2022)", "Recent (2023-2025)"],
                "name": "Time Period: "
            }
        }
    ],
    "transform": [
        {
            "calculate": "parseInt(datum.year_quarter)",
            "as": "year"
        },
        {
            "filter": "time_period == 'all' || (time_period == 'pre_2020' && year < 2020) || (time_period == '2020_2022' && year >= 2020 && year <= 2022) || (time_period == 'post_2022' && year > 2022)"
        }
    ],
    "layer": [
        {
            "mark": {
                "type": "line",
                "stroke": "#6f3ce7",
                "strokeWidth": 3,
                "point": true
            },
            "encoding": {
                "x": {
                    "field": "year_quarter",
                    "type": "ordinal",
                    "title": "Year Quarter",
                    "axis": {"labelAngle": -45},
                    "sort": null
                },
                "y": {
                    "field": "all_groups_cpi",
                    "type": "quantitative",
                    "title": "Inflation Rate (%)",
                    "scale": {"domain": [-2, 10]}
                },
                "tooltip": [
                    {"field": "year_quarter", "type": "nominal", "title": "Quarter"},
                    {"field": "all_groups_cpi", "type": "quantitative", "title": "Headline CPI", "format": ".1f"}
                ]
            }
        },
        {
            "mark": {
                "type": "line",
                "stroke": "#1b7fc2",
                "strokeWidth": 2,
                "strokeDash": [5, 5],
                "point": true
            },
            "encoding": {
                "x": {
                    "field": "year_quarter",
                    "type": "ordinal"
                },
                "y": {
                    "field": "trimmed_mean",
                    "type": "quantitative"
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

// 6. Living Cost Indexes 
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

// 8. Cost Pressures Heatmap 
const costPressures = {
  "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
  "data": {
    "url": "data/cost_pressures.csv"
  },
  "transform": [
    {
      "fold": ["employee_pressure", "pensioner_pressure", "self_funded_pressure"],
      "as": ["pressure_type", "pressure_level"]
    },
    {
      "aggregate": [
        {
          "op": "count",
          "as": "count_*"
        }
      ],
      "groupby": [
        "category",
        "pressure_level"
      ]
    },
    {
      "stack": "count_*",
      "groupby": [],
      "as": [
        "stack_count_category1",
        "stack_count_category2"
      ],
      "offset": "normalize",
      "sort": [
        {
          "field": "category",
          "order": "ascending"
        }
      ]
    },
    {
      "window": [
        {
          "op": "min",
          "field": "stack_count_category1",
          "as": "x"
        },
        {
          "op": "max",
          "field": "stack_count_category2",
          "as": "x2"
        },
        {
          "op": "dense_rank",
          "as": "rank_pressure_level"
        },
        {
          "op": "distinct",
          "field": "pressure_level",
          "as": "distinct_pressure_level"
        }
      ],
      "groupby": [
        "category"
      ],
      "frame": [
        null,
        null
      ],
      "sort": [
        {
          "field": "pressure_level",
          "order": "ascending"
        }
      ]
    },
    {
      "window": [
        {
          "op": "dense_rank",
          "as": "rank_category"
        }
      ],
      "frame": [
        null,
        null
      ],
      "sort": [
        {
          "field": "category",
          "order": "ascending"
        }
      ]
    },
    {
      "stack": "count_*",
      "groupby": [
        "category"
      ],
      "as": [
        "y",
        "y2"
      ],
      "offset": "normalize",
      "sort": [
        {
          "field": "pressure_level",
          "order": "ascending"
        }
      ]
    },
    {
      "calculate": "datum.y + (datum.rank_pressure_level - 1) * datum.distinct_pressure_level * 0.01 / 3",
      "as": "ny"
    },
    {
      "calculate": "datum.y2 + (datum.rank_pressure_level - 1) * datum.distinct_pressure_level * 0.01 / 3",
      "as": "ny2"
    },
    {
      "calculate": "datum.x + (datum.rank_category - 1) * 0.01",
      "as": "nx"
    },
    {
      "calculate": "datum.x2 + (datum.rank_category - 1) * 0.01",
      "as": "nx2"
    },
    {
      "calculate": "(datum.nx+datum.nx2)/2",
      "as": "xc"
    },
    {
      "calculate": "(datum.ny+datum.ny2)/2",
      "as": "yc"
    }
  ],
  "vconcat": [
    {
      "mark": {
        "type": "text",
        "baseline": "middle",
        "align": "center"
      },
      "encoding": {
        "x": {
          "aggregate": "min",
          "field": "xc",
          "title": "Category",
          "axis": {
            "orient": "top"
          }
        },
        "color": {
          "field": "category",
          "legend": null,
          "scale": {
            "range": ["#D2B7E5", "#B185DB", "#815AC0", "#6247AA", "#9B6B9E", "#7A4988", "#5C3972", "#4A2C5A"]
          }
        },
        "text": {"field": "category"}
      }
    },
    {
      "layer": [
        {
          "mark": {
            "type": "rect"
          },
          "encoding": {
            "x": {
              "field": "nx",
              "type": "quantitative",
              "axis": null
            },
            "x2": {"field": "nx2"},
            "y": {
              "field": "ny",
              "type": "quantitative"
            },
            "y2": {"field": "ny2"},
            "color": {
              "field": "pressure_level",
              "type": "nominal",
              "scale": {
                "domain": ["Very High", "High", "Medium", "Low"],
                "range": ["#6247AA", "#815AC0", "#B185DB", "#D2B7E5"]
              },
              "legend": {
                "title": "Pressure Level",
                "orient": "bottom"
              }
            },
            "tooltip": [
              {
                "field": "category",
                "type": "nominal"
              },
              {
                "field": "pressure_type",
                "type": "nominal",
                "title": "Pressure Type"
              },
              {
                "field": "pressure_level",
                "type": "nominal"
              }
            ]
          }
        },
        {
          "mark": {
            "type": "text",
            "baseline": "middle",
            "fontSize": 10
          },
          "encoding": {
            "x": {
              "field": "xc",
              "type": "quantitative",
              "axis": null
            },
            "y": {
              "field": "yc",
              "type": "quantitative",
              "axis": {
                "title": "Pressure Type"
              }
            },
            "text": {
              "field": "pressure_type",
              "type": "nominal"
            }
          }
        }
      ]
    }
  ],
  "resolve": {
    "scale": {
      "x": "shared"
    }
  },
  "config": {
    "view": {
      "stroke": ""
    },
    "concat": {"spacing": 10},
    "axis": {
      "domain": false,
      "ticks": false,
      "labels": false,
      "grid": false
    }
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
            "scale": {
                "range": ["#1f77b4", "#ffffff", "#ff7f0e"],
                "domainMid": 0
            },
            "legend": {
                "title": "Annual Change (%)",
                "orient": "top",
                "direction": "horizontal",
                "gradientLength": 300,
                "format": ".1%",
                "values": [-0.02, -0.01, 0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06],
                "labelExpr": "format(datum.value, '.1%')"
            }
        },
        "tooltip": [
            {"field": "category", "type": "nominal", "title": "Category"},
            {"field": "annual_change_percent", "type": "quantitative", "title": "Annual Change", "format": ".1%"},
            {"field": "quarterly_change", "type": "quantitative", "title": "Quarterly Change", "format": ".1f"},
            {"field": "weight", "type": "quantitative", "title": "Weight in CPI", "format": ".1f"}
        ]
    }
};




// Configuration to remove the actions menu
const embedOpts = {
    actions: false
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