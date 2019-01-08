import Showable from './Showable.js';

class BookItem extends Showable {

    constructor(book, onEditClick, onDeleteClick) {

        super(document.createElement('tr'));  
        this.el.setAttribute("id", book.id);
        this.book = book;
        this.onEditClick =  onEditClick;
        this.onDeleteClick = onDeleteClick;
    }


    render() {

        this.el.innerHTML =  `
        <td class="app-info">${this.book.title}</td>
        <td class="app-info">${this.book.user}</td>
        <td class="app-info">${this.book.tags}</td>
        <td class="app-info add">
            <a href="#" class="btn-noframe edit"><i class="fas fa-edit light"></i> Edit</a> 
        </td>
        <td class="app-info">
            <a href="#" class="btn-danger delete"><i class="fas fa-times-circle"></i></a> 
        </td>
        `;
        let el = super.render();
        el.addEventListener(

            'click', (e) => {

                e.preventDefault();
                let c = e.target.className;
                if(c === "btn-noframe edit" || c === "fas fa-edit light") this.onEditClick(this.book.title, this.book.user, this.book.tags, this.book.id);
                if(c === "btn-danger delete" || c === "fas fa-times-circle") this.onDeleteClick(this.book.title, this.book.user, this.book.tags, this.book.id);
            }
            ,false
        );

        return el;
    }
}

export default BookItem;