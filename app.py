from flask import Flask, request, jsonify
import requests
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common import exceptions
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask_cors import CORS

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/scrape-imdb": {"origins": "http://localhost:5173"}})


URL = "https://m.imdb.com/chart/top/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/71.0.3578.98 Safari/537.36'
}


def scrape_movie_data(movie_link):
    response = requests.get(url=movie_link, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')

    title = soup.find('span', class_='hero__primary-text', attrs={'data-testid': 'hero__primary-text'}).text
    rating = soup.find('span', class_='sc-eb51e184-1 cxhhrI').text

    genre_div = soup.find('div', {'class': 'ipc-chip-list__scroller'})
    genres = [chip.find('span', {'class': 'ipc-chip__text'}).get_text() for chip in genre_div.find_all('a')]

    year_div = soup.find('div', class_="sc-1f50b7c-0 PUxFE")
    year = year_div.find('a', class_="ipc-link ipc-link--baseAlt ipc-link--inherit-color").text

    try:
        directors_ul = soup.select_one('span:contains("Directors") + div ul').find_all('li')
        directors = [director.text for director in directors_ul]
    except:
        directors = [soup.find('a', class_="ipc-metadata-list-item__list-content-item "
                                           "ipc-metadata-list-item__list-content-item--link").text]

    cast_links = soup.find_all('a', {'data-testid': 'title-cast-item__actor'})
    cast = [actor.get_text() for actor in cast_links]

    movie_data = {
        "title": title,
        "rating": rating,
        "genres": genres,
        "release_year": year,
        "director(s)": directors,
        "cast": cast,
        "image": ""  # Empty for now
    }

    return movie_data

def scrape_with_director(driver):
    movies = []

    director = driver.find_element(By.CLASS_NAME, 'ipc-metadata-list-summary-item__t')
    director.click()

    try:
        see_all = driver.find_element(By.CLASS_NAME, 'ipc-see-more__text')
        driver.execute_script("arguments[0].scrollIntoView(true);", see_all)
        see_all.click()
    except exceptions.ElementClickInterceptedException:
        pass

    div = driver.find_element(By.XPATH, '//*[@id="accordion-item-writer-previous-projects"]/div')
    all_movies_links = div.find_elements(By.CLASS_NAME, 'ipc-metadata-list-summary-item__t')
    all_movies_links = [link.get_attribute('href') for link in all_movies_links]

    for movie_link in all_movies_links[:3]:
        driver.get(movie_link)
        try:
            award_div = driver.find_element(By.CSS_SELECTOR, "div[data-testid='awards']")
            movie_data = scrape_movie_data(driver.current_url)
            movies.append(movie_data)
        except (exceptions.NoSuchElementException, exceptions.ElementClickInterceptedException):
            pass

    return movies

def scrape_imdb(choice, director=None, genres=None):
    chrome_options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    driver.get(URL)
    result = []

    if choice == 1:
        movies = driver.find_elements(By.CSS_SELECTOR, "a.ipc-title-link-wrapper h3.ipc-title__text")
        movie_links = [movie.find_element(By.XPATH, "./ancestor::a").get_attribute('href') for movie in movies][:5]

        for link in movie_links:
            driver.get(link)
            current_movie_data = scrape_movie_data(link)
            result.append(current_movie_data)
            driver.back()

    elif choice == 2:
        search_field = driver.find_element(By.XPATH, '//*[@id="suggestion-search"]')
        search_button = driver.find_element(By.XPATH, '//*[@id="suggestion-search-button"]')

        search_field.send_keys(director)
        search_button.click()

        result = scrape_with_director(driver)

    elif choice == 3:
        ct = 0
        movies_data_with_genres = []

        movies = driver.find_elements(By.CSS_SELECTOR, "a.ipc-title-link-wrapper h3.ipc-title__text")
        movie_links = [movie.find_element(By.XPATH, "./ancestor::a").get_attribute('href') for movie in movies]

        for link in movie_links:
            driver.get(link)

            genre_div = driver.find_element(By.CLASS_NAME, "ipc-chip-list__scroller")
            genre_elements = genre_div.find_elements(By.CSS_SELECTOR, "a > span.ipc-chip__text")
            genres_curr_movie = [element.text.lower() for element in genre_elements]

            if all([genre in genres_curr_movie for genre in genres]):
                current_movie_data = scrape_movie_data(link)
                movies_data_with_genres.append(current_movie_data)
                result.append(current_movie_data)
                ct += 1

            if ct == 3:
                break

            driver.back()

        df = pd.DataFrame(movies_data_with_genres)
        df.to_csv("imdb_top_movies_for_specified_genres_dataset.csv")

    driver.quit()
    return result

@app.route('/scrape-imdb', methods=['POST'])
def scrape_imdb_endpoint():
    data = request.json
    choice = data.get('choice')
    director = data.get('director')
    genres = data.get('genres')

    if choice == 1:
        result = scrape_imdb(choice)
    elif choice == 2:
        result = scrape_imdb(choice, director=director)
    elif choice == 3:
        result = scrape_imdb(choice, genres=genres)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)