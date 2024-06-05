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
            "Kochi Tuskers Kerala": "#ff5917",
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

        // Function to assign color based on winner
        const assignColor = (team) => {
            if (teamFilter.value === '') {
                return 'rgb(30, 136, 229)'
            } else {
                return teamColors[team];
            }
        };
        

        // Filter out null values and format seasons
        const seasons = [...new Set(data.map(d => d.season).filter(season => season !== null))]
            .map(season => parseInt(season))
            .sort((a, b) => a - b);

        const teams = [...new Set(data.map(d => d.home_team).filter(team => team !== null))].sort();

        const seasonFilter = document.getElementById('seasonFilter');
        const teamFilter = document.getElementById('teamFilter');
        const resetFiltersBtn = document.getElementById('resetFilters');

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

            const filteredData = data.filter(d =>
                (selectedSeason === "" || parseInt(d.season) === parseInt(selectedSeason)) &&
                (selectedTeam === "" || d.home_team === selectedTeam || d.away_team === selectedTeam)
            );

            const updatedFirstInningsScores = filteredData.map(d => parseInt(d.first_innings_score));
            const updatedSecondInningsScores = filteredData.map(d => parseInt(d.second_innings_score));

            const updatedColors = filteredData.map(d => assignColor(d.winner));

            const updatedTrace = {
                x: updatedFirstInningsScores,
                y: updatedSecondInningsScores,
                mode: 'markers',
                marker: {
                    size: 12,
                    color: updatedColors, // Assign colors based on winners
                    symbol: 'square',
                    opacity: 0.8
                },
                type: 'scatter',
                text: filteredData.map(d => `<i>${d.description}</i><br><span>${d.name} | <b>${d.result}</b> | 1st: ${d.first_innings_score}, 2nd: ${d.second_innings_score}<span>`), // Updated hover text format
                hoverinfo: 'text',
                hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: 'black',
                    font: { size: 12, color: 'black' },
                    namelength: 0
                },
                hovertemplate: '%{text}' // Display hover text
            };

            Plotly.react('plot', [updatedTrace], layout);
        };

        // Reset Filters Function
        const resetFilters = () => {
            seasonFilter.value = '';
            teamFilter.value = '';

            applyFilters();
        };

        // Initial plot
        const firstInningsScores = data.map(d => parseInt(d.first_innings_score));
        const secondInningsScores = data.map(d => parseInt(d.second_innings_score));

        const trace = {
            x: firstInningsScores,
            y: secondInningsScores,
            mode: 'markers',
            marker: {
                size: 8,
                color: 'rgb(30, 136, 229)', // Default color
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
            hovertemplate: '%{text}' // Display hover text
        };

        const layout = {
            title: 'IPL Scorigami',
            xaxis: {
                title: 'First Innings Score',
                range: [40, 300]
            },
            yaxis: {
                title: 'Second Innings Score',
                range: [40, 300]
            },
            hovermode: 'closest',
            height: 600,
            dragmode: false,
            selectdirection: 'none'
        };

        Plotly.newPlot('plot', [trace], layout);

        // Attach event listeners to filters and reset button
        seasonFilter.addEventListener('change', applyFilters);
        teamFilter.addEventListener('change', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
    });
