
const IdEl = (id) => document.getElementById(id)
const El = (desc) => document.querySelector(desc)
const getVal = (desc) => El(desc).value;
const setVal = (desc, val) => El(desc).value = val;
const addEvent = (desc, e, f) => El(desc).addEventListener(e, f);



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

            if(updatedBook.isbn === book.isbn) {
                updatedBook.title = book.title;
                updatedBook.author = book.author;
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
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


class Showable {

    constructor() {
     
        this.el = undefined;
    }

    show( parent ) { this.el = parent.appendChild( this.makeHtml() ); }
    hide() { if( this.el ) this.el.remove(); }
    makeHtml() {}
}

class BookItem extends Showable {

    constructor(book) {

        super();    
        this.book = book;
    }

    makeHtml() {

        const row = document.createElement('tr');
        row.setAttribute("id", this.book.isbn);
        row.innerHTML =  `
        <td>${this.book.title}</td>
        <td>${this.book.author}</td>
        <td>${this.book.isbn}</td>
        <td>
        <a href="#" class="btn btn-sm edit">Edit</a> 
        </td>
        <td>
        <a href="#" class="btn btn-danger btn-sm delete">X</a> 
        </td>
        `;
        return row;
    }
}


class BookTable extends Showable  {

    constructor(books) {

        super();
        this.books = books;
        this.columns =  ["Title", "Author", "ISBN", ""];
    }

    show(parent) { 

        super.show(parent);
        let bookList = IdEl('book-list');
        this.books.forEach((bookItem) => {

            console.log(bookItem)   
            if(bookItem !== undefined) bookItem.show( bookList );
        });         
    }

    makeHtml() {

        const table = document.createElement('table');
        table.className = `table table-striped mt-5`;
        table.innerHTML =  `
        <thead>
        <tr>
        ${this.columns.map(t => "<th>"+t+"</th>").reduce((s, t) => s + t)}
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

    getBook(isbn) {

        let bookItemIndex = this.getBookIndex( isbn );
        if(bookItemIndex > -1) return {err:undefined, bookItem:this.books[ bookItemIndex ]};
        return {err:`Can't find book with isbn ${isbn}`, bookItem: undefined};
    }

    addBook(title, author, isbn) {   
        
        let err = '';
        if(title === '' || author === '' || isbn === '') err = 'Please fill in all fields';
        if(this.getBookIndex(isbn) > -1) err = 'ISBN no must be unique!';  
      
        if(!err) {

            let bookItem = new BookItem( {title, author, isbn});
            this.books = [...this.books, bookItem]
            bookItem.show( IdEl('book-list') );
            return {err, bookItem};
        }
        return {err, book:undefined};
    }

    removeBook( isbn ) {

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

// let isAvesome = (target) => {
  
//    target.isAvesome = true;
// }

// @isAvesome
class App {

    constructor() {

        let sb = Store.getBooks();
        this.bookTable = new BookTable( sb.map((b) => new BookItem( b )) );
        this.editMode = false;
        
        document.addEventListener('DOMContentLoaded', () => {

            addEvent('#book-list','click', (e) => { // dodaje event do book-list bo przyciski jeszcze nie istnieją!

                const isbn = e.target.parentElement.parentElement.id;               
                console.log("click:"+ isbn )
                if(e.target.classList.contains('delete')) {


                    console.log("remove:"+  isbn )
                    Store.removeBook( isbn );
                    let deleted = this.bookTable.removeBook( isbn );
                    if( deleted ) {

                        setVal('#title', deleted.title)
                        setVal('#author', deleted.author)
                        setVal('#isbn', deleted.isbn)
                    }
                    
                    this.showAlert('Book Removed', 'success');
                }
                else if(e.target.classList.contains('edit')) {

                    console.log("edit:"+  isbn )
                    let {err, bookItem} = this.bookTable.getBook( isbn );
                    console.log(bookItem)
                    if( bookItem ) {

                        setVal('#title', bookItem.book.title)
                        setVal('#author', bookItem.book.author)
                        setVal('#isbn', bookItem.book.isbn)
                        this.editMode = true;
                        setVal('#add-update-book', "Update");
                    }
                    else {

                        this.showAlert(err,  'warning');
                    }
                }
            });       
        });

        // Event: Add a Book
        addEvent('#book-form', 'submit', (e) => {

            e.preventDefault();
            if(this.editMode) {

                this.editMode = false;
                setVal('#add-update-book', "Add Book");
              
                let {err, bookItem} = this.bookTable.getBook( getVal('#isbn') );
                if( err ) this.showAlert(err, 'warning');
                else {
                    bookItem.book.title = getVal('#title');
                    bookItem.book.author = getVal('#author');
                    bookItem.hide();
                    bookItem.show(IdEl('book-list'));
                    Store.updateBook(bookItem.book);
                  
                    this.showAlert('Book Updated', 'success');   
                    setVal('#title', '');
                    setVal('#author', '');
                    setVal('#isbn', '');
                }  
            }
            else {

                let {err, bookItem}  = this.bookTable.addBook(getVal('#title'), getVal('#author'), getVal('#isbn'));
                if( err ) this.showAlert(err, 'warning');
                else {
                  
                    Store.addBook( bookItem.book );
                    this.showAlert('Book Added', 'success');   
                    setVal('#title', '');
                    setVal('#author', '');
                    setVal('#isbn', '');
                }                
            }
        });
    }

    
    show() {
        
        this.bookTable.show(IdEl('main-container'));    
    }

    showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message

        El('.container').insertBefore(div, IdEl('book-form'));

        setTimeout(() => { El('.alert').remove(); }, 3000);
    }
};

let app = new App();
app.show();



