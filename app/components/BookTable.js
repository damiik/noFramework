import Showable from './Showable.js';

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
        <tbody id="book-list">
        </tbody>
        `;

        console.log("render(books) ")

        //let bookList = this.appendWithId('tbody', 'book-list');
        let el = super.render();
        books.map(book => el.children[1].appendChild(book.render()));
        return el;
    }
}

export default BookTable;