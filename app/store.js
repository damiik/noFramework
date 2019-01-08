// Store class: handles storage
class Store {

    static getBooks() {
        
        let books = [];
        if(localStorage.getItem('books') !== null) {

            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    };

    static addBook(book) {

        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify( books));
    };

    static updateBook(book) {

        const books = Store.getBooks();

        books.forEach((updatedBook) => {

            if(updatedBook.id == book.id) {
                updatedBook.title = book.title;
                updatedBook.user = book.user;
                updatedBook.tags = book.tags;
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    };

    static removeBook(id) {

        const books = Store.getBooks();

        books.forEach((book, index) => {

            if(book.id == id || (book.id === undefined && book.id === undefined)) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    };
}
export default Store;