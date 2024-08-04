import cast from '../cast_mapping.json' assert { type: 'json' };

// Define the array of directors
const directors = [
    'Aamir Khan', 'Adam Elliot', 'Akira Kurosawa', 'Alejandro G. Iñárritu', 'Alfred Hitchcock',
    'Andrew Stanton', 'Anthony Russo', 'Asghar Farhadi', 'Billy Wilder', 'Bob Persichetti',
    'Bong Joon Ho', 'Brad Bird', 'Brian De Palma', 'Bryan Singer', 'Buster Keaton',
    'Carl Theodor Dreyer', 'Carol Reed', 'Charles Chaplin', 'Christopher Nolan', 'Clint Eastwood',
    'Clyde Bruckman', 'Curtis Hanson', 'Damien Chazelle', 'Damián Szifron', 'Danny Boyle',
    'Darren Aronofsky', 'David Fincher', 'David Lean', 'David Lynch', 'David Yates',
    'Dean DeBlois', 'Denis Villeneuve', 'Elem Klimov', 'Elia Kazan', 'Ernst Lubitsch',
    'Ethan Coen', 'Fernando Meirelles', 'Florian Henckel von Donnersmarck', 'Florian Zeller',
    'Francis Ford Coppola', 'Frank Capra', 'Frank Darabont', 'Fritz Lang', 'Gavin O"Connor',
    'George Lucas', 'George Miller', 'George Roy Hill', 'Gillo Pontecorvo', 'Giuseppe Tornatore',
    'Gore Verbinski', 'Guillermo del Toro', 'Gus Van Sant', 'Guy Ritchie', 'Harold Ramis',
    'Hayao Miyazaki', 'Henri-Georges Clouzot', 'Ingmar Bergman', 'Irvin Kershner', 'Isao Takahata',
    'James Cameron', 'James Mangold', 'James McTeigue', 'Jean-Pierre Jeunet', 'Jim Sheridan',
    'Joaquim Dos Santos', 'Joel Coen', 'John Carpenter', 'John Ford', 'John G. Avildsen',
    'John Huston', 'John Lasseter', 'John McTiernan', 'John Sturges', 'Jon Watts',
    'Jonathan Demme', 'Joseph Kosinski', 'Joseph L. Mankiewicz', 'Juan José Campanella', 'Kevin Costner',
    'Lana Wachowski', 'Lasse Hallström', 'Lee Unkrich', 'Lenny Abrahamson', 'Luc Besson',
    'M. Night Shyamalan', 'Majid Majidi', 'Makoto Shinkai', 'Martin McDonagh', 'Martin Scorsese',
    'Masaki Kobayashi', 'Mathieu Kassovitz', 'Mel Gibson', 'Michael Cimino', 'Michael Curtiz',
    'Michael Mann', 'Michel Gondry', 'Milos Forman', 'Nadine Labaki', 'Nitesh Tiwari',
    'Oliver Hirschbiegel', 'Oliver Stone', 'Olivier Nakache', 'Orson Welles', 'Park Chan-wook',
    'Paul Thomas Anderson', 'Pete Docter', 'Peter Farrelly', 'Peter Jackson', 'Peter Weir',
    'Quentin Tarantino', 'Rajkumar Hirani', 'Richard Linklater', 'Richard Marquand', 'Ridley Scott',
    'Rob Reiner', 'Robert Mulligan', 'Robert Wise', 'Robert Zemeckis', 'Roberto Benigni',
    'Roger Allers', 'Roman Polanski', 'Ron Clements', 'Ron Howard', 'Sam Mendes',
    'Sean Penn', 'Sergio Leone', 'Sergio Pablos', 'Sidney Lumet', 'Stanley Donen',
    'Stanley Kramer', 'Stanley Kubrick', 'Steve McQueen', 'Steven Spielberg', 'Stuart Rosenberg',
    'T.J. Gnanavel', 'Takashi Yamazaki', 'Tate Taylor', 'Terry George', 'Terry Gilliam',
    'Thomas Kail', 'Thomas Vinterberg', 'Todd Phillips', 'Tom McCarthy', 'Tony Kaye',
    'Victor Fleming', 'Vidhu Vinod Chopra', 'Vittorio De Sica', 'Wes Anderson', 'William Friedkin',
    'William Wyler', 'Wim Wenders', 'Wolfgang Petersen', 'Yasujirô Ozu', 'Çagan Irmak'
  ];
    

// Define the array of genres
const genres = [
    'Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery', 'Adventure',
    'Music', 'War', 'History', 'Crime', 'Animation'
];

export { directors, genres, cast };