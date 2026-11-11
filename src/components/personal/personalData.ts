export type Book = {
  slug: string;
  title: string;
  author: string;
  year: string;
  cover: string;
  genre: string;
  about: string;
  url: string;
};

export type Movie = {
  slug: string;
  title: string;
  director: string;
  year: string;
  poster: string;
  genre: string;
  about: string;
  url: string;
};

const wiki = (page: string) => `https://en.wikipedia.org/wiki/${page}`;

export const books: Book[] = [
  {
    slug: "song-of-achilles",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    year: "2011",
    cover: "/assets/books/song-of-achilles.jpg",
    genre: "Mythology",
    about: "The Iliad retold by Patroclus — a love story that knows exactly how it ends, and makes you hope anyway.",
    url: wiki("The_Song_of_Achilles"),
  },
  {
    slug: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    year: "c. 180",
    cover: "/assets/books/meditations.jpg",
    genre: "Philosophy",
    about: "Private notes of a Roman emperor to himself on duty, mortality and keeping a steady mind.",
    url: wiki("Meditations"),
  },
  {
    slug: "exhalation",
    title: "Exhalation",
    author: "Ted Chiang",
    year: "2019",
    cover: "/assets/books/exhalation.jpg",
    genre: "Science fiction",
    about: "Nine quiet, precise stories about time, free will and what a thinking machine might feel.",
    url: wiki("Exhalation:_Stories"),
  },
  {
    slug: "golden-son",
    title: "Golden Son",
    author: "Pierce Brown",
    year: "2015",
    cover: "/assets/books/golden-son.jpg",
    genre: "Science fiction",
    about: "Darrow climbs deeper into the Society he swore to destroy, and the war turns personal.",
    url: wiki("Golden_Son"),
  },
  {
    slug: "red-rising",
    title: "Red Rising",
    author: "Pierce Brown",
    year: "2014",
    cover: "/assets/books/red-rising.jpg",
    genre: "Science fiction",
    about: "A Helium-3 miner on Mars is remade as a Gold to burn the colour hierarchy down from inside.",
    url: wiki("Red_Rising"),
  },
  {
    slug: "no-longer-human",
    title: "No Longer Human",
    author: "Osamu Dazai",
    year: "1948",
    cover: "/assets/books/no-longer-human.jpg",
    genre: "Literary fiction",
    about: "A man performs being human for everyone around him until the mask is all that is left.",
    url: wiki("No_Longer_Human"),
  },
  {
    slug: "between-the-acts",
    title: "Between the Acts",
    author: "Virginia Woolf",
    year: "1941",
    cover: "/assets/books/between-the-acts.jpg",
    genre: "Modernist",
    about: "One summer day, one village pageant, the war just over the horizon — Woolf's final novel.",
    url: wiki("Between_the_Acts"),
  },
  {
    slug: "letters-to-milena",
    title: "Letters to Milena",
    author: "Franz Kafka",
    year: "1952",
    cover: "/assets/books/letters-to-milena.jpg",
    genre: "Letters",
    about: "Kafka writing to his Czech translator Milena Jesenská — tender, anxious and completely unguarded.",
    url: wiki("Letters_to_Milena"),
  },
];

export const movies: Movie[] = [
  {
    slug: "blue-jay",
    title: "Blue Jay",
    director: "Alex Lehmann",
    year: "2016",
    poster: "/assets/movies/blue-jay.jpg",
    genre: "Drama · Romance",
    about: "Two former high-school sweethearts run into each other back home and spend one long, black-and-white night with what might have been.",
    url: wiki("Blue_Jay_(film)"),
  },
  {
    slug: "anyone-but-you",
    title: "Anyone but You",
    director: "Will Gluck",
    year: "2023",
    poster: "/assets/movies/anyone-but-you.webp",
    genre: "Romantic comedy",
    about: "Two people who can't stand each other fake a relationship at a wedding in Sydney — Much Ado About Nothing with sunscreen.",
    url: wiki("Anyone_but_You"),
  },
  {
    slug: "the-longest-ride",
    title: "The Longest Ride",
    director: "George Tillman Jr.",
    year: "2015",
    poster: "/assets/movies/the-longest-ride.png",
    genre: "Romance · Drama",
    about: "A bull rider and an art student, and an old man's letters — two love stories decades apart, braided together.",
    url: wiki("The_Longest_Ride_(film)"),
  },
  {
    slug: "requiem-for-a-dream",
    title: "Requiem for a Dream",
    director: "Darren Aronofsky",
    year: "2000",
    poster: "/assets/movies/requiem-for-a-dream.jpg",
    genre: "Psychological drama",
    about: "Four lives come apart to addiction over three seasons. Relentless, and impossible to forget.",
    url: wiki("Requiem_for_a_Dream"),
  },
];
