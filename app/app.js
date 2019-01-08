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
        this.bookTable = new BookTable(sb.map(
            
                (b) => new BookItem(b, this.editButtonClick(), this.deleteButtonClick())
            )
        );        
        this.editMode = false;
        this.editId = undefined;

        document.addEventListener('DOMContentLoaded', () => {

            IdEl('main-container').appendChild( this.bookForm.render() );        
            IdEl('main-container').appendChild( this.bookTable.render() );            
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
            let deleted = app.bookTable.removeBook( id );
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
                let {err, bookItem} = app.bookTable.updateBook( book );
                if( err ) app.showMessage(err, 'warning');
                else {
    
                    Store.updateBook( bookItem.book );
                    app.showMessage('Book Updated', 'success');  
                    app.bookForm.setValues();
                }
            }
            else {  // add book

                let {err, bookItem} = app.bookTable.addBook( new BookItem({...app.bookForm.getValues(), id:(new Date).getTime()}, 

                        this.editButtonClick(),
                        this.deleteButtonClick()
                    )
                );
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

};

let app = new App();


export default app;