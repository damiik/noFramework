
const El = (name) => document.querySelector(name)
const getVal = (name) => El(name).value;
const setVal = (name, val) => El(name).value = val;
const addEvent = (name, e, f) => El(name).addEventListener(e, f);



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

    static removeBook(isbn) {

        const books = Store.getBooks();

        books.forEach((book, index) => {

            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    };
}


class BookItem {

    constructor(parent, book) {

        this.parent = parent;        
        this.book = book;
        this.html = undefined;
    }

    show() { this.html = El(this.parent).appendChild(this.makeHtml());}
    hide() { if(this.html) this.html.remove(); }

    makeHtml() {

        const row = document.createElement('tr');
        row.setAttribute("id", this.book.isbn);
        row.innerHTML =  `
        <td>${this.book.title}</td>
        <td>${this.book.author}</td>
        <td>${this.book.isbn}</td>
        <td>
        <a href="#" class="btn btn-danger btn-sm delete">X</a> 
        </td>
        `;
        return row;
    }
}


class BookTable {

    constructor(parent, books) {

        this.parent = parent;
        this.books = books; 
        this.html = undefined;
    }
    show() { 

        this.html = El(this.parent).appendChild(this.makeHtml());
        this.books.forEach((bookItem) => {

            console.log(bookItem)   
            if(bookItem !== undefined) bookItem.show();
        });         
    }
    hide() { if(this.html) this.html.remove(); }

    makeHtml() {

        const table = document.createElement('table');
        table.className = `table table-striped mt-5`;
        table.innerHTML =  `
        <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th></th>
        </tr>
        </thead>
        <tbody id="book-list">
        
        </tbody>
        `;
 
        return table;
    }

    getBookIndex(isbn) {

        let bookItemIndex = -1;
        this.books.forEach((bookItem, index) => {

            if(bookItem !== undefined && bookItem.book.isbn === isbn)  bookItemIndex = index;
        });  
        return bookItemIndex;
    }

    addBook(title, author, isbn) {   
        let err = '';
        if(title === '' || author === '' || isbn === '') err = 'Please fill in all fields';
        if(this.getBookIndex(isbn) > -1) err = 'ISBN no must be unique!';  
      
        if(!err) {

            let bookItem = new BookItem('#book-list', {title, author, isbn});
            this.books = [...this.books, bookItem]
            bookItem.show();
            return {err, book:bookItem.book};
        }
        return {err, book:undefined};
    }


    removeBook(isbn) {

        let bookItemIndex = this.getBookIndex( isbn );
        if(bookItemIndex > -1) {
            let toDelete = this.books[ bookItemIndex ];
            toDelete.hide();
            this.books.splice(bookItemIndex, 1);
            console.log(toDelete)
            return toDelete.book;
        }
        return {};
    }
}



class App {

    constructor() {

        let sb = Store.getBooks();
        this.bookTable = new BookTable('#main-container', sb.map((b) => new BookItem('#book-list', b) ));
        //this.books = sb.map((b) => new BookItem('#book-list', b) ); 

        
        document.addEventListener('DOMContentLoaded', () => {

            this.show();

            addEvent('#book-list','click', (e) => { // dodaje event do book-list bo przyciski jeszcze nie istnieją!
                
                const isbn = e.target.parentElement.parentElement.id;
                console.log( isbn)
                Store.removeBook( isbn );
                let deleted = this.bookTable.removeBook( isbn );
                if( deleted ) {

                    setVal('#title', deleted.title)
                    setVal('#author', deleted.author)
                    setVal('#isbn', deleted.isbn)
                }
                
                this.showAlert('Book Removed', 'success');
            });       


        });

        // Event: Add a Book
        addEvent('#book-form', 'submit', (e) => {

            e.preventDefault();

            let {err, book}  = this.bookTable.addBook(getVal('#title'), getVal('#author'), getVal('#isbn'));
            if( err ) this.showAlert(err, 'warning');
            else {
                Store.addBook( book );
                this.showAlert('Book Added', 'success');   
                setVal('#title', '');
                setVal('#author', '');
                setVal('#isbn', '');
            }
        });
    }

    
    show() {

        this.bookTable.show();    
        
         // Event: Remove a Book

    }

    showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message

        El('.container').insertBefore(div, El('#book-form'));

        setTimeout(() => { El('.alert').remove(); }, 3000);
    }
};

let app = new App();



