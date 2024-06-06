fetch('/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Color mapping for teams
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

        const assignColor = (team) => {
            return teamColors[team] || 'rgb(30, 136, 229)'; // Default to blue if color not found
        };

        // Filter out null values and format seasons
        const seasons = [...new Set(data.map(d => d.season).filter(season => season !== null))]
            .map(season => parseInt(season))
            .sort((a, b) => a - b);

        const teams = [...new Set(data.map(d => d.home_team).filter(team => team !== null))].sort();

        const seasonFilter = document.getElementById('seasonFilter');
        const teamFilter = document.getElementById('teamFilter');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const colorModeSwitch = document.getElementById('flexSwitchCheckChecked');
        const colorModeSwitchContainer = document.getElementById('colorModeSwitchContainer');

        seasons.forEach(season => {
            seasonFilter.innerHTML += `<option value="${season}">${season}</option>`;
        });

        teams.forEach(team => {
            teamFilter.innerHTML += `<option value="${team}">${team}</option>`;
        });

        // Function to apply filters and update the plot
        const applyFilters = () => {
            const selectedSeason = seasonFilter.value;
            const selectedTeam = teamFilter.value;
            const colorByTeamWin = colorModeSwitch.checked;

            const filteredData = data.filter(d =>
                (selectedSeason === "" || parseInt(d.season) === parseInt(selectedSeason)) &&
                (selectedTeam === "" || d.home_team === selectedTeam || d.away_team === selectedTeam)
            );

            const updatedFirstInningsScores = filteredData.map(d => parseInt(d.first_innings_score));
            const updatedSecondInningsScores = filteredData.map(d => parseInt(d.second_innings_score));

            const updatedColors = filteredData.map(d => {
                if (selectedTeam === "") {
                    return assignColor();
                } else if (colorByTeamWin) {
                    return d.winner === selectedTeam ? 'green' : 'red';
                } else {
                    return assignColor(d.winner);
                }
            });

            const updatedTrace = {
                x: updatedFirstInningsScores,
                y: updatedSecondInningsScores,
                mode: 'markers',
                marker: {
                    size: 8,
                    color: updatedColors,
                    symbol: 'square',
                    opacity: 0.8
                },
                type: 'scatter',
                text: filteredData.map(d => `<i>${d.description}</i><br><span>${d.name} | <b>${d.result}</b> | 1st: ${d.first_innings_score}, 2nd: ${d.second_innings_score}</span>`),
                hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: 'black',
                    font: { size: 12, color: 'black' },
                    namelength: 0
                },
                hovertemplate: '%{text}' // Display hover text
            };

            const layout = {
                title: 'IPL Scorigami',
                xaxis: {
                    title: 'First Innings Score',
                    range: 'auto'
                },
                yaxis: {
                    title: 'Second Innings Score',
                    range: 'auto'
                },
                hovermode: 'closest',
                height: 600,
                dragmode: false,
                selectdirection: 'none'
            };

            Plotly.react('plot', [updatedTrace], layout);

            // Show/hide the color mode switch based on team filter
            if (selectedTeam !== "") {
                colorModeSwitchContainer.style.display = 'block';
            } else {
                colorModeSwitchContainer.style.display = 'none';
            }
        };

        // Initial plot
        applyFilters();

        // Event listeners for filters and switch
        seasonFilter.addEventListener('change', applyFilters);
        teamFilter.addEventListener('change', applyFilters);
        colorModeSwitch.addEventListener('change', applyFilters);
        resetFiltersBtn.addEventListener('click', () => {
            seasonFilter.value = '';
            teamFilter.value = '';
            colorModeSwitch.checked = false;
            applyFilters();
        });
    })
    .catch(error => console.error('Error fetching data:', error));
