
import Store from './store.js';
import Icon from './img/idea-icon-12424.png'

import BookItem from './components/BookItem.js';
import BookTable from './components/BookTable.js';
import BookForm from './components/BookForm.js';

import './style.scss'

const img = new Image();
img.src = Icon;


const IdEl = (id) => document.getElementById(id)
const El = (desc) => document.querySelector(desc)
const setVal = (desc, val) => El(desc).value = val;


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

        return ( e ) => {

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


export default app;