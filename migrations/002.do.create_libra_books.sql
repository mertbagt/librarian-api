CREATE TABLE libra_books (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    page_count INTEGER,
    genre TEXT NOT NULL,
    isbn TEXT NOT NULL
);