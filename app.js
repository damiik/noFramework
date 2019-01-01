
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

    constructor(el = undefined) { this.el = el; }
    render() { return this.el; }
    remove() { if( this.el ) this.el.remove(); }

    appendWithId(el, id) {
      
      let child = this.el.appendChild(document.createElement(el));
      child.setAttribute("id", id);
      return child;
    }

    appendWithClass(el, className) {
      
      let child = this.el.appendChild(document.createElement(el));
      child.setAttribute("class", className);
      return child;
    }
}



class BookItem extends Showable {

    constructor(book, onEditClick, onDeleteClick) {

        super(document.createElement('tr'));  
        this.el.setAttribute("id", book.isbn);
        this.book = book;
        this.onEditClick = onEditClick;
        this.onDeleteClick = onDeleteClick;
     }

    render() {

        this.el.innerHTML =  `
        <td>${this.book.title}</td>
        <td>${this.book.author}</td>
        <td>${this.book.isbn}</td>
        <td>
        <a href="#" onClick="(${this.onEditClick})('${this.book.title}', '${this.book.author}', '${this.book.isbn}');" class="btn btn-success btn-sm edit">Edit</a> 
        </td>
        <td>
        <a href="#" onClick="(${this.onDeleteClick})('${this.book.title}', '${this.book.author}', '${this.book.isbn}');" class="btn btn-danger btn-sm delete">X</a> 
        </td>
        `;
        return super.render();
    }
}


class BookTable extends Showable  {

    constructor() {

        super(document.createElement('table'));
        this.el.className = `table table-striped mt-5`;
        this.columns =  ["Title", "Author", "ISBN", ""];
    }

    render(books) {

       this.el.innerHTML =  `
        <thead>
        <tr>
        ${this.columns.map(t => "<th>"+t+"</th>").reduce((s, t) => s + t)}
        </tr>
        </thead>
        `;

      let bookList = this.appendWithId('tbody', 'book-list');
      //console.log(IdEl('book-list')) is null!
      books.map(book => bookList.appendChild(book.render()));
      
      return super.render();
    }
}


class BookForm extends Showable {

    constructor(onSubmit) {

        super(document.createElement('form'));
        this.el.setAttribute('id', 'book-form');

        //this.el.attachEvent('onsubmit', onSubmit);
        this.el.addEventListener('submit', onSubmit);        
    }

    render() {


        this.el.innerHTML =  `

            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" class="form-control">
            </div>
            <div class="form-group">
                    <label for="author">Author</label>
                    <input type="text" id="author" class="form-control">
            </div>
            <div class="form-group">
                    <label for="isbn">ISBN</label>
                    <input type="text" id="isbn" class="form-control">
            </div>  
            <input type="submit" value="Add Book" class="btn btn-primary btn-block" id="add-update-book">  
        `;

        return super.render();
    }
}


let editButtonClick = (app) => {

    return (title, author, isbn) => {

        console.log(`edit button click with isbn ${title}`)

        setVal('#title', title)
        setVal('#author', author)
        setVal('#isbn', isbn)
        app.editMode = true;
        setVal('#add-update-book', 'Update');
    };
}


let deleteButtonClick = (app) => {

    return (title, author, isbn) => {

        console.log(`delete button click with isbn ${title}`)

        Store.removeBook( isbn );
        let deleted = app.removeBook( isbn );
        if( deleted ) {

            setVal('#title', deleted.title)
            setVal('#author', deleted.author)
            setVal('#isbn', deleted.isbn)
        }
        
        app.showAlert('Book Removed', 'success');
    };
}


let bookFormSubmit = (app) => {

    return (e) => {

        e.preventDefault();
        if(app.editMode) {   // update book

            app.editMode = false;
            setVal('#add-update-book', "Add Book");
        
            let {err, bookItem} = app.updateBook(getVal('#title'), getVal('#author'), getVal('#isbn') );
            if( err ) app.showAlert(err, 'warning');
            else {

                Store.updateBook(bookItem.book);
                app.showAlert('Book Updated', 'success');   
                setVal('#title', '');
                setVal('#author', '');
                setVal('#isbn', '');
            }  
        }
        else {  // add book

            let {err, bookItem}  = app.addBook(getVal('#title'), getVal('#author'), getVal('#isbn'));
            if( err ) app.showAlert(err, 'warning');
            else {
            //IdEl('book-list').appendChild(bookItem.render())
                Store.addBook( bookItem.book );
                app.showAlert('Book Added', 'success');   
                setVal('#title', '');
                setVal('#author', '');
                setVal('#isbn', '');
            }                
        }
    }
}


class App {

    constructor() {

        this.info = "Hello from App";

        let sb = Store.getBooks();
       
        this.bookForm = new BookForm( (bookFormSubmit)(this) );
        this.bookTable = new BookTable();        
        this.editMode = false;
        this.books = sb.map((b) => new BookItem(b, 

            ( editButtonClick )(this),
            ( deleteButtonClick )(this)
        ));

        document.addEventListener('DOMContentLoaded', () => {

            this.render();
            // addEvent('#book-list','click', (e) => { // dodaje event do book-list bo przyciski jeszcze nie istnieją!


            // });  
            
            //this.bookForm.el.addEventListener('submit', bookFormSubmit);
            // // Event: Add a Book
            // addEvent('#book-form', 'submit', (e) => {

            //     e.preventDefault();
            //     if(this.editMode) {   // update book

            //         this.editMode = false;
            //         setVal('#add-update-book', "Add Book");
                
            //         let {err, bookItem} = this.updateBook(getVal('#title'), getVal('#author'), getVal('#isbn') );
            //         if( err ) this.showAlert(err, 'warning');
            //         else {

            //             Store.updateBook(bookItem.book);
            //             this.showAlert('Book Updated', 'success');   
            //             setVal('#title', '');
            //             setVal('#author', '');
            //             setVal('#isbn', '');
            //         }  
            //     }
            //     else {  // add book

            //         let {err, bookItem}  = this.addBook(getVal('#title'), getVal('#author'), getVal('#isbn'));
            //         if( err ) this.showAlert(err, 'warning');
            //         else {
            //         //IdEl('book-list').appendChild(bookItem.render())
            //             Store.addBook( bookItem.book );
            //             this.showAlert('Book Added', 'success');   
            //             setVal('#title', '');
            //             setVal('#author', '');
            //             setVal('#isbn', '');
            //         }                
            //     }
            // });
        });
    }

    
    render() {

       IdEl('main-container').appendChild( this.bookForm.render() );        
       IdEl('main-container').appendChild( this.bookTable.render(this.books) );
    }

    showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message

        El('.container').insertBefore(div, IdEl('book-form'));

        setTimeout(() => { El('.alert').remove(); }, 3000);
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
        
        let {err, bookItem} = {undefined, undefined};
        if(title === '' || author === '' || isbn === '') err = 'Please fill in all fields';
        if(this.getBookIndex(isbn) > -1) err = 'ISBN number must be unique!';  
      
        if(!err) {

            bookItem = new BookItem(
                {title, author, isbn}, 
                ( editButtonClick )(this),
                ( deleteButtonClick )(this)
            );
            this.books = [...this.books, bookItem];
            IdEl('book-list').appendChild(bookItem.render());
        }
        return {err, bookItem};
    }
  
    updateBook(title, author, isbn) {

        let {err, bookItem} = {undefined, undefined};
        if(title === '' || author === '' || isbn === '') err = 'Please fill in all fields';
        if(!err) {
          
           let {err, bookItem} = this.getBook( isbn );

           if(bookItem !== undefined) {
              bookItem.book.title = title;
              bookItem.book.author = author;
              bookItem.render(); // !!!!! super !!!!!! updated only changed element
            }
          return {err, bookItem};
        }
        return {err, bookItem};
    }

    removeBook( isbn ) {

        let bookItemIndex = this.getBookIndex( isbn );
        if(bookItemIndex > -1) {

            let toDelete = this.books[ bookItemIndex ];
            toDelete.remove();
            this.books.splice(bookItemIndex, 1);
            console.log( toDelete )
            return toDelete.book;
        }

        return {};
    }
};

let app = new App();


