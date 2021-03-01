TRUNCATE libra_patrons, libra_books, libra_checks RESTART IDENTITY CASCADE;

INSERT INTO libra_patrons (first, last)
VALUES
  ('Joe', 'Smith'),
  ('Bob', 'Johnson'),
  ('John', 'Baker'),
  ('John', 'Barber');

INSERT INTO libra_books (title, page_count, genre, isbn)
VALUES
  ('A Game of Thrones', 694, 'political fiction', '0-553-10354-7'),
  ('Being and Time', 589, 'philosophy', '0-631-19770-2'),
  ('The Life of Pi', 352, 'philosophical fiction', '0-676-97376-0'),
  ('And Then There Were None', 272, 'mystery', '9780312330873'),
  ('The Water Dancer', 407, 'historical fiction', '978-0-399-59059-7'),
  ('The Eyes of the Dragon', 326, 'fantasy', '978-0-670-81458-9'),
  ('Where the Crawdads Sing', 384, 'literary fiction', '9780735219113'),
  ('Mastering the Art of French Cooking', 726, 'culinary', '0-375-41340-5'),
  ('Notes of a Native Son', 192, 'essay', '9780807064313'),
  ('The City of God', 982, 'philosophy', '9780679600879');