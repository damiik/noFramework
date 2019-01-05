
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
        this.el.setAttribute("id", book.id);
        this.book = book;
        this.onEditClick = onEditClick;
        this.onDeleteClick = onDeleteClick;
     }

    render() {

        this.el.innerHTML =  `
        <td class="app-info">${this.book.title}</td>
        <td class="app-info">${this.book.user}</td>
        <td class="app-info">${this.book.tags}</td>
        <td class="app-info">
        <a href="#" onClick="(${this.onEditClick})('${this.book.title}', '${this.book.user}', '${this.book.tags}', '${this.book.id}');" class="btn-noframe edit"><i class="fas fa-edit light"></i> Edit</a> 
        </td>
        <td class="app-info">
        <a href="#" onClick="(${this.onDeleteClick})('${this.book.title}', '${this.book.user}', '${this.book.tags}', '${this.book.id}');" class="btn-danger delete"><i class="fas fa-times-circle "></i></a> 
        </td>
        `;
        return super.render();
    }
}


class BookTable extends Showable  {

    constructor() {

        super(document.createElement('table'));
        this.el.className = 'table frame';
        //this.el.setAttribute("id",  'book-list'); //<<added
        this.columns =  ["Title", "User", "Tags", "", ""];
    }

    render(books) {

       this.el.innerHTML =  `
        <thead>
        <tr>
        ${this.columns.map(t => "<th>"+t+"</th>").reduce((s, t) => s + t)}
        </tr>
        </thead>
        `;

        console.log("render(books) ")

      let bookList = this.appendWithId('tbody', 'book-list');
      //console.log(IdEl('book-list')) is null!
      books.map(book => bookList.appendChild(book.render()));
      
      return super.render();
    }
}


class BookForm extends Showable {

    constructor(onSubmit, onError) {

        super(document.createElement('form'));
        this.el.setAttribute('id', 'book-form');
        this.el.className = 'form-container frame';
        this.el.addEventListener('submit', (e) => {
            onSubmit(e);
        });
    }

    getValues() { return {title: this.title.value, user: this.user.value, tags: this.tags.value} }

    setValues(title = '', user = '', tags = '') {

        this.title.value = title;
        this.user.value = user;
        this.tags.value = tags;
    }
    
    render() {

        this.el.innerHTML =  `

            <label for="title" class ="form-label">Title :</label>
            <input type="text" id="title" class="form-value">

            <label for="user" class ="form-label">User :</label>
            <input type="text" id="user" class="form-value">

            <label for="tags" class ="form-label">Tags :</label>
            <input type="text" id="tags" class="form-value">
 
            <input type="submit" value="Add Book" class="form-button btn-success" id="add-update-book">  
        `;

        let el = super.render();
        this.title = el.children[1];
        this.user = el.children[3];
        this.tags = el.children[5];
        return el;
    }
}

let onError = (app) => {

    app.showMessage()

    return (message, className) => {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message

        El('.container').insertBefore(div, IdEl('book-form'));
        setTimeout(() => { El('.alert').remove(); }, 3000);
    }
}


class App {

    constructor() {

        this.info = "Hello from App";

        let sb = Store.getBooks();
       
        this.bookForm = new BookForm(this.bookFormSubmit(), onError(this) );
        this.bookTable = new BookTable();        
        this.editMode = false;
        this.editId = undefined;
        this.books = sb.map((b) => new BookItem(b, 

            this.editButtonClick(),
            this.deleteButtonClick()
        ));

        document.addEventListener('DOMContentLoaded', () => {

          
            IdEl('main-container').appendChild( this.bookForm.render() );        
            IdEl('main-container').appendChild( this.bookTable.render(this.books) );            
        });
    }


    editButtonClick() {

        let app = this;
        return (title, user, tags, id) => {
    
            console.log(`edit button click with id ${id}`)
            app.bookForm.setValues(title, user, tags);
            app.editMode = true;
            app.editId = id !== undefined? id : (new Date).getTime();

            setVal('#add-update-book', 'Update');
        };
    }


    deleteButtonClick() {

        let app = this;
        return (title, user, tags, id) => {
    
            console.log(`delete button click with id ${id}`)
    
            Store.removeBook( id );
            let deleted = app.removeBook( id );
            if( deleted ) app.bookForm.setValues(deleted.title, deleted.user, deleted.tags);
           
            app.showMessage('Book Removed', 'success');
        };
    }

    bookFormSubmit() {

        let app = this;

        return (e) => {

            e.preventDefault();
             console.log(`submit - value:${app.bookForm.title.value} user:${app.bookForm.user.value}` )
            if(app.bookForm.title.value === '' || 
                app.bookForm.user.value === '' || 
                app.bookForm.tags.value === '' ||
                app.bookForm.title.value === undefined || 
                app.bookForm.user.value === undefined || 
                app.bookForm.tags.value === undefined
                ) {
                app.showMessage('BookForm: Please fill in all fields', 'warning');
                return;
            }

            if( app.editMode ) {   // update book
    
                setVal('#add-update-book', "Add Book");
                let book = app.bookForm.getValues();
                book.id = app.editId;
                app.editId = undefined;
                app.editMode = false;
                let {err, bookItem} = app.updateBook( book );
                if( err ) app.showMessage(err, 'warning');
                else {
    
                    Store.updateBook( bookItem.book );
                    app.showMessage('Book Updated', 'success');  
                    app.bookForm.setValues();
                }  
            }
            else {  // add book

                let book = app.bookForm.getValues();
                book.id = (new Date).getTime();

                let {err, bookItem}  = app.addBook( book );
                if( err ) app.showMessage(err, 'warning');
                else {
    
                    Store.addBook( bookItem.book );
                    app.showMessage('Book Added', 'success');  
                    app.bookForm.setValues();
                }
            }
        }
    }
    

    showMessage(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.innerHTML = message

        El('.container').insertBefore(div, IdEl('book-form'));

        setTimeout(() => { El('.alert').remove(); }, 3000);
    }

    
    //-----------------------------------------------------------------------------------------
    getBookIndex(id) {

        let bookItemIndex = -1;
        this.books.forEach((bookItem, index) => {

            if(bookItem !== undefined && bookItem.book.id == id)  bookItemIndex = index;
        });  
        return bookItemIndex;
    }

    getBook(id) {

        let bookItemIndex = this.getBookIndex( id );
        if(bookItemIndex > -1) return {err:undefined, bookItem:this.books[ bookItemIndex ]};
        return {err:`Can't find book with id ${id}`, bookItem: undefined};
    }

    addBook(book) {   
        
        let {err, bookItem} = {undefined, undefined};
        if(this.getBookIndex(book.id) > -1) err = 'TAGS number must be unique!';  
      
        if(!err) {

            bookItem = new BookItem(book, 

                this.editButtonClick(),
                this.deleteButtonClick()
            );
            this.books = [...this.books, bookItem];
            IdEl('book-list').appendChild(bookItem.render());
        }
        return {err, bookItem};
    }
  
    updateBook(book) {

        let {err, bookItem} = this.getBook( book.id );

        if(bookItem !== undefined) {
            bookItem.book.title = book.title;
            bookItem.book.user = book.user;
            bookItem.book.tags = book.tags;
            bookItem.render(); // !!!!! super !!!!!! updated only changed element
        }
        return {err, bookItem};
    }
    // przerobić resztę metod na styl funcyjny
    removeBook( id ) {
     
        let toDelete = undefined;

        this.books = this.books.filter(b => {
   //console.log('toDelete:' + id + " curr:" + b.book.id )
            if(b.book.id != id) return true;
            else toDelete = b;
            return false;
        });

        if(toDelete !== undefined) {
            console.log('toDelete:' + toDelete.book.id)
            toDelete.remove();
            console.log( toDelete )
            return toDelete.book;
        }
        return {};
    }
};

let app = new App();


