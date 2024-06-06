fetch('/data')
    .then(response => response.json())
    .then(data => {
        const teamColors = {
            "Chennai Super Kings": "#fdc204",
            "Deccan Chargers": "#1a4667",
            "Delhi Capitals (formerly Daredevils)": "#265098",
            "Gujarat Lions": "#fe4a21",
            "Gujarat Titans": "#041839",
            "Kochi Tuskers Kerala": "#d73a19",
            "Kolkata Knight Riders": "#8653bc",
            "Lucknow Super Giants": "#8ec2bd",
            "Mumbai Indians": "#329bea",
            "Pune Warriors India": "#2f9cc3",
            "Punjab Kings (formerly Kings XI)": "#dd1f2d",
            "Rajasthan Royals": "#ff65ab",
            "Rising Pune Supergiant": "#b93182",
            "Royal Challengers Bengaluru": "#fa0505",
            "Sunrisers Hyderabad": "#fba81a"
        };

        const assignColor = (team, filterMode, selectedTeam) => {
            if (!selectedTeam && filterMode) {
                return teamColors[team] || 'rgb(30, 136, 229)'; // Team color when no team is selected and color switch is checked
            } else if (!selectedTeam) {
                return 'rgb(30, 136, 229)'; // Default color when no team is selected
            } else if (filterMode) {
                return team ? teamColors[team] || 'rgb(30, 136, 229)' : 'rgb(30, 136, 229)';
            } else {
                return team === selectedTeam ? 'green' : 'red';
            }
        };
        
        const seasons = [...new Set(data.map(d => d.season).filter(season => season !== null))]
            .map(season => parseInt(season))
            .sort((a, b) => a - b);

        const teams = [...new Set(data.map(d => d.home_team).filter(team => team !== null))].sort();

        const teamFilter = document.getElementById('teamFilter');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const colorSwitch = document.getElementById('flexSwitchCheckChecked');

        // Clear existing options to prevent duplicates
        teamFilter.innerHTML = '<option value="">All Teams</option>';

        teams.forEach(team => {
            teamFilter.innerHTML += `<option value="${team}">${team}</option>`;
        });

        const seasonRangeSlider = document.getElementById('seasonRangeSlider');
        noUiSlider.create(seasonRangeSlider, {
            start: [seasons[0], seasons[seasons.length - 1]],
            connect: true,
            range: {
                'min': seasons[0],
                'max': seasons[seasons.length - 1]
            },
            step: 1,
            tooltips: true,
            format: {
                to: value => Math.round(value),
                from: value => Math.round(value)
            }
        });

        const applyFilters = () => {
            const selectedSeasonRange = seasonRangeSlider.noUiSlider.get();
            const selectedTeam = teamFilter.value;
            const filterMode = colorSwitch.checked;

            const filteredData = data.filter(d =>
                (selectedSeasonRange[0] <= d.season && d.season <= selectedSeasonRange[1]) &&
                (selectedTeam === "" || d.home_team === selectedTeam || d.away_team === selectedTeam)
            );

            const updatedFirstInningsScores = filteredData.map(d => parseInt(d.first_innings_score));
            const updatedSecondInningsScores = filteredData.map(d => parseInt(d.second_innings_score));
            const updatedColors = filteredData.map(d => assignColor(d.winner, filterMode, selectedTeam));

            const updatedTrace = {
                x: updatedFirstInningsScores,
                y: updatedSecondInningsScores,
                mode: 'markers',
                marker: {
                    size: 12,
                    color: updatedColors,
                    symbol: 'square',
                    opacity: 0.8
                },
                type: 'scatter',
                text: filteredData.map(d => `<i>${d.description}</i><br><span>${d.name} | <b>${d.result}</b> | 1st: ${d.first_innings_score}, 2nd: ${d.second_innings_score}<span>`),
                hoverinfo: 'text',
                hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: 'black',
                    font: { size: 12, color: 'black' },
                    namelength: 0
                },
                hovertemplate: '%{text}'
            };

            Plotly.react('plot', [updatedTrace], layout);
        };

        const resetFilters = () => {
            seasonRangeSlider.noUiSlider.set([seasons[0], seasons[seasons.length - 1]]);
            teamFilter.value = '';
            colorSwitch.checked = false;
            applyFilters();
        };

        const firstInningsScores = data.map(d => parseInt(d.first_innings_score));
        const secondInningsScores = data.map(d => parseInt(d.second_innings_score));

        const trace = {
            x: firstInningsScores,
            y: secondInningsScores,
            mode: 'markers',
            marker: {
                size: 8,
                color: 'rgb(30, 136, 229)',
                symbol: 'square',
                line: {
                    color: 'rgb(30, 136, 229)',
                    width: 0.5
                },
                opacity: 0.8
            },
            type: 'scatter',
            text: data.map(d => `<i>${d.description}</i><br><span>${d.name} | <b>${d.result}</b> | 1st: ${d.first_innings_score}, 2nd: ${d.second_innings_score}<span>`),
            hoverlabel: {
                bgcolor: 'white',
                bordercolor: 'black',
                font: { size: 12, color: 'black' },
                namelength: 0
            },
            hovertemplate: '%{text}'
        };

        const layout = {
            title: 'IPL Scorigami',
            xaxis: {
                title: 'First Innings Score',
                autorange: true
            },
            yaxis: {
                title: 'Second Innings Score',
                autorange: true
            },
            hovermode: 'closest',
            height: 600,
            dragmode: false,
            selectdirection: 'none'
        };

        Plotly.newPlot('plot', [trace], layout);

        seasonRangeSlider.noUiSlider.on('update', applyFilters);
        teamFilter.addEventListener('change', applyFilters);
        colorSwitch.addEventListener('change', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
    });
