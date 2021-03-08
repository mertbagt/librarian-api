# Librarian API
 
API datebase to support Librarian app at: https://librarian-drab.vercel.app/

App allows a librarian to manage a collection of books and track which patron they are checked out to.

API endpoints are:

## /books

table containing title, page_count, genre and isbn data

## /patrons
 
table containing first and last (names) data

## /checks

table containing patron_id and book_id data.  Used for tracking which books are checked to which patrons.

### (JavaScript/Node/Express/PostgreSQL)
