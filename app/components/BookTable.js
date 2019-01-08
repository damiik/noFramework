import Showable from './Showable.js';

const IdEl = (id) => document.getElementById(id)

class BookTable extends Showable  {

    constructor(books) {

        super(document.createElement('table'));
        this.books = books;
        this.el.className = 'table frame';
        this.columns =  ["Title", "User", "Tags", "", ""];
    }

    render() {

       this.el.innerHTML =  `
        <thead>
            <tr>
                ${this.columns.map(t => "<th>"+t+"</th>").reduce((s, t) => s + t)}
            </tr>
        </thead>
        <tbody id="book-list">
        </tbody>
        `;

        console.log("render(books) ")

        //let bookList = this.appendWithId('tbody', 'book-list');
        let el = super.render();
        this.books.map(book => el.children[1].appendChild(book.render()));
        return el;
    }

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

    addBook(bookItem) {   
        
        let err = undefined;
        if(this.getBookIndex( bookItem.book.id ) > -1) err = 'TAGS number must be unique!';  
      
        if(!err) {

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

}

export default BookTable;