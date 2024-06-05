# IPL Scorigami

IPL Scorigami is a web application that visualizes the first and second innings scores of all completed IPL games, including those decided by the Duckworth–Lewis–Stern (DLS) method. This project uses Flask for the backend, Plotly for interactive plotting, and SQLAlchemy for database interactions. Bootstrap CSS is used for presentation and styling.

## Previous Repos

Due to struggle with database migration, extended version history is stored at two previous repos:
- https://github.com/arulgundam/ipl_scorigami_deprecated2
- https://github.com/arulgundam/ipl_scorigami_deprecated

## Features

- Interactive plot of IPL match scores
- Filters for season and team
- Filter reset functionality

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/arulgundam/ipl_scorigami.git
    cd ipl_scorigami
    ```

2. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the required packages:
    ```bash
    pip install -r requirements.txt

4. Run the application:
    ```bash
    flask run
    ```

## Usage

- Access the application at `http://127.0.0.1:5000/`
- Use the filters to view specific seasons or teams
- Click on data points in the plot to see detailed match information
- Reset data using `http://127.0.0.1:5000/reset_data`

## Project Structure

- `app.py`: The main Flask application file
- `templates/`: HTML templates
- `static/js/`: JavaScript files
- `static/css/`: CSS files
- `data/`: Data files (CSV)

## License

This project is licensed under the MIT License.

## Acknowledgments

- Jon Bois for the concept of Scorigami
- Plotly for interactive plotting
- Flask for the web framework

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request
