import time
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

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/71.0.3578.98 Safari/537.36'
}

URL = "https://m.imdb.com/chart/top/"
MOVIES_DATA = []


def scrape_movie_data(movie_link):
    response = requests.get(url=movie_link, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')

    title = soup.find('span', class_='hero__primary-text', attrs={'data-testid': 'hero__primary-text'}).text
    rating = soup.find('span', class_='sc-bde20123-1 cMEQkK').text

    genre_div = soup.find('div', {'class': 'ipc-chip-list__scroller'})
    genres = [chip.find('span', {'class': 'ipc-chip__text'}).get_text() for chip in genre_div.find_all('a')]

    year_div = soup.find('div', class_="sc-b7c53eda-0 dUpRPQ")
    year_link = year_div.find('a', class_="ipc-link ipc-link--baseAlt ipc-link--inherit-color")
    year = year_link.text

    try:
        directors_ul = soup.select_one('span:contains("Directors") + div ul').find_all('li')
        directors = [director.text for director in directors_ul]
    except:
        directors = [soup.find('a', class_="ipc-metadata-list-item__list-content-item "
                                           "ipc-metadata-list-item__list-content-item--link").text]

    cast_links = soup.find_all('a', {'data-testid': 'title-cast-item__actor'})
    cast = [actor.get_text() for actor in cast_links]

    first_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'a.ipc-lockup-overlay.ipc-focusable'))
    )

    first_link.click()

    link_for_img = driver.find_element(By.CSS_SELECTOR, 'a[data-testid="mv-gallery-button"]').get_attribute('href')

    second_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[data-testid="mv-gallery-button"]'))
    )

    second_link.click()

    response = requests.get(url=link_for_img, headers=HEADERS)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, 'html.parser')
    img_src = soup.find('img', class_='poster').get('src')

    movie_data = {
        "title": title,
        "rating": rating,
        "genres": genres,
        "release_year": year,
        "director(s)": directors,
        "cast": cast,
        "image": img_src
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

    for movie_link in all_movies_links:
        driver.get(movie_link)
        try:
            award_div = driver.find_element(By.CSS_SELECTOR, "div[data-testid='awards']")
            # driver.execute_script("arguments[0].scrollIntoView(true);", award_div)
            movie_data = scrape_movie_data(driver.current_url)
            movies.append(movie_data)
        except (exceptions.NoSuchElementException, exceptions.ElementClickInterceptedException):
            pass

    return movies


choice = int(input('do you wish to just scrape the imdb top 250 only? (1) or with a director (2) or specific genres (3)'))


if choice == 1:
    try:
        chrome_options = webdriver.ChromeOptions()
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

        driver.get(URL)

        movies = driver.find_elements(By.CSS_SELECTOR, "a.ipc-title-link-wrapper h3.ipc-title__text")
        movie_links = [movie.find_element(By.XPATH, "./ancestor::a").get_attribute('href') for movie in movies][:251]

        for link in movie_links:
            driver.get(link)
            # time.sleep(0.25)

            current_movie_data = scrape_movie_data(link)
            MOVIES_DATA.append(current_movie_data)
            # time.sleep(0.25)

            driver.back()

    except Exception as e:
        print(f'Error has occurred: {e}')

    finally:
        df = pd.DataFrame(MOVIES_DATA)
        df.to_csv("imdb_top_250_movies_dataset.csv")
        driver.quit()
        
elif choice == 2:
    director = input('please specify the director...')

    chrome_options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    driver.get(URL)

    search_field = driver.find_element(By.XPATH, '//*[@id="suggestion-search"]')
    search_button = driver.find_element(By.XPATH, '//*[@id="suggestion-search-button"]')

    search_field.send_keys(director)
    search_button.click()

    movies_for_director = scrape_with_director(driver)
    df = pd.DataFrame(movies_for_director)
    df.to_csv(f"imdb_top_movies_for_director_{director}_dataset.csv")
    driver.quit()

elif choice == 3:
    genres = list(input('please specify the genres separated by a space (from drama, horror, action, thriller, '
                        'sci-fi, comedy, short, history, biography, crime)...').split(' '))

    movies_data_with_genres = []
    chrome_options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    driver.get(URL)

    movies = driver.find_elements(By.CSS_SELECTOR, "a.ipc-title-link-wrapper h3.ipc-title__text")
    movie_links = [movie.find_element(By.XPATH, "./ancestor::a").get_attribute('href') for movie in movies][:251]

    for link in movie_links:
        driver.get(link)
        # time.sleep(0.25)

        genre_div = driver.find_element(By.CLASS_NAME, "ipc-chip-list__scroller")
        genre_elements = genre_div.find_elements(By.CSS_SELECTOR, "a > span.ipc-chip__text")
        genres_curr_movie = [element.text.lower() for element in genre_elements]

        if all([genre in genres_curr_movie for genre in genres]):
            current_movie_data = scrape_movie_data(link)
            movies_data_with_genres.append(current_movie_data)

        # time.sleep(0.25)
        driver.back()

    df = pd.DataFrame(movies_data_with_genres)
    df.to_csv("imdb_top_movies_for_specified_genres_dataset.csv")
    driver.quit()
        
